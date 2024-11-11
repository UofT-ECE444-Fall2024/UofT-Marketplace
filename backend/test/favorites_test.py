import json
import pytest
from src.models import Favorite, User, Item
from src import create_app, db  # Absolute import path


# Test getting favorites for a user with favorites
def test_get_favorites_success(client, setup_data):
    user_id = 1  # Assuming user 1 exists in setup_data
    response = client.get(f'/api/favorites/{user_id}')
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert isinstance(data['favorites'], list)
    # Verify the structure of returned favorites
    if len(data['favorites']) > 0:
        assert 'title' in data['favorites'][0]
        assert 'price' in data['favorites'][0]
        assert 'image' in data['favorites'][0]

# Test getting favorites for a user with no favorites
def test_get_favorites_empty(client, setup_data):
    user_id = 999  # User with no favorites
    response = client.get(f'/api/favorites/{user_id}')
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['favorites']) == 0

# Test adding a new favorite
def test_add_favorite_success(client, setup_data):
    payload = {
        'user_id': 1,
        'item_id': 1
    }

    response = client.post('/api/favorites', 
                          data=json.dumps(payload),
                          content_type='application/json')
    data = response.get_json()


    assert response.status_code == 201
    assert data['status'] == 'success'
    assert data['message'] == 'Added to favorites'

# Test adding a favorite that already exists
def test_add_favorite_duplicate(client, setup_data):
    payload = {
        'user_id': 1,
        'item_id': 1
    }
    client.post('/api/favorites', 
                data=json.dumps(payload),
                content_type='application/json')
    

    response = client.post('/api/favorites', 
                          data=json.dumps(payload),
                          content_type='application/json')
    data = response.get_json()


    assert response.status_code == 409
    assert data['status'] == 'error'
    assert data['message'] == 'Already in favorites'

def test_add_favorite_invalid_data(client, setup_data):
    # Test adding a favorite with missing data
    payload = {
        'user_id': 1
        # Missing item_id
    }
    response = client.post('/api/favorites', 
                          data=json.dumps(payload),
                          content_type='application/json')
    data = response.get_json()

    assert response.status_code == 500
    assert data['status'] == 'error'

def test_remove_favorite_success(client, setup_data):
    # First add a favorite
    payload = {
        'user_id': 1,
        'item_id': 1
    }
    client.post('/api/favorites', 
                data=json.dumps(payload),
                content_type='application/json')
    
    # Then remove it
    response = client.delete(f'/api/favorites/1/1')
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['message'] == 'Removed from favorites'

def test_remove_favorite_not_found(client, setup_data):
    # Test removing a favorite that doesn't exist
    response = client.delete(f'/api/favorites/999/999')
    data = response.get_json()

    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['message'] == 'Favorite not found'

def test_get_favorites_invalid_user(client, setup_data):
    # Test getting favorites for a non-existent user
    response = client.get('/api/favorites/-1')
    data = response.get_json()

    assert response.status_code == 404
    # assert data['status'] == 'error'

@pytest.fixture
def setup_favorites_data(app):
    """Fixture to set up test data for favorites"""
    with app.app_context():
        user1 = User(username='Robin', email='test1@test.com')
        user2 = User(username='McLovin', email='test2@test.com')
        db.session.add_all([user1, user2])
        item1 = Item(title='Couch', price='$20', condition='New')
        item2 = Item(title='Some Books', price='$30', condition='Used')


        db.session.add_all([item1, item2])
        
        db.session.commit()
        
        favorite1 = Favorite(user_id=user1.id, item_id=item1.id)
        db.session.add(favorite1)
        db.session.commit()

        yield



        # Cleanup
        db.session.query(Favorite).delete()
        db.session.query(Item).delete()
        db.session.query(User).delete()
        db.session.commit()