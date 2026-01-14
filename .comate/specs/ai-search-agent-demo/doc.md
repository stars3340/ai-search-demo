# AI 搜索 Agent 多轮搜索 UI Demo 需求文档（移动端版）

## 需求背景
当前 AI 搜索产品从单轮检索转向 Agent 多轮搜索，系统时延显著增加。为缓解移动端用户等待焦虑并提升产品信任感，需要实现新的移动端 UI/UX 方案，展示搜索和思考过程。

## 需求场景具体处理逻辑

### 移动端特性
1. **屏幕适配**：针对手机屏幕（375px-428px）优化布局
2. **触摸交互**：优化触摸区域和手势操作
3. **竖屏布局**：采用适合竖屏浏览的垂直滚动布局
4. **底部导航**：搜索输入框固定在底部（类似 ChatGPT 移动端）

### 搜索过程展示
1. **顶部用户查询区域**：
   - 显示用户输入的问题
   - 简洁的卡片样式

2. **搜索状态展示区域**：
   - 默认折叠状态：灰色小字显示【搜索x个关键词，参考y篇内容】
   - 点击展开后显示详细步骤
   - 搜索完成后自动折叠（可选，可配置）

3. **详细步骤展开内容**：
   - 搜索步骤：显示搜索词标签，横向滚动
   - 思考步骤：思考内容默认折叠，点击展开查看
   - 获取网页步骤：显示网页图标和链接（可点击）
   - 每轮思考完成后显示使用的 query

4. **最终回答区域**：
   - 模拟 AI 生成的回答内容
   - Markdown 格式渲染
   - 参考资料链接

5. **底部搜索输入框**：
   - 固定在屏幕底部
   - 圆角设计，带发送按钮
   - 键盘弹出时自动适配

## 架构技术方案

### 技术栈选择
- **前端框架**：原生 HTML/CSS/JavaScript（轻量级 demo）
- **图标方案**：使用 SVG 图标
- **样式方案**：CSS3 Flexbox 布局，CSS 变量管理主题
- **交互实现**：原生 JavaScript 事件处理，setTimeout 模拟异步搜索
- **移动端适配**：viewport meta 标签，触摸事件优化

### 核心组件设计
1. **UserQuery 组件**：用户查询展示区域
   - 简洁的卡片样式
   - 显示用户输入的问题

2. **SearchStatus 组件**：搜索状态展示
   - 折叠/展开切换
   - 灰色小字显示统计信息
   - 点击展开显示详细步骤

3. **StepList 组件**：详细步骤列表
   - 搜索步骤：横向滚动的搜索词标签
   - 思考步骤：可折叠的思考内容
   - 网页获取步骤：网页图标和链接
   - 动画效果

4. **AnswerArea 组件**：最终回答区域
   - Markdown 样式渲染
   - 打字机效果

5. **BottomInput 组件**：底部搜索输入框
   - 固定定位
   - 圆角设计
   - 发送按钮

6. **SearchController 控制器**：模拟搜索流程
   - 管理搜索状态
   - 控制步骤添加时机
   - 处理折叠/展开逻辑

## 影响文件

### 新建文件
- `ai-search-demo/index.html` - 主页面文件（HTML 结构）
- `ai-search-demo/styles.css` - 样式文件（CSS 样式定义）
- `ai-search-demo/app.js` - 应用逻辑（JavaScript 实现）

### 文件修改类型
- 新建：纯前端 demo，无现有代码修改

## 实现细节

### HTML 结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>AI 搜索 Agent Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <!-- 主内容区域 -->
        <div class="main-content">
            <!-- 用户查询区域 -->
            <div class="user-query-section">
                <div class="user-query-card">
                    <div class="user-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div class="user-query-text">什么是人工智能的发展趋势？</div>
                </div>
            </div>
            
            <!-- 搜索状态区域 -->
            <div class="search-status-section" id="searchStatusSection">
                <div class="search-status-header" id="searchStatusHeader">
                    <span class="status-text" id="statusText">搜索 0 个关键词，参考 0 篇内容</span>
                    <span class="expand-icon" id="expandIcon">▼</span>
                </div>
                <div class="search-status-content" id="searchStatusContent">
                    <!-- 动态添加步骤 -->
                </div>
            </div>
            
            <!-- 回答区域 -->
            <div class="answer-section" id="answerSection" style="display: none;">
                <div class="answer-header">
                    <div class="ai-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                    </div>
                    <span class="ai-name">AI 助手</span>
                </div>
                <div class="answer-content" id="answerContent">
                    <!-- 动态生成回答 -->
                </div>
            </div>
        </div>
        
        <!-- 底部输入框 -->
        <div class="bottom-input-container">
            <div class="search-box">
                <input type="text" class="search-input" placeholder="输入您的问题...">
                <button class="send-btn">
                    <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

