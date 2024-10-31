from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    # Store users with extended profile information
    app.config['USERS'] = {
        'admin': {
            'password': 'admin',
            'full_name': 'Admin User',
            'email': 'admin@example.com',
            'verified': True,
            'description': 'Admin user description' 
        }
    }

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.bp)

    return app
