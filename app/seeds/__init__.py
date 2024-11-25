from flask.cli import AppGroup
from .seed_users import seed_users, undo_users
from .seed_stocks import seed_stocks, undo_stocks
from .seed_tags import seed_tags, undo_tags
# from .seed_usershares import seed_usershares, undo_usershares
# from .seed_transactions import seed_transactions, undo_transactions
from .seed_saves import seed_saves, undo_saves

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
            undo_saves()
            # undo_transactions()
            # undo_usershares()
            undo_stocks()
            undo_tags()
            undo_users()
    seed_users()
    seed_tags()
    seed_stocks()
    # seed_usershares()
    # seed_transactions()
    seed_saves()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_saves()
    # undo_transactions()
    # undo_usershares()
    undo_stocks()
    undo_tags()
    undo_users()
    # Add other undo functions here