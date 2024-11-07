import json
import pytest
from app import create_app, db  # Adjusted import path
from app.models import User, Item, ItemImage

@pytest.fixture
def client():
    # Set up the application in testing mode
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    # Use the app context for setting up and tearing down the database
    with app.app_context():
        db.create_all()  # Create tables
        yield app.test_client()  # Provide the test client
        db.session.remove()  # Remove the session
        db.drop_all()  # Drop tables after tests are done

def test_register(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    data = response.get_json()
    assert response.status_code == 201
    assert data['status'] == 'success'
    assert data['message'] == 'Registration successful'
    assert data['user']['username'] == 'testuser'

def test_login(client):
    # Register a new user first
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    
    # Attempt to log in with the registered user
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    data = response.get_json()
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['message'] == 'Login successful'
    assert data['user']['username'] == 'testuser'

def test_get_profile(client):
    # Register a new user
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    
    # Retrieve the user's profile
    response = client.get('/api/profile/testuser')
    data = response.get_json()
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['user']['username'] == 'testuser'
    assert data['user']['full_name'] == 'Test User'

def test_create_listing(client):
    # Register a user first
    register_response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    user_id = register_response.get_json()['user']['username']  # Use username as user_id in test
    
    # Create a new listing
    response = client.post('/api/listings', json={
        'user_id': user_id,
        'title': 'Test Item',
        'description': 'A test item description',
        'price': '$10.00',
        'location': 'Test Location',
        'images': []
    })
    data = response.get_json()
    assert response.status_code == 201
    assert data['status'] == 'success'
    assert data['message'] == 'Listing created successfully'
    assert data['item']['title'] == 'Test Item'

def test_get_listings(client):
    # Insert a listing
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    client.post('/api/listings', json={
        'user_id': 'testuser',
        'title': 'Test Item',
        'description': 'A test item description',
        'price': '$10.00',
        'location': 'Test Location',
        'images': []
    })
    
    # Retrieve the listings
    response = client.get('/api/listings')
    data = response.get_json()
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['listings']) > 0
    assert data['listings'][0]['title'] == 'Test Item'
