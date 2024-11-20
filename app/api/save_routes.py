from flask import Blueprint, request,jsonify
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

save_routes = Blueprint("save", __name__)


@save_routes.route("/")
def get_all_saves():
    return jsonify({'hello':"hi"})