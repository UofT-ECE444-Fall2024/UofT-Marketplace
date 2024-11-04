from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

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
    item_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    # add more fields here

    def __init__(self, title, description):
        self.title = title
        self.description = text

    def __repr__(self):
        return f'<title {self.title}>'
