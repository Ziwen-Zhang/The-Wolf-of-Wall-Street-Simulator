from app.models import db, Stock, Tag, environment, SCHEMA
from sqlalchemy.sql import text


def seed_stocks():
    stocks = [
        {
            "name": "Apple",
            "symbol": "AAPL",
            "description": "A leader in consumer electronics, transforming industries with innovative products like the iPhone and MacBook.",
            "price": 150.0,
            "initial_price": 150.0,
            "total_shares": int(100000000 / 150.0),
            "remaining_shares": int(100000000 / 150.0),
            "tag_id": 1,
        },
        {
            "name": "Tesla",
            "symbol": "TSLA",
            "description": "Pioneering the electric vehicle market with cutting-edge designs and sustainable technology.",
            "price": 700.0,
            "initial_price": 700.0,
            "total_shares": int(50000000 / 700.0),
            "remaining_shares": int(50000000 / 700.0),
            "tag_id": 2,
        },
        {
            "name": "Amazon",
            "symbol": "AMZN",
            "description": "The largest online retailer revolutionizing e-commerce and cloud services.",
            "price": 3300.0,
            "initial_price": 3300.0,
            "total_shares": int(150000000 / 3300.0),
            "remaining_shares": int(150000000 / 3300.0),
            "tag_id": 1,
        },
        {
            "name": "Google",
            "symbol": "GOOGL",
            "description": "A digital era cornerstone specializing in search, advertising, and tech innovation.",
            "price": 2800.0,
            "initial_price": 2800.0,
            "total_shares": int(120000000 / 2800.0),
            "remaining_shares": int(120000000 / 2800.0),
            "tag_id": 1,
        },
        {
            "name": "Microsoft",
            "symbol": "MSFT",
            "description": "A tech giant known for Windows, Office, and Azure cloud services.",
            "price": 320.0,
            "initial_price": 320.0,
            "total_shares": int(110000000 / 320.0),
            "remaining_shares": int(110000000 / 320.0),
            "tag_id": 1,
        },
        {
            "name": "Meta",
            "symbol": "META",
            "description": " A social media leader driving innovation in virtual and augmented reality.",
            "price": 340.0,
            "initial_price": 340.0,
            "total_shares": int(90000000 / 340.0),
            "remaining_shares": int(90000000 / 340.0),
            "tag_id": 1,
        },
        {
            "name": "NVIDIA",
            "symbol": "NVDA",
            "description": "A GPU innovator powering gaming, AI, and high-performance computing.",
            "price": 500.0,
            "initial_price": 500.0,
            "total_shares": int(70000000 / 500.0),
            "remaining_shares": int(70000000 / 500.0),
            "tag_id": 1,
        },
        {
            "name": "Netflix",
            "symbol": "NFLX",
            "description": "A streaming pioneer reshaping global media consumption.",
            "price": 400.0,
            "initial_price": 400.0,
            "total_shares": int(60000000 / 400.0),
            "remaining_shares": int(60000000 / 400.0),
            "tag_id": 3,
        },
        {
            "name": "Disney",
            "symbol": "DIS",
            "description": "A legendary entertainment company producing movies, TV, and theme park experiences.",
            "price": 120.0,
            "initial_price": 120.0,
            "total_shares": int(80000000 / 120.0),
            "remaining_shares": int(80000000 / 120.0),
            "tag_id": 3,
        },
        {
            "name": "Coca-Cola",
            "symbol": "KO",
            "description": "A global beverage leader with an iconic portfolio of sparkling and still drinks.",
            "price": 60.0,
            "initial_price": 60.0,
            "total_shares": int(60000000 / 60.0),
            "remaining_shares": int(60000000 / 60.0),
            "tag_id": 4,
        },
        {
            "name": "PepsiCo",
            "symbol": "PEP",
            "description": "A food and beverage giant balancing indulgence with healthy options.",
            "price": 150.0,
            "initial_price": 150.0,
            "total_shares": int(65000000 / 150.0),
            "remaining_shares": int(65000000 / 150.0),
            "tag_id": 4,
        },
        {
            "name": "Exxon Mobil",
            "symbol": "XOM",
            "description": "A global energy leader in oil, gas, and renewable technologies.",
            "price": 110.0,
            "initial_price": 110.0,
            "total_shares": int(100000000 / 110.0),
            "remaining_shares": int(100000000 / 110.0),
            "tag_id": 5,
        },
        {
            "name": "Chevron",
            "symbol": "CVX",
            "description": "An energy company advancing in oil, gas, and sustainable innovations.",
            "price": 130.0,
            "initial_price": 130.0,
            "total_shares": int(95000000 / 130.0),
            "remaining_shares": int(95000000 / 130.0),
            "tag_id": 5,
        },
        {
            "name": "Intel",
            "symbol": "INTC",
            "description": "A semiconductor pioneer powering modern computing and AI technologies.",
            "price": 40.0,
            "initial_price": 40.0,
            "total_shares": int(40000000 / 40.0),
            "remaining_shares": int(40000000 / 40.0),
            "tag_id": 1,
        },
        {
            "name": "AMD",
            "symbol": "AMD",
            "description": "A leading chipmaker excelling in processors, GPUs, and computing solutions.",
            "price": 100.0,
            "initial_price": 100.0,
            "total_shares": int(50000000 / 100.0),
            "remaining_shares": int(50000000 / 100.0),
            "tag_id": 1,
        },
        {
            "name": "Ford",
            "symbol": "F",
            "description": "An automotive icon blending legacy with electric and innovative vehicles.",
            "price": 20.0,
            "initial_price": 20.0,
            "total_shares": int(30000000 / 20.0),
            "remaining_shares": int(30000000 / 20.0),
            "tag_id": 2,
        },
        {
            "name": "General Motors",
            "symbol": "GM",
            "description": "A global automaker innovating with electric and autonomous vehicles.",
            "price": 30.0,
            "initial_price": 30.0,
            "total_shares": int(35000000 / 30.0),
            "remaining_shares": int(35000000 / 30.0),
            "tag_id": 2,
        },
        {
            "name": "Boeing",
            "symbol": "BA",
            "description": " An aerospace leader in commercial, military, and space technologies.",
            "price": 200.0,
            "initial_price": 200.0,
            "total_shares": int(85000000 / 200.0),
            "remaining_shares": int(85000000 / 200.0),
            "tag_id": 6,
        },
        {
            "name": "Starbucks",
            "symbol": "SBUX",
            "description": "A premium coffee brand revolutionizing the global café experience.",
            "price": 100.0,
            "initial_price": 100.0,
            "total_shares": int(50000000 / 100.0),
            "remaining_shares": int(50000000 / 100.0),
            "tag_id": 4,
        },
        {
            "name": "Walmart",
            "symbol": "WMT",
            "description": "A retail powerhouse offering affordable goods across diverse categories.",
            "price": 150.0,
            "initial_price": 150.0,
            "total_shares": int(100000000 / 150.0),
            "remaining_shares": int(100000000 / 150.0),
            "tag_id": 7,
        },
        {
            "name": "Target",
            "symbol": "TGT",
            "description": "A popular retailer known for stylish, affordable, and high-quality products.",
            "price": 130.0,
            "initial_price": 130.0,
            "total_shares": int(70000000 / 130.0),
            "remaining_shares": int(70000000 / 130.0),
            "tag_id": 7,
        },
    ]

    for entry in stocks:
        stock = Stock(
            name=entry["name"],
            symbol=entry["symbol"],
            description=entry["description"],
            price=entry["price"],
            initial_price=entry["initial_price"],
            total_shares=entry["total_shares"],
            remaining_shares=entry["remaining_shares"],
            tag_id=entry["tag_id"],
        )
        db.session.add(stock)

    db.session.commit()
    print("Seeded stocks.")


def undo_stocks():
    if environment == "production":
        db.session.execute(text(f'TRUNCATE table "{SCHEMA}".stocks RESTART IDENTITY CASCADE;'))
    else:
        db.session.execute(text("DELETE FROM stocks"))
    db.session.commit()
    print("Undid stocks.")
