from flask import Flask
from flask_cors import CORS
from app.models import db, User

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # danger?!?!!? who knows
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Database configuration
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    # Create tables and admin user
    with app.app_context():
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
                is_admin=True
            )
            admin_user.set_password('admin')
            db.session.add(admin_user)
            db.session.commit()

    from app import routes
    app.register_blueprint(routes.bp)

    return app
