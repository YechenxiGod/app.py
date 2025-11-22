import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # 使用 MySQL 连接 - 动漫与特摄剧管理系统数据库
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL',
        'mysql+pymysql://root:123456@localhost/BookCollectionDB')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')