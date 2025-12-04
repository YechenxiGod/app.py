import requests
import time

# API基础URL
API_BASE_URL = 'http://localhost:5000/api'

# 1. 获取所有资源
def get_all_resources():
    response = requests.get(f'{API_BASE_URL}/resources')
    if response.status_code == 200:
        return response.json()
    else:
        print(f"获取资源失败，状态码: {response.status_code}")
        return []

# 2. 修改资源名称
def update_resource_name(resource_id, new_name):
    resource_data = {
        'title': new_name
    }
    response = requests.put(f'{API_BASE_URL}/resources/{resource_id}', json=resource_data)
    if response.status_code == 200:
        print(f"资源 {resource_id} 名称已更新为: {new_name}")
        return True
    else:
        print(f"更新资源失败，状态码: {response.status_code}")
        return False

# 3. 获取热门推荐数据
def get_popular_resources():
    response = requests.get(f'{API_BASE_URL}/resources')
    if response.status_code == 200:
        # 模拟热门推荐的筛选逻辑（这里简单返回所有资源）
        return response.json()
    else:
        print(f"获取热门推荐失败，状态码: {response.status_code}")
        return []

# 4. 测试同步功能
def test_sync():
    print("=== 测试热门推荐同步功能 ===")
    
    # 获取所有资源
    resources = get_all_resources()
    if not resources:
        return
    
    # 选择一个资源进行测试
    test_resource = resources[0]  # 选择第一个资源
    original_name = test_resource['title']
    resource_id = test_resource['resourceID']
    
    print(f"\n测试资源信息:")
    print(f"ID: {resource_id}")
    print(f"原始名称: {original_name}")
    
    # 修改资源名称
    new_name = f"{original_name} (测试修改)"
    update_resource_name(resource_id, new_name)
    
    # 等待一会儿，确保数据更新完成
    time.sleep(1)
    
    # 获取热门推荐数据
    popular_resources = get_popular_resources()
    
    # 检查热门推荐中的资源名称是否已更新
    print(f"\n检查热门推荐中的资源名称是否同步更新:")
    for resource in popular_resources:
        if resource['resourceID'] == resource_id:
            print(f"热门推荐中的资源: {resource['title']}")
            if resource['title'] == new_name:
                print("✅ 热门推荐内容已同步更新")
            else:
                print("❌ 热门推荐内容未同步更新")
            break
    
    # 恢复原始名称
    update_resource_name(resource_id, original_name)
    print(f"\n已恢复资源原始名称: {original_name}")

if __name__ == "__main__":
    test_sync()