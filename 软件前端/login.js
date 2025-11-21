document.addEventListener('DOMContentLoaded', function() {
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    const adminFeatures = document.getElementById('adminFeatures');
    const loginForm = document.getElementById('loginForm');
    const soundControl = document.getElementById('soundControl');
    const soundIcon = soundControl.querySelector('.sound-icon');
    const mutedVideo = document.getElementById('mutedVideo');
    const soundVideo = document.getElementById('soundVideo');
    const videoFallback = document.querySelector('.video-fallback');
    const videoLoading = document.getElementById('videoLoading');
    const interactionHint = document.getElementById('interactionHint');
    
    let isMuted = true; // 初始为静音状态
    let videoSwitched = false; // 标记是否已切换到有声音视频
    
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
    soundControl.addEventListener('click', function() {
        if (!videoSwitched) {
            // 如果还没切换到有声音视频，先切换
            switchToSoundVideo();
        }
        
        isMuted = !isMuted;
        soundVideo.muted = isMuted;
        
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
        
        // 根据用户类型调用不同的登录验证
        if (userType === 'admin') {
            verifyAdminLogin(username, password);
        } else {
            verifyUserLogin(username, password);
        }
    });
    
    // 验证管理员登录
    async function verifyAdminLogin(username, password) {
        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 登录成功，跳转到主页面
                alert('登录成功！欢迎管理员：' + username);
                window.location.href = 'index.html';
            } else {
                // 登录失败，显示错误信息
                alert(result.message || '登录失败，请检查用户名和密码');
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            alert('登录请求失败，请检查网络连接或后端服务');
        }
    }
    
    // 验证普通用户登录
    async function verifyUserLogin(username, password) {
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 登录成功，跳转到用户主页面
                alert('登录成功！欢迎用户：' + username);
                window.location.href = 'user.html';
            } else {
                // 登录失败，显示错误信息
                alert(result.message || '登录失败，请检查用户名和密码');
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            alert('登录请求失败，请检查网络连接或后端服务');
        }
    }
    
    // 切换到有声音视频
    function switchToSoundVideo() {
        if (videoSwitched) return;
        
        videoSwitched = true;
        
        // 停止静音视频
        mutedVideo.pause();
        mutedVideo.style.display = 'none';
        
        // 显示有声音视频
        soundVideo.style.display = 'block';
        
        // 尝试播放有声音视频
        const playPromise = soundVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // 视频播放成功
                console.log('有声音视频播放成功');
                videoLoading.style.display = 'none';
                interactionHint.classList.add('hidden');
                
                // 设置初始音量
                soundVideo.volume = 0.5;
                soundVideo.muted = isMuted;
            }).catch(function(error) {
                // 播放被阻止
                console.log('有声音视频播放被阻止:', error);
                showFallbackBackground();
            });
        }
    }
    
    // 视频加载和播放处理
    function initVideo() {
        // 显示加载指示器
        videoLoading.style.display = 'block';
        
        // 设置静音视频属性
        mutedVideo.volume = 0;
        mutedVideo.muted = true;
        mutedVideo.preload = "auto";
        
        // 设置有声音视频属性
        soundVideo.volume = 0.5;
        soundVideo.muted = true; // 初始为静音
        soundVideo.preload = "auto";
        
        // 静音视频加载成功事件
        mutedVideo.addEventListener('loadeddata', function() {
            console.log('静音视频数据已加载');
            videoLoading.style.display = 'none';
            videoFallback.style.display = 'none';
        });
        
        // 有声音视频加载成功事件
        soundVideo.addEventListener('loadeddata', function() {
            console.log('有声音视频数据已加载');
        });
        
        // 视频错误处理
        mutedVideo.addEventListener('error', function(e) {
            console.error('静音视频加载错误:', e);
            videoLoading.style.display = 'none';
            showFallbackBackground();
        });
        
        soundVideo.addEventListener('error', function(e) {
            console.error('有声音视频加载错误:', e);
        });
        
        // 视频播放结束重新开始
        mutedVideo.addEventListener('ended', function() {
            mutedVideo.currentTime = 0;
            mutedVideo.play().catch(e => {
                console.log('静音视频循环播放失败:', e);
            });
        });
        
        soundVideo.addEventListener('ended', function() {
            soundVideo.currentTime = 0;
            soundVideo.play().catch(e => {
                console.log('有声音视频循环播放失败:', e);
            });
        });
        
        // 尝试播放静音视频
        playMutedVideo();
    }
    
    function playMutedVideo() {
        const playPromise = mutedVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // 静音视频播放成功
                console.log('静音视频自动播放成功');
                videoLoading.style.display = 'none';
            }).catch(function(error) {
                // 自动播放被阻止
                console.log('静音视频自动播放被阻止:', error);
                videoLoading.style.display = 'none';
                showFallbackBackground();
            });
        }
    }
    
    function showFallbackBackground() {
        console.log('启用备用背景');
        mutedVideo.style.display = 'none';
        soundVideo.style.display = 'none';
        videoFallback.style.display = 'block';
        interactionHint.classList.add('hidden');
    }
    
    // 页面加载完成后初始化视频
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideo);
    } else {
        initVideo();
    }
    
    // 添加用户交互事件监听 - 切换到有声音视频
    document.addEventListener('click', function() {
        switchToSoundVideo();
    });
    
    document.addEventListener('keypress', function() {
        switchToSoundVideo();
    });
    
    // 确保视频在页面可见时播放
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            if (videoSwitched && soundVideo.paused) {
                soundVideo.play().catch(function(e) {
                    console.log('页面恢复后有声音视频播放失败:', e);
                });
            } else if (!videoSwitched && mutedVideo.paused) {
                mutedVideo.play().catch(function(e) {
                    console.log('页面恢复后静音视频播放失败:', e);
                });
            }
        }
    });
    
    // 5秒后自动隐藏提示
    setTimeout(() => {
        interactionHint.classList.add('hidden');
    }, 5000);
    
    // 添加输入框回车提交支持
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});