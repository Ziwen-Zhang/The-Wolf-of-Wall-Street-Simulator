from flask import Blueprint, request,jsonify
from app.models import User, db , Save
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

save_routes = Blueprint("save", __name__)


@save_routes.route("/")
def get_all_saves():
    saves = Save.query.filter_by(user_id = current_user.id)
    save_list = [s.to_dict() for s in saves]
    return jsonify({"saves":save_list})


@save_routes.route("/", methods=["POST"])
@login_required
def add_save():
    data = request.get_json()
    stock_id = data.get("stock_id")
    target_price = data.get("target_price")
    alert_type = data.get("alert_type")

    if not target_price or target_price <= 0:
        return jsonify({"error": "Invalid target price"}), 400

    if alert_type not in ["above", "below"]:
        return jsonify({"error": "Invalid alert type"}), 400
    
    existing_save = Save.query.filter_by(stock_id=stock_id, user_id=current_user.id).first()
    if existing_save:
        return jsonify({"error": "Stock already saved"}), 400

    new_save = Save(
        stock_id=stock_id,
        user_id=current_user.id,
        target_price=target_price,
        alert_type=alert_type
    )
    db.session.add(new_save)
    db.session.commit()

    return jsonify({"message": "Alert saved successfully", "save": new_save.to_dict()}), 201


@save_routes.route("/", methods=["DELETE"])
@login_required
def delete_save():
    data = request.get_json()
    stock_id = data.get("stock_id")
    save = Save.query.filter_by(stock_id=stock_id, user_id=current_user.id).first()

    if save.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(save)
    db.session.commit()

    return jsonify({"message": "Save deleted successfully"}), 200