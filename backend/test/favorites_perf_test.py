import pytest
import json

@pytest.mark.parametrize("user_id", [1, 2, 3])  # Example user IDs to test
def test_get_favorites_performance(client, benchmark, user_id):
    # Measure the performance of GET /favorites/<user_id> endpoint
    response = benchmark(lambda: client.get(f'/api/favorites/{user_id}'))
    assert response.status_code == 200
    elapsed_time = benchmark.stats['mean']  # 'mean' is the average time

    assert elapsed_time < 0.01 # in secs


@pytest.mark.parametrize("user_id, item_id", [(1, 101), (2, 202), (3, 303)])  # Example user and item IDs
def test_add_favorite_performance(client, benchmark, user_id, item_id):
    # Measure the performance of POST /favorites
    payload = {"user_id": user_id, "item_id": item_id}
    response = benchmark(lambda: client.post('/api/favorites', 
                                             data=json.dumps(payload), 
                                             content_type='application/json'))
    elapsed_time = benchmark.stats['mean']  

    assert elapsed_time < 0.01 
    assert response.status_code in [201, 409]  # 201 if added, 409 if already exists

@pytest.mark.parametrize("user_id, item_id", [(1, 101), (2, 202), (3, 303)])  # Example user and item IDs
def test_remove_favorite_performance(client, benchmark, user_id, item_id):
    # Measure the performance of DELETE /favorites/<user_id>/<item_id>
    response = benchmark(lambda: client.delete(f'/api/favorites/{user_id}/{item_id}'))
    elapsed_time = benchmark.stats['mean']  

    assert elapsed_time < 0.01 
    assert response.status_code in [200, 404]  # 200 if removed, 404 if not found


## Can run with command like 
## runusing: pytest 