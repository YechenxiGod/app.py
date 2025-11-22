// 全局变量
let currentEditingResourceId = null;
let currentBorrowResourceId = null;

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadResources();
    loadStats();
});

// 加载资源列表
async function loadResources() {
    showLoading();
    try {
          const response = await fetch(`${API_BASE_URL}/resources`);
          const resources = await response.json();
          displayResources(resources);
    } catch (error) {
        console.error('加载资源列表失败:', error);
        showEmptyState();
    }
}

// 显示资源列表
function displayResources(resources) {
    const tableBody = document.getElementById('resourcesTableBody');
    const resourcesTable = document.getElementById('resourcesTable');
    const emptyState = document.getElementById('emptyState');
    const loadingMessage = document.getElementById('loadingMessage');
    
    loadingMessage.style.display = 'none';
    
    if (resources.length === 0) {
        resourcesTable.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    resourcesTable.style.display = 'table';
    
    tableBody.innerHTML = '';
    
    resources.forEach(resource => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.code}</td>
            <td>${resource.title}</td>
            <td>${resource.director}</td>
            <td>${resource.producer || '-'}</td>
            <td>${resource.category || '-'}</td>
            <td>
                <span class="status ${resource.status === '可观看' ? 'available' : 'borrowed'}">
                    ${resource.status}
                </span>
            </td>
            <td>
                <button onclick="editResource(${resource.resourceID})" class="btn-primary">编辑</button>
                <button onclick="showBorrowModal(${resource.resourceID}, '${resource.status}', '${resource.title}')" 
                        class="${resource.status === '可观看' ? 'btn-success' : 'btn-secondary'}">
                    ${resource.status === '可观看' ? '借出' : '归还'}
                </button>
                <button onclick="deleteResource(${resource.resourceID})" class="btn-danger">删除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
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

// 显示添加表单
function showAddForm() {
    currentEditingResourceId = null;
    document.getElementById('modalTitle').textContent = '添加资源';
    document.getElementById('codeInput').value = '';
    document.getElementById('titleInput').value = '';
    document.getElementById('directorInput').value = '';
    document.getElementById('producerInput').value = '';
    document.getElementById('categoryInput').value = '';
    document.getElementById('statusSelect').value = '可观看';
    document.getElementById('resourceModal').style.display = 'flex';
}

// 编辑资源
async function editResource(resourceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`);
        const resource = await response.json();
        
        currentEditingResourceId = resourceId;
        document.getElementById('modalTitle').textContent = '编辑资源';
        document.getElementById('codeInput').value = resource.code;
        document.getElementById('titleInput').value = resource.title;
        document.getElementById('directorInput').value = resource.director;
        document.getElementById('producerInput').value = resource.producer || '';
        document.getElementById('categoryInput').value = resource.category || '';
        document.getElementById('statusSelect').value = resource.status;
        document.getElementById('resourceModal').style.display = 'flex';
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

// 显示借阅/归还模态框
function showBorrowModal(resourceId, status, title) {
    currentBorrowResourceId = resourceId;
    const isBorrowing = status === '可观看';
    
    document.getElementById('borrowModalTitle').textContent = isBorrowing ? '借出资源' : '归还资源';
    document.getElementById('borrowBookTitle').textContent = title;
    document.getElementById('borrowerNameInput').value = '';
    document.getElementById('borrowNotesInput').value = '';
    document.getElementById('borrowSubmitBtn').textContent = isBorrowing ? '确认借出' : '确认归还';
    
    if (!isBorrowing) {
        document.getElementById('borrowModalContent').innerHTML = `
            <p>归还资源: <strong>${title}</strong></p>
            <div class="form-actions">
                <button onclick="processBorrowReturn(event)" class="btn-primary">确认归还</button>
                <button onclick="hideBorrowModal()" class="btn-secondary">取消</button>
            </div>
        `;
    }
    
    document.getElementById('borrowModal').style.display = 'flex';
}

// 处理借阅/归还
async function processBorrowReturn(event) {
    if (event) event.preventDefault();
    
    try {
        const isBorrowing = document.getElementById('borrowModalTitle').textContent === '借出图书';
        
        if (isBorrowing) {
            // 借出资源
            const borrowerName = document.getElementById('borrowerNameInput').value.trim();
            const notes = document.getElementById('borrowNotesInput').value;
            
            if (!borrowerName) {
                alert('请输入借阅人姓名');
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/resources/borrow/${currentBorrowResourceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    borrowerName: borrowerName,
                    notes: notes
                })
            });
            
            if (response.ok) {
                hideBorrowModal();
                loadResources();
                loadStats();
                alert('资源借出成功');
            } else {
                alert('借出失败');
            }
        } else {
            // 归还资源
            const activeRecordsResponse = await fetch(`${API_BASE_URL}/borrow-records/active`);
            const activeRecords = await activeRecordsResponse.json();
            const record = activeRecords.find(r => r.resourceID === currentBorrowResourceId);
            
            if (record) {
                const returnResponse = await fetch(`${API_BASE_URL}/borrow-records/${record.recordID}/return`, {
                    method: 'PUT'
                });
                
                if (returnResponse.ok) {
                    hideBorrowModal();
                    loadResources();
                    loadStats();
                    alert('资源归还成功');
                } else {
                    alert('归还失败');
                }
            } else {
                alert('未找到该资源的借阅记录');
            }
        }
    } catch (error) {
        console.error('操作失败:', error);
        alert('操作失败');
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

function hideBorrowModal() {
    document.getElementById('borrowModal').style.display = 'none';
}

// 添加回车键搜索支持
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchResources();
    }
});