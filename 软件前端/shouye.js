// 动漫与特摄剧管理系统 - 视频背景管理器
class VideoBackgroundManager {
    constructor() {
        // 初始化视频切换机制
        this.initializeVideoSwitch();
    }

    // 初始化视频切换机制
    initializeVideoSwitch() {
        // 获取视频元素
        this.previewVideo = document.getElementById('previewVideo');
        this.mainVideo = document.getElementById('mainVideo');
        
        if (!this.previewVideo || !this.mainVideo) {
            console.error('找不到视频元素');
            return;
        }
        
        // 设置预览视频属性（静音自动播放）
        this.previewVideo.muted = true;
        this.previewVideo.loop = true;
        this.previewVideo.playsInline = true;
        this.previewVideo.autoplay = true;
        
        // 设置主视频属性（有声音，点击后播放）
        this.mainVideo.muted = false;
        this.mainVideo.loop = true;
        this.mainVideo.playsInline = true;
        
        // 添加视频错误处理
        this.previewVideo.addEventListener('error', () => this.handleVideoError('预览视频'));
        this.mainVideo.addEventListener('error', () => this.handleVideoError('主视频'));
        
        // 设置交互监听器
        this.setupInteraction();
        
        // 响应式调整
        window.addEventListener('resize', () => this.optimizeVideoForScreen());
        
        // 初始优化
        this.optimizeVideoForScreen();
    }
    
    // 设置交互监听器
    setupInteraction() {
        // 添加点击事件处理函数
        document.addEventListener('click', this.handleInteraction.bind(this));
        
        // 也支持触摸事件，适配移动设备
        document.addEventListener('touchstart', this.handleInteraction.bind(this));
        
        // 添加键盘事件支持
        document.addEventListener('keydown', (e) => {
            // 按空格键或回车键也可以触发切换
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.handleInteraction();
            }
        });
    }
    
    // 处理用户交互
    handleInteraction() {
        // 如果预览视频仍在显示（即还没有切换到主视频）
        if (this.previewVideo.style.display !== 'none') {
            this.switchToMainVideo();
            // 移除事件监听器，防止重复切换
            document.removeEventListener('click', this.handleInteraction.bind(this));
            document.removeEventListener('touchstart', this.handleInteraction.bind(this));
            

        }
    }
    
    // 切换到主视频（有声音）
    switchToMainVideo() {
        console.log('切换到有声音的主视频');
        
        // 淡出预览视频
        this.previewVideo.style.opacity = '0';
        this.previewVideo.style.transition = 'opacity 0.8s ease';
        
        // 准备主视频
        this.mainVideo.style.display = 'block';
        this.mainVideo.style.opacity = '0';
        this.mainVideo.style.transition = 'opacity 0.8s ease';
        
        // 尝试播放主视频
        this.mainVideo.play().then(() => {
            console.log('主视频播放成功');
            
            // 显示主视频
            setTimeout(() => {
                this.mainVideo.style.opacity = '1';
            }, 100);
            
            // 完全隐藏预览视频
            setTimeout(() => {
                this.previewVideo.style.display = 'none';
            }, 800);
            
        }).catch(error => {
            console.error('主视频播放失败:', error);
            
            // 恢复预览视频
            this.previewVideo.style.opacity = '1';
            this.mainVideo.style.display = 'none';
            
            // 尝试备用方案：静音播放主视频
            this.tryAlternativePlayback();
        });
    }
    
    // 尝试备用播放方案
    tryAlternativePlayback() {
        console.log('尝试备用播放方案：静音播放主视频');
        
        // 静音播放主视频
        this.mainVideo.muted = true;
        
        this.mainVideo.play().then(() => {
            console.log('备用方案成功：静音播放主视频');
            
            // 显示主视频
            setTimeout(() => {
                this.mainVideo.style.opacity = '1';
            }, 100);
            
            // 完全隐藏预览视频
            setTimeout(() => {
                this.previewVideo.style.display = 'none';
            }, 800);
            

            
        }).catch(err => {
            console.error('备用方案也失败:', err);
            this.applyFallbackBackground();
        });
    }
    
    // 根据屏幕尺寸优化视频显示
    optimizeVideoForScreen() {
        const isMobile = window.innerWidth <= 768;
        const videos = [this.previewVideo, this.mainVideo];
        
        videos.forEach(video => {
            if (video) {
                if (isMobile) {
                    video.style.width = '120%';
                    video.style.height = '120%';
                } else {
                    video.style.width = '100%';
                    video.style.height = '100%';
                }
            }
        });
    }
    
    // 视频加载错误处理
    handleVideoError(videoType) {
        console.error(`${videoType}加载失败`);
        
        if (videoType === '预览视频') {
            // 如果预览视频失败，尝试直接播放主视频（但静音）
            this.previewVideo.style.display = 'none';
            this.mainVideo.muted = true;
            this.mainVideo.style.display = 'block';
            this.mainVideo.style.opacity = '1';
            
            this.mainVideo.play().catch(err => {
                console.error('直接播放主视频失败:', err);
                this.applyFallbackBackground();
            });
        } else if (videoType === '主视频') {
            // 如果主视频失败，保持使用预览视频
            this.previewVideo.style.opacity = '1';
            this.mainVideo.style.display = 'none';
        }
    }
    
    // 应用后备背景
    applyFallbackBackground() {
        console.log('应用后备背景');
        
        // 隐藏所有视频
        if (this.previewVideo) this.previewVideo.style.display = 'none';
        if (this.mainVideo) this.mainVideo.style.display = 'none';
        
        // 添加渐变背景
        const container = document.querySelector('.background-container');
        if (container) {
            container.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        }
        

    }
}

