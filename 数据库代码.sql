-- 创建数据库
CREATE DATABASE IF NOT EXISTS BookCollectionDB 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE BookCollectionDB;

-- 管理员表
CREATE TABLE admin_users (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 普通用户表
CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 图书表
CREATE TABLE books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(20) NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Publisher VARCHAR(100),
    Category VARCHAR(50),
    Status ENUM('在架', '借出') DEFAULT '在架',
    CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 借阅记录表
CREATE TABLE borrow_records (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    BookID INT NOT NULL,
    BorrowerName VARCHAR(50) NOT NULL,
    BorrowDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Notes VARCHAR(200),
    FOREIGN KEY (BookID) REFERENCES books(BookID) ON DELETE CASCADE
);

-- 插入测试数据
INSERT INTO books (ISBN, Title, Author, Publisher, Category, Status) VALUES
('9787115546081', '软件工程', '张三', '清华大学出版社', '计算机', '在架'),
('9787121361972', 'Java编程思想', '李四', '电子工业出版社', '计算机', '借出'),
('9787544291170', '百年孤独', '加西亚·马尔克斯', '南海出版公司', '文学', '在架');

INSERT INTO borrow_records (BookID, BorrowerName, BorrowDate, ReturnDate, Notes) VALUES
(2, '王五', '2024-01-15', NULL, '课程参考书');

-- 插入管理员账号 (密码为123456)
INSERT INTO admin_users (Username, Password) VALUES
('admin', '123456');

-- 插入普通用户账号 (密码为123456)
INSERT INTO users (Username, Password, Email, Phone) VALUES
('admin', '123456', 'admin@example.com', '13800138000');