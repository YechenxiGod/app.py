import mysql.connector

# 数据库连接参数
config = {
    'user': 'root',
    'password': '123456',
    'host': 'localhost',
    'database': 'BookCollectionDB',
    'charset': 'utf8mb4'
}

try:
    # 连接数据库
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    print("数据库连接成功")
    
    # 导入资源数据 - SQL文件中的所有资源
    resources_data = [
        # 国漫
        ('CM-001', '斗罗大陆', '沈乐平', '玄机科技', '玄幻', '中国', '改编自唐家三少的同名小说，讲述唐三在斗罗大陆上的成长故事。', '可观看'),
        ('CM-002', '一人之下', '李豪凌', '绘梦动画', '奇幻', '中国', '普通青年张楚岚意外卷入异人世界的冒险故事。', '可观看'),
        ('CM-003', '凡人修仙传', '王裕仁', '万维猫动画', '修仙', '中国', '平凡少年韩立通过努力一步步成为修仙界传奇的故事。', '可观看'),
        ('CM-004', '完美世界', '王裕仁', '福煦影视', '玄幻', '中国', '石昊在完美世界中成长、战斗的热血故事。', '可观看'),
        ('CM-005', '灵笼', '董相博', '艺画开天', '科幻', '中国', '末日后人类在灯塔上艰难求生的故事。', '可观看'),
        
        # 日漫
        ('JM-001', '鬼灭之刃', '外崎春雄', 'ufotable', '热血', '日本', '炭治郎为了让变成鬼的妹妹变回人类，加入鬼杀队的故事。', '已借出'),
        ('JM-002', '进击的巨人', '荒木哲郎', 'WIT STUDIO', '热血', '日本', '人类为了生存与巨人战斗的黑暗奇幻故事。', '可观看'),
        ('JM-003', '名侦探柯南', '儿玉兼嗣', 'TMS Entertainment', '推理', '日本', '高中生侦探工藤新一被灌下毒药后变成小学生江户川柯南，继续破案的故事。', '可观看'),
        ('JM-004', '海贼王', '尾田荣一郎', '东映动画', '冒险', '日本', '路飞为了成为海贼王而踏上伟大航路的冒险故事。', '可观看'),
        ('JM-005', '火影忍者', '伊达勇登', 'Studio Pierrot', '热血', '日本', '漩涡鸣人成长为火影的励志故事。', '可观看'),
        
        # 特摄
        ('TS-001', '假面骑士01', '杉原辉昭', '东映', '特摄', '日本', '人工智能时代的假面骑士故事。', '可观看'),
        ('TS-002', '泽塔奥特曼', '田口清隆', '圆谷制作', '特摄', '日本', '新生代奥特曼泽塔保卫地球的故事。', '可观看'),
        ('TS-003', '铠甲勇士', '郑国伟', '奥飞娱乐', '特摄', '中国', '中国特摄英雄铠甲勇士与邪恶势力战斗的故事。', '可观看'),
        
        # 美漫
        ('AM-001', '复仇者联盟', '乔斯·韦登', '漫威影业', '超级英雄', '美国', '漫威超级英雄团队复仇者联盟联合对抗威胁的故事。', '可观看'),
        ('AM-002', '正义联盟', '扎克·施奈德', 'DC影业', '超级英雄', '美国', 'DC超级英雄团队正义联盟保护世界的故事。', '可观看'),
        ('AM-003', '蜘蛛侠', '山姆·雷米', '漫威影业', '超级英雄', '美国', '彼得·帕克获得超能力后成为蜘蛛侠的故事。', '可观看'),
        
        # 短剧
        ('DR-001', '琉璃', '尹涛', '欢瑞世纪', '仙侠', '中国', '褚璇玑与禹司凤跨越十生十世的爱情故事。', '可观看'),
        ('DR-002', '山河令', '成志超', '慈文传媒', '武侠', '中国', '周子舒与温客行相识相知的江湖故事。', '可观看'),
        
        # 电影
        ('MV-001', '千与千寻', '宫崎骏', '吉卜力工作室', '动画电影', '日本', '少女千寻在神灵世界的奇幻冒险。', '可观看'),
        ('MV-002', '你的名字。', '新海诚', 'CoMix Wave Films', '动画电影', '日本', '男女主角互换身体并寻找彼此的故事。', '可观看'),
        ('MV-003', '哪吒之魔童降世', '饺子', '彩条屋影业', '动画电影', '中国', '改编自中国传统神话，讲述哪吒的成长故事。', '可观看')
    ]
    
    # 先禁用外键检查
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    
    # 清空表数据
    cursor.execute("DELETE FROM borrow_records")
    print("已清空borrow_records表中的现有数据")
    
    cursor.execute("DELETE FROM resources")
    print("已清空resources表中的现有数据")
    
    # 重新启用外键检查
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    
    # 插入所有资源数据
    insert_query = """
        INSERT INTO resources (Code, Name, Director, Studio, Category, Country, Description, Status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(insert_query, resources_data)
    conn.commit()
    
    print(f"成功插入 {cursor.rowcount} 个资源数据")
    
    # 插入借用记录
    borrow_records = [
        (6, '动漫爱好者', '2024-01-15', None, '观看学习'),  # 借用鬼灭之刃
        (12, '特摄迷', '2024-01-20', None, '收藏观看'),   # 借用泽塔奥特曼
        (20, '电影爱好者', '2024-01-25', None, '研究动画技术')  # 借用千与千寻
    ]
    
    # 先清空借用记录表
    cursor.execute("TRUNCATE TABLE borrow_records")
    
    # 插入借用记录
    insert_borrow_query = """
        INSERT INTO borrow_records (ResourceID, BorrowerName, BorrowDate, ReturnDate, Notes)
        VALUES (%s, %s, %s, %s, %s)
    """
    
    cursor.executemany(insert_borrow_query, borrow_records)
    conn.commit()
    
    print(f"成功插入 {cursor.rowcount} 个借用记录")
    
    # 验证插入的数据数量
    cursor.execute("SELECT COUNT(*) FROM resources")
    count = cursor.fetchone()[0]
    print(f"resources表中现在有 {count} 个资源")
    
    # 验证分类数据
    cursor.execute("SELECT DISTINCT Category FROM resources")
    categories = [cat[0] for cat in cursor.fetchall()]
    print(f"所有分类: {categories}")
    
    # 验证每个分类的数量
    for category in categories:
        cursor.execute("SELECT COUNT(*) FROM resources WHERE Category = %s", (category,))
        count = cursor.fetchone()[0]
        print(f"{category}: {count} 个资源")
        
except mysql.connector.Error as e:
    print(f"数据库操作错误: {e}")
    conn.rollback()
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
        print("数据库连接已关闭")
