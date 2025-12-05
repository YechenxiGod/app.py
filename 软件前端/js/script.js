// 全局变量
let currentEditingResourceId = null;

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadResources();
    loadStats();
    
    // 获取当前用户信息并显示
    const currentUserInfoElement = document.getElementById('currentUserInfo');
    if (currentUserInfoElement) {
        // 尝试从localStorage或sessionStorage获取用户信息
        let userInfo = null;
        try {
            userInfo = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        } catch (error) {
            console.error('解析用户信息失败:', error);
        }
        
        // 显示用户名，如果没有则显示默认值
        if (userInfo && userInfo.username) {
            if (userInfo.isAdmin) {
                // 管理员用户显示"管理员+登录账号"
                currentUserInfoElement.textContent = `管理员${userInfo.username}`;
            } else {
                // 普通用户显示用户名
                currentUserInfoElement.textContent = userInfo.username;
            }
        } else {
            // 未登录状态显示默认值
            currentUserInfoElement.textContent = '请登录';
        }
    }
});

// 加载资源列表
async function loadResources() {
    console.log('进入loadResources函数');
    showLoading();
    
    try {
        console.log('调用API获取资源数据:', `${API_BASE_URL}/resources`);
        const response = await fetch(`${API_BASE_URL}/resources`);
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const resources = await response.json();
        console.log('获取到资源数据:', resources);
        
        displayResources(resources);
        
        // 同时测试统计数据加载
        console.log('开始加载统计数据...');
        loadStats();
        
    } catch (error) {
        console.error('加载资源列表失败:', error);
        showEmptyState();
    }
}

// 显示资源列表
function displayResources(resources) {
    console.log('进入displayResources函数，资源数据:', resources);
    
    const tableBody = document.getElementById('resourcesTableBody');
    const resourcesTable = document.getElementById('resourcesTable');
    const emptyState = document.getElementById('emptyState');
    const loadingMessage = document.getElementById('loadingMessage');
    
    console.log('DOM元素:', {
        tableBody: tableBody,
        resourcesTable: resourcesTable,
        emptyState: emptyState,
        loadingMessage: loadingMessage
    });
    
    loadingMessage.style.display = 'none';
    
    if (resources.length === 0) {
        console.log('没有资源数据，显示空状态');
        resourcesTable.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    console.log(`有 ${resources.length} 条资源数据，显示表格`);
    emptyState.style.display = 'none';
    resourcesTable.style.display = 'table';
    
    tableBody.innerHTML = '';
    
    resources.forEach((resource, index) => {
        console.log(`处理第 ${index + 1} 条资源:`, resource);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.code}</td>
            <td>${resource.title}</td>
            <td>${resource.director}</td>
            <td>${resource.producer || '-'}</td>
            <td>${resource.category || '-'}</td>
            <td>${resource.country || '-'}</td>
            <td>
                <span class="status ${resource.status === '可观看' ? 'available' : 'borrowed'}">
                    ${resource.status}
                </span>
            </td>
            <td>${resource.description || '-'}</td>
            <td>
                <button onclick="editResource(${resource.resourceID})" class="btn-primary">编辑</button>
                <button onclick="deleteResource(${resource.resourceID})" class="btn-danger">删除</button>
            </td>
        `;
        tableBody.appendChild(row);
        console.log(`已添加资源行:`, row);
    });
    
    console.log('资源列表显示完成');
}

// 加载统计信息
async function loadStats() {
    try {
        const [summaryResponse, categoryResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/resources/stats/summary`),
            fetch(`${API_BASE_URL}/resources/stats/category`)
        ]);
        
        const summary = await summaryResponse.json();
        const categoryStats = await categoryResponse.json();
        
        document.getElementById('totalResources').textContent = summary.totalBooks;
        document.getElementById('availableResources').textContent = summary.availableBooks;
        document.getElementById('borrowedResources').textContent = summary.borrowedBooks;
        
        const categoryStatsElement = document.getElementById('categoryStats');
        categoryStatsElement.innerHTML = '';
        
        categoryStats.forEach(stat => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="category-name">${stat.category}</span><span class="category-count">${stat.count}本</span>`;
            categoryStatsElement.appendChild(li);
        });
    } catch (error) {
        console.error('加载统计信息失败:', error);
    }
}

// 搜索资源
async function searchResources() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (!keyword) {
        loadResources();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/resources/search?keyword=${encodeURIComponent(keyword)}`);
        const resources = await response.json();
        displayResources(resources);
    } catch (error) {
        console.error('搜索资源失败:', error);
    }
}

// 重置搜索
function resetSearch() {
    document.getElementById('searchInput').value = '';
    loadResources();
}

// 处理图片文件选择
function handleImageFileChange() {
    const fileInput = document.getElementById('imageFileInput');
    const imagePreview = document.getElementById('imagePreview');
    const imageUrlInput = document.getElementById('imageUrlInput');
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // 显示图片预览
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            
            // 将本地图片转换为DataURL并设置到图片URL输入框
            imageUrlInput.value = e.target.result;
        }
        
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// 显示添加表单
function showAddForm() {
    currentEditingResourceId = null;
    
    // 添加完整的null检查
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = '添加资源';
    
    const codeInput = document.getElementById('codeInput');
    if (codeInput) codeInput.value = '';
    
    const titleInput = document.getElementById('titleInput');
    if (titleInput) titleInput.value = '';
    
    const directorInput = document.getElementById('directorInput');
    if (directorInput) directorInput.value = '';
    
    const producerInput = document.getElementById('producerInput');
    if (producerInput) producerInput.value = '';
    
    const categoryInput = document.getElementById('categoryInput');
    if (categoryInput) categoryInput.value = '';
    
    const countryInput = document.getElementById('countryInput');
    if (countryInput) countryInput.value = '';
    
    const descriptionInput = document.getElementById('descriptionInput');
    if (descriptionInput) descriptionInput.value = '';
    
    const imageUrlInput = document.getElementById('imageUrlInput');
    if (imageUrlInput) imageUrlInput.value = '';
    
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect) statusSelect.value = '可观看';
    
    const imageFileInput = document.getElementById('imageFileInput');
    if (imageFileInput) imageFileInput.value = '';
    
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
    
    const resourceModal = document.getElementById('resourceModal');
    if (resourceModal) resourceModal.style.display = 'flex';
}

