import subprocess
import os

def run_git_command(command, cwd=None):
    """运行 Git 命令的通用函数"""
    try:
        result = subprocess.run(
            ['git'] + command,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        return None

# 示例用法
# 克隆仓库
run_git_command(['clone', 'https://github.com/username/repo.git'])

# 查看状态
status = run_git_command(['status'], cwd='./repo')
print(f"Git Status: {status}")

# 添加文件
run_git_command(['add', '.'], cwd='./repo')

# 提交更改
run_git_command(['commit', '-m', 'Initial commit'], cwd='./repo')

# 推送到远程仓库
run_git_command(['push', 'origin', 'main'], cwd='./repo')