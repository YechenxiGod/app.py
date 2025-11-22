// 动漫与特摄剧管理系统 - 卡片点击功能
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
        const cardId = this.id;
        const cardTitle = this.querySelector('h3').textContent;
        
        // 添加点击动画效果
        this.style.transform = 'translateY(-20px) scale(1.02)';
        this.style.transition = 'all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)';
        
        setTimeout(() => {
            this.style.transform = '';
            this.style.transition = '';
            
            // 显示通知
            showNotification(`正在进入${cardTitle}功能...`);
            
            // 这里可以添加跳转逻辑
            switch(cardId) {
                case 'home':
                    console.log('动漫与特摄剧首页功能');
                    break;
                case 'categories':
                    console.log('动漫与特摄剧分类浏览功能');
                    break;
                case 'forum':
                    console.log('动漫与特摄剧讨论社区功能');
                    break;
                case 'profile':
                    console.log('个人收藏与观看历史功能');
                    break;
            }
        }, 200);
    });
})

// 动漫与特摄剧管理系统 - 退出登录功能
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 添加退出动画
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
}

// 背景视频将自动播放且无需控制按钮

// 动漫与特摄剧管理系统 - 背景管理器
class BackgroundManager {
    constructor() {
        // 初始化背景切换机制
        this.initializeBackgroundSwitch();
        
        // 初始化动漫与特摄剧相关卡片背景图片
        this.initializeCardBackgrounds();
    }

    // 初始化背景切换机制
    initializeBackgroundSwitch() {
        // 获取背景元素
        this.bgImage = document.getElementById('bgImage');
        this.bgVideo = document.getElementById('bgVideo');
        
        if (!this.bgImage || !this.bgVideo) return;
        
        // 设置视频属性
        this.bgVideo.muted = false; // 启用声音
        this.bgVideo.loop = true;
        this.bgVideo.playsInline = true;
        
        // 添加视频加载失败处理
        this.bgVideo.addEventListener('error', () => {
            this.handleVideoError();
        });
        
        // 添加用户交互监听器来切换背景
        this.setupInteractionSwitch();
        
        // 响应式调整
        window.addEventListener('resize', () => {
            this.optimizeBackgroundForScreen();
        });
        
        // 初始优化
        this.optimizeBackgroundForScreen();
    }
    
    // 设置交互切换背景
    setupInteractionSwitch() {
        const handleInteraction = () => {
            // 如果还没有切换到视频背景
            if (this.bgVideo.style.display === 'none') {
                this.switchToVideoBackground();
                // 移除事件监听器，防止重复切换
                document.removeEventListener('click', handleInteraction);
            }
        };
        
        // 只添加鼠标点击触发
        document.addEventListener('click', handleInteraction);
    }
    
    // 切换到视频背景
    switchToVideoBackground() {
        console.log('切换到视频背景');
        
        // 淡出图片背景
        this.bgImage.style.opacity = '0';
        
        // 显示并播放视频
        this.bgVideo.style.display = 'block';
        this.bgVideo.play().then(() => {
            console.log('视频背景播放成功');
            // 完全隐藏图片背景
            setTimeout(() => {
                this.bgImage.style.display = 'none';
            }, 800);
        }).catch(error => {
            console.log('视频播放失败:', error);
            // 恢复图片背景
            this.bgImage.style.opacity = '1';
        });
    }
    
    // 根据屏幕尺寸优化背景
    optimizeBackgroundForScreen() {
        const isMobile = window.innerWidth <= 768;
        
        // 优化图片背景
        if (this.bgImage) {
            if (isMobile) {
                this.bgImage.style.transform = 'scale(1.1)';
            } else {
                this.bgImage.style.transform = 'scale(1)';
            }
        }
        
        // 优化视频背景
        if (this.bgVideo) {
            if (isMobile) {
                this.bgVideo.style.width = '120%';
                this.bgVideo.style.height = '120%';
            } else {
                this.bgVideo.style.width = '100%';
                this.bgVideo.style.height = '100%';
            }
        }
    }

    // 初始化卡片背景图片
    initializeCardBackgrounds() {
        // 为四个卡片分别设置动漫与特摄剧相关背景图片
        const cardBackgrounds = [
            { id: 'home-bg', image: '【哲风壁纸】动漫-灰原.png' },         // 动漫首页卡片背景
            { id: 'categories-bg', image: '【哲风壁纸】名侦探柯南-灰原哀.png' }, // 分类浏览卡片背景
            { id: 'forum-bg', image: '【哲风壁纸】可爱-名侦探柯南.png' },         // 动漫讨论社区卡片背景
            { id: 'profile-bg', image: '【哲风壁纸】二次元-名侦探柯南.png' }      // 个人收藏卡片背景
        ];

        // 设置每个卡片的背景图片
        cardBackgrounds.forEach(card => {
            const element = document.getElementById(card.id);
            if (element) {
                this.setCardBackground(element, card.image);
            }
        });
    }

