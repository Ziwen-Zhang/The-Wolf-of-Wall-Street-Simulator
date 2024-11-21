import time
from app.models import Transaction, Stock, db, Usershare,Order

def process_orders():
    from app import app 
    with app.app_context():
        while True:
            pending_orders = Order.query.filter_by(status="pending").all()

            for order in pending_orders:
                stock = Stock.query.get(order.stock_id)
                if not stock:
                    continue

                if (
                    (order.order_type == "buy" and stock.price <= order.limit_price) or
                    (order.order_type == "sell" and stock.price >= order.limit_price)
                ):
                    # 创建交易
                    new_transaction = Transaction(
                        user_id=order.user_id,
                        stock_id=order.stock_id,
                        quantity=order.quantity,
                        transaction_price=order.limit_price,
                        total_price=order.limit_price * order.quantity,
                        transaction_type=order.order_type,
                    )
                    db.session.add(new_transaction)

                    # 更新用户股票持仓或余额
                    user_share = Usershare.query.filter_by(
                        user_id=order.user_id,
                        stock_id=order.stock_id
                    ).first()

                    if order.order_type == "buy":
                        user_share.update_on_buy(order.quantity, order.limit_price)
                        order.user.update_buying_power(-order.limit_price * order.quantity)
                    elif order.order_type == "sell":
                        user_share.update_on_sell(order.quantity)
                        order.user.update_buying_power(order.limit_price * order.quantity)

                    # 标记订单为已执行
                    order.status = "executed"
                    db.session.add(order)

            db.session.commit()

            time.sleep(5)  # 每 5 秒检查一次挂单

