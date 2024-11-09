import os
from pathlib import Path
from flask import Flask
from flask_cors import CORS
from src.models import db, User
from datetime import datetime
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    basedir = Path(__file__).resolve().parent
    DATABASE = "flaskr.db"
    db_uri = os.getenv("DATABASE_URL", f"sqlite:///{Path(basedir).joinpath(DATABASE)}")
    
    # Database configuration
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    socketio.init_app(app)
    
    # Create tables and admin user
    with app.app_context():
        from src.models import db, User

        # Initialize database
        db.init_app(app)

        db.create_all()
        
        # Check if admin user exists, if not create it
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                full_name='Admin User',
                email='admin@example.com',
                verified=True,
                description='Admin user description',
                is_admin=True,
                rating=0.0,
                rating_count=0,
            )
            admin_user.set_password('admin')
            db.session.add(admin_user)
            db.session.commit()

    from src import routes
    app.register_blueprint(routes.bp)

    return app