// 导出VideoBackgroundManager类，供其他页面使用
window.VideoBackgroundManager = VideoBackgroundManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 初始化视频背景管理器
    const videoBackgroundManager = new VideoBackgroundManager();
    
    console.log('动漫与特摄剧管理系统首页加载完成');
});

/**
 * 动漫与特摄剧管理系统 - 视频背景使用说明
 * 
 * 1. 页面默认加载并播放静音预览视频：【哲风壁纸】动态壁纸-动漫-简约.mp4
 * 2. 用户点击页面任意位置后，切换到有声音的主视频：chaoran.mp4
 * 3. 支持响应式设计，适配不同屏幕尺寸
 * 4. 包含错误处理和后备方案，确保良好的用户体验
 */

// 动漫与特摄剧管理系统 - 内容管理器
class ContentManager {
    constructor() {
        // 初始化数据和DOM元素
        this.popularContentElement = document.getElementById('popular-content');
        this.carouselContainerElement = document.getElementById('carousel-container');
        
        // Mock数据 - 当API不可用时使用
        this.mockResources = [
            {
                ResourceID: 1,
                Code: 'AN001',
                Name: '海贼王',
                Category: '动画',
                Country: '日本',
                Description: '讲述了路飞为了实现与因救他而断臂的香克斯的约定而出海，在旅途中不断寻找志同道合的伙伴，一起向着伟大航线进发，目标是成为海贼王。',
                ImageURL: 'https://picsum.photos/seed/onepiece/400/600'
            },
            {
                ResourceID: 2,
                Code: 'AN002',
                Name: '斗罗大陆',
                Category: '动画',
                Country: '中国',
                Description: '唐三因偷学内门绝学为唐门所不容，跳崖明志时却发现没有死，反而穿越到了另一个世界，一个属于武魂的世界。',
                ImageURL: 'https://picsum.photos/seed/douluo/400/600'
            },
            {
                ResourceID: 3,
                Code: 'AN003',
                Name: '完美世界',
                Category: '动画',
                Country: '中国',
                Description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。群雄并起，万族林立，诸圣争霸，乱天动地。问苍茫大地，谁主沉浮？',
                ImageURL: 'https://picsum.photos/seed/wanmei/400/600'
            },
            {
                ResourceID: 4,
                Code: 'AN004',
                Name: '火影忍者',
                Category: '动画',
                Country: '日本',
                Description: '故事成功地将原本隐藏在黑暗中，用世界上最强大的毅力和最艰辛的努力去做最密不可宣和隐讳残酷的事情的忍者，描绘成了太阳下最值得骄傲最光明无限的职业。',
                ImageURL: 'https://picsum.photos/seed/naruto/400/600'
            },
            {
                ResourceID: 5,
                Code: 'AN005',
                Name: '斗破苍穹',
                Category: '动画',
                Country: '中国',
                Description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！',
                ImageURL: 'https://picsum.photos/seed/doupocangqiong/400/600'
            },
            {
                ResourceID: 6,
                Code: 'AN006',
                Name: '凡人修仙传',
                Category: '动画',
                Country: '中国',
                Description: '一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子。他以这样身份，如何在门派中立足，如何以平庸的资质进入到修仙者的行列，靠的只是比别人更多一点点的努力和机遇。',
                ImageURL: 'https://picsum.photos/seed/fanren/400/600'
            },
            {
                ResourceID: 7,
                Code: 'MO001',
                Name: '复仇者联盟',
                Category: '电影',
                Country: '美国',
                Description: '一个来自地球之外的威胁，让地球上最强大的超级英雄们不得不团结起来，共同对抗这个可能毁灭地球的敌人。',
                ImageURL: 'https://picsum.photos/seed/avengers/400/600'
            },
            {
                ResourceID: 8,
                Code: 'DR001',
                Name: '山海情',
                Category: '短剧',
                Country: '中国',
                Description: '讲述了二十世纪九十年代以来，在国家扶贫政策的引导下，在福建的对口帮扶下，西海固的人民群众移民搬迁，不断克服各种困难，探索脱贫发展办法，将风沙走石的"干沙滩"建设成寸土寸金的"金沙滩"的故事。',
                ImageURL: 'https://picsum.photos/seed/shanhaiqing/400/600'
            },
            {
                ResourceID: 9,
                Code: 'CA001',
                Name: '蝙蝠侠：黑暗骑士',
                Category: '电影',
                Country: '美国',
                Description: '蝙蝠侠、戈登警长和检察官哈维·登特组成了一个打击犯罪的"正义联盟"，共同对抗哥谭市的犯罪势力。',
                ImageURL: 'https://picsum.photos/seed/batman/400/600'
            },
            {
                ResourceID: 10,
                Code: 'CM001',
                Name: '蜘蛛侠：平行宇宙',
                Category: '动画电影',
                Country: '美国',
                Description: '讲述了普通高中生迈尔斯·莫拉莱斯如何跟随蜘蛛侠彼得·帕克的脚步，成为新一代的蜘蛛侠的故事。',
                ImageURL: 'https://picsum.photos/seed/spiderverse/400/600'
            }
        ];
    }
    
