from app.models import Usershare, Transaction, db

def process_transaction(user, stock_id, quantity, price, transaction_type):
    new_transaction = Transaction(
        quantity=quantity,
        transaction_price=price,
        transaction_type=transaction_type,
        total_price=price * quantity,
        user_id=user.id,
        stock_id=stock_id,
    )
    db.session.add(new_transaction)

    usershare = Usershare.query.filter_by(user_id=user.id, stock_id=stock_id).first()

    if transaction_type == "buy":
        if not usershare:
            usershare = Usershare(
                user_id=user.id, 
                stock_id=stock_id, 
                quantity=quantity,
                average_price=price
                )
            db.session.add(usershare)
        else:
            usershare.update_on_buy(quantity, price)
        user.update_buying_power(-price * quantity) 


    elif transaction_type == "sell":
        usershare.update_on_sell(quantity)
        user.update_buying_power(price * quantity)

    db.session.commit()
    return usershare
