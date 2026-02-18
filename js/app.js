// 24小时新闻摘要 - JavaScript

let currentNews = [];
let currentCategory = 'all';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置日期选择器为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datePicker').value = today;
    
    // 加载数据
    loadGoldPrice();
    loadNews();
    loadHistoryDates();
});

// 加载黄金价格
async function loadGoldPrice() {
    try {
        const response = await fetch('/api/gold');
        const data = await response.json();
        
        document.getElementById('nyPrice').textContent = `$${data.ny.price}`;
        document.getElementById('ldPrice').textContent = `$${data.ld.price}`;
        document.getElementById('nyCnyPrice').textContent = `¥${data.ny_cny_gram.price}`;
        document.getElementById('ldCnyPrice').textContent = `¥${data.ld_cny_gram.price}`;
        
        document.getElementById('goldUpdateTime').textContent = 
            `更新时间: ${data.updated} | 汇率: 1 USD = ¥${data.exchange_rate.usd_to_cny}`;
    } catch (error) {
        console.error('加载黄金价格失败:', error);
    }
}

// 加载新闻
async function loadNews() {
    const date = document.getElementById('datePicker').value;
    const newsList = document.getElementById('newsList');
    const updateTime = document.getElementById('updateTime');
    
    newsList.innerHTML = '<div class="loading">加载中...</div>';
    
    try {
        const response = await fetch(`/api/news?date=${date}`);
        const data = await response.json();
        
        currentNews = data.articles || [];
        
        if (currentNews.length === 0) {
            newsList.innerHTML = '<div class="empty">暂无新闻数据</div>';
            updateTime.textContent = '--';
            return;
        }
        
        updateTime.textContent = data.date;
        renderNews(currentNews);
    } catch (error) {
        console.error('加载新闻失败:', error);
        newsList.innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
    }
}

// 渲染新闻列表
function renderNews(articles) {
    const newsList = document.getElementById('newsList');
    const filtered = currentCategory === 'all' 
        ? articles 
        : articles.filter(a => a.category === currentCategory);
    
    if (filtered.length === 0) {
        newsList.innerHTML = '<div class="empty">暂无新闻</div>';
        return;
    }
    
    newsList.innerHTML = filtered.map(article => `
        <article class="news-item" onclick="window.open('${article.url}', '_blank')">
            <span class="category ${article.category}">${getCategoryName(article.category)}</span>
            <h3>${article.title}</h3>
            <p class="summary">${article.summary}</p>
            <div class="meta">
                <span>📰 ${article.source}</span>
                <span>🕐 ${article.pubTime}</span>
                <a href="${article.url}" target="_blank">原文链接 →</a>
            </div>
        </article>
    `).join('');
}

// 分类筛选
function filterCategory(category) {
    currentCategory = category;
    
    // 更新标签状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    renderNews(currentNews);
}

// 获取分类名称
function getCategoryName(category) {
    const names = {
        'politics': '政治',
        'finance': '财经',
        'military': '军事'
    };
    return names[category] || category;
}

// 加载历史日期
async function loadHistoryDates() {
    try {
        const response = await fetch('/api/dates');
        const dates = await response.json();
        
        const historyDiv = document.getElementById('historyDates');
        
        if (dates.length === 0) {
            historyDiv.innerHTML = '<span class="empty">暂无历史数据</span>';
            return;
        }
        
        historyDiv.innerHTML = dates.map(date => `
            <span class="history-date" onclick="selectDate('${date}')">${date}</span>
        `).join('');
    } catch (error) {
        console.error('加载历史日期失败:', error);
    }
}

// 选择日期
function selectDate(date) {
    document.getElementById('datePicker').value = date;
    loadNews();
}

// 刷新新闻
async function refreshNews() {
    const btn = document.querySelector('.refresh-btn');
    btn.disabled = true;
    btn.textContent = '🔄 刷新中...';
    
    try {
        const response = await fetch('/api/refresh', { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
            alert(`刷新成功! 获取了 ${result.count} 条新闻`);
            loadNews();
            loadHistoryDates();
        } else {
            alert('刷新失败');
        }
    } catch (error) {
        alert('刷新失败: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 刷新';
    }
}

// 日期选择变化
document.getElementById('datePicker').addEventListener('change', loadNews);
