# tests/test_auth.py
import pytest
from unittest.mock import Mock, patch
from src import create_app
from src.models import db, User
import json
from urllib.parse import urlparse, parse_qs
import base64

def create_fake_jwt_token(email):
    """Helper function to create a properly encoded fake JWT token"""
    # Create a proper JWT structure
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "upn": email,
        "unique_name": email,
        "email": email,
        # Add any other claims your route might be checking
    }
    
    # Base64 encode each part
    header_encoded = base64.b64encode(json.dumps(header).encode()).decode()
    payload_encoded = base64.b64encode(json.dumps(payload).encode()).decode()
    
    # Create fake signature
    signature = base64.b64encode(b"fake-signature").decode()
    
    # Remove any padding '=' characters
    header_encoded = header_encoded.rstrip('=')
    payload_encoded = payload_encoded.rstrip('=')
    signature = signature.rstrip('=')
    
    # Join with periods to create JWT structure
    return f"{header_encoded}.{payload_encoded}.{signature}"

@pytest.fixture
def app():
    """Create and configure a test Flask application instance"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    # Create application context
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()

@pytest.fixture
def mock_stytch():
    """Create a mock Stytch client"""
    with patch('src.routes.stytch_client') as mock:
        yield mock

def test_login_route_success(client, mock_stytch):
    """Test successful login route that redirects to Microsoft OAuth"""
    mock_stytch.oauth.microsoft.start.return_value = {
        'url': 'https://fake-microsoft-oauth.com/authorize'
    }
    
    response = client.get('/login')
    
    assert response.status_code == 302
    assert response.location == 'https://fake-microsoft-oauth.com/authorize'
    
    mock_stytch.oauth.microsoft.start.assert_called_once_with(
        login_redirect_url='http://localhost:5001/authenticate',
        signup_redirect_url='http://localhost:5001/authenticate',
        custom_scopes=["User.Read"]
    )

def test_authenticate_no_token(client):
    """Test authenticate route when no token is provided"""
    response = client.get('/authenticate')
    
    assert response.status_code == 302
    parsed_url = urlparse(response.location)
    query_params = parse_qs(parsed_url.query)
    
    assert parsed_url.netloc == 'localhost:3000'
    assert query_params['status'][0] == 'error'
    assert query_params['message'][0] == 'Authentication failed - no token provided'
    assert query_params['clear_oauth'][0] == 'true'

def test_authenticate_invalid_token(client, mock_stytch):
    """Test authenticate route with invalid token"""
    mock_stytch.oauth.authenticate.side_effect = Exception('invalid_token')
    
    response = client.get('/authenticate?token=invalid_token')
    
    assert response.status_code == 302
    parsed_url = urlparse(response.location)
    query_params = parse_qs(parsed_url.query)
    
    assert parsed_url.netloc == 'localhost:3000'
    assert query_params['status'][0] == 'error'
    assert query_params['message'][0] == 'Invalid authentication token. Please try logging in again.'
    assert query_params['clear_oauth'][0] == 'true'

def test_authenticate_non_utoronto_email(client, mock_stytch):
    """Test authenticate route with non-UofT email"""
    fake_token = create_fake_jwt_token("user@gmail.com")
    mock_stytch.oauth.authenticate.return_value = Mock(
        provider_values=Mock(
            access_token=fake_token
        ),
        user=Mock(
            name=Mock(
                first_name='Test',
                last_name='User'
            )
        )
    )
    
    response = client.get('/authenticate?token=valid_token')
    
    assert response.status_code == 302
    parsed_url = urlparse(response.location)
    query_params = parse_qs(parsed_url.query)
    
    assert parsed_url.netloc == 'localhost:3000'
    assert query_params['status'][0] == 'error'
    assert query_params['message'][0] == 'Please sign in with your UToronto email address'
    assert query_params['clear_oauth'][0] == 'true'

def test_authenticate_successful_new_user(client, mock_stytch):
    """Test successful authentication for a new user"""
    email = "user@mail.utoronto.ca"
    fake_token = create_fake_jwt_token(email)
    
    # Create a more complete mock response
    mock_response = Mock()
    
    # Set up the provider_values attribute
    mock_response.provider_values = Mock()
    mock_response.provider_values.access_token = fake_token
    
    # Set up the user attribute with all required nested attributes
    mock_response.user = Mock()
    mock_response.user.name = Mock()
    mock_response.user.name.first_name = 'Test'
    mock_response.user.name.last_name = 'User'
    mock_response.user.emails = [Mock(email=email)]  # Add emails attribute
    
    # Configure the mock to return our response
    mock_stytch.oauth.authenticate.return_value = mock_response
    
    # Create a session for the test client
    with client.session_transaction() as sess:
        sess['session_token'] = 'test_session'  # Add session data if needed
    
    response = client.get('/authenticate?token=valid_token')
    
    assert response.status_code == 302
    parsed_url = urlparse(response.location)
    query_params = parse_qs(parsed_url.query)
    
    assert parsed_url.netloc == 'localhost:3000'
    assert query_params['status'][0] == 'success'
    assert query_params['message'][0] == 'Welcome! Your account has been created.'
    
    # Verify user data in response
    user_data = parse_qs(query_params['userData'][0])
    assert user_data['email'][0] == email
    
    # Verify user was created in database
    with client.application.app_context():
        user = User.query.filter_by(email=email).first()
        assert user is not None
        assert user.full_name == 'Test User'
        assert user.verified == True
        assert user.email == email
        assert user.username == 'user'  # Base username from email

def test_authenticate_existing_user(client, mock_stytch):
    """Test successful authentication for an existing user"""
    email = "user@mail.utoronto.ca"
    
    # Create existing user
    with client.application.app_context():
        user = User(
            username='existinguser',
            email=email,
            full_name='Existing User',
            verified=True
        )
        db.session.add(user)
        db.session.commit()
    
    # Mock successful Stytch authentication
    fake_token = create_fake_jwt_token(email)
    mock_stytch.oauth.authenticate.return_value = Mock(
        provider_values=Mock(
            access_token=fake_token
        ),
        user=Mock(
            name=Mock(
                first_name='Existing',
                last_name='User'
            )
        )
    )
    
    response = client.get('/authenticate?token=valid_token')
    
    assert response.status_code == 302
    parsed_url = urlparse(response.location)
    query_params = parse_qs(parsed_url.query)
    
    assert parsed_url.netloc == 'localhost:3000'
    assert query_params['status'][0] == 'success'
    assert query_params['message'][0] == 'Welcome back!'
    
    # Verify user data in response
    user_data = parse_qs(query_params['userData'][0])
    assert user_data['username'][0] == 'existinguser'
    assert user_data['email'][0] == email