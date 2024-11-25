from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    credential = field.data  # This can be either email or username
    user = User.query.filter(
        (User.email == credential) | (User.username == credential)
    ).first()
    if not user:
        raise ValidationError("Username/Email not found.")


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    credential = form.data["credential"]
    user = User.query.filter(
        (User.email == credential) | (User.username == credential)
    ).first()
    if user and not user.check_password(password):
        raise ValidationError('Password was incorrect.')


class LoginForm(FlaskForm):
    credential = StringField('credential', validators=[DataRequired(), user_exists])
    password = PasswordField('password', validators=[DataRequired(), password_matches])