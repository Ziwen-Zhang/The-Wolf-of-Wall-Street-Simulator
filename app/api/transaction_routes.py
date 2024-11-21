from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Stock, db, Transaction,Usershare
from typing import List
from ..utils.transaction import process_transaction,schedule_transaction

transactions_routes = Blueprint("transactions", __name__)

@transactions_routes.route("/history")
@login_required
def get_user_history():
    history = Transaction.query.filter_by(user_id = current_user.id).all()
    history_list = [h.to_dict()for h in history]
    return jsonify({"history":history_list})


@transactions_routes.route("/buy", methods=["POST"])
@login_required
def buy_stock():
    data = request.get_json()
    stock_id = data.get("stock_id")
    quantity = data.get("quantity")
    # price = data.get("price")

    usershare = process_transaction(current_user.id, stock_id, quantity, "buy")
    return jsonify({"message": "Transaction success!", "shares": usershare.to_dict_transaction()})



@transactions_routes.route("/sell", methods=["POST"])
@login_required
def sell_stock():
    data = request.get_json()
    stock_id = data.get("stock_id")
    quantity = data.get("quantity")
    # price = data.get("price")

    usershare = process_transaction(current_user.id, stock_id, quantity, "sell")
    return jsonify({"message": "Transaction success!", "shares": usershare.to_dict_transaction() if usershare.quantity > 0 else None})


@transactions_routes.route("/schedule", methods=["POST"])
@login_required
def schedule_buy():
    data = request.get_json()
    stock_id = data.get("stock_id")
    quantity = data.get("quantity")
    price = data.get("limit_price")

    transaction = schedule_transaction(current_user.id, stock_id, quantity, price, "buy")
    return jsonify({"message": "Transaction success!", "shares": transaction.to_dict_schedule()})
