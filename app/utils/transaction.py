from app.models import Usershare, Transaction, db, User, Stock

# def process_transaction(user_id, stock_id, quantity, price, transaction_type):
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
        if stock.remaining_shares < quantity:
            raise ValueError(f"Not enough shares available. Remaining: {stock.remaining_shares} shares")
        if not usershare:
            usershare = Usershare(
                user_id=user.id, 
                stock_id=stock_id, 
                quantity=quantity,
                average_price=stock.price
            )
            db.session.add(usershare)
        else:
            usershare.update_on_buy(quantity, stock.price)
        stock.remaining_shares -= quantity
        user.update_buying_power(-stock.price * quantity)

    elif transaction_type == "sell":
        if not usershare or usershare.quantity < quantity:
            raise ValueError(f"Not enough shares to sell. Available: {usershare.quantity if usershare else 0}")
        usershare.update_on_sell(quantity)
        stock.remaining_shares += quantity
        user.update_buying_power(stock.price * quantity)
    db.session.commit()
    print(f"[Transaction] {transaction_type.upper()} | User {user_id} | Stock {stock_id} | Quantity {quantity} | Price {stock.price}")
    return usershare

def schedule_transaction(user_id, stock_id, quantity, limit_price, transaction_type):
    existing_transaction = Transaction.query.filter_by(
        user_id=user_id,
        stock_id=stock_id,
        transaction_type=transaction_type,
        limit_price=limit_price,
    ).first()
    if existing_transaction:
        existing_transaction.quantity += quantity
        existing_transaction.total_price += quantity * limit_price
        db.session.commit()
        print(f"[Schedule] Updated existing transaction: {existing_transaction}")
        return existing_transaction
    new_transaction = Transaction(
        quantity=quantity,
        limit_price=limit_price,
        transaction_type=transaction_type,
        transaction_price=limit_price,
        total_price=limit_price * quantity,
        user_id=user_id,
        stock_id=stock_id,
    )
    db.session.add(new_transaction)
    db.session.commit()
    print(f"[Schedule] Created new transaction: {new_transaction}")
    return new_transaction