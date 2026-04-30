// main.js
// 页面初始化与事件绑定
// 可编辑的文案占位：用户可在此补充说明与公式
const UI_TEXT = {
    // 3) 计算公式文本（默认展开显示），可按需调整
    scoreFormula: (
        'DTI = 0.73 × MFCC_8_std + 0.69 × Chroma_A_std + 0.67 ×  Spectral_Rolloff_std' +
        '\n\nFeatures are normalized to [0, 1] range before scoring.' +
        '\nMore details can be found in the paper: 《Associations with between birdsong environments and human momentary affect wellbeing: evidence from real-world》' +
        '\nTo run in the browser, we use lightweight proxy features instead of exact librosa/MIR equivalents. They may differ numerically, but preserve similar temporal dynamics and perceptual trends for interactive wellbeing-oriented analysis.'
    ),
    // 2) 每个特征的解释（默认展开显示）
    featureExplanations: {
        mfcc_8_std: (
            '🎵 MFCC 8 Standard Deviation (MFCC_8_std)\n\n' +
            'Reflects the variability in spectral complexity, an important marker of vocal richness and expressiveness.\n' +
            'Higher values indicate more dynamic and complex frequency structures within the birdsong, which were linked to greater wellbeing effects.'
        ),
        chroma_A_std: (
        '✨ Chroma A Standard Deviation (Chroma_A_std)\n\n' +
        'Measures the variability of energy associated with the pitch class A (A note) across time.\n' +
        'Higher values indicate greater fluctuations in harmonic content related to the A pitch class, reflecting increased tonal variability and dynamic harmonic movement in the acoustic signal.'
        ),
        spectral_rolloff_std: (
            '✨ Spectral Rolloff Standard Deviation (Spectral_Rolloff_std)\n\n' +
            'Measures the variation in the frequency below which 85% of the spectral energy is concentrated.\n' +
            'Greater variation indicates dynamic shifts in spectral energy distribution, contributing to a richer and more engaging auditory experience.'
        ),
        
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const analyzer = new AudioAnalyzer();
    renderExamples();
    // 上传相关事件
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        fileInput.click();
    });
    uploadArea.addEventListener('click', (e) => {
        if (e.target === uploadArea) { // 只在直接点击上传区域时触发
            fileInput.click();
        }
    });
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0], analyzer);
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0], analyzer);
        }
    });
});
function processFile(file, analyzer) {
    if (!file.type.startsWith('audio/')) {
        showError('Please select an audio file');
        return;
    }
    showProgress(0);
    analyzer.loadAudioFile(file)
        .then(audioBuffer => {
            showProgress(30);
            return analyzer.extractFeatures(audioBuffer);
        })
        .then(features => {
            showProgress(70);
            const score = analyzer.calculateScore(features);
            showProgress(100);
            displayResults(features, score, analyzer);
        })
        .catch(() => {
            showError('Audio processing failed, please try another file');
        })
        .finally(() => {
            hideProgress();
        });
}
function showProgress(percent) {
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    progressBar.style.display = 'block';
    progressFill.style.width = percent + '%';
}
function hideProgress() {
    document.getElementById('progressBar').style.display = 'none';
}
function displayResults(features, score, analyzer) {
    const resultsSection = document.getElementById('resultsSection');
    const scoreValue = document.getElementById('scoreValue');
    const featuresDisplay = document.getElementById('featuresDisplay');
    scoreValue.textContent = score.toFixed(3);
    // 填充分数公式说明（可编辑占位）
    const scoreFormulaContent = document.getElementById('scoreFormulaContent');
    if (scoreFormulaContent) {
        scoreFormulaContent.textContent = UI_TEXT.scoreFormula;
    }
    featuresDisplay.innerHTML = `
        <div class="feature-card">
            <div class="feature-label">MFCC-8 Standard Deviation</div>
            <div class="feature-value">${features.mfcc_8_std.toFixed(4)}</div>
            <details class="feature-explain" open>
                <summary>Feature Explanation</summary>
                <div>${UI_TEXT.featureExplanations.mfcc_8_std}</div>
            </details>
        </div>
        <div class="feature-card">
            <div class="feature-label">Spectral Rolloff Std</div>
            <div class="feature-value">${features.spectral_rolloff_std.toFixed(4)}</div>
            <details class="feature-explain" open>
                <summary>Feature Explanation</summary>
                <div>${UI_TEXT.featureExplanations.spectral_rolloff_std}</div>
            </details>
        </div>
        <div class="feature-card">
            <div class="feature-label">Chroma A std</div>
            <div class="feature-value">${features.chroma_A_std.toFixed(4)}</div>
            <details class="feature-explain" open>
                <summary>Feature Explanation</summary>
                <div>${UI_TEXT.featureExplanations.chroma_A_std}</div>
            </details>
        </div>
    `;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}
function showError(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `❌ ${message}`;
    container.appendChild(errorDiv);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
