from flask import Blueprint, jsonify, current_app, request
from app.models import db, User

bp = Blueprint('main', __name__)

@bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    full_name = data.get('full_name')
    email = data.get('email')

    if not all([username, password, full_name, email]):
        return jsonify({
            'status': 'error',
            'message': 'All fields are required'
        }), 400
        
    if User.query.filter_by(username=username).first():
        return jsonify({
            'status': 'error',
            'message': 'Username already exists'
        }), 409
        
    new_user = User(
        username=username,
        full_name=full_name,
        email=email,
        verified=False,
        description=''
    )
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    user_data = {
        'username': username,
        'full_name': full_name,
        'verified': False,
        'description': ''
    }
    
    return jsonify({
        'status': 'success',
        'message': 'Registration successful',
        'user': user_data
    }), 201

@bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        user_data = {
            'username': user.username,
            'full_name': user.full_name,
            'verified': user.verified,
            'description': user.description,
            'is_admin': user.is_admin
        }
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': user_data
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Invalid username or password'
        }), 401
@bp.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    if username not in current_app.config['USERS']:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        }), 404
        
    user_data = {
        'username': username,
        'full_name': current_app.config['USERS'][username]['full_name'],
        'verified': current_app.config['USERS'][username]['verified'],
        'description': current_app.config['USERS'][username].get('description', '')
    }
    
    return jsonify({
        'status': 'success',
        'user': user_data
    }), 200
    
@bp.route('/')
def home():
    return jsonify({"message": "Hello World!"})

####################################DEBUGGING############################
@bp.route('/api/debug/users', methods=['GET'])
def debug_users():
    # Only allow in development environment!
        
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'verified': user.verified,
        'is_admin': user.is_admin
    } for user in users]
    
    return jsonify({
        'user_count': len(user_list),
        'users': user_list
    })