import pytest
import json
from datetime import datetime

@pytest.fixture
def sample_user_data():
    return {
        "email": "test@example.com",
        "username": "testuser",
        "auth_type": "email",
        "verified": True
    }

@pytest.fixture
def sample_listing_data():
    return {
        "user_id": 1,
        "title": "Test Item",
        "description": "Test Description",
        "price": "$100",
        "location": "Test Location",
        "condition": "new",
        "category": "electronics",
        "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRg=="]
    }

# User Related Tests
@pytest.mark.parametrize("email,username", [
    ("test1@test.com", "user1"),
    ("test2@test.com", "user2"),
    ("test3@test.com", "user3")
])
def test_create_user_performance(client, benchmark, email, username):
    payload = {
        "email": email,
        "username": username,
        "auth_type": "email",
        "verified": True
    }
    response = benchmark(lambda: client.post('/api/auth/user',
                                           data=json.dumps(payload),
                                           content_type='application/json'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 400]

@pytest.mark.parametrize("username", ["user1", "user2", "user3"])
def test_get_profile_performance(client, benchmark, username):
    response = benchmark(lambda: client.get(f'/api/profile/{username}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 404]

@pytest.mark.parametrize("user_id,full_name", [
    (1, "Test User 1"),
    (2, "Test User 2"),
    (3, "Test User 3")
])
def test_update_profile_performance(client, benchmark, user_id, full_name):
    payload = {"user_id": user_id, "full_name": full_name}
    response = benchmark(lambda: client.put('/api/profile/update',
                                          data=json.dumps(payload),
                                          content_type='application/json'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 404]

# Listing Related Tests
def test_create_listing_performance(client, benchmark, sample_listing_data):
    response = benchmark(lambda: client.post('/api/listings',
                                           data=json.dumps(sample_listing_data),
                                           content_type='application/json'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.1  # Slightly longer timeout due to image processing
    assert response.status_code in [201, 500]

@pytest.mark.parametrize("query_params", [
    {},
    {"search": "test"},
    {"condition": "new"},
    {"location": "Test Location"},
    {"category": "electronics"},
    {"minPrice": "50", "maxPrice": "150"},
    {"sortBy": "price_asc"}
])
def test_get_listings_performance(client, benchmark, query_params):
    response = benchmark(lambda: client.get('/api/listings?' + '&'.join([f"{k}={v}" for k, v in query_params.items()])))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code == 200

@pytest.mark.parametrize("user_id", [1, 2, 3])
def test_get_user_listings_performance(client, benchmark, user_id):
    response = benchmark(lambda: client.get(f'/api/listings/user/{user_id}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 404]

@pytest.mark.parametrize("listing_id", [1, 2, 3])
def test_get_single_listing_performance(client, benchmark, listing_id):
    response = benchmark(lambda: client.get(f'/api/listings/{listing_id}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 404]

# Favorites Tests (from original)
@pytest.mark.parametrize("user_id", [1, 2, 3])
def test_get_favorites_performance(client, benchmark, user_id):
    response = benchmark(lambda: client.get(f'/api/favorites/{user_id}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code == 200

@pytest.mark.parametrize("user_id, item_id", [(1, 101), (2, 202), (3, 303)])
def test_add_favorite_performance(client, benchmark, user_id, item_id):
    payload = {"user_id": user_id, "item_id": item_id}
    response = benchmark(lambda: client.post('/api/favorites',
                                           data=json.dumps(payload),
                                           content_type='application/json'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [201, 409]

@pytest.mark.parametrize("user_id, item_id", [(1, 101), (2, 202), (3, 303)])
def test_remove_favorite_performance(client, benchmark, user_id, item_id):
    response = benchmark(lambda: client.delete(f'/api/favorites/{user_id}/{item_id}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 404]

# Conversation Related Tests
@pytest.mark.parametrize("user_ids,item_id", [
    ([1, 2], 101),
    ([2, 3], 102),
    ([1, 3], 103)
])
def test_create_conversation_performance(client, benchmark, user_ids, item_id):
    payload = {"user_ids": user_ids, "item_id": item_id}
    response = benchmark(lambda: client.post('/api/conversations',
                                           data=json.dumps(payload),
                                           content_type='application/json'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 201, 400, 404]

@pytest.mark.parametrize("user_id", [1, 2, 3])
def test_get_conversations_performance(client, benchmark, user_id):
    response = benchmark(lambda: client.get(f'/api/conversations/{user_id}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code == 200

@pytest.mark.parametrize("conversation_id", [1, 2, 3])
def test_get_messages_performance(client, benchmark, conversation_id):
    response = benchmark(lambda: client.get(f'/api/conversations/{conversation_id}/messages'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code == 200


# Debug Endpoint Tests
def test_debug_users_performance(client, benchmark):
    response = benchmark(lambda: client.get('/api/debug/users'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code == 200

@pytest.mark.parametrize("username", ["user1", "user2", "user3"])
def test_debug_profile_performance(client, benchmark, username):
    response = benchmark(lambda: client.get(f'/api/debug/profile/{username}'))
    elapsed_time = benchmark.stats['mean']
    assert elapsed_time < 0.01
    assert response.status_code in [200, 404]