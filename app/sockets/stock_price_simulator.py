from time import sleep
from app.models import Stock
import random

def stock_price_simulator(socketio):
    from app import app,db
    while True:
        try:
            with app.app_context():
                stocks = Stock.query.all()
                updated_stocks = []

                for stock in stocks:
                    percentage_change = random.uniform(-0.05, 0.05)
                    new_price = stock.price * (1 + percentage_change)
                    stock.price = round(new_price, 2)
                    db.session.add(stock)
                    updated_stocks.append(
                        {"id": stock.id, "name": stock.name, "price": stock.price}
                    )

                db.session.commit()

                socketio.emit("stock_update", {"stocks": updated_stocks})
                print("Updated stock prices sent to clients.")
        except Exception as e:
            print(f"Error in stock_price_simulator: {e}")
        sleep(3)

# @socketio.on("connect")
# def handle_connect():
#     print("Client connected")


# @socketio.on("disconnect")
# def handle_disconnect():
#     print("Client disconnected")