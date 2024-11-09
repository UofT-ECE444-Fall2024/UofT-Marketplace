import json
import pytest
from src import create_app, db  # Absolute import path
from src.models import User, Item, ItemImage

test_user_1 = {
    'username': 'testuser1',
    'password': 'test1',
    'full_name': 'Test 1',
    'email': 'testuser1@example.com'
}

test_user_2 = {
    'username': 'testuser2',
    'password': 'test2',
    'full_name': 'Test 2',
    'email': 'testuser2@example.com'
}

test_item = {
    'user_id': '1',
    'title': 'Test Item',
    'description': 'A test item description',
    'price': '$10.00',
    'location': 'Test Location',
    'images': []
}

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

# def test_create_listing(client):
#     # Register a user first
#     register_response = client.post('/api/auth/register', json={
#         'username': 'testuser',
#         'password': 'password123',
#         'full_name': 'Test User',
#         'email': 'testuser@example.com'
#     })
#     user_id = register_response.get_json()['user']['username']  # Use username as user_id in test
    
#     # Try to create a new listing without images (this should fail)
#     response = client.post('/api/listings', json={
#         'user_id': user_id,
#         'title': 'Test Item',
#         'description': 'A test item description',
#         'price': '$10.00',
#         'location': 'Test Location',
#         'images': []  # No images
#     })
#     data = response.get_json()
#     assert response.status_code == 500
#     assert data['status'] == 'error'

# def test_get_listings(client):
#     # Insert a listing
#     client.post('/api/auth/register', json={
#         'username': 'testuser',
#         'password': 'password123',
#         'full_name': 'Test User',
#         'email': 'testuser@example.com'
#     })
#     client.post('/api/listings', json={
#         'user_id': '1',
#         'title': 'Test Item',
#         'description': 'A test item description',
#         'price': '$10.00',
#         'location': 'Test Location',
#         'images': []
#     })
    
#     # Retrieve the listings
#     response = client.get('/api/listings')
#     data = response.get_json()
#     assert response.status_code == 500
#     assert data['status'] == 'error'


def test_create_conversation(client):
    client.post('/api/auth/register', json=test_user_1)
    client.post('/api/auth/register', json=test_user_2)
    client.post('/api/listings', json=test_item)
    response = client.post('/api/conversations', json={
        "user_ids": [1, 2],
        "item_id": 1
    })
    assert response.status_code == 201
    response = client.get('/api/conversations/1')
    assert response.status_code == 200

def test_create_conversation(client):
    client.post('/api/auth/register', json=test_user_1)
    client.post('/api/auth/register', json=test_user_2)
    client.post('/api/conversations', json={
        'user_ids': [1, 2]
    })

    response = client.get('/api/conversations/1/messages', json=test_user_1)
    assert response.status_code == 200