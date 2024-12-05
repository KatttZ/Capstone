from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Card(db.Model):
    __tablename__ = 'cards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    list_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('lists.id')), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # relationships
    list = db.relationship('List', back_populates='cards')
    comments = db.relationship('Comment', back_populates='card', cascade='all, delete-orphan')
    # labels = db.relationship('Label', secondary='card_labels', back_populates='cards')

    def to_dict(self, include_comments=False):
        card_dict = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'list_id': self.list_id,
            'position': self.position,
            "due_date": self.due_date,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

        if include_comments:
            card_dict['comments'] = [comment.to_dict() for comment in self.comments]
       
        # if include_labels:
        #     card_dict['labels'] = [label.to_dict() for label in self.labels]
        
        return card_dict
    
