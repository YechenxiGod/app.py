import pymysql

# 连接数据库
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='123456',
    database='BookCollectionDB',
    charset='utf8mb4'
)

# 创建游标
cursor = conn.cursor()

# 查询资源表中的所有数据
print("\n=== 查询所有资源数据 ===")
cursor.execute("SELECT * FROM resources")
resources = cursor.fetchall()
print(f"共找到 {len(resources)} 条资源数据")
for resource in resources:
    print(f"ID: {resource[0]}, Code: {resource[1]}, Name: {resource[2]}, Status: {resource[9]}")

# 关闭游标和连接
cursor.close()
conn.close()