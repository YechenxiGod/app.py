import requests
import json

# 测试前端API调用
url = "http://localhost:5000/api/resources"
try:
    response = requests.get(url)
    response.raise_for_status()  # 检查请求是否成功
    data = response.json()
    
    print(f"API返回的资源数量: {len(data)}")
    
    # 模拟前端的资源分类和统计逻辑
    categories = {}
    total = 0
    
    for resource in data:
        # 统计每个分类的资源数量
        category = resource['category']
        if category not in categories:
            categories[category] = 0
        categories[category] += 1
        total += 1
    
    print(f"\n统计结果：")
    print(f"总资源数: {total}")
    print(f"分类数量: {len(categories)}")
    print(f"各分类资源数：")
    for cat, count in categories.items():
        print(f"  {cat}: {count}个")
    
    # 测试搜索功能
    search_term = "斗罗"
    filtered = [r for r in data if search_term in r['title'] or search_term in r['description']]
    print(f"\n搜索 '{search_term}' 的结果数量: {len(filtered)}")
    for r in filtered:
        print(f"  - {r['title']}")
        
    print("\n前端逻辑测试通过！数据可以正确获取和处理。")
    
except requests.exceptions.RequestException as e:
    print(f"API请求失败: {e}")
except Exception as e:
    print(f"处理数据时出错: {e}")
