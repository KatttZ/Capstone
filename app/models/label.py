# from .db import db, environment, SCHEMA, add_prefix_for_prod

# # TODO: Label feature - database structure in place for future implementation

# class Label(db.Model):
#     __tablename__ = 'labels'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}
    
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False, unique=True)
  
#     # relationships
#     cards = db.relationship('Card', secondary='card_labels', back_populates='labels')

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'name': self.name
#         }

# card_labels = db.Table(
#     'card_labels',
#     db.Model.metadata,
#     db.Column('card_id', db.Integer, db.ForeignKey(add_prefix_for_prod('cards.id')), primary_key=True),
#     db.Column('label_id', db.Integer, db.ForeignKey(add_prefix_for_prod('labels.id')), primary_key=True)
# )