// 编辑资源
async function editResource(resourceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`);
        const resource = await response.json();
        
        currentEditingResourceId = resourceId;
        
        // 添加完整的null检查
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = '编辑资源';
        
        const codeInput = document.getElementById('codeInput');
        if (codeInput) codeInput.value = resource.code;
        
        const titleInput = document.getElementById('titleInput');
        if (titleInput) titleInput.value = resource.title;
        
        const directorInput = document.getElementById('directorInput');
        if (directorInput) directorInput.value = resource.director;
        
        const producerInput = document.getElementById('producerInput');
        if (producerInput) producerInput.value = resource.producer || '';
        
        const categoryInput = document.getElementById('categoryInput');
        if (categoryInput) categoryInput.value = resource.category || '';
        
        const countryInput = document.getElementById('countryInput');
        if (countryInput) countryInput.value = resource.country || '';
        
        const descriptionInput = document.getElementById('descriptionInput');
        if (descriptionInput) descriptionInput.value = resource.description || '';
        
        const imageUrlInput = document.getElementById('imageUrlInput');
        if (imageUrlInput) imageUrlInput.value = resource.imageUrl || '';
        
        const statusSelect = document.getElementById('statusSelect');
        if (statusSelect) statusSelect.value = resource.status;
        
        const imageFileInput = document.getElementById('imageFileInput');
        if (imageFileInput) imageFileInput.value = '';
        
        // 显示图片预览
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            if (resource.imageUrl) {
                imagePreview.src = resource.imageUrl;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.src = '';
                imagePreview.style.display = 'none';
            }
        }
        
        const resourceModal = document.getElementById('resourceModal');
        if (resourceModal) resourceModal.style.display = 'flex';
      } catch (error) {
          console.error('加载资源信息失败:', error);
          alert('加载资源信息失败');
    }
}

// 保存资源
async function saveResource(event) {
    event.preventDefault();
    
    const resourceData = {
        code: document.getElementById('codeInput').value,
        title: document.getElementById('titleInput').value,
        director: document.getElementById('directorInput').value,
        producer: document.getElementById('producerInput').value,
        category: document.getElementById('categoryInput').value,
        country: document.getElementById('countryInput').value,
        description: document.getElementById('descriptionInput').value,
        imageUrl: document.getElementById('imageUrlInput').value,
        status: document.getElementById('statusSelect').value
    };
    
    if (!resourceData.code || !resourceData.title || !resourceData.director) {
        alert('编号、标题和导演是必填字段');
        return;
    }
    
    try {
        const url = currentEditingResourceId 
            ? `${API_BASE_URL}/resources/${currentEditingResourceId}`
            : `${API_BASE_URL}/resources`;
        
        const method = currentEditingResourceId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resourceData)
        });
        
        if (response.ok) {
            // 如果是更新"一人之下"资源，同步更新shouye.js文件
            if (resourceData.title === '一人之下' || (currentEditingResourceId && currentEditingResourceId === 2)) {
                updateShouyeImage(resourceData.imageUrl);
            }
            
            hideResourceModal();
            loadResources();
            loadStats();
            alert(currentEditingResourceId ? '资源更新成功' : '资源添加成功');
        } else {
            alert('操作失败');
        }
    } catch (error) {
        console.error('保存资源失败:', error);
        alert('操作失败');
    }
}

// 更新shouye.js文件中的"一人之下"资源图片
async function updateShouyeImage(imageUrl) {
    try {
        // 这里可以实现更新shouye.js文件的逻辑
        // 由于前端JavaScript无法直接修改服务器上的文件
        // 可以考虑通过API将图片URL发送到后端，由后端更新shouye.js文件
        console.log('更新shouye.js中的"一人之下"资源图片:', imageUrl);
        
        // 临时解决方案：通过浏览器本地存储同步图片URL
        localStorage.setItem('yirenzhixiaImageUrl', imageUrl);
        
        alert('"一人之下"资源图片已更新到本地存储，shouye页面将自动使用新图片');
    } catch (error) {
        console.error('更新shouye.js文件失败:', error);
        alert('更新shouye页面图片失败');
    }
}

// 删除资源
async function deleteResource(resourceId) {
    if (!confirm('确定要删除此资源吗？此操作不可恢复。')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadResources();
            loadStats();
            alert('资源删除成功');
        } else {
            alert('删除失败');
        }
    } catch (error) {
        console.error('删除资源失败:', error);
        alert('删除失败');
    }
}



// 辅助函数
function showLoading() {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('resourcesTable').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

function showEmptyState() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('resourcesTable').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
}

function hideResourceModal() {
    document.getElementById('resourceModal').style.display = 'none';
}

// 添加回车键搜索支持
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchResources();
    }
});