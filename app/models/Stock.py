from .db import db, environment, SCHEMA, add_prefix_for_prod
from typing import Any, Dict
from .base import Base


class Stock(Base):
    __tablename__ = "stocks"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    name = db.Column(db.String, nullable=False)
    symbol = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    total_value = db.Column(db.Integer, nullable=False)
    user_shares = db.relationship("Usershare", back_populates="stock")

    tag = db.relationship("Tag", back_populates="stocks")
    tag_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "symbol": self.symbol,
            "description": self.description,
            "price": self.price,
            "total_value": self.total_value,
            "tag": self.tag.to_dict() if self.tag else None,
        }
