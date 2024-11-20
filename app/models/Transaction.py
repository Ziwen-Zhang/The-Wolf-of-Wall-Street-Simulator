from .db import db, environment, SCHEMA, add_prefix_for_prod
from .base import HasTimestamps,BelongsToUser,BelongsToStock
from typing import Any, Dict
from ..utils.formatting_methods import format_currency

class Transaction (HasTimestamps,BelongsToUser,BelongsToStock):
    __tablename__ = "transactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Integer, nullable=False)

    transaction_price = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String, nullable=False)

    def calculate_total_value(self):
        self.total_price = self.quantity * self.transaction_price


    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "quantity":self.quantity,
            "stock_id": self.stock_id,
            "transaction_price":format_currency(self.transaction_price),
            "total_price":format_currency(self.total_price),
            "transaction_type":self.transaction_type,
            "transaction_date":self.created_at
        }