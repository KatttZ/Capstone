from app.models import db, Card, environment, SCHEMA
from sqlalchemy.sql import text


def seed_cards():
    card1 = Card(title='Project Planning', description='Plan out the project', list_id=1, position=1)
    card2 = Card(title='Create Database', description='Create the database schema', list_id=1, position=2)
    card3 = Card(title='Seed Database', description='Seed the database with data', list_id=1, position=3)
    card4 = Card(title='Create Routes', description='Create the routes for the project', list_id=2, position=1)
    card5 = Card(title='Create Components', description='Create the components for the project', list_id=2, position=2)
    card6 = Card(title='Create Redux Store', description='Create the redux store for the project', list_id=2, position=3)
    card7 = Card(title='Create Styling', description='Create the styling for the project', list_id=3, position=1)
    card8 = Card(title='Revise Resume', description='Revise resume for job applications', list_id=9, position=1)
    card9 = Card(title='Health Insurance', description='Sign up for health insurance', list_id=9, position=2)

    db.session.add_all([card1, card2, card3, card4, card5, card6, card7, card8, card9])
    db.session.commit()


def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))

    db.session.commit()
    