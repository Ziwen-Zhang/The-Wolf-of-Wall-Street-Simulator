from time import sleep
from app.models import Save, Stock
from flask_socketio import emit

def process_save_notifications(socketio):
    """
    Periodically checks for saved stocks and sends notifications via WebSocket.
    """
    from app import app ,db
    while True:
        try:
            with app.app_context():
                saves = Save.query.all()
                for save in saves:
                    stock = Stock.query.get(save.stock_id)
                    if not stock:
                        continue

                    if stock.price >= save.target_price:
                        message = f"Stock {stock.name} has reached your target price of {save.target_price}!"

                        socketio.emit(
                            "save_notification",
                            {"user_id": save.user_id, "message": message},
                            to="/"
                        )
                        print(f"[WebSocket] Sent notification to User {save.user_id}: {message}")
                        
                        # db.session.delete(save)
                        db.session.commit()
                        return 
            sleep(5)
        except Exception as e:
            print(f"Error in process_save_notifications: {e}")
            sleep(5)
