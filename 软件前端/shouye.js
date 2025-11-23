// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadHomeStats();
    loadPopularAnimes();
});

// 加载首页统计信息
async function loadHomeStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/resources/stats/summary`);
        const summary = await response.json();
        
        document.getElementById('totalResourcesHome').textContent = summary.totalBooks;
        document.getElementById('availableResourcesHome').textContent = summary.availableBooks;
        document.getElementById('borrowedResourcesHome').textContent = summary.borrowedBooks;
    } catch (error) {
        console.error('加载统计信息失败:', error);
    }
}

// 加载热门推荐动漫
async function loadPopularAnimes() {
    try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        const resources = await response.json();
        
        const animeGrid = document.getElementById('popularAnimes');
        animeGrid.innerHTML = '';
        
        // 最多显示12个资源
        const displayResources = resources.slice(0, 12);
        
        displayResources.forEach(resource => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            animeCard.innerHTML = `
                <div class="anime-image">
                    <!-- 图片将由用户自行添加 -->
                    <span>${resource.title}</span>
                </div>
                <div class="anime-info">
                    <div class="anime-title">${resource.title}</div>
                    <div class="anime-director">导演: ${resource.director}</div>
                    <div class="anime-status ${resource.status === '可观看' ? 'available' : 'borrowed'}">
                        ${resource.status}
                    </div>
                </div>
            `;
            animeGrid.appendChild(animeCard);
        });
    } catch (error) {
        console.error('加载热门推荐失败:', error);
        document.getElementById('popularAnimes').innerHTML = '<p>加载失败，请稍后再试</p>';
    }
}