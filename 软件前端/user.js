// 卡片点击功能 - 从1.txt中提取的交互模式
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
            showNotification(`正在进入${cardTitle}...`);
            
            // 这里可以添加跳转逻辑
            switch(cardId) {
                case 'home':
                    console.log('首页功能');
                    break;
                case 'categories':
                    console.log('分类功能');
                    break;
                case 'forum':
                    console.log('论坛功能');
                    break;
                case 'profile':
                    console.log('个人中心功能');
                    break;
            }
        }, 200);
    });
})

// 退出登录功能
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

// 背景管理器 - 支持视频背景和卡片背景图片的组合方案
class BackgroundManager {
    constructor() {
        // 初始化视频背景
        this.initializeVideoBackground();
        
        // 初始化卡片背景图片
        this.initializeCardBackgrounds();
    }

    // 初始化视频背景（带声音）
    initializeVideoBackground() {
        const videoElement = document.getElementById('bgVideo');
        if (!videoElement) return;

        // 设置视频属性
        videoElement.muted = false; // 启用声音
        videoElement.loop = true;
        videoElement.autoplay = true;
        videoElement.playsInline = true;

        // 尝试恢复视频播放（如果浏览器暂停了自动播放）
        videoElement.play().then(() => {
            console.log('背景视频播放成功，声音已启用');
        }).catch(error => {
            console.log('背景视频自动播放受限，尝试用户交互后播放:', error);
            // 添加用户交互后自动播放的事件监听器
            this.setupUserInteractionPlay(videoElement);
        });

        // 视频加载失败处理
        videoElement.addEventListener('error', () => {
            console.log('背景视频加载失败，将使用备用样式');
            this.applyFallbackVideoBackground();
        });

        // 响应式调整
        window.addEventListener('resize', () => {
            this.optimizeVideoForScreen(videoElement);
        });

        // 初始优化
        this.optimizeVideoForScreen(videoElement);
    }

    // 初始化卡片背景图片
    initializeCardBackgrounds() {
        // 为四个卡片分别设置背景图片
        const cardBackgrounds = [
            { id: 'home-bg', image: '【哲风壁纸】动漫-灰原.png' },         // 首页卡片背景
            { id: 'categories-bg', image: '【哲风壁纸】名侦探柯南-灰原哀.png' }, // 分类卡片背景
            { id: 'forum-bg', image: '【哲风壁纸】可爱-名侦探柯南.png' },         // 论坛卡片背景
            { id: 'profile-bg', image: '【哲风壁纸】二次元-名侦探柯南.png' }      // 我的卡片背景
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

    // 设置用户交互后播放视频
    setupUserInteractionPlay(videoElement) {
        const playVideo = () => {
            videoElement.play().then(() => {
                console.log('通过用户交互恢复视频播放');
                // 移除事件监听器
                document.removeEventListener('click', playVideo);
                document.removeEventListener('keydown', playVideo);
            }).catch(error => {
                console.log('恢复视频播放失败:', error);
            });
        };

        // 添加事件监听器
        document.addEventListener('click', playVideo);
        document.addEventListener('keydown', playVideo);
    }

    // 根据屏幕尺寸优化视频
    optimizeVideoForScreen(videoElement) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动设备上优化性能
            videoElement.style.width = '120%'; // 覆盖整个屏幕
            videoElement.style.height = '120%';
        } else {
            // 桌面设备优化视觉效果
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
        }
    }

    // 应用视频后备背景样式
    applyFallbackVideoBackground() {
        const container = document.querySelector('.background-container');
        if (container) {
            container.style.background = 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))';
        }
    }
}

// 导出BackgroundManager类，以便在其他页面使用
window.BackgroundManager = BackgroundManager;

// 在当前页面初始化背景管理器
const backgroundManager = new BackgroundManager();

/**
 * 使用说明：如何使用视频背景和卡片背景图片效果
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

// 页面加载时显示用户信息
document.addEventListener('DOMContentLoaded', function() {
    // 这里可以添加从后端获取用户信息的代码
    console.log('用户页面加载完成');
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 示例：添加一些交互功能
    addInteractiveFeatures();
});

// 添加交互功能 - 从1.txt中提取的现代交互设计理念
function addInteractiveFeatures() {
    // 为卡片添加触摸反馈效果
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        // 添加鼠标悬停时的阴影过渡效果（从1.txt中提取的高级阴影效果）
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 16px 48px 16px rgba(90, 120, 232, 0.14), 0 12px 32px rgba(90, 120, 232, 0.19), 0 8px 16px -8px rgba(90, 120, 232, 0.29)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
        
        // 添加键盘焦点样式（从1.txt中提取的无障碍设计）
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

// 显示通知 - 从1.txt中提取的高级UI设计
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // 使用从1.txt提取的现代通知样式
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

// 添加键盘快捷键 - 从1.txt中提取的高级交互设计
document.addEventListener('keydown', function(e) {
    // 数字键1-4直接激活对应的卡片功能
    const cards = ['home', 'categories', 'forum', 'profile'];
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
            showNotification('返回首页');
        }
    }
});