
from marshmallow import Schema, fields, post_dump
from datetime import datetime


class NoteSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    content = fields.Str()
    created_at = fields.DateTime()
    tags = fields.Str()

    tags_list = fields.Method("get_tags_list")
    created_date = fields.Method("format_created_date")
    created_time = fields.Method("format_created_time")
    user_id = fields.Int(required=True)
    # author = fields.Nested(UserSchema(only=("id", "username")))  # Include user info in Note responses

    def format_created_date(self, obj):
        return obj.created_at.strftime("%d-%m-%Y")

    def format_created_time(self, obj):
        return obj.created_at.strftime("%I:%M %p")

    def get_tags_list(self,obj):
        tags_list=obj.tags.split(',')
        return tags_list

class UserSchema(Schema):
    id=fields.Int()
    username=fields.Str()
    password=fields.Str()
    notes = fields.List(fields.Nested(NoteSchema()))  # Prevent circular dependency
    # notes = fields.List(fields.Nested(lambda: NoteSchema(exclude=("author",))))  # Prevent circular dependency