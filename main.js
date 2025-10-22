// main.js
// 页面初始化与事件绑定
// 可编辑的文案占位：用户可在此补充说明与公式
const UI_TEXT = {
    // 3) 计算公式文本（默认展开显示），可按需调整
    scoreFormula: (
        'WAI = 0.65 × MFCC_8_std + 0.50 × chroma_A_std + 0.40 × spectral_centroid_std + 0.39 × pulse_clarity' +
        '\n\nMore detail can be found in the paper: 《Birdsong Acoustic Features and Human Wellbeing: Evidence from Real-World Audio Data》'
    ),
    // 2) 每个特征的解释（默认展开显示）
    featureExplanations: {
        mfcc_8_std: (
            'This feature captures how much the spectral structure of a birdsong varies over time.\n' +
            'Songs with higher MFCC variability tend to sound more complex and expressive, reflecting a richer acoustic texture that may engage listeners more deeply.'
        ),
        chroma_A_std: (
           
            'This feature captures changes in harmony and tone—how the notes shift over time.\n' +
            'Greater variation makes the song sound more melodic and balanced, which is often felt as pleasant and calming.'
        ),
        spectral_centroid_std: (
            'The spectral centroid reflects the “brightness” of a sound.\n' +
            'When its variability is high, the song moves between lighter and darker tones, giving it a lively and textured character rather than a flat or monotonous one'
        ),
        pulse_clarity: (
            'It quantifies the temporal regularity and rhythmic clarity of the birdsong.\n' +
            'Clearer rhythmic structure is associated with a more organized, soothing auditory experience.'
        )
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
                <summary>feature explanation</summary>
                <div>${UI_TEXT.featureExplanations.mfcc_8_std}</div>
            </details>
        </div>
        <div class="feature-card">
            <div class="feature-label">Spectral Centroid Std</div>
            <div class="feature-value">${features.spectral_centroid_std.toFixed(4)}</div>
            <details class="feature-explain" open>
                <summary>feature explanation</summary>
                <div>${UI_TEXT.featureExplanations.spectral_centroid_std}</div>
            </details>
        </div>
        <div class="feature-card">
            <div class="feature-label">Chroma A Standard Deviation</div>
            <div class="feature-value">${features.chroma_A_std.toFixed(4)}</div>
            <details class="feature-explain" open>
                <summary>feature explanation</summary>
                <div>${UI_TEXT.featureExplanations.chroma_A_std}</div>
            </details>
        </div>
        <div class="feature-card">
            <div class="feature-label">Pulse Clarity</div>
            <div class="feature-value">${features.pulse_clarity.toFixed(4)}</div>
            <details class="feature-explain" open>
                <summary>feature explanation</summary>
                <div>${UI_TEXT.featureExplanations.pulse_clarity}</div>
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
