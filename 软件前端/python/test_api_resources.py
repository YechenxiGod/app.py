import requests

# 测试后端API是否能返回正确的数据
try:
    response = requests.get('http://localhost:5000/api/resources')
    print(f"API响应状态: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"共获取到 {len(data)} 条资源数据")
        
        # 显示前5条数据
        print("\n前5条资源数据:")
        for i, resource in enumerate(data[:5]):
            print(f"{i+1}. {resource['code']} - {resource['title']} ({resource['category']})")
            
        # 统计分类数据
        categories = {}
        for resource in data:
            category = resource['category']
            categories[category] = categories.get(category, 0) + 1
            
        print("\n分类统计:")
        for category, count in categories.items():
            print(f"{category}: {count} 条")
            
    else:
        print(f"API调用失败: {response.text}")
        
except Exception as e:
    print(f"请求错误: {e}")