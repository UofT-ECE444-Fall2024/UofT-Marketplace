import pytest
from src import create_app, db  # Absolute import path
import pytest

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
    