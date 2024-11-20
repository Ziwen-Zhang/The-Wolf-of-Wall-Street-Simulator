import json
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Stock, db, Transaction,Usershare
from typing import List

stocks_routes = Blueprint("stocks", __name__)


@stocks_routes.route("/all", methods=["GET"])
def get_all_stocks():
    stocks: List[Stock] = Stock.query.all()
    print(f"{stocks=}")
    stock_list = [stock.to_dict() for stock in stocks]
    return jsonify({"stocks": stock_list})


@stocks_routes.route("/<int:stock_id>", methods=["GET"])
def get_stock_detail(stock_id):
    stock = Stock.query.get(stock_id)
    return jsonify({"stock": stock.to_dict()})


@stocks_routes.route("/buy", methods=["POST"])
@login_required
def buy_stock():
    data = request.get_json()
    stock_id = data.get("stock_id")
    quantity = data.get("quantity")
    price = data.get("price")
    user = current_user

    new_transaction = Transaction(
        quantity=quantity,
        transaction_price=price,
        transaction_type="buy",
        total_price=price * quantity,
        user_id=user.id,
        stock_id=stock_id
    )
    db.session.add(new_transaction)

    usershare = Usershare.query.filter_by(user_id=user.id, stock_id=stock_id).first()
    if not usershare:
        usershare = Usershare(
            user_id=user.id,
            stock_id=stock_id,
            quantity=quantity
        )
        db.session.add(usershare)
    else:
        usershare.quantity += quantity

    db.session.commit()

    return jsonify({"message": "Transaction success!", "shares": usershare.to_dict()})


@stocks_routes.route("/sell", methods=["POST"])
@login_required
def sell_stock():
    data = request.get_json()
    stock_id = data.get("stock_id")
    quantity = data.get("quantity")
    price = data.get("price")
    user = current_user

    new_transaction = Transaction(
        quantity=quantity,
        transaction_price=price,
        transaction_type="sell",
        total_price=price * quantity,
        user_id=user.id,
        stock_id=stock_id
    )
    db.session.add(new_transaction)
    db.session.commit()
    
    usershare = Usershare.query.filter_by(user_id=user.id, stock_id=stock_id).first()

    return jsonify({"message": "Transaction success!", "shares": usershare.to_dict()})

@stocks_routes.route("/portfolio", methods=["GET"])
@login_required
def get_user_portfolio():
    user = current_user
    shares = Usershare.query.filter_by(user_id=user.id).all()
    share_data = [share.to_dict() for share in shares]

    return jsonify({"shares": share_data})

@stocks_routes.route("/history")
@login_required
def get_user_history():
    history = Transaction.query.filter_by(user_id = current_user.id).all()
    history_list = [h.to_dict()for h in history]
    return jsonify({"history":history_list})