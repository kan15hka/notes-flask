from datetime import timedelta

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from sqlalchemy import URL
from blocklist import BLOCKLIST
from db import db
from flask_smorest import Api
from flask_cors import CORS
from resources import note_blp, user_blp
from jwt_callbacks import (
    expired_token_callback,
    invalid_token_callback,
    missing_token_callback,
    needs_fresh_token_callback,
    revoked_token_callback,
    access_token_expires_callback,
    custom_error_handler,
    token_not_found_callback
)


def create_app():
    app = Flask(__name__)
    CORS(app, origins="http://localhost:5173")

    url = URL.create(
        drivername="postgresql+psycopg2",
        username="postgres",
        password="Welcome@123!",
        host="localhost",
        port=5432,
        database="notes_db"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = url
    app.config["API_TITLE"] = "Flask Rest API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["JWT_SECRET_KEY"] = "1234567890qwerty"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    api = Api(app)

    api.register_blueprint(note_blp)
    api.register_blueprint(user_blp)

    jwt = JWTManager(app)

    # Register the JWT callback functions
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    jwt.expired_token_loader(expired_token_callback)
    jwt.invalid_token_loader(invalid_token_callback)
    jwt.unauthorized_loader(missing_token_callback)
    jwt.needs_fresh_token_loader(needs_fresh_token_callback)
    jwt.revoked_token_loader(revoked_token_callback)
    jwt.expired_token_loader(access_token_expires_callback)

    return app

