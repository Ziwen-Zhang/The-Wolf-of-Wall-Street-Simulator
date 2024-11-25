from .db import db, environment, SCHEMA, add_prefix_for_prod
from .base import BelongsToStock, BelongsToUser,HasTimestamps
from typing import Any, Dict

class Order(BelongsToStock, BelongsToUser,HasTimestamps):
    __tablename__ = "orders"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    order_type = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    limit_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, nullable=False, default="pending")
    user = db.relationship("User", back_populates="orders",lazy=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "order_type": self.order_type,
            "quantity": self.quantity,
            "limit_price": self.limit_price,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
