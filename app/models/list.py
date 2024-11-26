from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class List(db.Model):
    __tablename__ = 'lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100),nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('boards.id')), nullable=False)
    position = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # relationships
    board = db.relationship('Board', back_populates='lists')
    cards = db.relationship('Card', back_populates='list', cascade='all, delete-orphan')

    def to_dict(self, include_cards=False):
        list_dict = {
            'id': self.id,
            'title': self.title,
            'board_id': self.board_id,
            'position': self.position,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

        if include_cards:
            list_dict['cards'] = [card.to_dict() for card in self.cards]
            
        return list_dict