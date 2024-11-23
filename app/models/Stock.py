from .db import db, environment, SCHEMA, add_prefix_for_prod
from typing import Any, Dict
from .base import Base
from ..utils.formatting_methods import format_currency
from sqlalchemy.orm import Session
from sqlalchemy.event import listens_for


class Stock(Base):
    __tablename__ = "stocks"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    name = db.Column(db.String, nullable=False)
    symbol = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False) 
    initial_price = db.Column(db.Float, nullable=False)

    total_shares = db.Column(db.Integer, nullable=False, default=0)
    remaining_shares = db.Column(db.Integer, nullable=False)
    user_shares = db.relationship("Usershare", back_populates="stock",lazy=True)

    tag = db.relationship("Tag", back_populates="stocks",lazy=True)
    tag_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")))

    @property
    def total_value(self) -> float:
        return self.price * self.total_shares
    
    @total_value.setter
    def total_value(self, value: float):
        if not self.total_shares or self.total_shares == 0:
            raise ValueError("Cannot set total_value when total_shares is None or 0.")
        self.price = value / self.total_shares

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "symbol": self.symbol,
            "description": self.description,
            "initial_price": self.initial_price,
            "price": self.price,
            "total_shares": self.total_shares,
            "remaining_shares": self.remaining_shares,
            "total_value": format_currency(self.total_value),
            "tag": self.tag.to_dict() if self.tag else None,
        }
