// 动漫与特摄剧管理系统 - 视频背景管理器
class VideoBackgroundManager {
    constructor() {
        this.videoSwitched = false; // 标记是否已切换到有声音视频
        // 初始化视频切换机制
        this.initializeVideoSwitch();
    }

    // 初始化视频切换机制
    initializeVideoSwitch() {
        // 获取视频元素
        this.mutedVideo = document.getElementById('mutedVideo');
        this.soundVideo = document.getElementById('soundVideo');
        this.videoFallback = document.querySelector('.video-fallback');
        this.videoLoading = document.getElementById('videoLoading');
        this.interactionHint = document.getElementById('interactionHint');
        
        if (!this.mutedVideo || !this.soundVideo) {
            console.error('找不到视频元素');
            this.applyFallbackBackground();
            return;
        }
        
        // 显示加载指示器
        if (this.videoLoading) this.videoLoading.style.display = 'block';
        
        // 设置静音视频属性
        this.mutedVideo.volume = 0;
        this.mutedVideo.muted = true;
        this.mutedVideo.preload = "auto";
        
        // 设置有声音视频属性
        this.soundVideo.volume = 0.5;
        this.soundVideo.muted = true; // 初始为静音，交互后自动取消静音
        this.soundVideo.preload = "auto";
        
        // 静音视频加载成功事件
        this.mutedVideo.addEventListener('loadeddata', () => {
            console.log('静音视频数据已加载');
            if (this.videoFallback) this.videoFallback.style.display = 'none';
            if (this.videoLoading) this.videoLoading.style.display = 'none';
        });
        
        // 有声音视频加载成功事件
        this.soundVideo.addEventListener('loadeddata', () => {
            console.log('有声音视频数据已加载');
        });
        
        // 视频错误处理
        this.mutedVideo.addEventListener('error', (e) => {
            console.error('静音视频加载错误:', e);
            this.applyFallbackBackground();
        });
        
        this.soundVideo.addEventListener('error', (e) => {
            console.error('有声音视频加载错误:', e);
        });
        
        // 视频播放结束重新开始
        this.mutedVideo.addEventListener('ended', () => {
            this.mutedVideo.currentTime = 0;
            this.mutedVideo.play().catch(e => {
                console.log('静音视频循环播放失败:', e);
            });
        });
        
        this.soundVideo.addEventListener('ended', () => {
            this.soundVideo.currentTime = 0;
            this.soundVideo.play().catch(e => {
                console.log('有声音视频循环播放失败:', e);
            });
        });
        
        // 设置交互监听器
        this.setupInteraction();
        
        // 响应式调整
        window.addEventListener('resize', () => this.optimizeVideoForScreen());
        
        // 初始优化
        this.optimizeVideoForScreen();
        
        // 5秒后自动隐藏提示
        if (this.interactionHint) {
            setTimeout(() => {
                this.interactionHint.style.display = 'none';
            }, 5000);
        }
        
        // 确保视频在页面可见时播放
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                if (this.videoSwitched && this.soundVideo.paused) {
                    this.soundVideo.play().catch(e => {
                        console.log('页面恢复后有声音视频播放失败:', e);
                    });
                } else if (!this.videoSwitched && this.mutedVideo.paused) {
                    this.mutedVideo.play().catch(e => {
                        console.log('页面恢复后静音视频播放失败:', e);
                    });
                }
            }
        });
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
        if (!this.videoSwitched) {
            this.switchToSoundVideo();
        }
    }
    
    // 切换到有声音视频
    switchToSoundVideo() {
        this.videoSwitched = true;
        
        // 停止静音视频
        this.mutedVideo.pause();
        this.mutedVideo.style.display = 'none';
        
        // 显示有声音视频
        this.soundVideo.style.display = 'block';
        
        // 尝试播放有声音视频
        const playPromise = this.soundVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 视频播放成功
                console.log('有声音视频播放成功');
                if (this.videoLoading) this.videoLoading.style.display = 'none';
                if (this.interactionHint) this.interactionHint.style.display = 'none';
                
                // 设置初始音量并确保有声音
                this.soundVideo.volume = 0.5;
                this.soundVideo.muted = false;
            }).catch((error) => {
                // 视频播放被阻止
                console.log('有声音视频播放被阻止:', error);
                if (this.videoLoading) this.videoLoading.style.display = 'none';
                this.applyFallbackBackground();
            });
        }
    }
    
    // 根据屏幕尺寸优化视频显示
    optimizeVideoForScreen() {
        const isMobile = window.innerWidth <= 768;
        
        // 优化静音视频
        if (this.mutedVideo) {
            if (isMobile) {
                this.mutedVideo.style.width = '120%';
                this.mutedVideo.style.height = '120%';
            } else {
                this.mutedVideo.style.width = '100%';
                this.mutedVideo.style.height = '100%';
            }
        }
        
        // 优化有声音视频
        if (this.soundVideo) {
            if (isMobile) {
                this.soundVideo.style.width = '120%';
                this.soundVideo.style.height = '120%';
            } else {
                this.soundVideo.style.width = '100%';
                this.soundVideo.style.height = '100%';
            }
        }
    }
    
    // 应用后备背景
    applyFallbackBackground() {
        console.log('应用后备背景');
        
        // 隐藏视频
        if (this.mutedVideo) this.mutedVideo.style.display = 'none';
        if (this.soundVideo) this.soundVideo.style.display = 'none';
        
        // 添加渐变背景
        const container = document.querySelector('.background-container');
        if (container) {
            container.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        }
        
        // 显示备用背景
        if (this.videoFallback) {
            this.videoFallback.style.display = 'block';
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
        this.setupSidebarNavigation();
    }
    
    // 设置侧边栏导航
    setupSidebarNavigation() {
        const navItems = document.querySelectorAll('.sidebar .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const category = item.textContent.trim();
                this.filterPopularContent(category);
                
                // 为当前点击的导航项添加激活状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    
    // 筛选热门推荐内容
    async filterPopularContent(category) {
        if (!this.popularContentElement) return;
        
        try {
            // 获取所有资源数据
            const allResources = await this.fetchPopularContent();
            let filteredResources = allResources;
            
            // 根据分类筛选
            switch (category) {
                case '日漫':
                    filteredResources = allResources.filter(resource => resource.country === '日本');
                    break;
                case '国漫':
                    filteredResources = allResources.filter(resource => resource.country === '中国');
                    break;
                case '美漫':
                    filteredResources = allResources.filter(resource => resource.country === '美国');
                    break;
                case '电影':
                    filteredResources = allResources.filter(resource => resource.category === '动画电影');
                    break;
                case '首页':
                default:
                    filteredResources = allResources;
                    break;
            }
            
            // 渲染筛选后的内容
            this.renderPopularContent(filteredResources);
        } catch (error) {
            console.error('筛选热门推荐失败:', error);
        }
    }
    
    // 获取热门推荐数据 - 更新为使用与管理后台相同的API
    async fetchPopularContent() {
        try {
            // 尝试从与管理后台相同的API获取资源数据
            const response = await fetch(`${this.API_BASE_URL}/resources`);
            if (response.ok) {
                const data = await response.json();
                console.log('使用API数据:', data);
                // 返回所有数据，并转换字段名
                const result = data.map(resource => ({
                    resourceID: resource.ResourceID || resource.resourceID,
                    code: resource.Code || resource.code,
                    title: resource.Name || resource.title,
                    director: resource.Director || resource.director,
                    producer: resource.Studio || resource.producer,
                    category: resource.Category || resource.category,
                    country: resource.Country || resource.country,
                    description: resource.Description || resource.description,
                    status: resource.Status || resource.status,
                    imageUrl: resource.ImageURL || resource.imageUrl
                }));
                console.log('转换后的API数据:', result);
                
                // 检查本地存储中是否有"一人之下"资源的图片URL
                const yirenzhixiaImageUrl = localStorage.getItem('yirenzhixiaImageUrl');
                if (yirenzhixiaImageUrl) {
                    // 更新"一人之下"资源的图片URL
                    const yirenzhixiaIndex = result.findIndex(item => item.title === '一人之下' || item.title === '一人之夏');
                    if (yirenzhixiaIndex !== -1) {
                        result[yirenzhixiaIndex].imageUrl = yirenzhixiaImageUrl;
                    }
                }
                
                return result;
            }
            throw new Error('API返回非成功状态');
        } catch (error) {
            console.log('API调用失败，使用模拟数据:', error);
            // 返回模拟数据，并转换为与API相同的字段名格式
            const result = this.mockResources.map(resource => ({
                resourceID: resource.ResourceID,
                code: resource.Code,
                title: resource.Name,
                director: resource.Director,
                producer: resource.Studio,
                category: resource.Category,
                country: resource.Country,
                description: resource.Description,
                status: resource.Status,
                imageUrl: resource.ImageURL
            }));
            console.log('使用模拟数据:', result);
            
            // 检查本地存储中是否有"一人之下"资源的图片URL
            const yirenzhixiaImageUrl = localStorage.getItem('yirenzhixiaImageUrl');
            if (yirenzhixiaImageUrl) {
                // 更新"一人之下"资源的图片URL
                const yirenzhixiaIndex = result.findIndex(item => item.title === '一人之下' || item.title === '一人之夏');
                if (yirenzhixiaIndex !== -1) {
                    result[yirenzhixiaIndex].imageUrl = yirenzhixiaImageUrl;
                }
            }
            
            return result;
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
                <img src="${resource.imageUrl || 'https://picsum.photos/seed/default/400/600'}" alt="${resource.title}">
                <span class="content-status ${statusClass}">${resource.status || '可观看'}</span>
                <div class="popular-item-info">
                    <div class="popular-item-title">${resource.title}</div>
                    <div class="popular-item-meta">
                        <span>${resource.category || '未知'}</span>
                        <span>${resource.country || '未知'}</span>
                    </div>
                    <div class="popular-item-desc">${resource.description || '暂无简介'}</div>
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
                // 随机排序并固定返回7个轮播项，同时转换字段名
                return [...data]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 7)
                    .map(resource => ({
                        resourceID: resource.ResourceID || resource.resourceID,
                        code: resource.Code || resource.code,
                        title: resource.Name || resource.title,
                        director: resource.Director || resource.director,
                        producer: resource.Studio || resource.producer,
                        category: resource.Category || resource.category,
                        country: resource.Country || resource.country,
                        description: resource.Description || resource.description,
                        status: resource.Status || resource.status,
                        imageUrl: resource.ImageURL || resource.imageUrl
                    }));
            }
            throw new Error('API返回非成功状态');
        } catch (error) {
            console.log('轮播图API调用失败，使用模拟数据:', error);
            // 从模拟数据中随机选择7个，并转换为与API相同的字段名格式
            const carouselData = [...this.mockResources]
                .sort(() => 0.5 - Math.random())
                .slice(0, 7)
                .map(resource => ({
                    resourceID: resource.ResourceID,
                    code: resource.Code,
                    title: resource.Name,
                    director: resource.Director,
                    producer: resource.Studio,
                    category: resource.Category,
                    country: resource.Country,
                    description: resource.Description,
                    status: resource.Status,
                    imageUrl: resource.ImageURL
                }));
            return carouselData;
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
                <img src="${item.imageUrl || 'https://picsum.photos/seed/default/1200/400'}" alt="${item.title}">
                <div class="carousel-slide-content">
                    <h3 class="carousel-slide-title">${item.title}</h3>
                    <p class="carousel-slide-desc">${item.description || '暂无简介'}</p>
                    <div class="carousel-slide-meta">
                        <span>类型: ${item.category || '未知'}</span>
                        <span>国家: ${item.country || '未知'}</span>
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
    
    // 为首页导航项添加默认激活状态
    const homeNavItem = document.querySelector('.sidebar .nav-item:first-child');
    if (homeNavItem) {
        homeNavItem.classList.add('active');
    }
    
    // 获取并显示当前用户名字
    const userNameElement = document.getElementById('currentUserName');
    if (userNameElement) {
        // 从localStorage获取用户信息
        let userInfo = localStorage.getItem('currentUser');
        let user = null;
        
        // 尝试解析localStorage中的用户信息
        if (userInfo) {
            try {
                user = JSON.parse(userInfo);
            } catch (error) {
                console.error('解析localStorage用户信息失败:', error);
                user = null;
            }
        }
        
        // 如果localStorage中没有用户信息，尝试从sessionStorage获取
        if (!user) {
            userInfo = sessionStorage.getItem('currentUser');
            if (userInfo) {
                try {
                    user = JSON.parse(userInfo);
                } catch (error) {
                    console.error('解析sessionStorage用户信息失败:', error);
                    user = null;
                }
            }
        }
        
        // 显示用户名
        if (user) {
            if (user.username) {
                if (user.isAdmin) {
                    // 管理员用户显示"管理员+登录账号"
                    userNameElement.textContent = `管理员${user.username}`;
                } else {
                    // 普通用户显示用户名
                    userNameElement.textContent = user.username;
                }
            } else if (user.name) {
                userNameElement.textContent = user.name;
            } else if (user.userName) {
                userNameElement.textContent = user.userName;
            } else {
                // 如果有isAdmin字段但没有用户名，根据类型显示默认值
                userNameElement.textContent = user.isAdmin ? '管理员' : '用户';
            }
        } else {
            // 未登录状态显示默认值
            userNameElement.textContent = '请登录';
        }
    }
    
    console.log('动漫与特摄剧管理系统内容管理器初始化完成');
});