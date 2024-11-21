from flask_socketio import SocketIO, emit
from threading import Thread
from time import sleep
import random
from app.models import Stock, db

# 创建 SocketIO 实例
socketio = SocketIO(cors_allowed_origins="*")

# 股票价格模拟器
def stock_price_simulator():
    while True:
        try:
            with db.app_context():
                stocks = Stock.query.all()
                updated_stocks = []

                for stock in stocks:
                    # 随机浮动价格
                    percentage_change = random.uniform(-0.05, 0.05)
                    new_price = stock.price * (1 + percentage_change)
                    stock.price = round(new_price, 2)
                    db.session.add(stock)
                    updated_stocks.append({
                        "id": stock.id,
                        "name": stock.name,
                        "price": stock.price
                    })

                db.session.commit()

                # 推送实时更新到所有连接的客户端
                socketio.emit("stock_update", {"stocks": updated_stocks})
                print("Updated stock prices sent to clients.")
        except Exception as e:
            print(f"Error in stock_price_simulator: {e}")
        sleep(3)  # 每 3 秒更新一次

# WebSocket 事件
@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")
