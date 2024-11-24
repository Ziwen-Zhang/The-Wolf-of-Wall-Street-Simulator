from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Notification

notification_routes = Blueprint("notifications", __name__)

@notification_routes.route("/", methods=["GET"])
@login_required
def get_notifications():
    notifications = Notification.query.filter_by(user_id=current_user.id).all()
    return jsonify([notification.to_dict() for notification in notifications])


@notification_routes.route("/<int:id>", methods=["PUT"])
@login_required
def mark_notification_as_read(id):
    notification = Notification.query.get(id)

    if not notification or notification.user_id != current_user.id:
        return jsonify({"error": "Notification not found"}), 404

    notification.read = True
    db.session.commit()
    return jsonify(notification.to_dict())

@notification_routes.route("/", methods=["POST"])
@login_required
def create_notification():
    data = request.get_json()

    required_fields = ["stock_name", "target_price", "current_price", "alert_type"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    existing_notification = Notification.query.filter_by(
        user_id=current_user.id,
        stock_name=data["stock_name"],
        target_price=data["target_price"],
        alert_type=data["alert_type"],
    ).first()

    if existing_notification:
        return 

    Notification.query.filter_by(
        user_id=current_user.id,
        stock_name=data["stock_name"],
        alert_type=data["alert_type"],
        read=False 
    ).update({"read": True})

    new_notification = Notification(
        user_id=current_user.id,
        stock_name=data["stock_name"],
        target_price=data["target_price"],
        current_price=data["current_price"],
        alert_type=data["alert_type"],
    )
    db.session.add(new_notification)
    db.session.commit()

    return jsonify(new_notification.to_dict()), 201


@notification_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_notification(id):
    notification = Notification.query.get(id)

    if not notification or notification.user_id != current_user.id:
        return jsonify({"error": "Notification not found"}), 404

    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": f"Notification {id} deleted"}), 200


def check_and_create_notification(user_id, stock_name, target_price, current_price, alert_type):
    existing_notification = Notification.query.filter_by(
        user_id=user_id,
        stock_name=stock_name,
        target_price=target_price,
        alert_type=alert_type,
    ).first()

    if existing_notification:
        return

    new_notification = Notification(
        user_id=user_id,
        stock_name=stock_name,
        target_price=target_price,
        current_price=current_price,
        alert_type=alert_type,
    )
    db.session.add(new_notification)
    db.session.commit()
