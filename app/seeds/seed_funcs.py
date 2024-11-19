from app.models import db
from sqlalchemy.sql import text
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


def seed_data(data_list, Model):
    for entry in data_list:
        instance = Model(**entry)
        db.session.add(instance)
    db.session.commit()


def undo_data(table_name):
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.{table_name} RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text(f"DELETE FROM {table_name}"))
    db.session.commit()
