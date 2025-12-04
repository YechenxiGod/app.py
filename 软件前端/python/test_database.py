import pymysql

# 连接数据库
try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='123456',
        db='BookCollectionDB',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    with conn.cursor() as cursor:
        # 查询资源数据
        sql = "SELECT * FROM resources"
        cursor.execute(sql)
        resources = cursor.fetchall()
        
        print(f"数据库中共有 {len(resources)} 条资源数据")
        for resource in resources:
            print(f"ID: {resource['ResourceID']}, 名称: {resource['Name']}, 状态: {resource['Status']}")
            
        # 查询数据库结构
        sql = "DESCRIBE resources"
        cursor.execute(sql)
        structure = cursor.fetchall()
        print("\nresources表结构:")
        for field in structure:
            print(f"{field['Field']}: {field['Type']}")
            
finally:
    if 'conn' in locals():
        conn.close()