from .db import db, environment, SCHEMA, add_prefix_for_prod
from .base import BelongsToUser


class Leaderboard(BelongsToUser):
    __tablename__ = "leaderboard"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    net_worth = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "net_worth": self.net_worth
        }
