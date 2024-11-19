from flask.cli import AppGroup
# from .users import seed_users, undo_users
from .seed_lists import users, stocks, usershares, transactions, tags ,saves
from app.models.db import db, environment, SCHEMA
from .seed_funcs import seed_data, undo_data
from app.models import db, User, Stock, Usershare, Transaction, Tag ,Save
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
        # undo_users()
        undo()
    # seed_users()
    # Add other seed functions here
    seed_data(users, User)
    seed_data(stocks, Stock)
    seed_data(usershares, Usershare)
    seed_data(transactions, Transaction)
    seed_data(tags, Tag)
    seed_data(saves, Save)

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    # undo_users()
    # Add other undo functions here
    undo_data("users")
    undo_data("stocks")
    undo_data("user_shares")
    undo_data("transactions")
    undo_data("tags")
    undo_data("saves")
