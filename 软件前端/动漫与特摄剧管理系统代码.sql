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
    Country VARCHAR(50),
    Description TEXT,
    Status ENUM('可观看', '已借出') DEFAULT '可观看',
    CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 观看记录表（暂时未用上）
CREATE TABLE borrow_records (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    ResourceID INT NOT NULL,
    BorrowerName VARCHAR(50) NOT NULL,
    BorrowDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Notes VARCHAR(200),
    FOREIGN KEY (ResourceID) REFERENCES resources(ResourceID) ON DELETE CASCADE
);

-- 插入测试数据 - 国漫
INSERT INTO resources (Code, Name, Director, Studio, Category, Country, Description, Status) VALUES
-- 国漫
('CM-001', '斗罗大陆', '沈乐平', '玄机科技', '玄幻', '中国', '改编自唐家三少的同名小说，讲述唐三在斗罗大陆上的成长故事。', '可观看'),
('CM-002', '一人之下', '李豪凌', '绘梦动画', '奇幻', '中国', '普通青年张楚岚意外卷入异人世界的冒险故事。', '可观看'),
('CM-003', '凡人修仙传', '王裕仁', '万维猫动画', '修仙', '中国', '平凡少年韩立通过努力一步步成为修仙界传奇的故事。', '可观看'),
('CM-004', '完美世界', '王裕仁', '福煦影视', '玄幻', '中国', '石昊在完美世界中成长、战斗的热血故事。', '可观看'),
('CM-005', '灵笼', '董相博', '艺画开天', '科幻', '中国', '末日后人类在灯塔上艰难求生的故事。', '可观看'),

-- 日漫
('JM-001', '鬼灭之刃', '外崎春雄', 'ufotable', '热血', '日本', '炭治郎为了让变成鬼的妹妹变回人类，加入鬼杀队的故事。', '可观看'),
('JM-002', '进击的巨人', '荒木哲郎', 'WIT STUDIO', '热血', '日本', '人类为了生存与巨人战斗的黑暗奇幻故事。', '可观看'),
('JM-003', '名侦探柯南', '儿玉兼嗣', 'TMS Entertainment', '推理', '日本', '高中生侦探工藤新一被灌下毒药后变成小学生江户川柯南，继续破案的故事。', '可观看'),
('JM-004', '海贼王', '尾田荣一郎', '东映动画', '冒险', '日本', '路飞为了成为海贼王而踏上伟大航路的冒险故事。', '可观看'),
('JM-005', '火影忍者', '伊达勇登', 'Studio Pierrot', '热血', '日本', '漩涡鸣人成长为火影的励志故事。', '可观看'),

-- 特摄
('TS-001', '假面骑士01', '杉原辉昭', '东映', '特摄', '日本', '人工智能时代的假面骑士故事。', '可观看'),
('TS-002', '泽塔奥特曼', '田口清隆', '圆谷制作', '特摄', '日本', '新生代奥特曼泽塔保卫地球的故事。', '可观看'),
('TS-003', '铠甲勇士', '郑国伟', '奥飞娱乐', '特摄', '中国', '中国特摄英雄铠甲勇士与邪恶势力战斗的故事。', '可观看'),

-- 美漫
('AM-001', '复仇者联盟', '乔斯·韦登', '漫威影业', '超级英雄', '美国', '漫威超级英雄团队复仇者联盟联合对抗威胁的故事。', '可观看'),
('AM-002', '正义联盟', '扎克·施奈德', 'DC影业', '超级英雄', '美国', 'DC超级英雄团队正义联盟保护世界的故事。', '可观看'),
('AM-003', '蜘蛛侠', '山姆·雷米', '漫威影业', '超级英雄', '美国', '彼得·帕克获得超能力后成为蜘蛛侠的故事。', '可观看'),

-- 短剧
('DR-001', '琉璃', '尹涛', '欢瑞世纪', '仙侠', '中国', '褚璇玑与禹司凤跨越十生十世的爱情故事。', '可观看'),
('DR-002', '山河令', '成志超', '慈文传媒', '武侠', '中国', '周子舒与温客行相识相知的江湖故事。', '可观看'),

-- 电影
('MV-001', '千与千寻', '宫崎骏', '吉卜力工作室', '动画电影', '日本', '少女千寻在神灵世界的奇幻冒险。', '可观看'),
('MV-002', '你的名字。', '新海诚', 'CoMix Wave Films', '动画电影', '日本', '男女主角互换身体并寻找彼此的故事。', '可观看'),
('MV-003', '哪吒之魔童降世', '饺子', '彩条屋影业', '动画电影', '中国', '改编自中国传统神话，讲述哪吒的成长故事。', '可观看')



-- 插入管理员账号 (密码为123456)
INSERT INTO admin_users (Username, Password) VALUES
('admin', '123456');

-- 插入普通用户账号 (密码为123456)
INSERT INTO users (Username, Password, Email, Phone) VALUES
('admin', '123456', 'admin@example.com', '13800138000');