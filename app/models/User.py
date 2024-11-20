from .db import db, environment, SCHEMA, add_prefix_for_prod
from .base import HasTimestamps
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Any, Dict
from .types import UserFullDict,ShareDict
from .Usershare import Usershare

class User(HasTimestamps, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    _hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    bank_debt = db.Column(db.Integer, default=0, nullable=False)
    shares = db.relationship("Usershare", back_populates="user", cascade="all, delete-orphan")
    base_buying_power = db.Column(db.Float, default=100000.0, nullable=False)

    @property
    def total_net_worth(self):
        total_shares_value = sum(share.quantity * share.calculate_average_price() for share in self.shares)
        return self.base_buying_power + total_shares_value

    @property
    def buying_power(self) -> float:
        total_shares_value = sum(share.quantity * share.calculate_average_price() for share in self.shares)
        return max(self.base_buying_power - total_shares_value, 0)

    @buying_power.setter
    def buying_power(self, amount: float):
        self.base_buying_power += amount

    def update_buying_power(self, amount: float, transaction_type: str):
        if transaction_type == 'buy':
            self.base_buying_power -= amount
        elif transaction_type == 'sell':
            self.base_buying_power += amount
        else:
            raise ValueError("Invalid transaction type: must be 'buy' or 'sell'")

    def add_share(self, stock_id: int, quantity: float, price: float):
        share = next((share for share in self.shares if share.stock_id == stock_id), None)
        if share:
            total_quantity = share.quantity + quantity
            new_average_price = (
                (share.quantity * share.average_price) + (quantity * price)
            ) / total_quantity
            share.quantity = total_quantity
            share.average_price = new_average_price
        else:
            new_share = Usershare(user_id=self.id, stock_id=stock_id, quantity=quantity, average_price=price)
            self.shares.append(new_share)

    def remove_share(self, stock_id: int, quantity: float):
        share = next((share for share in self.shares if share.stock_id == stock_id), None)
        if not share or share.quantity < quantity:
            raise ValueError("Insufficient shares to remove")
        share.quantity -= quantity
        if share.quantity == 0:
            self.shares.remove(share)

    @property
    def password(self):
        raise AttributeError("Password is not readable")

    @password.setter
    def password(self, password):
        self._hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self._hashed_password, password)

    def __repr__(self):
        return f"<User {self.username} {self.email}>"

    def to_dict(self, include_shares=True) -> UserFullDict:
        user_data = {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "email": self.email,
            "buying_power": self.buying_power,
            "total_net_worth": self.total_net_worth,
            "bank_debt": self.bank_debt,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if include_shares:
            user_data["shares"] = [share.to_dict() for share in self.shares]
        return user_data
