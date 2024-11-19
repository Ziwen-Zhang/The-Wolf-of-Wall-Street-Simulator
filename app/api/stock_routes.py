from flask import Blueprint, jsonify
from flask_login import login_required
from ..models import Stock
from typing import List
stocks_routes = Blueprint('stocks', __name__)



@stocks_routes.route('/all')
def get_all_stocks():
    stocks:List[Stock] = Stock.query.all()
    stock_list = [stock.to_dict() for stock in stocks]
    print(stock_list)
    return jsonify({'stocks':stock_list})


