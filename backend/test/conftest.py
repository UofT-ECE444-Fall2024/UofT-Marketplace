import json
import pytest
from src import create_app, db  # Absolute import path
from src.models import User, Item, ItemImage

LOCATIONS = [
    'Bahen',
    'University College',
    'Hart House',
    'Sid Smith',
    'Myhal',
    'Robarts'
]

CONDITIONS = [
    'New',
    'Used - Like New',
    'Used - Good',
    'Used - Fair',
]

@pytest.fixture
def client():
    # Set up the application in testing mode
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database

    with app.app_context():
        db.create_all()  # Create tables
        yield app.test_client()  # Provide the test client
        db.session.remove()  # Remove the session
        db.drop_all()  # Drop tables after tests are done


@pytest.fixture
def setup_data(client):
    # Mock data for testing
    # Register a user
    user_response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    user_id = user_response.get_json()['user']['id']

    # Add some items
    client.post('/api/listings', json={
        'user_id': user_id,
        'title': 'Test Item 1',
        'description': 'Description for item 1',
        'price': '$10.00',
        'location': ['University College', 'Sid Smith'],
        'condition': 'New',
        'category': 'Electronics',
        'images': []
    })
    
    client.post('/api/listings', json={
        'user_id': user_id,
        'title': 'Test Item 2',
        'description': 'Description for item 2',
        'price': '$20.00',
        'location': ['Bahen'],
        'condition': 'Used - Good',
        'category': 'Books',
        'images': []
    })
    
    # Return the user_id for use in other tests
    return user_id

  
@pytest.fixture
def setup_listing_data(client):
    # Create a user
    user_response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    user_id = user_response.get_json()['user']['id']

    # Create a listing for the user
    response = client.post('/api/listings', json={
        'user_id': user_id,
        'title': 'Test Item',
        'description': 'Description for test item',
        'price': '$20.00',
        'location': ['University College'],
        'condition': 'New',
        'category': 'Electronics',
        'images': []
    })
    item_id = response.get_json()['item']['id']

    return item_id

  
@pytest.fixture
def setup_rating_data(client):
    # Create a test user in the database with an initial rating and rating_count
    user_response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })

    # Get user data from the response
    user_data = user_response.get_json()['user']
    
    # Return user info as a dictionary, including initial rating and rating_count
    return {
        'id': user_data['id'],
        'username': user_data['username'],
        'rating': user_data.get('rating', 0.0),  # Set default to 0.0 if not provided
        'rating_count': user_data.get('rating_count', 0)  # Set default to 0 if not provided
    }
  