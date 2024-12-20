from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Stock, db, Transaction,Usershare
from typing import List

stocks_routes = Blueprint("stocks", __name__)


@stocks_routes.route("/all", methods=["GET"])
def get_all_stocks():
    stocks: List[Stock] = Stock.query.order_by(Stock.id.asc()).all()
    stock_list = [stock.to_dict() for stock in stocks]
    return jsonify({"stocks": stock_list})


@stocks_routes.route("/<int:stock_id>", methods=["GET"])
def get_stock_detail(stock_id):
    stock = Stock.query.get(stock_id)
    return jsonify({"stock": stock.to_dict()})


@stocks_routes.route("/portfolio", methods=["GET"])
@login_required
def get_user_portfolio():
    user = current_user
    shares = Usershare.query.filter_by(user_id=user.id).all()
    share_data = [share.to_dict() for share in shares]

    return jsonify({"shares": share_data})
