import json
import pytest
from src import create_app, db  # Absolute import path
from src.models import User, Item, ItemImage


from flask import jsonify

def test_get_listings_no_filters(client, setup_data):
    # Test without any filters (should return all items)
    response = client.get('/api/listings')
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['listings']) > 0  # Ensure listings are returned

def test_get_listings_with_condition(client, setup_data):
    # Test with condition filter (e.g., New)
    response = client.get('/api/listings', query_string={'condition': 'New'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert all(item['condition'] == 'New' for item in data['listings'])


def test_get_listings_with_location(client, setup_data):
    # Test with location filter (e.g., Bahen)
    response = client.get('/api/listings', query_string={'location': 'Bahen'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert all("Bahen" in item['location'] for item in data['listings'])

def test_get_listings_with_category(client, setup_data):
    # Test with category filter (e.g., Accessories)
    response = client.get('/api/listings', query_string={'category': 'Accessories'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert all("Accessories" in item['category'] for item in data['listings'])


def test_get_listings_with_price_range(client, setup_data):
    # Test with price filter (minPrice, maxPrice)
    response = client.get('/api/listings', query_string={'minPrice': '15', 'maxPrice': '25'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert all(15 <= float(item['price'][1:]) <= 25 for item in data['listings'])  # Strip '$' for comparison


# Failure Test: Invalid price range filter (non-numeric values)
def test_get_listings_invalid_price_range(client, setup_data):
    # Test with an invalid price filter (e.g., non-numeric string)
    response = client.get('/api/listings', query_string={'minPrice': 'abc', 'maxPrice': 'xyz'})
    data = response.get_json()

    assert response.status_code == 500  # Should raise an internal server error due to invalid value
    assert data['status'] == 'error'
    assert 'could not convert string to float' in data['message']  # The error message should mention the issue


def test_get_listings_with_sorting(client, setup_data):
    # Test sorting by price_asc
    response = client.get('/api/listings', query_string={'sortBy': 'price_asc'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['listings'][0]['price'] <= data['listings'][1]['price']  # Check that price is sorted in ascending order

    # Test sorting by date_desc (default)
    response = client.get('/api/listings', query_string={'sortBy': 'date_desc'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['listings'][0]['created_at'] >= data['listings'][1]['created_at']  # Check that items are sorted by date


# Failure Test: Invalid sort parameter
def test_get_listings_invalid_sort_by(client, setup_data):
    # Test with an invalid sort parameter (not one of the expected values)
    response = client.get('/api/listings', query_string={'sortBy': 'invalid_sort'})
    data = response.get_json()

    assert response.status_code == 200  # The API should return success even with an invalid sort parameter
    assert data['status'] == 'success'
    assert len(data['listings']) > 0  # Ensure that listings are returned despite the invalid sort value
    # You might want to check the default sort order is used, which is by created_at descending
    assert data['listings'][0]['created_at'] >= data['listings'][1]['created_at']


def test_get_listings_with_search(client, setup_data):
    # Test search functionality
    response = client.get('/api/listings', query_string={'search': 'item 1'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['listings']) > 0
    assert 'Test Item 1' in [item['title'] for item in data['listings']]


# Failure Test: Search with malformed query
def test_get_listings_invalid_search(client, setup_data):
    # Test with a malformed search query (e.g., too long, special characters)
    response = client.get('/api/listings', query_string={'search': '%$#@!InvalidSearch'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['listings']) == 0  # No items should match the invalid search query


def test_get_listings_with_multiple_filters(client, setup_data):
    # Test combining filters: condition, location, and price range
    response = client.get('/api/listings', query_string={'condition': 'Used', 'location': 'Bahen', 'minPrice': '15'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert all(item['condition'] == 'Used' for item in data['listings'])
    assert all('Bahen' in item['location'] for item in data['listings'])
    assert all(float(item['price'][1:]) >= 15 for item in data['listings'])  # Ensure price is greater than or equal to 15


def test_get_listings_with_invalid_filter(client, setup_data):
    # Test with an invalid filter
    response = client.get('/api/listings', query_string={'location': 'InvalidLocation'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['listings']) == 0  # No listings should match this invalid location


def test_get_listings_with_empty_response(client, setup_data):
    # Test that no items are returned when no items match the filter
    response = client.get('/api/listings', query_string={'minPrice': '1000'})
    data = response.get_json()

    assert response.status_code == 200
    assert data['status'] == 'success'
    assert len(data['listings']) == 0  # No items should be in the listings as none match the price filter