### CSS 样式
```css
:root {
    --primary-color: #10a37f;
    --secondary-color: #6366f1;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-tertiary: #9ca3af;
    --bg-color: #ffffff;
    --bg-secondary: #f9fafb;
    --border-color: #e5e7eb;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --safe-area-bottom: env(safe-area-inset-bottom);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html, body {
    height: 100%;
    overflow: hidden;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    line-height: 1.6;
    font-size: 14px;
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 480px;
    margin: 0 auto;
    background: var(--bg-color);
    position: relative;
}

/* 主内容区域 */
.main-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    padding-bottom: calc(80px + var(--safe-area-bottom));
}

/* 用户查询区域 */
.user-query-section {
    margin-bottom: 16px;
}

.user-query-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: var(--bg-secondary);
    border-radius: 12px;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--text-secondary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-avatar svg {
    width: 20px;
    height: 20px;
}

.user-query-text {
    flex: 1;
    font-size: 15px;
    color: var(--text-primary);
    line-height: 1.5;
}

/* 搜索状态区域 */
.search-status-section {
    background: var(--bg-secondary);
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
}

.search-status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.search-status-header:active {
    background: rgba(0, 0, 0, 0.05);
}

.status-text {
    font-size: 13px;
    color: var(--text-secondary);
}

.expand-icon {
    font-size: 12px;
    color: var(--text-tertiary);
    transition: transform 0.3s ease;
}

.search-status-section.expanded .expand-icon {
    transform: rotate(180deg);
}

.search-status-content {
    display: none;
    border-top: 1px solid var(--border-color);
    padding: 12px 16px;
}

.search-status-section.expanded .search-status-content {
    display: block;
}

/* 步骤项 */
.step-item {
    margin-bottom: 12px;
    animation: fadeIn 0.3s ease;
}

.step-item:last-child {
    margin-bottom: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 搜索步骤样式 */
.search-step {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px 12px;
}

.search-step-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.search-step-icon {
    width: 14px;
    height: 14px;
    color: var(--primary-color);
    flex-shrink: 0;
}

.search-step-title {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.search-step-content {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
}

.search-step-content::-webkit-scrollbar {
    display: none;
}

.search-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    color: var(--text-primary);
    white-space: nowrap;
    flex-shrink: 0;
}

.search-tag-icon {
    width: 12px;
    height: 12px;
    color: var(--text-tertiary);
}

/* 思考步骤样式 */
.think-step {
    border-left: 3px solid var(--secondary-color);
    padding-left: 10px;
}

.think-step-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin-bottom: 8px;
    padding: 4px 0;
}

.think-step-title {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.think-step-content {
    display: none;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
    background: var(--bg-color);
    border-radius: 8px;
    padding: 10px;
}

.think-step.expanded .think-step-content {
    display: block;
}

.think-step-query {
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-tertiary);
    font-style: italic;
}

/* 网页获取步骤样式 */
.web-step {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-color);
    border-radius: 8px;
}

.web-step-icon {
    width: 14px;
    height: 14px;
    color: var(--primary-color);
    flex-shrink: 0;
}

.web-step-link {
    font-size: 12px;
    color: var(--primary-color);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.web-step-link:active {
    opacity: 0.7;
}

/* 回答区域 */
.answer-section {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 16px;
}

.answer-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.ai-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.ai-avatar svg {
    width: 20px;
    height: 20px;
}

.ai-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.answer-content {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-primary);
}

.answer-content h1,
.answer-content h2,
.answer-content h3 {
    margin: 12px 0 8px 0;
    font-weight: 600;
    font-size: 16px;
}

.answer-content p {
    margin-bottom: 12px;
}

.answer-content ul,
.answer-content ol {
    margin-bottom: 12px;
    padding-left: 20px;
}

.answer-content li {
    margin-bottom: 6px;
}

/* 底部输入框容器 */
.bottom-input-container {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: var(--bg-color);
    border-top: 1px solid var(--border-color);
    padding: 12px 16px;
    padding-bottom: calc(12px + var(--safe-area-bottom));
    z-index: 100;
}

.search-box {
    display: flex;
    align-items: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 8px 12px;
    transition: all 0.2s ease;
}

.search-box:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1);
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    color: var(--text-primary);
    background: transparent;
}

.search-input::placeholder {
    color: var(--text-tertiary);
}

.send-btn {
    background: var(--primary-color);
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.send-btn:active {
    transform: scale(0.95);
}

.send-icon {
    width: 18px;
    height: 18px;
    color: white;
}

/* 打字机光标效果 */
.typing-cursor::after {
    content: '|';
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% {
        opacity: 1;
    }
    51%, 100% {
        opacity: 0;
    }
}
```

