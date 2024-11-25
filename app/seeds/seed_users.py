from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_users():
    users = [
        {
            "username": "demo",
            "email": "demo@d.com",
            "password": "password",
            "first_name": "Demo",
            "last_name": "User",
        },
    ]

    for i in range(2, 51):
        users.append({
            "username": f"user_{i}",
            "email": f"user_{i}@example.com",
            "password": "password",
            "first_name": f"FirstName{i}",
            "last_name": f"LastName{i}",
        })

    for entry in users:
        user = User(
            username=entry["username"],
            email=entry["email"],
            first_name=entry["first_name"],
            last_name=entry["last_name"],
        )
        user.password = entry["password"]
        db.session.add(user)

    db.session.commit()
    print("Seeded users.")

def undo_users():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()
    print("Undid users.")
