"""数据存储模块"""
import os
import json
from datetime import datetime

class NewsStorage:
    def __init__(self, data_dir=None):
        if data_dir is None:
            data_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'news')
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)
    
    def save_news(self, date_str, news_data):
        """保存新闻到文件"""
        filepath = os.path.join(self.data_dir, f'{date_str}.json')
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(news_data, f, ensure_ascii=False, indent=2)
        return filepath
    
    def load_news(self, date_str):
        """加载指定日期的新闻"""
        filepath = os.path.join(self.data_dir, f'{date_str}.json')
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        return None
    
    def list_dates(self):
        """列出所有有数据的日期"""
        dates = []
        if os.path.exists(self.data_dir):
            for f in os.listdir(self.data_dir):
                if f.endswith('.json'):
                    dates.append(f.replace('.json', ''))
        return sorted(dates, reverse=True)

if __name__ == '__main__':
    storage = NewsStorage()
    dates = storage.list_dates()
    print(f"已有数据的日期: {dates}")
