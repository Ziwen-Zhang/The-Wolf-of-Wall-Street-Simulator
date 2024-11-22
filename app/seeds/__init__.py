from flask.cli import AppGroup
from .seed_lists import users, stocks, usershares, transactions, tags, saves
from .seed_funcs import seed_data, undo_data
from app.models import db, User, Stock, Usershare, Transaction, Tag, Save
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# Create a seed group to hold our commands
seed_commands = AppGroup('seed')

# Create the `flask seed all` command
@seed_commands.command('all')
def all():
    """Seed all data."""
    if environment == 'production':
        # Before seeding in production, you might want to run the seed undo command
        undo()
    # Seed data
    seed_data(users, User)
    seed_data(stocks, Stock)
    seed_data(usershares, Usershare)
    seed_data(transactions, Transaction)
    seed_data(tags, Tag)
    seed_data(saves, Save)
    print("Seeded all data.")

# Create the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    """Undo seeded data."""
    # Undo data
    undo_data("users")
    undo_data("stocks")
    undo_data("user_shares")
    undo_data("transactions")
    undo_data("tags")
    undo_data("saves")
    print("Undid all data.")
