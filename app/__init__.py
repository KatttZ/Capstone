import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.board_routes import board_routes
from .api.list_routes import list_routes
from .api.card_routes import card_routes
from .api.comment_routes import comment_routes
from .seeds import seed_commands
from .config import Config
from flask_socketio import join_room, leave_room, send, SocketIO
from datetime import datetime

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(board_routes, url_prefix='/api/boards')
app.register_blueprint(list_routes, url_prefix='/api/lists')
app.register_blueprint(card_routes, url_prefix='/api/cards')
app.register_blueprint(comment_routes, url_prefix='/api/comments')
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

rooms = {}
@socketio.on('createRoom')
def handle_create_room(data):
    room_code = data['code']
    creator_name = data['name']
    
    if room_code in rooms:
        # Notify client if room already exists
        send({"name": "System", "message": "Room already exists."}, to=creator_name)
        return
    
    # Create a new room
    rooms[room_code] = {
        "members": 1,  # Creator counts as a member
        "messages": [],
        "creator": creator_name
    }
    join_room(room_code)
    print(f"Room {room_code} created by {creator_name}")
    send({"name": "System", "message": f"Room {room_code} created."}, to=creator_name)

@socketio.on('joinRoom')
def handle_join_room(data):
    room_code = data['code']
    username = data['name']
    
    # Check if the room exists
    if room_code not in rooms:
        # Send an error message back to the user
        send({"name": "System", "message": "Room does not exist."}, to=request.sid)
        print(f"Failed attempt: {username} tried to join non-existent room {room_code}.")
        return

    # Join the room
    join_room(room_code)
    rooms[room_code]["members"] += 1

    # Notify the room
    send({"name": "System", "message": f"{username} has joined the room."}, to=room_code)

    # Send the room's existing messages to the user
    for msg in rooms[room_code]["messages"]:
        send(msg, to=request.sid)
    
    print(f"{username} has successfully joined room {room_code}.")


@socketio.on('leaveRoom')
def handle_leave_room(data):
    room = data['code']
    username = data['name']
    
    if room not in rooms:
        print(f"Room {room} does not exist.")
        return
    
    leave_room(room)
    rooms[room]["members"] -= 1
    
    if rooms[room]["members"] <= 0:
        del rooms[room]
        print(f"Room {room} has been deleted due to no members.")
    else:
        send({"name": "System", "message": f"{username} has left the room."}, to=room)
    
    print(f"{username} has left room {room}.")


@socketio.on("message")
def handle_message(data):
    print("Received message:", data)  # Debug log
    room = data["room"]
    message = {
        "name": data["name"],
        "message": data["message"],
        "time": datetime.now().strftime("%H:%M"),
    }
    if room in rooms:
        rooms[room]["messages"].append(message)
    send(message, to=room)
    print(f"Sent message to room {room}: {message}")  # Debug log

if __name__ == '__main__':
    socketio.run(app, debug=True)