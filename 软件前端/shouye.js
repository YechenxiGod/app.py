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
