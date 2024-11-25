from app.models import db, Save, environment, SCHEMA
from sqlalchemy import text

def seed_saves():
    saves = [
        {"user_id": 1, "stock_id": 1, "target_price": 150.0, "alert_type": "above"},
        {"user_id": 2, "stock_id": 2, "target_price": 100.0, "alert_type": "below"},
    ]

    for entry in saves:
        save = Save(
            user_id=entry["user_id"],
            stock_id=entry["stock_id"],
            target_price=entry["target_price"],
            alert_type=entry["alert_type"],
        )
        db.session.add(save)

    db.session.commit()
    print("Seeded saves.")

def undo_saves():
    if environment == "production":
        db.session.execute(text(f'TRUNCATE table "{SCHEMA}".saves RESTART IDENTITY CASCADE;'))
    else:
        db.session.execute(text("DELETE FROM saves"))
    db.session.commit()
    print("Undid saves.")
