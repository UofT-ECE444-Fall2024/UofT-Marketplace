from flask import Blueprint, jsonify, current_app, request

bp = Blueprint('main', __name__)

@bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in current_app.config['USERS'] and current_app.config['USERS'][username] == password:
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': {'username': username}
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Invalid username or password'
        }), 401

@bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({
            'status': 'error',
            'message': 'Username and password are required'
        }), 400
        
    if username in current_app.config['USERS']:
        return jsonify({
            'status': 'error',
            'message': 'Username already exists'
        }), 409
        
    current_app.config['USERS'][username] = password
    return jsonify({
        'status': 'success',
        'message': 'Registration successful',
        'user': {'username': username}
    }), 201
    
@bp.route('/')
def home():
    return jsonify({"message": "Hello World!"})