    // 设置卡片背景图片
    setCardBackground(element, imageSrc) {
        // 设置背景图片
        element.style.backgroundImage = `url('${imageSrc}')`;
        console.log(`为卡片 ${element.id} 设置背景图片: ${imageSrc}`);

        // 创建图片对象来预加载和检查图片
        const img = new Image();
        img.src = imageSrc;

        // 图片加载成功
        img.onload = () => {
            console.log(`卡片背景图片 ${imageSrc} 加载成功`);
            element.classList.add('loaded');
        };

        // 图片加载失败
        img.onerror = () => {
            console.log(`卡片背景图片 ${imageSrc} 加载失败，使用备用背景`);
            element.style.backgroundColor = 'rgba(90, 120, 232, 0.2)';
            element.style.backgroundImage = 'none';
        };
    }

    // 视频加载失败处理
    handleVideoError() {
        console.log('视频加载失败，继续使用图片背景');
        if (this.bgVideo) {
            this.bgVideo.style.display = 'none';
        }
        if (this.bgImage) {
            this.bgImage.style.display = 'block';
            this.bgImage.style.opacity = '1';
        }
    }

    // 应用后备背景样式
    applyFallbackBackground() {
        const container = document.querySelector('.background-container');
        if (container) {
            container.style.background = 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))';
        }
    }
}

// 导出BackgroundManager类，供动漫与特摄剧管理系统其他页面使用
window.BackgroundManager = BackgroundManager;

// 在当前页面初始化背景管理器
const backgroundManager = new BackgroundManager();

/**
 * 动漫与特摄剧管理系统 - 使用说明：如何使用视频背景和卡片背景图片效果
 * 
 * 1. 视频背景设置：
 *    - 在页面中添加以下HTML结构：
 *    <div class="background-container">
 *        <video class="background-video" id="bgVideo" autoplay muted loop playsinline>
 *            <source src="Super爱豆的笑容都没你的甜 _ _ 热爱105℃的灰原哀.mp4" type="video/mp4">
 *        </video>
 *        <div class="background-overlay"></div>
 *    </div>
 * 
 * 2. 卡片背景图片设置：
 *    - 为每个卡片添加背景容器：
 *    <div class="feature-card" id="card-id">
 *        <div class="card-background" id="card-id-bg"></div>
 *        <div class="card-content">
 *            <!-- 卡片内容 -->
 *        </div>
 *    </div>
 * 
 * 3. 在页面中引入user.js文件：
 *    <script src="user.js"></script>
 * 
 * 4. 确保以下文件存在于您的项目目录中：
 *    - 背景视频: Super爱豆的笑容都没你的甜 _ _ 热爱105℃的灰原哀.mp4
 *    - 首页卡片背景: 【哲风壁纸】动漫-灰原.png
 *    - 分类卡片背景: 【哲风壁纸】名侦探柯南-灰原哀.png
 *    - 论坛卡片背景: 【哲风壁纸】可爱-名侦探柯南.png
 *    - 我的卡片背景: 【哲风壁纸】二次元-名侦探柯南.png
 * 
 * 5. 背景管理器会自动初始化视频背景（带声音）和卡片背景图片
 * 
 * 6. 确保在CSS中包含相关样式（已在user.css中定义）
 */

// 动漫与特摄剧管理系统 - 页面加载时初始化用户界面
document.addEventListener('DOMContentLoaded', function() {
    // 这里可以添加从后端获取用户信息和动漫与特摄剧资源的代码
    console.log('动漫与特摄剧管理系统用户界面加载完成');
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 示例：添加一些交互功能
    addInteractiveFeatures();
});

// 动漫与特摄剧管理系统 - 添加交互功能
function addInteractiveFeatures() {
    // 为卡片添加触摸反馈效果
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        // 添加鼠标悬停时的阴影过渡效果
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 16px 48px 16px rgba(90, 120, 232, 0.14), 0 12px 32px rgba(90, 120, 232, 0.19), 0 8px 16px -8px rgba(90, 120, 232, 0.29)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
        
        // 添加键盘焦点样式
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-color)';
            this.style.outlineOffset = '4px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// 动漫与特摄剧管理系统 - 显示通知功能
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // 使用现代通知样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--el-color-primary-light-5), var(--el-color-primary));
        color: white;
        padding: 15px 20px;
        border-radius: var(--el-border-radius-round);
        box-shadow: var(--el-box-shadow-dark);
        z-index: var(--el-index-popper);
        transform: translateX(100%);
        transition: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);
        max-width: 300px;
        font-size: var(--el-font-size-base);
        font-weight: var(--el-font-weight-primary);
    `;
    
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0) translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    notification.appendChild(closeBtn);
    
    // 自动关闭
    setTimeout(() => {
        notification.style.transform = 'translateX(100%) translateY(-10px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 动漫与特摄剧管理系统 - 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // 数字键1-4直接激活对应的卡片功能
    const cards = ['home', 'categories', 'forum', 'profile']; // 动漫与特摄剧管理系统主要功能卡片
    const index = parseInt(e.key) - 1;
    
    if (index >= 0 && index < cards.length) {
        e.preventDefault();
        const card = document.getElementById(cards[index]);
        if (card) {
            // 触发卡片点击事件
            card.click();
            // 设置焦点到卡片
            card.focus();
        }
    }
    
    // ESC键快速返回首页
    if (e.key === 'Escape') {
        e.preventDefault();
        const homeCard = document.getElementById('home');
        if (homeCard) {
            homeCard.focus();
            showNotification('返回动漫与特摄剧首页');
        }
    }
});