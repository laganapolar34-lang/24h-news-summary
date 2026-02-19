/**
 * 新闻简报 - 日期导航和交互脚本
 */

(function() {
    'use strict';
=== 日期    
    // =========工具函数 ============
    
    // 获取当前页面日期（从URL或默认今天）
    function getPageDate() {
        const path = window.location.pathname;
        const match = path.match(/(\d{4}-\d{2}-\d{2})\.html/);
        if (match) {
            const date = new Date(match[1]);
            // 修正时区问题
            return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        }
        return new Date();
    }
    
    // 获取今天日期（只取日期部分，设置时间为00:00:00）
    function getToday() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    }
    
    // 格式化日期为 YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // 格式化日期显示
    function formatDateDisplay(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('zh-CN', options);
    }
    
    // ============ 页面初始化 ============
    
    function init() {
        const pageDate = getPageDate();
        const today = getToday();
        const pageDateStr = formatDate(pageDate);
        const todayStr = formatDate(today);
        
        // 设置日期选择器
        const dateInput = document.getElementById('datePicker');
        if (dateInput) {
            dateInput.value = pageDateStr;
            dateInput.max = todayStr;
        }
        
        // 设置日期显示
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) {
            const isIndex = window.location.pathname === '/' || 
                           window.location.pathname === '/index.html' ||
                           window.location.pathname.endsWith('/');
            
            if (isIndex) {
                currentDateEl.textContent = '今日 · ' + formatDateDisplay(pageDate);
            } else {
                currentDateEl.textContent = formatDateDisplay(pageDate);
            }
        }
        
        // 初始化日期导航
        initDateNavigation(pageDate, today, pageDateStr, todayStr);
        
        // 初始化动画
        initAnimations();
    }
    
    // ============ 日期导航 ============
    
    function initDateNavigation(pageDate, today, pageDateStr, todayStr) {
        const prevBtn = document.getElementById('prevDay');
        const nextBtn = document.getElementById('nextDay');
        
        // 后一天按钮：如果是今天或之后则禁用
        if (pageDateStr >= todayStr) {
            if (nextBtn) {
                nextBtn.classList.add('disabled');
                nextBtn.style.opacity = '0.3';
                nextBtn.style.pointerEvents = 'none';
            }
        }
        
        // 前一天按钮点击
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                navigateToPrevDay(pageDate, today, todayStr);
            });
        }
        
        // 后一天按钮点击
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (pageDateStr < todayStr) {
                    navigateToNextDay(pageDate, today, todayStr);
                }
            });
        }
        
        // 日期选择器变化
        const dateInput = document.getElementById('datePicker');
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                const selectedDate = this.value;
                if (selectedDate && selectedDate !== pageDateStr) {
                    navigateToDate(selectedDate, todayStr);
                }
            });
        }
    }
    
    // 跳转到前一天
    function navigateToPrevDay(pageDate, today, todayStr) {
        const prevDate = new Date(pageDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = formatDate(prevDate);
        
        if (prevDateStr === todayStr) {
            window.location.href = 'index.html';
        } else {
            window.location.href = prevDateStr + '.html';
        }
    }
    
    // 跳转到后一天
    function navigateToNextDay(pageDate, today, todayStr) {
        const nextDate = new Date(pageDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = formatDate(nextDate);
        
        if (nextDateStr === todayStr) {
            window.location.href = 'index.html';
        } else {
            window.location.href = nextDateStr + '.html';
        }
    }
    
    // 跳转到选择日期
    function navigateToDate(selectedDate, todayStr) {
        if (selectedDate === todayStr) {
            window.location.href = 'index.html';
        } else {
            window.location.href = selectedDate + '.html';
        }
    }
    
    // ============ 动画 ============
    
    function initAnimations() {
        // 页面加载后添加动画类
        document.addEventListener('DOMContentLoaded', function() {
            const newsItems = document.querySelectorAll('.news-item');
            newsItems.forEach(function(item, index) {
                item.style.opacity = '0';
                item.style.animationDelay = (index * 0.1) + 's';
            });
        });
    }
    
    // ============ 启动 ============
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
