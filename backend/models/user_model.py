from enum import unique

from sqlalchemy.orm import backref

from db import db

class User(db.Model):
    __tablename__="users"

    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    username=db.Column(db.String(50),unique=True,nullable=False)
    password=db.Column(db.String(100),nullable=False)

    notes=db.relationship("Note",lazy=True)
    # notes=db.relationship("Note",backref="author",lazy=True)
