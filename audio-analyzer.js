// audio-analyzer.js
// 音频特征提取与分数计算
class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.currentAudio = null;
        // this.birdScorePercentiles = {
        //     10: 3.071648,
        //     25: 3.325747,
        //     50: 3.781828,
        //     75: 4.095244,
        //     90: 4.556210
        // };
    }
    async loadAudioFile(file) {
        console.log('Loading audio file...');
        console.log('AudioContext status:', this.audioContext?.state);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    if (!this.audioContext) {
                        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    }
                    const audioBuffer = await this.audioContext.decodeAudioData(e.target.result);
                    resolve(audioBuffer);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    async extractFeatures(audioBuffer) {
        console.log('Extracting features from buffer:', audioBuffer.duration, 's');
        const audioData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const frameSize = 1024;
        const hopSize = 512;
        const frames = [];
        const fftResults = [];
        
        // Pre-compute frames and FFTs
        for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
            const frame = audioData.slice(i, i + frameSize);
            frames.push(frame);
            fftResults.push(this.simpleFFT(frame));
        }
        
        // Calculate the three required features
        return {
            mfcc_8_std: this.calculateMFCCStdOptimized(fftResults, 8),
            spectral_rolloff_std: this.calculateSpectralRolloffStd(fftResults, sampleRate),
            low_energy: this.calculateLowEnergy(frames)
        };
    }
    calculateMFCCStdOptimized(fftResults, coeffIndex) {
        const mfccValues = fftResults.map(fft => {
            const logSpectrum = fft.map(x => Math.log(Math.abs(x) + 1e-10));
            return logSpectrum[coeffIndex % logSpectrum.length] || 0;
        });
        return this.std(mfccValues);
    }
    calculateSpectralRolloffStd(fftResults, sampleRate) {
        // Calculate spectral rolloff at 85% energy point for each frame
        const rolloffValues = fftResults.map(magnitude => {
            // Calculate cumulative energy
            const totalEnergy = magnitude.reduce((sum, val) => sum + val, 0);
            const threshold = totalEnergy * 0.85;
            
            let cumulativeEnergy = 0;
            let rolloffBin = 0;
            
            for (let i = 0; i < magnitude.length; i++) {
                cumulativeEnergy += magnitude[i];
                if (cumulativeEnergy >= threshold) {
                    rolloffBin = i;
                    break;
                }
            }
            
            // Convert bin to frequency
            const rolloffFreq = rolloffBin * sampleRate / (2 * magnitude.length);
            return rolloffFreq;
        });
        
        return this.std(rolloffValues);
    }
    
    calculateLowEnergy(frames) {
        // Calculate RMS energy for each frame
        const rmsValues = frames.map(frame => {
            const sumSquares = frame.reduce((sum, x) => sum + x * x, 0);
            return Math.sqrt(sumSquares / frame.length);
        });
        
        // Calculate energy threshold (50% of mean RMS)
        const meanRMS = rmsValues.reduce((sum, x) => sum + x, 0) / rmsValues.length;
        const energyThreshold = meanRMS * 0.5;
        
        // Count frames below threshold
        const lowEnergyFrames = rmsValues.filter(rms => rms < energyThreshold).length;
        
        // Return ratio of low energy frames
        return lowEnergyFrames / rmsValues.length;
    }
    simpleFFT(frame) {
        const N = frame.length;
        if (N <= 1) return frame;

        // Bit reversal
        const output = new Array(N);
        for (let i = 0; i < N; i++) {
            output[i] = frame[this.reverseBits(i, Math.log2(N))];
        }

        // FFT computation
        for (let size = 2; size <= N; size *= 2) {
            const halfSize = size / 2;
            const angle = -2 * Math.PI / size;
            
            for (let i = 0; i < N; i += size) {
                for (let j = 0; j < halfSize; j++) {
                    const t = output[i + j];
                    const exp = output[i + j + halfSize] * Math.cos(angle * j) - 
                              output[i + j + halfSize] * Math.sin(angle * j);
                    
                    output[i + j] = t + exp;
                    output[i + j + halfSize] = t - exp;
                }
            }
        }

        // Convert to magnitude spectrum
        return output.slice(0, N/2).map(x => Math.abs(x));
    }

    reverseBits(x, bits) {
        let result = 0;
        for (let i = 0; i < bits; i++) {
            result = (result << 1) | (x & 1);
            x >>= 1;
        }
        return result;
    }
    autocorrelation(data) {
        const N = data.length, result = [];
        for (let lag = 0; lag < N / 2; lag++) {
            let correlation = 0;
            for (let i = 0; i < N - lag; i++) {
                correlation += data[i] * data[i + lag];
            }
            result.push(correlation / (N - lag));
        }
        return result;
    }
    findPeaks(data) {
        const peaks = [];
        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > data[i-1] && data[i] > data[i+1]) {
                peaks.push(data[i]);
            }
        }
        return peaks.sort((a, b) => b - a);
    }
    std(values) {
        if (values.length === 0) return 0;
        const mean = values.reduce((sum, x) => sum + x, 0) / values.length;
        const variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / values.length;
        return Math.sqrt(variance);
    }
    calculateScore(features) {
        // Normalized score calculation with new features
        console.log('Calculating score with features:', features);
        
        // Normalize features to [0, 1] range
        const mfcc_norm = Math.min(Math.max((features.mfcc_8_std - 0) / (25 - 0), 0), 1); // min 0, max 25
        const rolloff_norm = Math.min(Math.max((features.spectral_rolloff_std - 0) / (3500 - 0), 0), 1); // min 0, max ~3500Hz
        const low_energy_norm = Math.min(Math.max(features.low_energy, 0), 1); // already in [0, 1]
        
        // Weighted sum (weights sum to ~1.0)
        // Higher MFCC and rolloff std = more complex/dynamic = higher score
        // Lower low_energy ratio = more energetic = higher score, so we use (1 - low_energy)
        return 0.38 * mfcc_norm +
               0.33 * rolloff_norm +
               0.31 * low_energy_norm;
    }
    // getPercentile(score) {
    //     if (score < this.birdScorePercentiles[10]) {
    //         return { description: "🎉 Congratulations! Your score is lower than 90% of bird calls, very unique features!" };
    //     } else if (score < this.birdScorePercentiles[25]) {
    //         return { description: "👏 Great! Your score is lower than 75% of bird calls, excellent performance!" };
    //     } else if (score < this.birdScorePercentiles[50]) {
    //         return { description: "😊 Nice! Your score is lower than 50% of bird calls, above average level!" };
    //     } else if (score < this.birdScorePercentiles[75]) {
    //         return { description: "😐 Your score is in the 25%-50% range of bird call data, room for improvement!" };
    //     } else if (score < this.birdScorePercentiles[90]) {
    //         return { description: "🤔 Your score is in the 10%-25% range of bird call data, try other audio files!" };
    //     } else {
    //         return { description: "😅 Your score is higher than 90% of bird calls, may need to adjust audio quality!" };
    //     }
    // }
}
