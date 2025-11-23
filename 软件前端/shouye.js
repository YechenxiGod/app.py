// 轮播图数据
const carouselData = [
    {
        id: 1,
        title: "哪吒之魔童闹海",
        subtitle: "天劫之后，哪吒、敖丙的灵魂保住了，但肉身在很快就会飞魄散。太乙真人打算用十色宝莲给二人重塑肉身。但是在重塑肉身的过程中...",
        imageUrl: "https://example.com/nezha.jpg",
        actionUrl: "index.html"
    },
    {
        id: 2,
        title: "无职转生 第二季",
        subtitle: "卢迪乌斯·格雷拉特的冒险仍在继续，这次他将面对更多挑战和成长。",
        imageUrl: "https://example.com/mushoku.jpg",
        actionUrl: "index.html"
    },
    {
        id: 3,
        title: "夏日重现",
        subtitle: "主角回到家乡参加姐姐的葬礼，却发现自己陷入了一个神秘的循环。",
        imageUrl: "https://example.com/summer.jpg",
        actionUrl: "index.html"
    },
    {
        id: 4,
        title: "进击的巨人 最终季",
        subtitle: "人类与巨人的最终决战即将到来，艾伦的计划逐渐浮出水面。",
        imageUrl: "https://example.com/aot.jpg",
        actionUrl: "index.html"
    },
    {
        id: 5,
        title: "鬼灭之刃 锻刀村篇",
        subtitle: "炭治郎一行人来到锻刀村，寻找新的刀匠修复日轮刀。",
        imageUrl: "https://example.com/demon.jpg",
        actionUrl: "index.html"
    }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    loadPopularAnimes();
});

// 初始化轮播图
function initCarousel() {
    const carouselSlides = document.querySelector('.carousel-slides');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;
    let interval;

    // 创建轮播图幻灯片
    function createSlides() {
        carouselSlides.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        carouselData.forEach((item, index) => {
            // 创建幻灯片
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${item.imageUrl})`;
            
            slide.innerHTML = `
                <div class="carousel-content">
                    <h2>${item.title}</h2>
                    <p>${item.subtitle}</p>
                    <button onclick="window.location.href='${item.actionUrl}'">播放正片</button>
                </div>
            `;
            
            carouselSlides.appendChild(slide);

            // 创建指示器
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        // 隐藏所有幻灯片和指示器
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 显示当前幻灯片和指示器
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentIndex = index;
    }

    // 下一张幻灯片
    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselData.length;
        goToSlide(currentIndex);
    }

    // 上一张幻灯片
    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
        goToSlide(currentIndex);
    }

    // 自动播放
    function startAutoplay() {
        interval = setInterval(nextSlide, 5000);
    }

    // 停止自动播放
    function stopAutoplay() {
        clearInterval(interval);
    }

    // 初始化
    createSlides();
    startAutoplay();

    // 添加事件监听器
    prevButton.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });

    nextButton.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });

    // 鼠标悬停时停止自动播放
    carouselSlides.addEventListener('mouseenter', stopAutoplay);
    carouselSlides.addEventListener('mouseleave', startAutoplay);
}

// 加载热门推荐动漫
function loadPopularAnimes() {
    // 由于没有API，使用模拟数据
    const mockResources = [
        { id: 1, title: "无职转生II", status: "可观看" },
        { id: 2, title: "我独自升级", status: "可观看" },
        { id: 3, title: "哪吒之魔童闹海", status: "可观看" },
        { id: 4, title: "更衣人偶坠入爱河", status: "可观看" },
        { id: 5, title: "碧蓝之海", status: "可观看" },
        { id: 6, title: "章鱼噼的原罪", status: "可观看" },
        { id: 7, title: "鬼灭之刃", status: "可观看" },
        { id: 8, title: "进击的巨人", status: "可观看" }
    ];
    
    const animeGrid = document.getElementById('popularAnimes');
    if (!animeGrid) return;
    
    animeGrid.innerHTML = '';
    
    mockResources.forEach(resource => {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.innerHTML = `
            <div class="anime-image">
                <!-- 图片将由用户自行添加 -->
                <span>${resource.title}</span>
            </div>
            <div class="anime-info">
                <div class="anime-title">${resource.title}</div>
                <div class="anime-status ${resource.status === '可观看' ? 'available' : 'borrowed'}">
                    ${resource.status}
                </div>
            </div>
        `;
        animeGrid.appendChild(animeCard);
    });
}