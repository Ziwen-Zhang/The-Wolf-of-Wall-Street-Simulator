# # app/seeds/seed_transactions.py
# from app.models import db, Transaction, environment, SCHEMA
# from sqlalchemy.sql import text

# def seed_transactions():
#     transactions = [
#         {"quantity": 10, "total_price": 1400.0, "transaction_price": 140.0, "transaction_type": "buy", "user_id": 1, "stock_id": 1},
#         {"quantity": 5, "total_price": 3400.0, "transaction_price": 680.0, "transaction_type": "buy", "user_id": 2, "stock_id": 2},
#         {"quantity": 3, "total_price": 2040.0, "transaction_price": 680.0, "transaction_type": "sell", "user_id": 2, "stock_id": 2},
#     ]

#     for entry in transactions:
#         transaction = Transaction(
#             quantity=entry["quantity"],
#             total_price=entry["total_price"],
#             transaction_price=entry["transaction_price"],
#             transaction_type=entry["transaction_type"],
#             user_id=entry["user_id"],
#             stock_id=entry["stock_id"],
#         )
#         db.session.add(transaction)

#     db.session.commit()
#     print("Seeded transactions.")

# def undo_transactions():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM transactions"))
#     db.session.commit()
#     print("Undid transactions.")
