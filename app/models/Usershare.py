from sqlalchemy import event, func
from .db import db, SCHEMA, environment
from .base import BelongsToStock, BelongsToUser
from .Transaction import Transaction
from ..utils.formatting_methods import format_currency

class Usershare(BelongsToStock, BelongsToUser):
    __tablename__ = "user_shares"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    quantity = db.Column(db.Float, nullable=False)

    user = db.relationship("User", back_populates="shares",lazy=True)
    stock = db.relationship("Stock", back_populates="user_shares",lazy=True)
    average_price = db.Column(db.Float, nullable=False, default=0.0)

    @property
    def total_value(self) -> float:
        return self.quantity * self.stock.price

    # def calculate_average_price(self):
    #     result = db.session.query(
    #         func.sum(Transaction.transaction_price * Transaction.quantity),
    #         func.sum(Transaction.quantity)
    #     ).filter_by(
    #         user_id=self.user_id,
    #         stock_id=self.stock_id,
    #         transaction_type="buy"
    #     ).first()

    #     total_cost, total_quantity = result
    #     return total_cost / total_quantity if total_quantity and total_quantity > 0 else 0.0
    
    def update_on_buy(self, quantity: float, price: float):
        if self.average_price is None:
            self.average_price = 0.0
        total_quantity = self.quantity + quantity
        self.average_price = (
            (self.quantity * self.average_price) + (quantity * price)   
        ) / total_quantity
        self.quantity = total_quantity
        
    def update_on_sell(self, quantity: float):
        self.quantity -= quantity

    def to_dict(self):
        return {
            "stock_id": self.stock_id,
            "stock_name":self.stock.name,
            "quantity": self.quantity,
            "average_price": format_currency(self.average_price),
            "current_price":format_currency(self.stock.price),
            "total_value": format_currency(self.total_value), 
        }

    def to_dict_transaction(self):
        return {
            "buying_power": format_currency(self.user.buying_power),
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "quantity": self.quantity,
            "average_price": format_currency(self.average_price),
            "current_price":format_currency(self.stock.price),
            "total_value": format_currency(self.total_value), 
        }