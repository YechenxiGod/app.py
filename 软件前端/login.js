document.addEventListener('DOMContentLoaded', function() {
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    const adminFeatures = document.getElementById('adminFeatures');
    const loginForm = document.getElementById('loginForm');
    const soundControl = document.getElementById('soundControl');
    const soundIcon = soundControl.querySelector('.sound-icon');
    const video = document.getElementById('bgVideo');
    const videoFallback = document.querySelector('.video-fallback');
    const videoLoading = document.getElementById('videoLoading');
    
    // 用户类型切换
    userTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.type === 'admin') {
                adminFeatures.style.display = 'block';
            } else {
                adminFeatures.style.display = 'none';
            }
        });
    });
    
    // 声音控制
    let isMuted = false;
    
    soundControl.addEventListener('click', function() {
        isMuted = !isMuted;
        video.muted = isMuted;
        
        if (isMuted) {
            soundIcon.textContent = '🔇';
        } else {
            soundIcon.textContent = '🔊';
        }
    });
    
    // 表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('.user-type-btn.active').dataset.type;
        
        // 简单的表单验证
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        // 这里添加实际的登录验证逻辑
        console.log(`用户类型: ${userType}, 用户名: ${username}, 密码: ${password}`);
        
        // 模拟登录成功
        alert(`登录成功！欢迎${userType === 'admin' ? '管理员' : '普通用户'}：${username}`);
        
        // 根据用户类型跳转到不同页面
        // 实际应用中这里应该跳转到主页面
        if (userType === 'admin') {
            // 管理员跳转到管理页面
            // window.location.href = 'admin.html';
            alert('将跳转到管理员页面');
        } else {
            // 普通用户跳转到用户页面
            // window.location.href = 'index.html';
            alert('将跳转到普通用户页面');
        }
    });
    
    // 添加输入框回车提交支持
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // 视频加载和播放处理
    function initVideo() {
        if (!video) {
            showFallbackBackground();
            return;
        }
        
        // 显示加载指示器
        videoLoading.style.display = 'block';
        
        // 设置视频属性
        video.volume = 0.3;
        video.muted = false;
        video.preload = "auto";
        
        // 视频加载成功事件
        video.addEventListener('loadeddata', function() {
            console.log('视频数据已加载');
            videoLoading.style.display = 'none';
            videoFallback.style.display = 'none';
        });
        
        // 视频错误处理
        video.addEventListener('error', function(e) {
            console.error('视频加载错误:', e);
            videoLoading.style.display = 'none';
            showFallbackBackground();
        });
        
        // 视频无法播放处理
        video.addEventListener('canplaythrough', function() {
            console.log('视频可以流畅播放');
            videoLoading.style.display = 'none';
        });
        
        // 视频播放结束重新开始
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play().catch(e => {
                console.log('循环播放失败:', e);
            });
        });
        
        // 尝试播放视频
        playVideoWithFallback();
    }
    
    function playVideoWithFallback() {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // 视频播放成功
                console.log('视频自动播放成功');
                videoLoading.style.display = 'none';
            }).catch(function(error) {
                // 自动播放被阻止
                console.log('自动播放被阻止:', error);
                videoLoading.style.display = 'none';
                showFallbackBackground();
                
                // 添加用户交互后重新尝试播放
                const resumeVideo = function() {
                    video.play().then(function() {
                        console.log('通过用户交互恢复视频播放');
                        videoFallback.style.display = 'none';
                        video.style.display = 'block';
                    }).catch(function(e) {
                        console.error('恢复播放失败:', e);
                    });
                    document.removeEventListener('click', resumeVideo);
                    document.removeEventListener('keypress', resumeVideo);
                };
                
                document.addEventListener('click', resumeVideo, { once: true });
                document.addEventListener('keypress', resumeVideo, { once: true });
            });
        }
    }
    
    function showFallbackBackground() {
        console.log('启用备用背景');
        video.style.display = 'none';
        videoFallback.style.display = 'block';
    }
    
    // 页面加载完成后初始化视频
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideo);
    } else {
        initVideo();
    }
    
    // 确保视频在页面可见时播放
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && video.paused && video.readyState >= 3) {
            video.play().catch(function(e) {
                console.log('页面恢复后播放失败:', e);
            });
        }
    });
});