### JavaScript 逻辑
```javascript
// 模拟搜索数据
const searchSteps = [
    {
        type: 'search',
        keywords: ['人工智能发展趋势', 'AI应用场景', '机器学习最新进展']
    },
    {
        type: 'think',
        content: '用户想了解人工智能的发展趋势，需要从多个维度分析：技术发展、应用领域、市场前景、伦理问题等。我将先搜索相关技术趋势和应用案例。',
        query: '人工智能发展趋势、应用场景、最新进展'
    },
    {
        type: 'web',
        url: 'https://example.com/ai-trends-2024',
        title: '2024年人工智能发展趋势报告'
    },
    {
        type: 'web',
        url: 'https://example.com/ai-applications',
        title: '人工智能在各行业的应用案例'
    },
    {
        type: 'think',
        content: '从搜索结果看，AI在医疗、金融、教育、制造业等领域都有重要应用。大语言模型的发展尤为突出，GPT-4、Claude等模型在理解和生成能力上都有显著提升。需要进一步了解技术对比和性能指标。',
        query: '大语言模型对比、GPT-4 vs Claude、性能评估'
    },
    {
        type: 'search',
        keywords: ['大语言模型对比', 'GPT-4 vs Claude', '模型性能评估']
    },
    {
        type: 'web',
        url: 'https://example.com/llm-comparison',
        title: '主流大语言模型性能对比分析'
    },
    {
        type: 'think',
        content: '综合所有资料，可以总结出AI发展的几个关键趋势：1）大语言模型持续突破；2）多模态能力增强；3）边缘AI和端侧部署；4）AI伦理和监管加强；5）行业应用深化。',
        query: 'AI伦理问题、数据隐私保护、算法偏见'
    },
    {
        type: 'search',
        keywords: ['AI伦理问题', '数据隐私保护', '算法偏见']
    }
];

const finalAnswer = `# 人工智能发展趋势

基于搜索到的资料，人工智能的发展呈现以下几个重要趋势：

## 1. 大语言模型持续突破

以 GPT-4、Claude 等为代表的大语言模型在理解和生成能力上取得了显著进步。这些模型不仅在自然语言处理任务中表现出色，还在代码生成、数学推理等领域展现出强大能力。

## 2. 多模态能力增强

现代 AI 系统不再局限于单一模态，而是能够同时处理文本、图像、音频等多种数据类型。这使得 AI 在视觉问答、图像生成、语音识别等任务中表现更加出色。

## 3. 行业应用深化

AI 技术在以下领域得到广泛应用：

- **医疗健康**：辅助诊断、药物研发、个性化治疗
- **金融服务**：风险评估、智能投顾、欺诈检测
- **教育培训**：个性化学习、智能辅导、内容生成
- **制造业**：预测性维护、质量控制、供应链优化

## 4. 边缘 AI 和端侧部署

为了降低延迟、保护隐私，越来越多的 AI 模型被部署到边缘设备上，如手机、汽车、智能家居等。

## 5. AI 伦理和监管加强

随着 AI 技术的广泛应用，各国政府和组织开始制定相关法规，关注数据隐私、算法公平性、透明度等问题。

## 总结

