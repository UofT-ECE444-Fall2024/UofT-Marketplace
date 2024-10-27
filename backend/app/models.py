from app.api import db

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