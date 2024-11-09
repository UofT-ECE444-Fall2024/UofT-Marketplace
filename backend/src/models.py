from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    verified = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text, default='')
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password_hash': self.password_hash,
            'full_name': self.full_name,
            'email': self.email,
            'verified': self.verified,
            'description': self.description,
            'is_admin': self.is_admin
        }

class Item(db.Model):
    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    condition = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='Available')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    images = db.relationship('ItemImage', backref='item', lazy=True, cascade='all, delete-orphan')

    # Add a relationship to reference the user (seller)
    seller = db.relationship('User', backref='items')
    favorited_by = db.relationship('User', secondary='favorites', lazy='dynamic')


    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'price': f'${self.price}',
            'location': self.location,
            'description': self.description,
            'condition': self.condition,
            'category': self.category,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'favorite_count': len(self.favorites),
            'seller': {
                'id': self.seller.id,
                'username': self.seller.username,
                'full_name': self.seller.full_name,
                'email': self.seller.email,
                'description': self.seller.description,
                'verified': self.seller.verified
            }
        }

class ItemImage(db.Model):
    __tablename__ = 'item_images'
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=False)
    content_type = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    # Add unique constraint to prevent duplicate favorites
    __table_args__ = (db.UniqueConstraint('user_id', 'item_id'),)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('favorites', lazy=True))
    item = db.relationship('Item', backref=db.backref('favorites', lazy=True))