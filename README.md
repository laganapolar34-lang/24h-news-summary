# 24小时新闻简报

每日自动更新的国际新闻聚合网页，包含黄金价格和汇率。

## 🌐 在线访问

- **首页**: https://eloquent-bunny-6fd118.netlify.app/
- **历史页面**: https://eloquent-bunny-6fd118.netlify.app/YYYY-MM-DD.html

## 📁 项目结构

```
24h-news-summary/
├── index.html          # 首页（当天最新）
├── YYYY-MM-DD.html    # 历史页面（每天自动生成）
├── css/
│   └── style.css      # 样式文件（Apple Newsroom 风格）
├── netlify.toml       # Netlify 配置
└── README.md          # 本文件
```

## 🎨 设计风格

- Apple Newsroom 风格：简洁、白色背景、大字体
- 移动端优先设计
- 有图/无图新闻混排

## ⚙️ 自动更新

### Cron 任务
- **触发时间**: 每天 08:00（北京时间）
- **执行者**: Miles（子代理）
- **任务内容**:
  1. 搜索当日国际新闻（政治、财经、军事）
  2. 查询黄金价格和汇率
  3. 更新 index.html
  4. 创建历史页面（YYYY-MM-DD.html）
  5. 推送到 GitHub

### 任务 ID
```
20281793-6549-4f46-953f-9f9534179368
```

### 修改 Cron 任务
```bash
# 查看任务
cron action=list

# 更新任务（修改 message 内容）
cron action=update id=20281793-6549-4f46-953f-9f9534179368 patch='{"payload": {"message": "新内容"}}'
```

## 🔧 手动修改指南

### 1. 修改网页样式
文件: `css/style.css`

关键变量:
```css
:root {
    --text-primary: #1d1d1f;   /* 主文字颜色 */
    --text-secondary: #86868b;  /* 次要文字颜色 */
    --accent: #0066cc;         /* 链接颜色 */
    --bg: #ffffff;              /* 背景色 */
    --bg-alt: #f5f5f7;          /* 交替背景色 */
}
```

### 2. 修改新闻分类
文件: `index.html`

新闻分类部分:
```html
<section class="news-section">
    <h2 class="section-title">
        <span class="icon">🌍</span>
        国际政治
    </h2>
    <!-- 新闻列表 -->
</section>
```

### 3. 修改黄金/汇率数据
文件: `index.html`

黄金价格区域:
```html
<div class="gold-card">
    <span class="gold-label">纽约现货 (USD/oz)</span>
    <span class="gold-price">$4,931.99</span>
    <span class="gold-change">今日 -$3.91</span>
</div>
```

### 4. 添加新页面元素
- HTML: 在 `index.html` 中添加，Miles 更新时会保留结构
- CSS: 在 `css/style.css` 中添加

### 5. 修改日期导航
文件: `index.html` 中的 JavaScript 部分

关键函数:
- `getPageDate()`: 从 URL 解析日期
- `prevDay`/`nextDay`: 前一天/后一天按钮

## 📊 数据来源

| 数据 | 来源 |
|------|------|
| 国际新闻 | Reuters, NYTimes, Bloomberg, Guardian 等 |
| 黄金价格 | Kitco, Investing.com |
| 汇率 | 中国外汇交易中心中间价 |

## 🚀 部署

### Netlify（当前）
1. 推送到 GitHub
2. Netlify 自动构建
3. 访问 `https://xxx.netlify.app/`

### 本地测试
```bash
# 克隆仓库
git clone https://github.com/laganapolar34-lang/24h-news-summary.git
cd 24h-news-summary

# 本地预览（需要 Python）
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 📝 汇报格式

每天 8 点自动发送的汇报模板:

```
📰 **今日新闻摘要（3条，至少1条财经）**
1. [政治/军事新闻标题]
2. [财经新闻标题]
3. [政治/军事/财经新闻标题]

🥇 **黄金价格**
- 纽约现货: $xxxx.xx (今日涨跌)
- 伦敦现货: $xxxx.xx (今日涨跌)
- 人民币/克: ¥xxxx.xx

💱 **汇率**
- 美元/人民币: ¥x.xx
- 100日元/人民币: ¥x.xx

🔗 **网页地址**：https://eloquent-bunny-6fd118.netlify.app/
```

## 🔑 关键文件路径

- 项目目录: `~/Claude开发项目/`
- Nix 工作区: `/Users/laganapolar/.openclaw/agents/nix/`
- Cron 任务配置: OpenClaw Gateway

## ❓ 常见问题

**Q: 如何手动触发更新？**
A: 运行 `cron action=run id=20281793-6549-4f46-953f-9f9534179368`
   或 `cron action=list` 查找"每日新闻页面更新"

**Q: 如何查看历史任务？**
A: 运行 `cron action=runs id=20281793-6549-4f46-953f-9f9534179368`

**Q: Cron ID 变了怎么办？**
A: 运行 `cron action=list` 查看所有任务，找到"每日新闻页面更新"对应的 ID

**Q: 网页显示异常怎么办？**
A: 检查 GitHub 仓库是否有最新提交，或在 Netlify 查看构建日志
