from flask import Blueprint,request
from flask_login import login_required, current_user
from app.models import db, Card, Comment
from datetime import datetime


card_routes = Blueprint('cards', __name__)


@card_routes.route('/<int:card_id>', methods=['GET'])
@login_required
def get_card(card_id):
    """
    Get a specific card by id
    """
    card = Card.query.get(card_id)
    if not card:
        return {'errors': 'Card not found'}, 404
    if card.list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    return card.to_dict()


@card_routes.route('/<int:card_id>', methods=['PUT'])
@login_required
def update_card(card_id):
    """
    Update a specific card by id
    """
    card = Card.query.get(card_id)
    if not card:
        return {'errors': 'Card not found'}, 404
    if card.list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    data = request.get_json()
    
    # Update basic attributes
    card.title = data['title']
    card.description = data.get('description', '')
    
    new_position = data.get('position', card.position)
    new_list_id = data.get('list_id', card.list_id)

    if new_list_id != card.list_id or new_position != card.position:
        # Update card's list and position
        if new_list_id != card.list_id:
            # Remove card from current list and adjust positions
            current_list_cards = Card.query.filter_by(list_id=card.list_id).order_by(Card.position).all()
            for idx, c in enumerate(current_list_cards):
                if c.id != card_id:
                    c.position = idx + 1
            card.list_id = new_list_id

        # Insert card into new list and adjust positions
        new_list_cards = Card.query.filter_by(list_id=new_list_id).order_by(Card.position).all()
        for idx, c in enumerate(new_list_cards):
            if idx + 1 >= new_position:
                c.position = idx + 2
            else:
                c.position = idx + 1
        card.position = new_position

    db.session.commit()
    return card.to_dict()



@card_routes.route('/<int:card_id>', methods=['DELETE'])
@login_required
def delete_card(card_id):
    """
    Delete a specific card by id and reorder remaining cards in the list
    """
    card = Card.query.get(card_id)
    if not card:
        return {'errors': 'Card not found'}, 404
    if card.list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    # Reorder remaining cards in the same list
    remaining_cards = Card.query.filter(
        Card.list_id == card.list_id, 
        Card.position > card.position
    ).order_by(Card.position).all()

    for idx, remaining_card in enumerate(remaining_cards):
        remaining_card.position = card.position + idx

    db.session.delete(card)
    db.session.commit()
    return {'message': 'Card deleted'}  





#================================Comment related routes==============================


@card_routes.route('/<int:card_id>/comments', methods=['GET'])
@login_required
def get_card_comments(card_id):
    """
    Get all comments from a specific card
    """
    card = Card.query.get(card_id)
    if not card:
        return {'errors': 'Card not found'}, 404
    if card.list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    comments = Comment.query.filter(Comment.card_id == card_id).order_by(Comment.created_at.desc()).all()

    return {'comments': [comment.to_dict() for comment in comments]}



@card_routes.route('/<int:card_id>/comments', methods=['POST'])
@login_required
def create_comment(card_id):
    """
    Create a new comment on a card
    """
    card = Card.query.get(card_id)
    if not card:
        return {'errors': 'Card not found'}, 404
    if card.list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    data = request.get_json()
    if not data['content']:
        return {'errors': 'Content is required'}, 400
    
    comment = Comment(
        content = data['content'],
        card_id = card_id,
        user_id = current_user.id,
        created_at = datetime.utcnow(),
        updated_at = datetime.utcnow()
    )

    db.session.add(comment)
    db.session.commit()
    return comment.to_dict()