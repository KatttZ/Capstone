from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Board(db.Model):
    __tablename__ = 'boards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)




    #relationships
    owner = db.relationship('User', back_populates='boards')
    lists = db.relationship('List', back_populates='board', cascade='all, delete-orphan')

    def to_dict(self, include_lists=False):
        board_dict = {
            'id': self.id,
            'title': self.title,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

        if include_lists:
            board_dict['lists'] = [list.to_dict() for list in self.lists]
            
        return board_dict