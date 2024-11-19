from .db import db, environment, SCHEMA, add_prefix_for_prod
from .base import HasTimestamps, BelongsToStock, BelongsToUser
from sqlalchemy import UniqueConstraint
from typing import Any, Dict


class Save(HasTimestamps, BelongsToUser, BelongsToStock):
    __tablename__ = "saves"

    __table_args__ = (
        UniqueConstraint('user_id', 'stock_id', name='unique_user_stock'),
        {'schema': SCHEMA} if environment == "production" else {}
    )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
