from flask import Blueprint, jsonify,request
from flask_login import login_required,current_user
from app.models import User
from app.models import db
from typing import Any, Dict, List,Optional
from ..models.types import UserDict
user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users: List[User] = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/current')
@login_required
def user() -> UserDict:
    """
    Query for a user by id and returns that user in a dictionary
    """
    user:Optional[User] = User.query.get(current_user.id)
    return user.to_dict()

@user_routes.route('/add', methods=['POST'])
@login_required
def add_fund():
    user = User.query.get(current_user.id)
    data = request.json
    amount = data.get('amount')
    if not amount or not isinstance(amount, (int, float)):
        return jsonify({"error": "Invalid amount"}), 400
    amount = float(amount)
    max_loanable = 1000000 - user.bank_debt
    if max_loanable <= 0:
        return jsonify({"error": "You have reached the maximum loan limit of $1,000,000."}), 400
    loan_amount = min(amount, max_loanable)
    user.base_buying_power += loan_amount
    user.bank_debt += loan_amount
    db.session.commit()
    return jsonify({
        "message": f"Added ${loan_amount} to fund.",
        "remaining_loan_capacity": 1000000 - user.bank_debt,
        "user": user.to_dict()
    }), 200

@user_routes.route('/repay', methods=['DELETE'])
@login_required
def repay_loan():
    user = User.query.get(current_user.id)
    data = request.json
    amount = data.get('amount')
    if not amount or not isinstance(amount, (int, float)):
        return jsonify({"error": "Invalid amount"}), 400
    amount = float(amount)
    if user.bank_debt <= 0:
        return jsonify({"error": "No outstanding debt to repay."}), 400
    max_repayable = min(amount, user.bank_debt, user.buying_power)
    if max_repayable <= 0:
        return jsonify({"error": "Insufficient buying power to repay debt."}), 400
    user.bank_debt -= max_repayable
    user.base_buying_power -= max_repayable
    db.session.commit()
    return jsonify({
        "message": f"Repaid ${max_repayable} of debt.",
        "remaining_debt": user.bank_debt,
        "remaining_buying_power": user.buying_power,
        "user": user.to_dict()
    }), 200

    
    