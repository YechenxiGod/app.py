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
        
        // API基础URL - 与管理后台保持一致
        this.API_BASE_URL = 'http://localhost:5000/api';
        
        // 从数据库获取的资源数据
        this.mockResources = [
            // 国漫
            {
                ResourceID: 1,
                Code: 'CM-001',
                Name: '斗罗大陆',
                Director: '沈乐平',
                Studio: '玄机科技',
                Category: '玄幻',
                Country: '中国',
                Description: '改编自唐家三少的同名小说，讲述唐三在斗罗大陆上的成长故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/douluo/400/600'
            },
            {
                ResourceID: 2,
                Code: 'CM-002',
                Name: '一人之下',
                Director: '李豪凌',
                Studio: '绘梦动画',
                Category: '奇幻',
                Country: '中国',
                Description: '普通青年张楚岚意外卷入异人世界的冒险故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/yirenzhixia/400/600'
            },
            {
                ResourceID: 3,
                Code: 'CM-003',
                Name: '凡人修仙传',
                Director: '王裕仁',
                Studio: '万维猫动画',
                Category: '修仙',
                Country: '中国',
                Description: '平凡少年韩立通过努力一步步成为修仙界传奇的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/fanrenxiuxianzhuan/400/600'
            },
            {
                ResourceID: 4,
                Code: 'CM-004',
                Name: '完美世界',
                Director: '王裕仁',
                Studio: '福煦影视',
                Category: '玄幻',
                Country: '中国',
                Description: '石昊在完美世界中成长、战斗的热血故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/wanmeishijie/400/600'
            },
            {
                ResourceID: 5,
                Code: 'CM-005',
                Name: '灵笼',
                Director: '董相博',
                Studio: '艺画开天',
                Category: '科幻',
                Country: '中国',
                Description: '末日后人类在灯塔上艰难求生的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/linglong/400/600'
            },
            
            // 日漫
            {
                ResourceID: 6,
                Code: 'JM-001',
                Name: '鬼灭之刃',
                Director: '外崎春雄',
                Studio: 'ufotable',
                Category: '热血',
                Country: '日本',
                Description: '炭治郎为了让变成鬼的妹妹变回人类，加入鬼杀队的故事。',
                Status: '已借出',
                ImageURL: 'https://picsum.photos/seed/kimetsunoyaiba/400/600'
            },
            {
                ResourceID: 7,
                Code: 'JM-002',
                Name: '进击的巨人',
                Director: '荒木哲郎',
                Studio: 'WIT STUDIO',
                Category: '热血',
                Country: '日本',
                Description: '人类为了生存与巨人战斗的黑暗奇幻故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/shingekinokyojin/400/600'
            },
            {
                ResourceID: 8,
                Code: 'JM-003',
                Name: '名侦探柯南',
                Director: '儿玉兼嗣',
                Studio: 'TMS Entertainment',
                Category: '推理',
                Country: '日本',
                Description: '高中生侦探工藤新一被灌下毒药后变成小学生江户川柯南，继续破案的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/conan/400/600'
            },
            {
                ResourceID: 9,
                Code: 'JM-004',
                Name: '海贼王',
                Director: '尾田荣一郎',
                Studio: '东映动画',
                Category: '冒险',
                Country: '日本',
                Description: '路飞为了成为海贼王而踏上伟大航路的冒险故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/onepiece/400/600'
            },
            {
                ResourceID: 10,
                Code: 'JM-005',
                Name: '火影忍者',
                Director: '伊达勇登',
                Studio: 'Studio Pierrot',
                Category: '热血',
                Country: '日本',
                Description: '漩涡鸣人成长为火影的励志故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/naruto/400/600'
            },
            
            // 特摄
            {
                ResourceID: 11,
                Code: 'TS-001',
                Name: '假面骑士01',
                Director: '杉原辉昭',
                Studio: '东映',
                Category: '特摄',
                Country: '日本',
                Description: '人工智能时代的假面骑士故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/kamenrider01/400/600'
            },
            {
                ResourceID: 12,
                Code: 'TS-002',
                Name: '泽塔奥特曼',
                Director: '田口清隆',
                Studio: '圆谷制作',
                Category: '特摄',
                Country: '日本',
                Description: '新生代奥特曼泽塔保卫地球的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/ultramanzett/400/600'
            },
            {
                ResourceID: 13,
                Code: 'TS-003',
                Name: '铠甲勇士',
                Director: '郑国伟',
                Studio: '奥飞娱乐',
                Category: '特摄',
                Country: '中国',
                Description: '中国特摄英雄铠甲勇士与邪恶势力战斗的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/kaijiayongshi/400/600'
            },
            
            // 美漫
            {
                ResourceID: 14,
                Code: 'AM-001',
                Name: '复仇者联盟',
                Director: '乔斯·韦登',
                Studio: '漫威影业',
                Category: '超级英雄',
                Country: '美国',
                Description: '漫威超级英雄团队复仇者联盟联合对抗威胁的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/avengers/400/600'
            },
            {
                ResourceID: 15,
                Code: 'AM-002',
                Name: '正义联盟',
                Director: '扎克·施奈德',
                Studio: 'DC影业',
                Category: '超级英雄',
                Country: '美国',
                Description: 'DC超级英雄团队正义联盟保护世界的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/justiceleague/400/600'
            },
            {
                ResourceID: 16,
                Code: 'AM-003',
                Name: '蜘蛛侠',
                Director: '山姆·雷米',
                Studio: '漫威影业',
                Category: '超级英雄',
                Country: '美国',
                Description: '彼得·帕克获得超能力后成为蜘蛛侠的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/spiderman/400/600'
            },
            
            // 短剧
            {
                ResourceID: 17,
                Code: 'DR-001',
                Name: '琉璃',
                Director: '尹涛',
                Studio: '欢瑞世纪',
                Category: '仙侠',
                Country: '中国',
                Description: '褚璇玑与禹司凤跨越十生十世的爱情故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/liuli/400/600'
            },
            {
                ResourceID: 18,
                Code: 'DR-002',
                Name: '山河令',
                Director: '成志超',
                Studio: '慈文传媒',
                Category: '武侠',
                Country: '中国',
                Description: '周子舒与温客行相识相知的江湖故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/shanhelin/400/600'
            },
            
            // 电影
            {
                ResourceID: 19,
                Code: 'MV-001',
                Name: '千与千寻',
                Director: '宫崎骏',
                Studio: '吉卜力工作室',
                Category: '动画电影',
                Country: '日本',
                Description: '少女千寻在神灵世界的奇幻冒险。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/spiritedaway/400/600'
            },
            {
                ResourceID: 20,
                Code: 'MV-002',
                Name: '你的名字。',
                Director: '新海诚',
                Studio: 'CoMix Wave Films',
                Category: '动画电影',
                Country: '日本',
                Description: '男女主角互换身体并寻找彼此的故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/yourname/400/600'
            },
            {
                ResourceID: 21,
                Code: 'MV-003',
                Name: '哪吒之魔童降世',
                Director: '饺子',
                Studio: '彩条屋影业',
                Category: '动画电影',
                Country: '中国',
                Description: '改编自中国传统神话，讲述哪吒的成长故事。',
                Status: '可观看',
                ImageURL: 'https://picsum.photos/seed/nezha/400/600'
            }
        ];
    }
    
    // 初始化内容
    initialize() {
        this.loadAndRenderPopularContent();
        this.loadAndRenderCarousel();
    }
    
    // 获取热门推荐数据 - 更新为使用与管理后台相同的API
    async fetchPopularContent() {
        try {
            // 尝试从与管理后台相同的API获取资源数据
            const response = await fetch(`${this.API_BASE_URL}/resources`);
            if (response.ok) {
                const data = await response.json();
                // 返回所有数据
                return data;
            }
            throw new Error('API返回非成功状态');
        } catch (error) {
            console.log('API调用失败，使用模拟数据:', error);
            // 返回所有模拟数据作为热门推荐，包含国漫、日漫、特摄、美漫、短剧、电影等类别
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
    
    // 渲染热门推荐 - 更新以支持与管理后台相同的API数据结构
    renderPopularContent(resources) {
        if (!this.popularContentElement || !resources || resources.length === 0) return;
        
        // 清空容器
        this.popularContentElement.innerHTML = '';
        
        // 创建资源卡片 - 包含所有类别（国漫、日漫、特摄、美漫、短剧、电影）
        resources.forEach(resource => {
            const item = document.createElement('div');
            item.className = 'popular-item';
            
            // 添加状态标签 - 根据资源状态显示不同样式
            const statusClass = resource.status === '可观看' ? 'status-available' : 'status-unavailable';
            
            item.innerHTML = `
                <img src="https://picsum.photos/seed/${resource.resourceID}/400/600" alt="${resource.title}">
                <span class="content-status ${statusClass}">${resource.status || '可观看'}</span>
                <div class="popular-item-info">
                    <div class="popular-item-title">${resource.title}</div>
                    <div class="popular-item-meta">
                        <span>${resource.category || '未知'}</span>
                        <span>未知</span>
                    </div>
                    <div class="popular-item-desc">暂无简介</div>
                    <div class="popular-item-details">
                        <small>导演：${resource.director || '未知'}</small>
                        <small>工作室：${resource.producer || '未知'}</small>
                    </div>
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
    
    // 获取轮播图数据 - 修改为从API资源中随机抽取
    async fetchCarouselData() {
        try {
            // 尝试从与管理后台相同的API获取资源数据
            const response = await fetch(`${this.API_BASE_URL}/resources`);
            if (response.ok) {
                const data = await response.json();
                // 随机排序并固定返回7个轮播项
                return [...data].sort(() => 0.5 - Math.random()).slice(0, 7);
            }
            throw new Error('API返回非成功状态');
        } catch (error) {
            console.log('轮播图API调用失败，使用模拟数据（从热门推荐中随机抽取）:', error);
            // 从热门推荐数据中随机抽取7个作为轮播图内容
            // 首先获取热门推荐数据
            const popularData = await this.fetchPopularContent();
            // 然后从热门推荐中随机选择7个
            return [...popularData].sort(() => 0.5 - Math.random()).slice(0, 7);
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
    
    // 渲染轮播图 - 更新以支持与管理后台相同的API数据结构
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
                <img src="https://picsum.photos/seed/${item.resourceID}/1200/400" alt="${item.title}">
                <div class="carousel-slide-content">
                    <h3 class="carousel-slide-title">${item.title}</h3>
                    <p class="carousel-slide-desc">暂无简介</p>
                    <div class="carousel-slide-meta">
                        <span>类型: ${item.category || '未知'}</span>
                        <span>国家: 未知</span>
                        <span>导演: ${item.director || '未知'}</span>
                        <span>状态: ${item.status || '可观看'}</span>
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
