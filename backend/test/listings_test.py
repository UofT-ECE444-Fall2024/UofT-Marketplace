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
