from flask import Blueprint,request
from flask_login import login_required, current_user
from app.models import db, List, Card



list_routes = Blueprint('lists', __name__)

@list_routes.route('/<int:list_id>', methods=['GET'])
@login_required
def get_list(list_id):
    """
    Get a specific list by id
    """
    list = List.query.get(list_id)
    if not list:
        return {'errors': 'List not found'}, 404
    if list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    return list.to_dict(include_cards=True)


@list_routes.route('/<int:list_id>', methods=['PUT'])
@login_required
def update_list(list_id):
    """
    Update a specific list by id
    """
    list = List.query.get(list_id)
    if not list:
        return {'errors': 'List not found'}, 404
    if list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    data = request.get_json()
    # Check if position is being changed
    if 'position' in data and data['position'] != list.position:
        board_id = list.board_id
        new_position = data['position']
        
        # Determine direction of movement
        if new_position > list.position:
            # Moving down the list
            List.query.filter(
                List.board_id == board_id,
                List.position > list.position,
                List.position <= new_position
            ).update({List.position: List.position - 1}, synchronize_session='fetch')
        else:
            # Moving up the list
            List.query.filter(
                List.board_id == board_id,
                List.position < list.position,
                List.position >= new_position
            ).update({List.position: List.position + 1}, synchronize_session='fetch')
        
        list.position = new_position

    # Update other fields
    list.title = data['title']
    
    db.session.commit()
    return list.to_dict()


@list_routes.route('/<int:list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    """
    Delete a specific list by id and reorder remaining lists
    """
    list = List.query.get(list_id)
    if not list:
        return {'errors': 'List not found'}, 404
    if list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    # Reorder remaining lists
    remaining_lists = List.query.filter(
        List.board_id == list.board_id, 
        List.position > list.position
    ).order_by(List.position).all()

    for idx, remaining_list in enumerate(remaining_lists):
        remaining_list.position = list.position + idx

    db.session.delete(list)
    db.session.commit()
    return {'message': 'List deleted'}





#================================Card related routes==============================

@list_routes.route('/<int:list_id>/cards', methods=['GET'])
@login_required
def get_list_cards(list_id):
    """
    Get all cards from a specific list
    """
    list = List.query.get(list_id)
    if not list:
        return {'errors': 'List not found'}, 404
    if list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401
    
    cards = Card.query.filter(Card.list_id == list_id).order_by(Card.position).all()

    return {'cards': [card.to_dict() for card in cards]}


@list_routes.route('/<int:list_id>/cards', methods=['POST'])
@login_required
def create_card(list_id):
    """
    Create a new card in a specific list
    """
    list = List.query.get(list_id)
    if not list:
        return {'errors': 'List not found'}, 404
    if list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    data = request.get_json()
    if 'title' not in data:
        return {'errors': 'Title is required'}, 400
    
   # Find the desired position
    max_position = db.session.query(db.func.max(Card.position)).filter(Card.list_id == list_id).scalar()
    desired_position = data.get('position', (max_position or 0) + 1)

    # Shift existing cards to make room for the new card
    Card.query.filter(
        Card.list_id == list_id, 
        Card.position >= desired_position
    ).update({Card.position: Card.position + 1}, synchronize_session='fetch')

    card = Card(
        title=data['title'],
        description=data.get('description', ''),
        position=desired_position,
        list_id=list_id
    )
    
    db.session.add(card)
    db.session.commit()
    return card.to_dict()

@list_routes.route('/<int:list_id>/cards/reorder', methods=['PUT'])
@login_required
def reorder_cards(list_id):
    list = List.query.get(list_id)
    if not list or list.board.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    data = request.get_json()
    card_order = data.get('cardOrder')
    
    if not card_order:
        return {'errors': 'Card order is required'}, 400

    # Update positions
    for index, card_id in enumerate(card_order, start=1):
        card = Card.query.get(card_id)
        if card and card.list_id == list_id:
            card.position = index

    db.session.commit()
    return {'cards': [card.to_dict() for card in Card.query.filter_by(list_id=list_id).order_by(Card.position).all()]}