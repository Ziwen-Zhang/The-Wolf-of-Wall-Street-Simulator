import random
from time import sleep
from app.models import Transaction, Stock, User
from ..utils.transaction import process_transaction


def generate_random_buy_transaction():
    from app import db, app

    with app.app_context():
        user_id = random.randint(1, 100)
        stock_id = random.randint(1, 21)
        quantity = random.randint(1, 10)
        stock = Stock.query.get(stock_id)
        # price = stock.price
        process_transaction(user_id, stock_id, quantity, "buy")
        print(
            f"[SIMULATION] Buy transaction created: User {user_id}, Stock {stock_id}, Quantity {quantity}, Price {stock.price}"
        )


def simulate_transactions():
    from app import db, app

    with app.app_context():
        while True:
            print("[SIMULATION] Starting simulation thread...")
            try:
                generate_random_buy_transaction()
            except Exception as e:
                print(f"[SIMULATION ERROR] Error in simulate_transactions: {e}")
            sleep(2)
