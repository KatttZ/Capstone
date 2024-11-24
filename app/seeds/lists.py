from app.models import db, List, environment, SCHEMA
from sqlalchemy.sql import text



def seed_lists():
    list1 = List(title='To Do', board_id=1, position=1)
    list2 = List(title='In Progress', board_id=1, position=2)
    list3 = List(title='Done', board_id=1, position=3)
    list4 = List(title='To Do', board_id=2, position=1)


    db.session.add_all([list1, list2, list3, list4])
    db.session.commit()


def undo_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lists"))

    db.session.commit()