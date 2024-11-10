import json
import pytest
from src import create_app, db  # Absolute import path
from src.models import User, Item, ItemImage

def test_create_listing(client):
    # Register a user first
    register_response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })
    user_id = register_response.get_json()['user']['id']  # Use username as user_id in test
    
    # Try to create a new listing without images (this should fail)
    response = client.post('/api/listings', json={
        'user_id': user_id,
        'title': 'Test Item',
        'description': 'A test item description',
        'price': '$10.00',
        'location': ['Bahen', 'University College', 'Hart House', 'Sid Smith'],
        'condition': 'New',  # Make sure to include condition
        'category': 'Electronics',  # Make sure to include category
        'images': []  # No images
    })
    data = response.get_json()
    assert response.status_code == 201
    assert data['status'] == 'success'

def test_get_listings(client):
    # Insert a listing
    register_response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'full_name': 'Test User',
        'email': 'testuser@example.com'
    })

    user_id = register_response.get_json()['user']['id']

    client.post('/api/listings', json={
        'user_id': user_id,
        'title': 'Test Item',
        'description': 'A test item description',
        'price': '$10.00',
        'location': ['Bahen', 'University College', 'Hart House', 'Sid Smith'],
        'condition': 'New',  # Make sure to include condition
        'category': 'Electronics',  # Make sure to include category
        'images': []  # Empty images array
    })
    
    # Retrieve the listings
    response = client.get('/api/listings')
    data = response.get_json()
    assert response.status_code == 200
    assert data['status'] == 'success'

    ### test for get items with user_id

# Test 1: Get items for a user with existing items
def test_get_items_by_user_with_items(client, setup_data):
    user_id = setup_data  # The user ID created in the setup_data fixture
    
    # Make a GET request to fetch items for the user
    response = client.get(f'/api/listings/user/{user_id}')
    data = response.get_json()

    # Assert the response is successful
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['items']) == 2  # We added 2 items in the setup
    assert data['items'][0]['title'] == 'Test Item 1'  # Check if the first item's title is correct
    assert data['items'][1]['title'] == 'Test Item 2'  # Check if the second item's title is correct

# Test 2: Get items for a user with no items
def test_get_items_by_user_no_items(client):
    # Create a user with no items
    user_response = client.post('/api/auth/register', json={
        'username': 'anotheruser',
        'password': 'password456',
        'full_name': 'Another User',
        'email': 'anotheruser@example.com'
    })
    user_id = user_response.get_json()['user']['id']
    
    # Make a GET request to fetch items for this user
    response = client.get(f'/api/listings/user/{user_id}')
    data = response.get_json()

    # Assert the response is successful and returns an empty list of items
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['items']) == 0  # No items for this user

# Test 3: Get items with missing user_id
def test_get_items_by_user_missing_user_id(client):
    # Make a GET request to fetch items without providing user_id
    response = client.get('/api/listings/user/')  # Missing user_id in the URL
    data = response.get_json()

    # Assert the response is a failure with a 404 status
    assert response.status_code == 404

# Test 4: Get items for a non-existent user
def test_get_items_by_user_non_existent_user(client):
    # Use a non-existent user ID
    non_existent_user_id = 99999  # Assuming this user ID doesn't exist in the database

    # Make a GET request to fetch items for the non-existent user
    response = client.get(f'/api/listings/user/{non_existent_user_id}')
    data = response.get_json()

    # Assert the response is a success but with an empty items list
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['items']) == 0  # No items for the non-existent user

