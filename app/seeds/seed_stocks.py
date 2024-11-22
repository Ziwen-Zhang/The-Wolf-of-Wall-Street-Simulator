# app/seeds/seed_stocks.py
from app.models import db, Stock, Tag, environment, SCHEMA
from sqlalchemy.sql import text


def seed_stocks():
    stocks = [
        {
            "name": "Apple",
            "symbol": "AAPL",
            "description": "Tech giant",
            "price": 150.0,
            "total_shares": int(100000000 / 150.0),
            "remaining_shares": int(100000000 / 150.0),
            "tag_id": 1,
        },
        {
            "name": "Tesla",
            "symbol": "TSLA",
            "description": "Electric vehicles",
            "price": 700.0,
            "total_shares": int(50000000 / 700.0),
            "remaining_shares": int(50000000 / 700.0),
            "tag_id": 2,
        },
        {
            "name": "Amazon",
            "symbol": "AMZN",
            "description": "E-commerce leader",
            "price": 3300.0,
            "total_shares": int(150000000 / 3300.0),
            "remaining_shares": int(150000000 / 3300.0),
            "tag_id": 1,
        },
        {
            "name": "Google",
            "symbol": "GOOGL",
            "description": "Search engine giant",
            "price": 2800.0,
            "total_shares": int(120000000 / 2800.0),
            "remaining_shares": int(120000000 / 2800.0),
            "tag_id": 1,
        },
        {
            "name": "Microsoft",
            "symbol": "MSFT",
            "description": "Software and cloud",
            "price": 320.0,
            "total_shares": int(110000000 / 320.0),
            "remaining_shares": int(110000000 / 320.0),
            "tag_id": 1,
        },
        {
            "name": "Meta",
            "symbol": "META",
            "description": "Social media leader",
            "price": 340.0,
            "total_shares": int(90000000 / 340.0),
            "remaining_shares": int(90000000 / 340.0),
            "tag_id": 1,
        },
        {
            "name": "NVIDIA",
            "symbol": "NVDA",
            "description": "Graphics cards and AI",
            "price": 500.0,
            "total_shares": int(70000000 / 500.0),
            "remaining_shares": int(70000000 / 500.0),
            "tag_id": 1,
        },
        {
            "name": "Netflix",
            "symbol": "NFLX",
            "description": "Streaming platform",
            "price": 400.0,
            "total_shares": int(60000000 / 400.0),
            "remaining_shares": int(60000000 / 400.0),
            "tag_id": 3,
        },
        {
            "name": "Disney",
            "symbol": "DIS",
            "description": "Entertainment and media",
            "price": 120.0,
            "total_shares": int(80000000 / 120.0),
            "remaining_shares": int(80000000 / 120.0),
            "tag_id": 3,
        },
        {
            "name": "Coca-Cola",
            "symbol": "KO",
            "description": "Beverage giant",
            "price": 60.0,
            "total_shares": int(60000000 / 60.0),
            "remaining_shares": int(60000000 / 60.0),
            "tag_id": 4,
        },
        {
            "name": "PepsiCo",
            "symbol": "PEP",
            "description": "Food and beverage",
            "price": 150.0,
            "total_shares": int(65000000 / 150.0),
            "remaining_shares": int(65000000 / 150.0),
            "tag_id": 4,
        },
        {
            "name": "Exxon Mobil",
            "symbol": "XOM",
            "description": "Oil and gas",
            "price": 110.0,
            "total_shares": int(100000000 / 110.0),
            "remaining_shares": int(100000000 / 110.0),
            "tag_id": 5,
        },
        {
            "name": "Chevron",
            "symbol": "CVX",
            "description": "Energy corporation",
            "price": 130.0,
            "total_shares": int(95000000 / 130.0),
            "remaining_shares": int(95000000 / 130.0),
            "tag_id": 5,
        },
        {
            "name": "Intel",
            "symbol": "INTC",
            "description": "Semiconductors",
            "price": 40.0,
            "total_shares": int(40000000 / 40.0),
            "remaining_shares": int(40000000 / 40.0),
            "tag_id": 1,
        },
        {
            "name": "AMD",
            "symbol": "AMD",
            "description": "Microprocessors",
            "price": 100.0,
            "total_shares": int(50000000 / 100.0),
            "remaining_shares": int(50000000 / 100.0),
            "tag_id": 1,
        },
        {
            "name": "Ford",
            "symbol": "F",
            "description": "Automobile manufacturer",
            "price": 20.0,
            "total_shares": int(30000000 / 20.0),
            "remaining_shares": int(30000000 / 20.0),
            "tag_id": 2,
        },
        {
            "name": "General Motors",
            "symbol": "GM",
            "description": "Automotive company",
            "price": 30.0,
            "total_shares": int(35000000 / 30.0),
            "remaining_shares": int(35000000 / 30.0),
            "tag_id": 2,
        },
        {
            "name": "Boeing",
            "symbol": "BA",
            "description": "Aerospace leader",
            "price": 200.0,
            "total_shares": int(85000000 / 200.0),
            "remaining_shares": int(85000000 / 200.0),
            "tag_id": 6,
        },
        {
            "name": "Starbucks",
            "symbol": "SBUX",
            "description": "Coffeehouse chain",
            "price": 100.0,
            "total_shares": int(50000000 / 100.0),
            "remaining_shares": int(50000000 / 100.0),
            "tag_id": 4,
        },
        {
            "name": "Walmart",
            "symbol": "WMT",
            "description": "Retail corporation",
            "price": 150.0,
            "total_shares": int(100000000 / 150.0),
            "remaining_shares": int(100000000 / 150.0),
            "tag_id": 7,
        },
        {
            "name": "Target",
            "symbol": "TGT",
            "description": "Retail giant",
            "price": 130.0,
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
            total_shares=entry["total_shares"],
            remaining_shares=entry["remaining_shares"],
            tag_id=entry["tag_id"],
        )
        db.session.add(stock)

    db.session.commit()
    print("Seeded stocks.")


def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))
    db.session.commit()
    print("Undid stocks.")