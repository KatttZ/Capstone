from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text


def seed_boards():
    board1 = Board(title='Personal Tasks', user_id=1)
    board2 = Board(title='Work Tasks', user_id=2)
    board3 = Board(title='Project Management', user_id=3)
    board4 = Board(title='Grocery List', user_id=1)
    board5 = Board(title='Job Search', user_id=1)
    board6 = Board(title='Vacation Planning', user_id=2)
    

    db.session.add_all([board1, board2, board3, board4, board5, board6])
    db.session.commit()




def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
    
    db.session.commit()


    