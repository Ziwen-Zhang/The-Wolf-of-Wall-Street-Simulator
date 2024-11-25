from app.models.base import BelongsToUser, HasTimestamps
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

class Notification(HasTimestamps,BelongsToUser):
    __tablename__ = "notifications"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    stock_name = db.Column(db.String(100), nullable=False)
    target_price = db.Column(db.Float, nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    alert_type = db.Column(db.String(10), nullable=False)
    read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_name": self.stock_name,
            "target_price": self.target_price,
            "current_price": self.current_price,
            "alert_type": self.alert_type,
            "read": self.read,
            "created_at": self.created_at.isoformat(),
        }
