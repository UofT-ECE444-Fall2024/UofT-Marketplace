from flask import Blueprint, jsonify, current_app, request

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
        
    if username in current_app.config['USERS']:
        return jsonify({
            'status': 'error',
            'message': 'Username already exists'
        }), 409
        
    current_app.config['USERS'][username] = {
        'password': password,
        'full_name': full_name,
        'email': email,
        'verified': False,
        'description': ''  # Added default description
    }
    
    # Create response without sensitive information
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
    
    if username in current_app.config['USERS'] and current_app.config['USERS'][username]['password'] == password:
        user_data = {
            'username': username,
            'full_name': current_app.config['USERS'][username]['full_name'],
            'verified': current_app.config['USERS'][username]['verified'],
            'description': current_app.config['USERS'][username].get('description', '')
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