from db import db
from sqlalchemy.sql import func
class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True ,autoincrement=True)
    title = db.Column(db.String(50), unique=True, nullable=False)
    content = db.Column(db.Text, unique=True, nullable=False)
    created_at=db.Column(db.DateTime,default=func.now(), nullable=False, )
    tags=db.Column(db.String(200),nullable=False)

    user_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)