人工智能正处于快速发展阶段，技术创新和应用落地并行推进。未来几年，我们有望看到更智能、更安全、更普惠的 AI 产品和服务。`;

class SearchController {
    constructor() {
        this.keywordCount = 0;
        this.contentCount = 0;
        this.isSearching = false;
        this.isExpanded = false;
        
        this.searchStatusSection = document.getElementById('searchStatusSection');
        this.searchStatusHeader = document.getElementById('searchStatusHeader');
        this.searchStatusContent = document.getElementById('searchStatusContent');
        this.statusText = document.getElementById('statusText');
        this.expandIcon = document.getElementById('expandIcon');
        this.answerSection = document.getElementById('answerSection');
        this.answerContent = document.getElementById('answerContent');
        
        this.bindEvents();
        this.startSearch();
    }
    
    bindEvents() {
        this.searchStatusHeader.addEventListener('click', () => this.toggleExpand());
        this.searchStatusHeader.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.toggleExpand();
        });
    }
    
    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        this.searchStatusSection.classList.toggle('expanded', this.isExpanded);
    }
    
    async startSearch() {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.searchStatusSection.style.display = 'block';
        
        // 逐步执行搜索步骤
        for (const step of searchSteps) {
            await this.processStep(step);
            await this.delay(800);
        }
        
        // 搜索完成
        this.updateStatusText();
        await this.delay(500);
        this.showAnswer();
        
        this.isSearching = false;
    }
    
    async processStep(step) {
        const stepElement = document.createElement('div');
        stepElement.className = 'step-item';
        
        if (step.type === 'search') {
            this.keywordCount += step.keywords.length;
            this.updateStatusText();
            stepElement.innerHTML = this.createSearchStepHTML(step);
        } else if (step.type === 'think') {
            stepElement.innerHTML = this.createThinkStepHTML(step);
        } else if (step.type === 'web') {
            this.contentCount++;
            this.updateStatusText();
            stepElement.innerHTML = this.createWebStepHTML(step);
        }
        
        this.searchStatusContent.appendChild(stepElement);
        this.searchStatusContent.scrollTop = this.searchStatusContent.scrollHeight;
    }
    
    createSearchStepHTML(step) {
        const keywords = step.keywords.map(k => 
            `<span class="search-tag">
                <svg class="search-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
                ${k}
            </span>`
        ).join('');
        
        return `
            <div class="search-step">
                <div class="search-step-header">
                    <svg class="search-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                    <span class="search-step-title">正在搜索</span>
                </div>
                <div class="search-step-content">
                    ${keywords}
                </div>
            </div>
        `;
    }
    
    createThinkStepHTML(step) {
        return `
            <div class="think-step">
                <div class="think-step-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <span class="think-step-title">💭 思考中...</span>
                    <span class="expand-icon">▼</span>
                </div>
                <div class="think-step-content">
                    ${step.content}
                    <div class="think-step-query">使用查询：${step.query}</div>
                </div>
            </div>
        `;
    }
    
    createWebStepHTML(step) {
        return `
            <div class="web-step">
                <svg class="web-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <a href="${step.url}" class="web-step-link" target="_blank">${step.title}</a>
            </div>
        `;
    }
    
    updateStatusText() {
        this.statusText.textContent = `搜索 ${this.keywordCount} 个关键词，参考 ${this.contentCount} 篇内容`;
    }
    
    async showAnswer() {
        this.answerSection.style.display = 'block';
        this.answerContent.innerHTML = '';
        this.answerContent.classList.add('typing-cursor');
        
        // 打字机效果
        const chars = finalAnswer.split('');
        for (const char of chars) {
            this.answerContent.innerHTML += char;
            await this.delay(3);
        }
        
        this.answerContent.classList.remove('typing-cursor');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SearchController();
});
```

## 边界条件与异常处理

1. **移动端适配**：处理不同屏幕尺寸和安全区域
2. **触摸优化**：优化触摸区域和触摸反馈
3. **键盘弹出**：处理软键盘弹出时的布局调整
4. **滚动优化**：使用 -webkit-overflow-scrolling: touch

## 数据流动路径

1. 用户输入查询 → 点击发送
2. 控制器接收事件 → 开始搜索流程
3. 遍历搜索步骤 → 动态添加步骤到 DOM
4. 更新状态栏统计信息
5. 搜索完成 → 显示最终回答（打字机效果）

## 预期成果

1. 完美的移动端适配（375px-428px）
2. 仿真实 AI 搜索 App 的界面设计
3. 完整的搜索、思考、网页获取流程展示
4. 可折叠/展开的详细步骤
5. 打字机效果的最终回答
6. 固定底部的搜索输入框
7. 流畅的触摸交互和动画
8. 适配安全区域（刘海屏等）