from flask import abort, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, get_jwt_identity
from flask_smorest import Blueprint
from passlib.handlers.pbkdf2 import pbkdf2_sha256
from sqlalchemy.exc import IntegrityError
import re
from datetime import timedelta

from blocklist import BLOCKLIST
from models import User
from schemas import UserSchema
from db import db


def is_strong_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):  # At least one uppercase letter
        return False
    if not re.search(r"[a-z]", password):  # At least one lowercase letter
        return False
    if not re.search(r"\d", password):  # At least one digit
        return False
    return True


user_blp = Blueprint("User", __name__)

##SIGNUP
@user_blp.route("/api/signup", methods=['POST'])
@user_blp.arguments(UserSchema)
@user_blp.response(201)
def user_signup(user):
    try:
        username = user["username"].lower()
        password = user["password"]
    except KeyError:
        return jsonify({"message": "Invalid request body. Ensure 'username' and 'password' are provided."}), 400

    # Validate password strength
    if not is_strong_password(password):
        return jsonify({"message": "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number."}), 400

    # Check if username exists
    if not username or len(username) < 3:  # Username should be at least 3 characters long
        return jsonify({"message": "Username must be at least 3 characters long."}), 400

    user= User.query.filter(User.username==username).first()
    if user:
        return jsonify({"message": "User with that username already exists."}), 409

    try:
        # Hash the password
        hashed_password = pbkdf2_sha256.hash(password)

        # Create a new user model instance
        user_model = User(username=username, password=hashed_password)
        db.session.add(user_model)
        db.session.commit()

        # Create access token with expiration time
        access_expires_in = timedelta(minutes=15)
        refresh_expires_in = timedelta(days=7)

        access_token = create_access_token(identity=username, fresh=True, expires_delta=access_expires_in)
        refresh_token = create_refresh_token(identity=username, expires_delta=refresh_expires_in)

        # Successful response
        return jsonify({
            "code": 201,
            "id": user_model.id,
            "username": user_model.username,
            "message": "User SignUp successful.",
            "access_token": access_token,
            "refresh_token":refresh_token,
            "access_expires": access_expires_in.total_seconds(),
            "refresh_expires": refresh_expires_in.total_seconds()
        })

    except IntegrityError as e:
        return jsonify({"message": "User with that username already exists."}), 409
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

##LOGIN
@user_blp.route("/api/login",methods=['POST'])
@user_blp.response(200)
def user_login(user):
    try:
        username=user["username"].lower()
        password=user["password"]

        db_user=User.query.filter(User.username==username).first()

        if db_user and pbkdf2_sha256.verify(password,db_user.password):
            access_expires_in = timedelta(minutes=15)
            refresh_expires_in = timedelta(days=7)

            access_token = create_access_token(identity=username, fresh=True, expires_delta=access_expires_in)
            refresh_token=create_refresh_token(identity=username,expires_delta=refresh_expires_in)
            return jsonify({
                "code": 201,
                "id": db_user.id,
                "username": username,
                "message": "User login successful.",
                "access_token": access_token,
                "refresh_token":refresh_token,
                "access_expires": access_expires_in.total_seconds(),
                "refresh_expires": refresh_expires_in.total_seconds()
            })

        return jsonify({"message":"Invalid username or password"}),401


    except KeyError:
        return jsonify({"message": "Invalid request body. Ensure 'username' and 'password' are provided."}), 400
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

##LOGOUT
@user_blp.route("/api/logout",methods=['POST'])
@user_blp.response(200)
@jwt_required()
def user_logout():
    try:
        # Get the JWT token from the request
        token = get_jwt()
        BLOCKLIST.add(token["jti"]) # "jti" is a unique identifier for the token
        return jsonify({"message":"User logout successful."}),200
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500

@user_blp.route("/api/logout-refresh",methods=['POST'])
@user_blp.response(200)
@jwt_required(refresh=True)
def refresh_logout():
    try:
        # Get the JWT token from the request
        token = get_jwt()
        BLOCKLIST.add(token["jti"]) # "jti" is a unique identifier for the token
        return jsonify({"message":"Refresh token revoked."}),200
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500




#Generate new access token
@user_blp.route("/api/refresh",methods=['POST'])
@jwt_required(refresh=True)
def refresh_access_token():
    try:
        username=get_jwt_identity()
        access_expires_in=timedelta(minutes=15)
        new_access_token=create_access_token(identity=username,fresh=False,expires_delta=access_expires_in)

        return jsonify({"access_token":new_access_token,"access_expires":access_expires_in.total_seconds()})
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
