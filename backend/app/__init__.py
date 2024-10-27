from flask import Flask
from flask_cors import CORS  # You'll need to install this: pip install flask-cors

def create_app():
    app = Flask(__name__)
    # Enable CORS for development
    CORS(app)
    
    # Add configuration
    app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
    app.config['USERNAME'] = 'admin'
    app.config['PASSWORD'] = 'admin'

    with app.app_context():
        from . import routes

    return app