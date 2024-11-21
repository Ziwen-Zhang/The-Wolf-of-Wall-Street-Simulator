from app.models import Usershare, Transaction, db, User, Stock, Order


def process_transaction(user_id, stock_id, quantity, transaction_type):
    stock = Stock.query.get(stock_id)

    new_transaction = Transaction(
        quantity=quantity,
        transaction_price=stock.price,
        transaction_type=transaction_type,
        total_price=stock.price * quantity,
        user_id=user_id,
        stock_id=stock_id,
    )
    db.session.add(new_transaction)
    usershare = Usershare.query.filter_by(user_id=user_id, stock_id=stock_id).first()
    user = User.query.get(user_id)
    if transaction_type == "buy":
        total_cost = stock.price * quantity
        if stock.remaining_shares < quantity:
            raise ValueError(
                f"Not enough shares available. Remaining: {stock.remaining_shares} shares"
            )
        if user.buying_power < total_cost:
            raise ValueError(
                f"Insufficient funds. Required: {total_cost}, Available: {user.buying_power}"
            )
        if not usershare:
            usershare = Usershare(
                user_id=user.id,
                stock_id=stock_id,
                quantity=quantity,
                average_price=stock.price,
            )
            db.session.add(usershare)
        else:
            usershare.update_on_buy(quantity, stock.price)
        stock.remaining_shares -= quantity
        user.update_buying_power(-total_cost)
        user.update_total_net_worth()
    elif transaction_type == "sell":
        if not usershare or usershare.quantity < quantity:
            raise ValueError(
                f"Not enough shares to sell. Available: {usershare.quantity if usershare else 0}"
            )
        usershare.update_on_sell(quantity)
        stock.remaining_shares += quantity
        user.update_buying_power(stock.price * quantity)
        user.update_total_net_worth()
        if usershare.quantity == 0:
            db.session.delete(usershare)
    db.session.commit()
    print(
        f"[Transaction] {transaction_type.upper()} | User {user_id} | Stock {stock_id} | Quantity {quantity} | Price {stock.price} | Total {stock.price * quantity}"
    )
    return usershare


def schedule_transaction(user_id, stock_id, quantity, limit_price, transaction_type):
    user = User.query.get(user_id)
    total_cost = limit_price * quantity
    if transaction_type == "buy" and user.buying_power < total_cost:
        raise ValueError(
            f"Insufficient funds to schedule order. Required: {total_cost}, Available: {user.buying_power}"
        )

    existing_order = Order.query.filter_by(
        user_id=user_id,
        stock_id=stock_id,
        order_type=transaction_type,
        limit_price=limit_price,
        status="pending",
    ).first()

    if existing_order:
        existing_order.quantity += quantity
        db.session.commit()
        print(f"[Schedule] Updated existing order: {existing_order}")
        return existing_order
    new_order = Order(
        user_id=user_id,
        stock_id=stock_id,
        quantity=quantity,
        limit_price=limit_price,
        order_type=transaction_type,
        status="pending",
    )
    db.session.add(new_order)
    db.session.commit()
    print(f"[Schedule] Created new order: {new_order}")
    return new_order
