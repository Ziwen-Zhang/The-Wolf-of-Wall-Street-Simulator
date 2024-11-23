from time import sleep
from app.models import Stock,User,Usershare
import random

def stock_price_simulator(socketio):
    from app import app, db
    while True:
        try:
            with app.app_context():
                stocks = Stock.query.all()
                updated_stocks = []

                for stock in stocks:
                    # percentage_change = random.uniform(-0.01, 0.01)
                    # new_price = stock.price * (1 + percentage_change)
                    # stock.price = round(new_price, 2)
                    # db.session.add(stock)

                    #new simulation
                    lower_bound = stock.initial_price * 0.5
                    upper_bound = stock.initial_price * 1.5
                    if stock.price < lower_bound:
                        percentage_change = random.uniform(-0.01, 0.05)
                    elif stock.price > upper_bound:
                        percentage_change = random.uniform(-0.05, 0.01)
                    else:
                        percentage_change = random.uniform(-0.05, 0.05)

                    new_price = stock.price * (1 + percentage_change)
                    stock.price = round(new_price, 2)
                    db.session.add(stock)
                    #### new

                    stock_data = {
                        "id": stock.id,
                        "name": stock.name,
                        "price": stock.price,
                        "description":stock.description,
                        "symbol":stock.symbol
                    }
                    updated_stocks.append(stock_data)
                    socketio.emit("stock_update", stock_data, room=str(stock.id))

                affected_users = (
                    db.session.query(User)
                    .join(Usershare, Usershare.user_id == User.id)
                    .filter(Usershare.stock_id.in_([stock.id for stock in stocks]))
                    .distinct()
                    .all()
                )
                for user in affected_users:
                    user.update_total_net_worth()
                    db.session.add(user)

                db.session.commit()
                # socketio.emit("stock_update", {"stocks": updated_stocks})
                # print("Updated stock prices and users' net worth sent to clients.")

        except Exception as e:
            print(f"Error in stock_price_simulator: {e}")
        sleep(3)


# @socketio.on("connect")
# def handle_connect():
#     print("Client connected")


# @socketio.on("disconnect")
# def handle_disconnect():
#     print("Client disconnected")