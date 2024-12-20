from flask import Blueprint, request, jsonify
from app.models import Notification, Stock, User, db, Save
from flask_login import current_user, login_required

save_routes = Blueprint("save", __name__)


@save_routes.route("/")
def get_all_saves():
    saves = Save.query.filter_by(user_id=current_user.id)
    save_list = [s.to_dict() for s in saves]
    return jsonify({"saves": save_list})


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

    existing_save = Save.query.filter_by(
        stock_id=stock_id, user_id=current_user.id, alert_type=alert_type
    ).first()

    if existing_save:
        return jsonify({"error": f"Stock already has a '{alert_type}' alert"}), 400

    new_save = Save(
        stock_id=stock_id,
        user_id=current_user.id,
        target_price=target_price,
        alert_type=alert_type,
    )
    db.session.add(new_save)
    db.session.commit()

    return jsonify({"message": "Alert saved successfully", "save": new_save.to_dict()}), 201


@save_routes.route("/", methods=["PUT"])
@login_required
def edit_save():
    data = request.get_json()
    stock_id = data.get("stock_id")
    target_price = data.get("target_price")
    alert_type = data.get("alert_type")

    if not stock_id:
        return jsonify({"error": "Stock ID is required"}), 400
    if target_price is not None and target_price <= 0:
        return jsonify({"error": "Invalid target price"}), 400
    if alert_type is not None and alert_type not in ["above", "below"]:
        return jsonify({"error": "Invalid alert type"}), 400

    save = Save.query.filter_by(
        stock_id=stock_id, user_id=current_user.id, alert_type=alert_type
    ).first()

    if not save:
        return jsonify({"error": "Save not found"}), 404

    if save.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    if target_price is not None:
        save.target_price = target_price

    db.session.commit()

    return jsonify({"message": "Save updated successfully", "save": save.to_dict()}), 200


# @save_routes.route("/", methods=["DELETE"])
# @login_required
# def delete_save():
#     data = request.get_json()
#     stock_id = data.get("stock_id")
#     alert_type = data.get("alert_type")

#     if not alert_type or alert_type not in ["above", "below"]:
#         return jsonify({"error": "Invalid alert type"}), 400

#     save = Save.query.filter_by(
#         stock_id=stock_id, user_id=current_user.id, alert_type=alert_type
#     ).first()

#     if not save:
#         return jsonify({"error": "Save not found"}), 404

#     if save.user_id != current_user.id:
#         return jsonify({"error": "Unauthorized"}), 403

#     db.session.delete(save)
#     db.session.commit()

#     return jsonify({"message": "Save deleted successfully"}), 200

@save_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_save(id):

    save = Save.query.get(id)

    if not save or save.user_id != current_user.id:
        return jsonify({"error": "Save not found"}), 404
    stock = Stock.query.get(save.stock_id)  
    
    Notification.query.filter_by(
        user_id=current_user.id,
        stock_name=stock.name, 
        alert_type=save.alert_type
    ).delete()

    db.session.delete(save)
    db.session.commit()

    return jsonify({"message": f"Save {id} and related {save.alert_type} notifications deleted"}), 200

