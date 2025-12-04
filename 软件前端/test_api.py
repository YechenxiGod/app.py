import requests

# 测试获取所有资源的API
try:
    response = requests.get('http://localhost:5000/api/resources')
    print(f'API响应状态码: {response.status_code}')
    print(f'API响应内容: {response.text}')
    
    if response.status_code == 200:
        data = response.json()
        print(f'资源总数: {len(data)}')
        for i, resource in enumerate(data[:5]):  # 只显示前5个资源
            print(f'资源{i+1}: {resource}')
            print('---')
except Exception as e:
    print(f'请求失败: {e}')
