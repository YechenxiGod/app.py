import pymysql

# 直接使用数据库连接信息
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '123456',
    'database': 'BookCollectionDB'
}

# 连接数据库
conn = pymysql.connect(**DB_CONFIG)
cursor = conn.cursor()

# 查看borrow_records表结构
print('Table structure for borrow_records:')
cursor.execute('DESCRIBE borrow_records')
for row in cursor.fetchall():
    print(row)

# 查看borrow_records表中的数据
print('\nData in borrow_records table:')
cursor.execute('SELECT * FROM borrow_records')
for row in cursor.fetchall():
    print(row)

# 关闭连接
cursor.close()
conn.close()