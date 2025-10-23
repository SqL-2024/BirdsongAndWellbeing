// examples.js
// 示例音频数据与渲染
// 平均分排名数据（科学结果）
const speciesRanking = [
    // ...existing top 10 species...
    {
        latin: 'Erithacus rubecula', score:1.339, name: 'European Robin', example: { url: 'https://xeno-canto.org/133862', score: 1.495, source: 'Mike Nelson, XC133862. Accessible at www.xeno-canto.org/133862.' }

    },
    {
        latin: 'Alauda arvensis', score: 1.330, name: 'Eurasian Skylark', example: { url: 'https://xeno-canto.org/158166', score: 1.435, source: 'david m, XC158166. Accessible at www.xeno-canto.org/158166.' }

    },
    {
        latin: 'Emberiza calandra', score: 1.322, name: 'Corn Bunting', example: { url: 'https://xeno-canto.org/123167', score: 1.435, source: 'david m, XC123167. Accessible at www.xeno-canto.org/123167.' }
    },
    {
        latin: 'Troglodytes troglodytes', score: 1.302, name: 'Eurasian Wren', example: { url: 'https://xeno-canto.org/133872', score: 1.337, source: 'Mike Nelson, XC133872. Accessible at www.xeno-canto.org/133872.' }

    },
    {
        latin: 'Turdus philomelos', score:1.300, name: 'Song Thrush', example: { url: 'https://xeno-canto.org/96608', score: 1.403, source: 'Fraser Simpson, XC96608. Accessible at www.xeno-canto.org/96608.' }
    },
    {
        latin: 'Anthus pratensis', score: 1.237, name: 'Meadow Pipit', example: { url: 'https://xeno-canto.org/138979', score: 1.302, source: 'Fernand DEROUSSEN, XC138979. Accessible at www.xeno-canto.org/138979.' }
    },
    {
        latin: 'Cyanistes caeruleus', score: 1.215, name: 'Eurasian Blue Tit', example: { url: 'https://xeno-canto.org/44203', score: 1.301, source: 'Stuart Fisher, XC44203. Accessible at www.xeno-canto.org/44203.' }
    },
    {
        latin: 'Locustella fluviatilis', score: 1.205, name: 'River Warbler', example: { url: 'https://xeno-canto.org/140557', score: 1.376, source: 'Fernand DEROUSSEN, XC140557. Accessible at www.xeno-canto.org/140557.' }

    },
    {
        latin: 'Sylvia atricapilla', score:1.195, name: 'Eurasian Blackcap', example: { url: 'https://xeno-canto.org/94967', score: 1.350, source: 'Richard Dunn, XC94967. Accessible at www.xeno-canto.org/94967.' }
    },
    {
        latin: 'Sulvia borin', score: 1.190, name: 'Garden Warbler', example: { url: 'https://xeno-canto.org/146260', score: 1.262, source: 'david m, XC146260. Accessible at www.xeno-canto.org/146260.' }

    },
    
];


function renderExamples() {
    // 平均分排名区域分为Top 10和Bottom 10
    const rankingContainer = document.getElementById('speciesRanking');
    if (rankingContainer) {
        // 只渲染 Top 10 模块，移除 Bottom 10 红色模块
        rankingContainer.innerHTML = `
            <div class="species-ranking-top10" style="background:linear-gradient(135deg,#4CAF50,#45a049);padding:20px;border-radius:15px;margin-bottom:30px;flex:1;">
                <h3 style="color:white;text-align:center;">Top 10 Species (English name(Binomial name))</h3>
                <div id="speciesTop10"></div>
            </div>
        `;
        // Top 10
        const top10 = speciesRanking.slice(0, 10);
        const top10Container = document.getElementById('speciesTop10');
        top10.forEach((sp, idx) => {
            const div = document.createElement('div');
            div.className = 'species-ranking-item';
            div.style.marginBottom = '18px';
            div.innerHTML = `
                <div><strong>#${idx + 1} ${sp.name} (<i>${sp.latin}</i>)</strong></div>
                <div>Average Score: <span style="color:#000;font-weight:bold;">${sp.score.toFixed(3)}</span></div>
                <div class="example-recording">
                    <span>Example recording:</span>
                    <button class="play-btn" onclick="playExample('${sp.example.url}')">Play</button>
                    <span style="margin-left:10px;">Score: ${sp.example.score.toFixed(2)}</span>
                </div>
                <div style="font-size:0.8em;color:#000;margin-top:5px;">Source: ${sp.example.source}</div>
            `;
            top10Container.appendChild(div);
        });
        // 移除 Bottom 10 渲染
    }

    // 旧的高分/低分示例区域
    const topExamples = document.getElementById('topExamples');
    const bottomExamples = document.getElementById('bottomExamples');
    if (topExamples) {
        topExamples.innerHTML = '';
        topExampleData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'example-item';
            li.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Score: ${item.score.toFixed(3)}</small>
                </div>
                <button class="play-btn" onclick="playExample('${item.url}')">Play</button>
            `;
            topExamples.appendChild(li);
        });
    }
    if (bottomExamples) {
        bottomExamples.innerHTML = '';
        bottomExampleData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'example-item';
            li.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Score: ${item.score.toFixed(3)}</small>
                </div>
                <button class="play-btn" onclick="playExample('${item.url}')">Play</button>
            `;
            bottomExamples.appendChild(li);
        });
    }
}
function playExample(url) {
    window.open(url, '_blank');
}
