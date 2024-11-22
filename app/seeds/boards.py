from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text


def seed_boards():
    board1 = Board(title='Personal Tasks', user_id=1)
    board2 = Board(title='Work Tasks', user_id=2)
    board3 = Board(title='Project Management', user_id=3)

    db.session.add_all([board1, board2, board3])
    db.session.commit()




def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
    
    db.session.commit()


    