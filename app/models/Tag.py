from .db import db, SCHEMA, environment, add_prefix_for_prod
from sqlalchemy.sql import func
from .base import Base


class Tag(Base):
    __tablename__ = "tags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))

    stocks = db.relationship("Stock", back_populates="tag", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }
