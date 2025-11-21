document.addEventListener('DOMContentLoaded', function() {
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    const adminFeatures = document.getElementById('adminFeatures');
    const loginForm = document.getElementById('loginForm');
    
    // 用户类型切换
    userTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.type === 'admin') {
                adminFeatures.style.display = 'block';
                adminFeatures.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                adminFeatures.style.display = 'none';
            }
        });
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
});