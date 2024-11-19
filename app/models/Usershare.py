from .db import db, SCHEMA, environment, add_prefix_for_prod
from sqlalchemy.sql import func
from .base import BelongsToStock,BelongsToUser,HasTimestamps
from .User import User
from .Stock import Stock
from .types import ShareDict



class Usershare(BelongsToStock,BelongsToUser,HasTimestamps):
    __tablename__ = "user_shares"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Float, nullable=False)
    average_price = db.Column(db.Float, nullable=False)

    user = db.relationship("User", back_populates="shares")
    stock = db.relationship("Stock", back_populates="user_shares")


    def update_total_value(self):
        self.total_value = self.quantity * self.average_price

    def to_dict(self) -> ShareDict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "quantity": self.quantity,
            "average_price": self.average_price,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
