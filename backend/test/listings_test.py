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


### GET, PUT, and DELETE a single listing but item_id
# Test GET /api/listings/<int:id>
def test_get_listing(client, setup_listing_data):
    item_id = setup_listing_data
    response = client.get(f'/api/listings/{item_id}')
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['listing']['title'] == 'Test Item'  # Check if the title matches

def test_get_listing_not_found(client):
    # Try to get a non-existent listing
    response = client.get('/api/listings/99999')
    data = response.get_json()

    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['message'] == 'Listing not found'

# Test PUT /api/listings/<int:id>
def test_update_listing(client, setup_listing_data):
    item_id = setup_listing_data
    updated_data = {
        'title': 'Updated Test Item',
        'description': 'Updated description',
        'price': '$30.00',
        'location': ['Robarts'],
        'images': []  # Can add images if necessary
    }

    response = client.put(f'/api/listings/{item_id}', json=updated_data)
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['message'] == 'Listing updated successfully'
    assert data['item']['title'] == 'Updated Test Item'
    assert data['item']['price'] == '$30.00'  # Ensure price is updated correctly

def test_update_listing_not_found(client):
    # Try to update a non-existent listing
    updated_data = {
        'title': 'Non-existent Item',
        'description': 'This item does not exist.',
        'price': '$50.00',
        'location': ['Robarts'],
        'images': []
    }
    
    response = client.put('/api/listings/99999', json=updated_data)
    data = response.get_json()

    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['message'] == 'Listing not found'

# Test DELETE /api/listings/<int:id>
def test_delete_listing(client, setup_listing_data):
    item_id = setup_listing_data
    response = client.delete(f'/api/listings/{item_id}')
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['message'] == 'Listing deleted successfully'

# Test PUT /api/listings/availibility/<int:id>
def test_update_availibility(client, setup_listing_data):
    item_id = setup_listing_data  # This gets the item_id from the fixture
    
    # Prepare the data for updating availability
    updated_data = {
        'status': 'unavailable'
    }

    # Send PUT request to update availability
    response = client.put(f'/api/listings/availibility/{item_id}', json=updated_data)
    data = response.get_json()

    # Assertions
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['message'] == 'Listing availibility updated successfully'
    assert data['item']['status'] == 'unavailable'


def test_update_availibility_item_not_found(client):
    # Define a payload for updating an item that doesn't exist
    updated_data = {'status': 'unavailable'}

    # Send PUT request to an invalid item ID
    response = client.put('/api/listings/availibility/9999', json=updated_data)

    # Check the response for item not found (404)
    assert response.status_code == 404  # In your case, this will return 500 error if an exception occurs
    data = response.get_json()
    assert data['status'] == 'error'
    assert data['message'] == 'Listing not found' # Assuming 'not found' is part of the error message


