from .db import db, environment, SCHEMA, add_prefix_for_prod
from .base import HasTimestamps, BelongsToStock, BelongsToUser
from sqlalchemy import UniqueConstraint
from typing import Any, Dict


class Save(HasTimestamps, BelongsToUser, BelongsToStock):
    __tablename__ = "saves"

    target_price = db.Column(db.Float, nullable=False)
    alert_type = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "target_price": self.target_price,
            "alert_type": self.alert_type,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

