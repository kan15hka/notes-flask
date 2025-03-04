from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint
from schemas import NoteSchema, UserSchema
from models import Note
from db import db
from flask import jsonify
from models import User
note_blp = Blueprint("Note", __name__)


# POST
# Add Notes
@note_blp.route("/api/add_note", methods=['POST'])
@note_blp.response(201)
@note_blp.arguments(NoteSchema)
@jwt_required()
def add_note(note):
    try:
        print("kkkk")
        note_model = Note(title=note["title"], content=note["content"], tags=note["tags"],user_id=note["user_id"])
        db.session.add(note_model)
        db.session.commit()
        return {"message": "Note added successfully", "code": 201}
    except Exception as e:
        db.session.rollback()  # Ensure the transaction is rolled back in case of an error
        return jsonify({"message": f"Error adding note: {str(e)}", "code": 500}), 500


# PUT
# Update Notes
@note_blp.route("/api/update_note/<int:note_id>", methods=['PUT'])
@note_blp.response(200)
@note_blp.arguments(NoteSchema)
@jwt_required()
def update_note(note, note_id):
    try:
        db_note = Note.query.get_or_404(note_id)

        db_note.title = note.get("title")
        db_note.content = note.get("content")
        db_note.tags = note.get("tags")
        db.session.commit()

        return {
            "message": "Note updated successfully.",
            "code": 200,
            "note": {
                "id": db_note.id,
                "title": db_note.title,
                "content": db_note.content
            }
        }
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating note: {str(e)}", "code": 500}), 500


# DELETE
# Delete Notes
@note_blp.route("/api/delete_note/<int:note_id>", methods=['DELETE'])
@note_blp.response(200)
@jwt_required()
def delete_note(note_id):
    try:
        db_note = Note.query.get_or_404(note_id)
        db.session.delete(db_note)
        db.session.commit()
        return {
            "message": "Note deleted successfully.",
            "code": 200,
        }
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting note: {str(e)}", "code": 500}), 500


# GET
# Fetch Notes
@note_blp.route("/api/notes/<int:user_id>", methods=['GET'])
@note_blp.response(200, NoteSchema(many=True))
@jwt_required()
def get_note(user_id):
    try:
        db_user=User.query.get_or_404(user_id)
        print(db_user)
        notes = db_user.notes
        return notes
    except Exception as e:
        return jsonify({"message": f"Error retrieving notes: {str(e)}", "code": 500}), 500

#Admin Level Routes
#Get Notes
@note_blp.route('/api/notes', methods=['GET'])
@note_blp.response(200, NoteSchema(many=True))
def get_all_notes():
    try:
        notes = Note.query.all()
        return notes
    except Exception as e:
        return jsonify({"message": f"Error retrieving notes: {str(e)}", "code": 500}), 500

#Get Users
@note_blp.route('/api/users', methods=['GET'])
@note_blp.response(200, UserSchema(many=True,exclude=("notes",)))
def get_all_users():
    try:
        users = User.query.all()
        return users
    except Exception as e:
        return jsonify({"message": f"Error retrieving users: {str(e)}", "code": 500}), 500

# Get User Notes
@note_blp.route('/api/user_notes', methods=['GET'])
@note_blp.response(200, UserSchema(many=True))
def get_all_users_notes():
    try:
        users_notes = User.query.all()
        return users_notes
    except Exception as e:
        return jsonify({"message": f"Error retrieving users: {str(e)}", "code": 500}), 500
