// 模拟搜索数据
const searchSteps = [
    {
        type: 'search',
        keywords: ['人工智能发展趋势', 'AI应用场景', '机器学习最新进展'],
        webs: [
            { url: 'https://example.com/ai-trends-2024', title: '2024年人工智能发展趋势报告', source: '机器之心' },
            { url: 'https://example.com/ai-applications', title: '人工智能在各行业的应用案例', source: '36氪' },
            { url: 'https://example.com/ai-medical', title: 'AI在医疗领域的突破性进展', source: '丁香园' }
        ]
    },
    {
        type: 'search',
        keywords: ['大语言模型对比', 'GPT-4 vs Claude', '模型性能评估'],
        webs: [
            { url: 'https://example.com/llm-comparison', title: '主流大语言模型性能对比分析', source: '量子位' },
            { url: 'https://example.com/gpt4-features', title: 'GPT-4技术特性深度解析', source: 'InfoQ' }
        ]
    },
    {
        type: 'search',
        keywords: ['AI伦理问题', '数据隐私保护', '算法偏见'],
        webs: [
            { url: 'https://example.com/ai-ethics', title: 'AI伦理与社会责任研究报告', source: '中国信通院' },
            { url: 'https://example.com/data-privacy', title: '人工智能时代的数据隐私保护', source: '澎湃新闻' },
            { url: 'https://example.com/ai-regulation', title: '全球AI监管政策对比分析', source: '财经杂志' }
        ]
    }
];

const finalAnswer = `人工智能的发展呈现以下几个重要趋势：

**1. 大语言模型持续突破**

以 GPT-4、Claude 等为代表的大语言模型在理解和生成能力上取得了显著进步，在代码生成、数学推理等领域展现出强大能力。

**2. 多模态能力增强**

现代 AI 系统能够同时处理文本、图像、音频等多种数据类型，在视觉问答、图像生成等任务中表现出色。

**3. 行业应用深化**

AI 技术在医疗健康、金融服务、教育培训、制造业等领域得到广泛应用：
• 医疗：辅助诊断、药物研发
• 金融：风险评估、智能投顾
• 教育：个性化学习、智能辅导

**4. 边缘 AI 和端侧部署**

越来越多的 AI 模型被部署到手机、汽车、智能家居等边缘设备上，以降低延迟、保护隐私。

**5. AI 伦理和监管加强**

各国政府开始制定相关法规，关注数据隐私、算法公平性、透明度等问题。`;

class SearchController {
    constructor() {
        this.keywordCount = 0;
        this.contentCount = 0;
        this.allKeywords = [];
        this.allWebs = [];
        this.isSearching = false;
        this.isExpanded = false;
        
        this.searchCard = document.getElementById('searchCard');
        this.searchHeader = document.getElementById('searchHeader');
        this.keywordCountEl = document.getElementById('keywordCount');
        this.contentCountEl = document.getElementById('contentCount');
        this.expandIcon = document.getElementById('expandIcon');
        this.searchDetail = document.getElementById('searchDetail');
        this.keywordsList = document.getElementById('keywordsList');
        this.sourcesList = document.getElementById('sourcesList');
        this.answerSection = document.getElementById('answerSection');
        this.answerContent = document.getElementById('answerContent');
        this.searchingIndicator = document.getElementById('searchingIndicator');
        
        this.bindEvents();
        this.startSearch();
    }
    
    bindEvents() {
        this.searchHeader.addEventListener('click', () => this.toggleExpand());
    }
    
    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        this.searchCard.classList.toggle('expanded', this.isExpanded);
    }
    
    async startSearch() {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.searchCard.style.display = 'block';
        this.searchingIndicator.style.display = 'flex';
        
        // 逐步执行搜索步骤
        for (const step of searchSteps) {
            await this.processStep(step);
            await this.delay(2500);
        }
        
        // 搜索完成，隐藏指示器
        this.searchingIndicator.style.display = 'none';
        await this.delay(300);
        
        // 显示答案
        this.showAnswer();
        this.isSearching = false;
    }
    
    async processStep(step) {
        if (step.type === 'search') {
            // 更新关键词
            step.keywords.forEach(k => {
                this.keywordCount++;
                this.allKeywords.push(k);
                this.animateNumber(this.keywordCountEl, this.keywordCount);
            });
            
            // 更新参考来源
            step.webs.forEach(web => {
                this.contentCount++;
                this.allWebs.push(web);
                this.animateNumber(this.contentCountEl, this.contentCount);
            });
            
            // 更新详情列表
            this.updateDetailLists();
        }
    }
    
    animateNumber(el, target) {
        el.textContent = target;
        el.classList.add('number-pop');
        setTimeout(() => el.classList.remove('number-pop'), 200);
    }
    
    updateDetailLists() {
        // 更新关键词列表
        this.keywordsList.innerHTML = this.allKeywords.map(k => 
            `<span class="keyword-tag">${k}</span>`
        ).join('');
        
        // 更新来源列表
        this.sourcesList.innerHTML = this.allWebs.map(web => 
            `<a href="${web.url}" class="source-item" target="_blank">
                <span class="source-title">${web.title}</span>
                <span class="source-name">${web.source}</span>
            </a>`
        ).join('');
    }
    
    async showAnswer() {
        this.answerSection.style.display = 'block';
        this.answerContent.innerHTML = '';
        
        // 打字机效果
        const chars = finalAnswer.split('');
        for (let i = 0; i < chars.length; i++) {
            this.answerContent.innerHTML += chars[i];
            if (i % 2 === 0) {
                await this.delay(15);
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SearchController();
});