    // 初始化内容
    initialize() {
        this.loadAndRenderPopularContent();
        this.loadAndRenderCarousel();
    }
    
    // 获取热门推荐数据
    async fetchPopularContent() {
        try {
            // 尝试从API获取数据
            const response = await fetch('/api/popular');
            if (response.ok) {
                return await response.json();
            }
            throw new Error('API返回非成功状态');
        } catch (error) {
            console.log('API调用失败，使用模拟数据:', error);
            // 返回模拟数据
            return this.mockResources;
        }
    }
    
    // 加载并渲染热门推荐
    async loadAndRenderPopularContent() {
        if (!this.popularContentElement) return;
        
        try {
            const data = await this.fetchPopularContent();
            this.renderPopularContent(data);
        } catch (error) {
            console.error('渲染热门推荐失败:', error);
        }
    }
    
    // 渲染热门推荐
    renderPopularContent(resources) {
        if (!this.popularContentElement || !resources || resources.length === 0) return;
        
        // 清空容器
        this.popularContentElement.innerHTML = '';
        
        // 创建资源卡片
        resources.forEach(resource => {
            const item = document.createElement('div');
            item.className = 'popular-item';
            
            item.innerHTML = `
                <img src="${resource.ImageURL || 'https://picsum.photos/seed/' + resource.ResourceID + '/400/600'}" alt="${resource.Name}">
                <div class="popular-item-info">
                    <div class="popular-item-title">${resource.Name}</div>
                    <div class="popular-item-desc">${resource.Description || '暂无简介'}</div>
                </div>
            `;
            
            // 添加点击事件
            item.addEventListener('click', () => {
                console.log('查看资源:', resource.Name);
                // 可以添加跳转到详情页的逻辑
            });
            
            this.popularContentElement.appendChild(item);
        });
    }
    
