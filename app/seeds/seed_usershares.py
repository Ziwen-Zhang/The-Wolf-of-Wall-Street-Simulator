# # app/seeds/seed_usershares.py
# from app.models import db, Usershare, User, Stock, environment, SCHEMA
# from sqlalchemy.sql import text

# def seed_usershares():
#     usershares = [
#         {"user_id": 1, "stock_id": 1, "quantity": 10, "average_price": 150.0},
#         {"user_id": 2, "stock_id": 2, "quantity": 2, "average_price": 200.0},
#     ]

#     for entry in usershares:
#         usershare = Usershare(
#             user_id=entry["user_id"],
#             stock_id=entry["stock_id"],
#             quantity=entry["quantity"],
#             average_price=entry["average_price"],
#         )
#         db.session.add(usershare)

#     db.session.commit()
#     print("Seeded usershares.")

# def undo_usershares():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.user_shares RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM user_shares"))
#     db.session.commit()
#     print("Undid usershares.")
