# app/seeds/seed_tags.py
from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tags():
    tags = [
        {"name": "Technology", "description": "Companies in the tech sector"},
        {"name": "Automotive", "description": "Automobile manufacturers and related companies"},
        {"name": "Entertainment", "description": "Entertainment and media companies"},
        {"name": "Food & Beverage", "description": "Food and beverage industry leaders"},
        {"name": "Energy", "description": "Oil, gas, and renewable energy companies"},
        {"name": "Aerospace", "description": "Aerospace and defense companies"},
        {"name": "Retail", "description": "Retail corporations and stores"},
    ]

    for entry in tags:
        tag = Tag(
            name=entry["name"],
            description=entry["description"],
        )
        db.session.add(tag)

    db.session.commit()
    print("Seeded tags.")

def undo_tags():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM tags"))
    db.session.commit()
    print("Undid tags.")
