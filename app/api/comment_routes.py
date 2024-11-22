from flask import Blueprint,request
from flask_login import login_required, current_user
from app.models import db, Comment
from datetime import datetime



comment_routes = Blueprint('comments', __name__)

@comment_routes.route('/<int:comment_id>', methods=['GET'])
@login_required
def get_comment(comment_id):
    """
    Get a comment by id
    """
    comment = Comment.query.get(comment_id)
    if not comment:
        return {'message': 'Comment not found'}, 404
    return comment.to_dict()



@comment_routes.route('/<int:comment_id>', methods=['PUT'])
@login_required
def update_comment(comment_id):
    """
    Update a specific comment by id
    """
    comment = Comment.query.get(comment_id)
    if not comment:
        return {'errors': 'Comment not found'}, 404
    if comment.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    data = request.get_json()
    if not data['content']:
        return {'errors': 'Content is required'}, 400
    comment.content = data['content']
    comment.updated_at = datetime.utcnow()

    db.session.commit()
    return comment.to_dict()



@comment_routes.route('/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    """
    Delete a specific comment by id
    """
    comment = Comment.query.get(comment_id)
    if not comment:
        return {'errors': 'Comment not found'}, 404
    if comment.user_id != current_user.id:
        return {'errors': 'Unauthorized'}, 401

    db.session.delete(comment)
    db.session.commit()
    return {'message': 'Comment deleted'}