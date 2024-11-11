from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    full_name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    verified = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text, default='')
    is_admin = db.Column(db.Boolean, default=False)
    joined_on = db.Column(db.DateTime, default=datetime.utcnow)

    # Rating attributes
    rating = db.Column(db.Float, nullable=False, default=0.0)
    rating_count = db.Column(db.Integer, nullable=False, default=0)

    auth_type = db.Column(db.String(20), default='local')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:  # Handle OAuth users who don't have a password
            return False
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
            'is_admin': self.is_admin,
            'rating': self.rating,
            'rating_count': self.rating_count,
            'joined_on': self.joined_on
        }
    
"""
1. Items Table: This table stores information about items listed for sale.

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),  -- seller
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),  -- e.g., 'Furniture', 'Electronics'
    price DECIMAL(10, 2),
    condition VARCHAR(50),  -- e.g., 'New', 'Like New', 'Used'
    pickup_location VARCHAR(255),  -- predefined secure locations
    status VARCHAR(50) DEFAULT 'Available',  -- e.g., 'Available', 'Reserved', 'Sold'
    urgent BOOLEAN DEFAULT FALSE,  -- whether listing is urgent
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
"""
class Item(db.Model):
    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    location = db.Column(JSON, nullable=False)  # Use JSON to store multiple locations
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
            'location': self.location,  # Already JSON serializable if it's a list
            'description': self.description,
            'condition': self.condition,
            'category': self.category,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'favorite_count': len(self.favorites),
            'seller': self.seller.to_dict(),
            'images': [img.image_url for img in self.images]
        }

class ItemImage(db.Model):
    __tablename__ = 'item_images'
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
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
    user = db.relationship('User', backref=db.backref('favorites', lazy=True, overlaps="favorited_by"), overlaps="favorited_by")
    item = db.relationship('Item', backref=db.backref('favorites', lazy=True, overlaps="favorited_by"), overlaps="favorited_by")