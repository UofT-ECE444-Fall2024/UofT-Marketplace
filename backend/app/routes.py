from flask import jsonify, current_app, request

@current_app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username == current_app.config['USERNAME'] and password == current_app.config['PASSWORD']:
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

@current_app.route('/')
def home():
    return jsonify({"message": "Hello World!"})