// examples.js
// 示例音频数据与渲染
// 四个区域的鸟类排名数据（每个区域Top 5）
const regionalRanking = {
    americas: [
        { latin: 'Toxostoma curvirostre', score: 0.788, name: 'Curve-billed Thrasher', example: { url: 'https://xeno-canto.org/377565', score: 0.874, source: 'Pat Goltz, XC377565.' } },
        { latin: 'Cyclarhis gujanensis', score: 0.706, name: 'Rufous-browed Peppershrike', example: { url: 'https://xeno-canto.org/552908', score: 0.769, source: 'Guillermo Treboux, XC552908.' } },
        { latin: 'Vireo gilvus', score: 0.694, name: 'Warbling Vireo', example: { url: 'https://xeno-canto.org/812838', score: 0.708, source: 'Paul Marvin, XC812838.' } },
        { latin: 'Setophaga aestiva', score: 0.678, name: 'American Yellow Warbler', example: { url: 'https://xeno-canto.org/1046362', score: 0.736, source: 'AUDEVARD Aurélien, XC1046362.' } },
        { latin: 'Thryomanes bewickii eremophilus', score: 0.628, name: 'Bewick\'s Wren', example: { url: 'https://xeno-canto.org/995434', score: 0.662, source: 'Bill Pyle, XC995434.' } }
    ],
    asia: [
        { latin: 'Periparus ater ater', score: 0.726, name: 'Coal Tit', example: { url: 'https://xeno-canto.org/916380', score: 0.753, source: 'Peter Boesman, XC916380.' } },
        { latin: 'Pellorneum ruficeps', score: 0.666, name: 'Puff-throated Babbler', example: { url: 'https://xeno-canto.org/992881', score: 0.708, source: 'Peter Ericsson, XC992881.' } },
        { latin: 'Phylloscopus xanthoschistos', score: 0.657, name: 'Grey-hooded Warbler', example: { url: 'https://xeno-canto.org/950758', score: 0.725, source: 'Pratap Singh, XC950758.' } },
        { latin: 'Phylloscopus inornatus', score: 0.643, name: 'Yellow-browed Warbler', example: { url: 'https://xeno-canto.org/995185', score: 0.696, source: 'Bo Shunqi 薄顺奇, XC995185.' } },
        { latin: 'Eudynamys scolopaceus', score: 0.641, name: 'Asian Koel', example: { url: 'https://xeno-canto.org/983831', score: 0.774, source: 'Swami Bogim, XC983831.' } }
    ],
    europe: [
        { latin: 'Troglodytes troglodytes', score: 0.708, name: 'Eurasian Wren', example: { url: 'https://xeno-canto.org/1053191', score: 0.774, source: 'Susanne Kuijpers, XC1053191.' } },
        { latin: 'Turdus philomelos', score: 0.700, name: 'Song Thrush', example: { url: 'https://xeno-canto.org/1004195', score: 0.722, source: 'Jorge Leitão, XC1004195.' } },
        { latin: 'Periparus ater', score: 0.697, name: 'Coal Tit', example: { url: 'https://xeno-canto.org/1011037', score: 0.745, source: 'Olivier SWIFT, XC1011037.' } },
        { latin: 'Parus major', score: 0.688, name: 'Great Tit', example: { url: 'https://xeno-canto.org/1009333', score: 0.772, source: 'Jorge Leitão, XC1009333.' } },
        { latin: 'Sylvia atricapilla', score: 0.679, name: 'Eurasian Blackcap', example: { url: 'https://xeno-canto.org/1023368', score: 0.689, source: 'Elias A. Ryberg, XC1023368.' } }
    ],
    uk: [
        { latin: 'Turdus philomelos', score: 0.726, name: 'Song Thrush', example: { url: 'https://xeno-canto.org/96608', score:0.765, source: 'Fraser Simpson, XC96608.' } },
        { latin: 'Alauda arvensis', score: 0.706, name: 'Eurasian Skylark', example: { url: 'https://xeno-canto.org/158166', score: 0.755, source: 'david m, XC158166.' } },
        { latin: 'Erithacus rubecula', score: 0.702, name: 'European Robin', example: { url: 'https://xeno-canto.org/133862', score: 0.806, source: 'Mike Nelson, XC133862.' } },
        { latin: 'Sylvia atricapilla', score: 0.700, name: 'Eurasian Blackcap', example: { url: 'https://xeno-canto.org/94967', score: 0.818, source: 'Richard Dunn, XC94967.' } },
        { latin: 'Sylvia curruca', score: 0.697, name: 'Lesser Whitethroat', example: { url: 'https://xeno-canto.org/101932', score: 0.754, source: 'Richard Dunn, XC101932.' } }
    ]
};


function renderExamples() {
    // 渲染四个区域的鸟类排名，使用同一色系的渐变背景
    const rankingContainer = document.getElementById('speciesRanking');
    if (rankingContainer) {
        // 定义四个区域的配置（清新淡雅的配色方案）
        const regions = [
            { key: 'americas', title: 'Americas', gradient: 'linear-gradient(135deg, #81D4FA, #4FC3F7)' },
            { key: 'asia', title: 'Asia', gradient: 'linear-gradient(135deg, #FFAB91, #FF8A65)' },
            { key: 'europe', title: 'Europe', gradient: 'linear-gradient(135deg, #CE93D8, #BA68C8)' },
            { key: 'uk', title: 'UK', gradient: 'linear-gradient(135deg, #81C784, #66BB6A)' }
        ];

        // 构建HTML结构（并排显示4个区域）
        let html = '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px;">';
        
        regions.forEach(region => {
            const birds = regionalRanking[region.key];
            html += `
                <div class="species-ranking-region" style="background:${region.gradient};padding:20px;border-radius:15px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                    <h3 style="color:white;text-align:center;margin-bottom:16px;font-size:1.3rem;">${region.title}</h3>
                    <div class="region-birds">`;
            
            birds.forEach((sp, idx) => {
                html += `
                    <div class="species-ranking-item" style="background:rgba(255,255,255,0.9);border-radius:10px;padding:14px;margin-bottom:14px;border-left:4px solid rgba(255,255,255,0.5);">
                        <div style="margin-bottom:6px;"><strong style="color:#2d5016;font-size:1.05rem;">#${idx + 1} ${sp.name}</strong></div>
                        <div style="font-size:0.9rem;color:#555;font-style:italic;margin-bottom:8px;">${sp.latin}</div>
                        <div style="margin-bottom:6px;">Score: <span style="color:#2E7D32;font-weight:bold;">${sp.score.toFixed(3)}</span></div>
                        <div class="example-recording" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <button class="play-btn" onclick="playExample('${sp.example.url}')" style="font-size:0.85rem;padding:6px 12px;">▶ Play</button>
                            <span style="font-size:0.85rem;color:#666;">Score: ${sp.example.score.toFixed(2)}</span>
                        </div>
                        <div style="font-size:0.75em;color:#777;margin-top:6px;">${sp.example.source}</div>
                    </div>`;
            });
            
            html += `
                    </div>
                </div>`;
        });
        
        html += '</div>';
        rankingContainer.innerHTML = html;
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