    // 获取轮播图数据
    async fetchCarouselData() {
        try {
            // 尝试从API获取数据
            const response = await fetch('/api/carousel');
            if (response.ok) {
                const data = await response.json();
                return data.slice(0, 5); // 最多显示5个轮播项
            }
            throw new Error('API返回非成功状态');
        } catch (error) {
            console.log('轮播图API调用失败，使用模拟数据:', error);
            // 随机选择3-5个资源作为轮播图
            const shuffled = [...this.mockResources].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
        }
    }
    
    // 加载并渲染轮播图
    async loadAndRenderCarousel() {
        if (!this.carouselContainerElement) return;
        
        try {
            const data = await this.fetchCarouselData();
            this.renderCarousel(data);
        } catch (error) {
            console.error('渲染轮播图失败:', error);
        }
    }
    
    // 渲染轮播图
    renderCarousel(items) {
        if (!this.carouselContainerElement || !items || items.length === 0) return;
        
        // 清空容器
        this.carouselContainerElement.innerHTML = '';
        
        // 创建轮播轨道
        const track = document.createElement('div');
        track.className = 'carousel-track';
        
        // 创建轮播项
        items.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            slide.innerHTML = `
                <img src="${item.ImageURL || 'https://picsum.photos/seed/' + item.ResourceID + '/1200/400'}" alt="${item.Name}">
                <div class="carousel-slide-content">
                    <h3 class="carousel-slide-title">${item.Name}</h3>
                    <p class="carousel-slide-desc">${item.Description || '暂无简介'}</p>
                    <div class="carousel-slide-meta">
                        <span>类型: ${item.Category || '未知'}</span>
                        <span>国家: ${item.Country || '未知'}</span>
                    </div>
                </div>
            `;
            
            track.appendChild(slide);
        });
        
        this.carouselContainerElement.appendChild(track);
        
        // 创建指示器
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        items.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
            indicator.dataset.index = index;
            
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            indicators.appendChild(indicator);
        });
        
        this.carouselContainerElement.appendChild(indicators);
        
        // 创建控制按钮
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-control carousel-control-prev';
        prevButton.innerHTML = '&lt;';
        prevButton.addEventListener('click', () => {
            this.prevSlide();
        });
        
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-control carousel-control-next';
        nextButton.innerHTML = '&gt;';
        nextButton.addEventListener('click', () => {
            this.nextSlide();
        });
        
        controls.appendChild(prevButton);
        controls.appendChild(nextButton);
        
        this.carouselContainerElement.appendChild(controls);
        
        // 初始化轮播状态
        this.currentSlide = 0;
        this.slideCount = items.length;
        this.track = track;
        this.indicators = indicators;
        
        // 启动自动轮播
        this.startAutoSlide();
    }
    
    // 跳转到指定幻灯片
    goToSlide(index) {
        if (index < 0 || index >= this.slideCount) return;
        
        this.currentSlide = index;
        
        // 更新轮播轨道位置
        const slideWidth = -100 * index;
        this.track.style.transform = `translateX(${slideWidth}%)`;
        
        // 更新指示器状态
        const allIndicators = this.indicators.querySelectorAll('.carousel-indicator');
        allIndicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // 重置自动轮播计时器
        this.resetAutoSlide();
    }
    
    // 上一张幻灯片
    prevSlide() {
        const newIndex = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.goToSlide(newIndex);
    }
    
    // 下一张幻灯片
    nextSlide() {
        const newIndex = (this.currentSlide + 1) % this.slideCount;
        this.goToSlide(newIndex);
    }
    
    // 启动自动轮播
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 每5秒切换一次
    }
    
    // 重置自动轮播计时器
    resetAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        this.startAutoSlide();
    }
}

// 在页面加载完成后初始化内容管理器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化内容管理器
    const contentManager = new ContentManager();
    contentManager.initialize();
    
    console.log('动漫与特摄剧管理系统内容管理器初始化完成');
});
