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

-- 动漫与特摄剧资源表
CREATE TABLE resources (
    ResourceID INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(20) NOT NULL,
    Name VARCHAR(200) NOT NULL,
    Director VARCHAR(100) NOT NULL,
    Studio VARCHAR(100),
    Category VARCHAR(50),
    Status ENUM('可观看', '已借出') DEFAULT '可观看',
    CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 借用记录表
CREATE TABLE borrow_records (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    ResourceID INT NOT NULL,
    BorrowerName VARCHAR(50) NOT NULL,
    BorrowDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Notes VARCHAR(200),
    FOREIGN KEY (ResourceID) REFERENCES resources(ResourceID) ON DELETE CASCADE
);

-- 插入测试数据
INSERT INTO resources (Code, Name, Director, Studio, Category, Status) VALUES
('KR-001', '假面骑士01', '杉原辉昭', '东映', '特摄', '可观看'),
('KR-002', '假面骑士Build', '田崎龙太', '东映', '特摄', '已借出'),
('AN-001', '死神Bleach', '阿部记之', 'Studio Pierrot', '动漫', '可观看'),
('AN-002', '名侦探柯南', '儿玉兼嗣', 'TMS Entertainment', '动漫', '可观看'),
('AN-003', '进击的巨人', '荒木哲郎', 'WIT STUDIO', '动漫', '可观看'),
('KR-003', '假面骑士W', '田崎龙太', '东映', '特摄', '可观看'),
('AN-004', '鬼灭之刃', '外崎春雄', 'ufotable', '动漫', '已借出'),
('KR-004', '假面骑士时王', '田崎龙太', '东映', '特摄', '可观看');

INSERT INTO borrow_records (ResourceID, BorrowerName, BorrowDate, ReturnDate, Notes) VALUES
(2, '动漫爱好者', '2024-01-15', NULL, '观看学习'),
(7, '特摄迷', '2024-01-20', NULL, '收藏观看');

-- 插入管理员账号 (密码为123456)
INSERT INTO admin_users (Username, Password) VALUES
('admin', '123456');

-- 插入普通用户账号 (密码为123456)
INSERT INTO users (Username, Password, Email, Phone) VALUES
('admin', '123456', 'admin@example.com', '13800138000');