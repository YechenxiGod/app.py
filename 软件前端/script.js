// 全局变量
let currentEditingBookId = null;
let currentBorrowBookId = null;

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadStats();
});

// 加载图书列表
async function loadBooks() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('加载图书列表失败:', error);
        showEmptyState();
    }
}

// 显示图书列表
function displayBooks(books) {
    const tableBody = document.getElementById('booksTableBody');
    const booksTable = document.getElementById('booksTable');
    const emptyState = document.getElementById('emptyState');
    const loadingMessage = document.getElementById('loadingMessage');
    
    loadingMessage.style.display = 'none';
    
    if (books.length === 0) {
        booksTable.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    booksTable.style.display = 'table';
    
    tableBody.innerHTML = '';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.isbn}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher || '-'}</td>
            <td>${book.category || '-'}</td>
            <td>
                <span class="status ${book.status === '在架' ? 'available' : 'borrowed'}">
                    ${book.status}
                </span>
            </td>
            <td>
                <button onclick="editBook(${book.bookID})" class="btn-primary">编辑</button>
                <button onclick="showBorrowModal(${book.bookID}, '${book.status}', '${book.title}')" 
                        class="${book.status === '在架' ? 'btn-success' : 'btn-secondary'}">
                    ${book.status === '在架' ? '借出' : '归还'}
                </button>
                <button onclick="deleteBook(${book.bookID})" class="btn-danger">删除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 加载统计信息
async function loadStats() {
    try {
        const [summaryResponse, categoryResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/books/stats/summary`),
            fetch(`${API_BASE_URL}/books/stats/category`)
        ]);
        
        const summary = await summaryResponse.json();
        const categoryStats = await categoryResponse.json();
        
        document.getElementById('totalBooks').textContent = summary.totalBooks;
        document.getElementById('availableBooks').textContent = summary.availableBooks;
        document.getElementById('borrowedBooks').textContent = summary.borrowedBooks;
        
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

// 搜索图书
async function searchBooks() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (!keyword) {
        loadBooks();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/books/search?keyword=${encodeURIComponent(keyword)}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('搜索图书失败:', error);
    }
}

// 重置搜索
function resetSearch() {
    document.getElementById('searchInput').value = '';
    loadBooks();
}

// 显示添加表单
function showAddForm() {
    currentEditingBookId = null;
    document.getElementById('modalTitle').textContent = '添加图书';
    document.getElementById('isbnInput').value = '';
    document.getElementById('titleInput').value = '';
    document.getElementById('authorInput').value = '';
    document.getElementById('publisherInput').value = '';
    document.getElementById('categoryInput').value = '';
    document.getElementById('statusSelect').value = '在架';
    document.getElementById('bookModal').style.display = 'flex';
}

// 编辑图书
async function editBook(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const book = await response.json();
        
        currentEditingBookId = bookId;
        document.getElementById('modalTitle').textContent = '编辑图书';
        document.getElementById('isbnInput').value = book.isbn;
        document.getElementById('titleInput').value = book.title;
        document.getElementById('authorInput').value = book.author;
        document.getElementById('publisherInput').value = book.publisher || '';
        document.getElementById('categoryInput').value = book.category || '';
        document.getElementById('statusSelect').value = book.status;
        document.getElementById('bookModal').style.display = 'flex';
    } catch (error) {
        console.error('加载图书信息失败:', error);
        alert('加载图书信息失败');
    }
}

// 保存图书
async function saveBook(event) {
    event.preventDefault();
    
    const bookData = {
        isbn: document.getElementById('isbnInput').value,
        title: document.getElementById('titleInput').value,
        author: document.getElementById('authorInput').value,
        publisher: document.getElementById('publisherInput').value,
        category: document.getElementById('categoryInput').value,
        status: document.getElementById('statusSelect').value
    };
    
    if (!bookData.isbn || !bookData.title || !bookData.author) {
        alert('ISBN、书名和作者是必填字段');
        return;
    }
    
    try {
        const url = currentEditingBookId 
            ? `${API_BASE_URL}/books/${currentEditingBookId}`
            : `${API_BASE_URL}/books`;
        
        const method = currentEditingBookId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            hideBookModal();
            loadBooks();
            loadStats();
            alert(currentEditingBookId ? '图书更新成功' : '图书添加成功');
        } else {
            alert('操作失败');
        }
    } catch (error) {
        console.error('保存图书失败:', error);
        alert('操作失败');
    }
}

// 删除图书
async function deleteBook(bookId) {
    if (!confirm('确定要删除这本图书吗？此操作不可恢复。')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadBooks();
            loadStats();
            alert('图书删除成功');
        } else {
            alert('删除失败');
        }
    } catch (error) {
        console.error('删除图书失败:', error);
        alert('删除失败');
    }
}

// 显示借阅/归还模态框
function showBorrowModal(bookId, status, title) {
    currentBorrowBookId = bookId;
    const isBorrowing = status === '在架';
    
    document.getElementById('borrowModalTitle').textContent = isBorrowing ? '借出图书' : '归还图书';
    document.getElementById('borrowBookTitle').textContent = title;
    document.getElementById('borrowerNameInput').value = '';
    document.getElementById('borrowNotesInput').value = '';
    document.getElementById('borrowSubmitBtn').textContent = isBorrowing ? '确认借出' : '确认归还';
    
    if (!isBorrowing) {
        document.getElementById('borrowModalContent').innerHTML = `
            <p>归还图书: <strong>${title}</strong></p>
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
        const bookStatus = document.getElementById('borrowModalTitle').textContent === '借出图书' ? '在架' : '借出';
        
        if (bookStatus === '在架') {
            // 借出图书
            const borrowerName = document.getElementById('borrowerNameInput').value.trim();
            const notes = document.getElementById('borrowNotesInput').value;
            
            if (!borrowerName) {
                alert('请输入借阅人姓名');
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/books/${currentBorrowBookId}/borrow`, {
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
                loadBooks();
                loadStats();
                alert('图书借出成功');
            } else {
                alert('借出失败');
            }
        } else {
            // 归还图书
            const activeRecordsResponse = await fetch(`${API_BASE_URL}/borrow-records/active`);
            const activeRecords = await activeRecordsResponse.json();
            const record = activeRecords.find(r => r.bookID === currentBorrowBookId);
            
            if (record) {
                const returnResponse = await fetch(`${API_BASE_URL}/borrow-records/${record.recordID}/return`, {
                    method: 'PUT'
                });
                
                if (returnResponse.ok) {
                    hideBorrowModal();
                    loadBooks();
                    loadStats();
                    alert('图书归还成功');
                } else {
                    alert('归还失败');
                }
            } else {
                alert('未找到该图书的借阅记录');
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
    document.getElementById('booksTable').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

function showEmptyState() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('booksTable').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
}

function hideBookModal() {
    document.getElementById('bookModal').style.display = 'none';
}

function hideBorrowModal() {
    document.getElementById('borrowModal').style.display = 'none';
}

// 添加回车键搜索支持
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchBooks();
    }
});