from app.models import Usershare, Transaction, db,User,Stock

def process_transaction(user_id, stock_id, quantity, price, transaction_type):
    new_transaction = Transaction(
        quantity=quantity,
        transaction_price=price,
        transaction_type=transaction_type,
        total_price=price * quantity,
        user_id=user_id,
        stock_id=stock_id,
    )
    db.session.add(new_transaction)
    stock = Stock.query.get(stock_id)
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
                average_price=price
                )
            stock.remaining_shares -= quantity
            db.session.add(usershare)
        else:
            usershare.update_on_buy(quantity, price)
            stock.remaining_shares -= quantity
        user.update_buying_power(-price * quantity) 


    elif transaction_type == "sell":
        usershare.update_on_sell(quantity)
        stock.remaining_shares += quantity
        user.update_buying_power(price * quantity)

    db.session.commit()
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
    return new_transaction