from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_comments():
    comment1 = Comment(content='This task is urgent!', card_id=1, user_id=1)
    comment2 = Comment(content='Please provide more details here', card_id=1, user_id=2)
    comment3 = Comment(content='This is a third comment', card_id=2, user_id=1)
    comment4 = Comment(content='This is a fourth comment', card_id=2, user_id=2)
    comment5 = Comment(content='This is a fifth comment', card_id=3, user_id=1)
    comment6 = Comment(content='This is a sixth comment', card_id=3, user_id=2)
    comment7 = Comment(content='This is a seventh comment', card_id=4, user_id=1)
    comment8 = Comment(content='This is an eighth comment', card_id=4, user_id=2)
    comment9 = Comment(content='This is a ninth comment', card_id=5, user_id=1)
    comment10 = Comment(content='This is a tenth comment', card_id=5, user_id=2)
    comment11 = Comment(content='This is an eleventh comment', card_id=6, user_id=1)
    comment12 = Comment(content='This is a twelfth comment', card_id=6, user_id=2)



    db.session.add_all([comment1, comment2, comment3, 
                        comment4, comment5, comment6, 
                        comment7, comment8, comment9, 
                        comment10, comment11, comment12])
    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
    
    db.session.commit()