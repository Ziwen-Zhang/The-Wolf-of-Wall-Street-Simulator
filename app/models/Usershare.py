from .db import db, SCHEMA, environment, add_prefix_for_prod
from sqlalchemy.sql import func
from .base import BelongsToStock, BelongsToUser
from .Stock import Stock
from .Transaction import Transaction
from ..utils.formatting_methods import format_currency

class Usershare(BelongsToStock, BelongsToUser):
    __tablename__ = "user_shares"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    quantity = db.Column(db.Float, nullable=False)

    user = db.relationship("User", back_populates="shares")
    stock = db.relationship("Stock", back_populates="user_shares")

    def calculate_average_price(self):
        transactions = Transaction.query.filter_by(
            user_id=self.user_id,
            stock_id=self.stock_id,
            transaction_type="buy"
        ).all()

        total_cost = sum(t.transaction_price * t.quantity for t in transactions)
        total_quantity = sum(t.quantity for t in transactions)

        return total_cost / total_quantity if total_quantity > 0 else 0

    def to_dict(self):
        return {
            # "user_id": self.user_id,
            "stock_id": self.stock_id,
            "quantity": self.quantity,
            "average_price": format_currency(self.calculate_average_price()),
        }
    
    def to_dict_transaction(self):
        return {
            "buying_power":self.user.buying_power,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "quantity": self.quantity,
            "average_price": format_currency(self.calculate_average_price()),
        }