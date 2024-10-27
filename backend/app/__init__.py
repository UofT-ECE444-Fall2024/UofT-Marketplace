from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    # Store users in memory (replace with database in production)
    app.config['USERS'] = {
        'admin': 'admin'  # default admin user
    }

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.bp)

    return app