import json
import pytest
from src import create_app, db  # Absolute import path
from src.models import User, Item, ItemImage

# Test case: Submit a new rating for a user
def test_write_rating(client, setup_rating_data):
    """
    This test verifies that a new rating is submitted correctly.
    It checks that the rating count increases and the rating is updated.
    """
    username = setup_rating_data['username']
    rating_input = 5  # Assume rating is 5
    
    # Send POST request to submit rating
    response = client.post('/api/profile/rate', json={
        'username': username,
        'rating': rating_input
    })
    
    # Fetch the updated user data from the database
    updated_user = User.query.filter_by(username=username).first()
    
    # Assert the response and check that the rating was correctly submitted
    assert response.status_code == 200
    assert response.json['msg'] == 'Rating submitted successfully.'
    assert updated_user.rating_count == 1  # Rating count should increase by 1
    assert updated_user.rating == 5  # Rating should be averaged

# Test case: Fetch a user's rating
def test_read_rating(client, setup_rating_data):
    """
    This test verifies that a user's rating is fetched correctly.
    It checks that the correct rating is returned for a valid user.
    """
    username = setup_rating_data['username']

    # Send GET request to fetch rating for the user
    response = client.get(f'/api/profile/rating/{username}')
    data = response.get_json()

    # Assert the response contains the correct status and rating
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['user_rating'] == setup_rating_data['rating']  # Rating should be 4.0 initially

# Test case: Submit multiple ratings for a user
def test_write_multiple_ratings(client, setup_rating_data):
    """
    This test verifies that multiple ratings can be submitted for a user.
    It checks that the rating count and rating value are correctly updated.
    """
    username = setup_rating_data['username']
    
    # First rating
    response_1 = client.post('/api/profile/rate', json={
        'username': username,
        'rating': 3  # Rating input 3
    })
    
    # Second rating
    response_2 = client.post('/api/profile/rate', json={
        'username': username,
        'rating': 5  # Rating input 5
    })
    
    # Fetch the updated user data from the database
    updated_user = User.query.filter_by(username=username).first()

    # Assert the response for both rating submissions
    assert response_1.status_code == 200
    assert response_2.status_code == 200
    assert updated_user.rating_count == 2  # Rating count should increase by 2
    assert updated_user.rating == 4.0  # Average rating should be 4.0

# Test case: Attempt to fetch rating for a non-existent user
def test_read_rating_user_not_found(client):
    """
    This test verifies that an error is returned when attempting to fetch
    the rating of a non-existent user.
    """
    username = 'nonexistentuser'
    
    # Send GET request to fetch rating for a non-existent user
    response = client.get(f'/api/profile/rating/{username}')
    data = response.get_json()

    # Assert the response indicates user is not found
    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['message'] == 'User not found'
    