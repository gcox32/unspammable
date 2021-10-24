import finnhub, json
from datetime import datetime, date, timedelta

token = 'c5qa9fiad3iaqkuej3vg'
finnhub_client = finnhub.Client(api_key=f"{token}")

# first parameter can be 'general', 'forex', 'crypto'
raw = finnhub_client.general_news('crypto', min_id=0)
news = json.dumps(raw, indent=4)

raw = finnhub_client.stock_social_sentiment('AAPL')

deltas = {
    '24hrs': 1,
    '48hrs': 2,
    'week': 7,
    'month': 30,
}

if __name__ == "__main__":
    token = 'c5qa9fiad3iaqkuej3vg'
    finnhub_client = finnhub.Client(api_key=f"{token}")

    to = date.isoformat(datetime.now())
    date_preference = 'week'
    td = timedelta(days = deltas[date_preference])
    _from = datetime.now() - td
    ticker = 'AAPL'
    
    raw = finnhub_client.company_news(ticker, _from=_from, to=to)
    news = json.dumps(raw, indent=4)
    print(news)

