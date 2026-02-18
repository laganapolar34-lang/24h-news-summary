from flask import Flask, jsonify, request
import os
import json
from datetime import datetime, timedelta
from scraper import NewsScraper
from gold_price import GoldPriceFetcher
from storage import NewsStorage

app = Flask(__name__, static_folder='../frontend', static_url_path='')

scraper = NewsScraper()
gold_fetcher = GoldPriceFetcher()
storage = NewsStorage()

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'news')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/news', methods=['GET'])
def get_news():
    date_str = request.args.get('date')
    if not date_str:
        date_str = datetime.now().strftime('%Y-%m-%d')
    
    news_data = storage.load_news(date_str)
    
    if not news_data:
        # 尝试抓取新闻
        news_data = scraper.fetch_news()
        if news_data:
            storage.save_news(date_str, news_data)
    
    return jsonify(news_data)

@app.route('/api/gold', methods=['GET'])
def get_gold_price():
    gold_data = gold_fetcher.get_price()
    return jsonify(gold_data)

@app.route('/api/dates', methods=['GET'])
def get_dates():
    dates = []
    if os.path.exists(DATA_DIR):
        for f in os.listdir(DATA_DIR):
            if f.endswith('.json'):
                dates.append(f.replace('.json', ''))
    dates.sort(reverse=True)
    return jsonify(dates)

@app.route('/api/refresh', methods=['POST'])
def refresh_news():
    """手动刷新新闻"""
    date_str = datetime.now().strftime('%Y-%m-%d')
    news_data = scraper.fetch_news()
    if news_data:
        storage.save_news(date_str, news_data)
        return jsonify({'success': True, 'count': len(news_data.get('articles', []))})
    return jsonify({'success': False})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
