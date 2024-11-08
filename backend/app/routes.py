from flask import Blueprint, jsonify, request, redirect, session, url_for
from app.models import db, User, Item, ItemImage
import base64
from stytch import Client as StytchClient
import os
from dotenv import load_dotenv  # Add this import
import requests
from urllib.parse import urlencode
import json

bp = Blueprint('main', __name__)
load_dotenv()

# Initialize Stytch client with your credentials
stytch_client = StytchClient(
  project_id=os.environ['STYTCH_PROJECT_ID'],
  secret=os.environ['STYTCH_SECRET'],
  environment="test"
)

# Route to start Microsoft OAuth login
@bp.route('/login')
def login_with_microsoft():
    response = stytch_client.oauth.microsoft.start(
        login_redirect_url='http://localhost:5001/authenticate',
        signup_redirect_url='http://localhost:5001/authenticate',
        custom_scopes=["User.Read"]
    )
    return redirect(response['url'])

@bp.route('/authenticate')
def authenticate():
    token = request.args.get('token')
    if not token:
        error_params = urlencode({
            'status': 'error',
            'message': 'Authentication failed - no token provided'
        })
        return redirect(f'http://localhost:3000?{error_params}')
    
    try:
        # Authenticate with Stytch
        response = stytch_client.oauth.authenticate(token)
        
        # Get access token and extract email
        access_token = response.provider_values.access_token
        token_parts = access_token.split('.')
        if len(token_parts) != 3:
            raise ValueError("Invalid access token format")
            
        payload = token_parts[1]
        payload += '=' * ((4 - len(payload) % 4) % 4)
        decoded_payload = base64.b64decode(payload)
        token_data = json.loads(decoded_payload)
        
        email = token_data.get('upn') or token_data.get('unique_name')
        
        if not email:
            error_params = urlencode({
                'status': 'error',
                'message': 'Could not retrieve email from Microsoft account'
            })
            return redirect(f'http://localhost:3000?{error_params}')
        
        # Validate email domain
        if not email.lower().endswith('@mail.utoronto.ca') and not email.lower().endswith('@utoronto.ca'):
            error_params = urlencode({
                'status': 'error',
                'message': 'Please sign in with your UToronto email address'
            })
            return redirect(f'http://localhost:3000?{error_params}')
        
        # Get user's name from response
        first_name = response.user.name.first_name
        last_name = response.user.name.last_name
        full_name = f"{first_name} {last_name}".strip()
        
        # Check if user exists in our database
        user = User.query.filter_by(email=email).first()
        is_new_user = user is None
        
        if is_new_user:
            # Create new user
            # Generate username from email (everything before @)
            username = email.split('@')[0]
            base_username = username
            counter = 1
            
            # Keep trying until we find an available username
            while User.query.filter_by(username=username).first():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User(
                username=username,
                email=email,
                full_name=full_name,
                verified=True,  # Since they logged in with UToronto email
                description='',
                is_admin=False
            )
            db.session.add(user)
            db.session.commit()
        
        # Prepare user info for session and response
        user_info = {
            'user_id': str(user.id),
            'username': user.username,
            'name': user.full_name,
            'email': user.email,
            'verified': user.verified,
            'is_admin': user.is_admin,
            'description': user.description
        }
        
        # Store in session
        session['user'] = user_info
        
        # Add a welcome message based on new vs returning user
        welcome_message = "Welcome back!" if not is_new_user else "Welcome! Your account has been created."
        
        # Change: Always redirect to the root route with the params
        query_params = urlencode({
            'status': 'success',
            'message': welcome_message,
            'userData': urlencode(user_info)
        })
        
        return redirect(f'http://localhost:3000/?{query_params}')  # Changed from /home to /
        
    except Exception as e:
        error_message = 'Authentication error. Please try again.'
        if 'oauth_state_used' in str(e):
            error_message = 'Authentication session expired. Please try logging in again.'
        elif 'invalid_token' in str(e):
            error_message = 'Invalid authentication token. Please try logging in again.'
        elif 'Invalid access token format' in str(e):
            error_message = 'Could not process Microsoft login. Please try again.'
            
        error_params = urlencode({
            'status': 'error',
            'message': error_message
        })
        
        return redirect(f'http://localhost:3000?{error_params}')

@bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        user_data = {
            'username': user.username,
            'full_name': user.full_name,
            'verified': user.verified,
            'description': user.description,
            'is_admin': user.is_admin
        }
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': user_data
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Invalid username or password'
        }), 401

@bp.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    # Query the database instead of checking config
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        }), 404
        
    user_data = {
        'username': user.username,
        'full_name': user.full_name,
        'verified': user.verified,
        'description': user.description,
        'is_admin': user.is_admin,
        'email': user.email  # Include email if needed
    }
    
    return jsonify({
        'status': 'success',
        'user': user_data
    }), 200

@bp.route('/')
def home():
    return jsonify({"message": "Hello World!"})

@bp.route('/api/listings', methods=['POST'])
def create_listing():
    try:
        data = request.json
        
        # Create new item
        new_item = Item(
            user_id=data['user_id'],
            title=data['title'],
            description=data['description'],
            price=float(data['price'].replace('$', '')),
            location=data['location']
        )
        db.session.add(new_item)
        
        # Handle images
        for image_data in data['images']:
            # Remove data URL prefix (e.g., 'data:image/jpeg;base64,')
            image_parts = image_data.split(',')
            content_type = image_parts[0].split(':')[1].split(';')[0]
            binary_data = base64.b64decode(image_parts[1])
            
            new_image = ItemImage(
                item=new_item,
                image_data=binary_data,
                content_type=content_type
            )
            db.session.add(new_image)
        
        db.session.commit()
        
        # Return the item data using the to_dict method
        return jsonify({
            'status': 'success',
            'message': 'Listing created successfully',
            'item': new_item.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        items = Item.query.order_by(Item.created_at.desc()).all()
        listings = []
        
        for item in items:
            # Get the basic item data
            item_data = item.to_dict()
            
            # Add the image if it exists
            first_image = item.images[0] if item.images else None
            if first_image:
                image_b64 = base64.b64encode(first_image.image_data).decode('utf-8')
                item_data['image'] = f'data:{first_image.content_type};base64,{image_b64}'
            else:
                item_data['image'] = None
                
            listings.append(item_data)
        
        return jsonify({
            'status': 'success',
            'listings': listings
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/api/listings/<int:id>', methods=['GET'])
def get_listing(id):
    try:
        # Retrieve the specific item by ID
        item = Item.query.get(id)

        if item is None:
            return jsonify({
                'status': 'error',
                'message': 'Listing not found'
            }), 404  # Return 404 if the item is not found

        # Convert item data to dictionary format
        item_data = item.to_dict()

        # Initialize a list to store all the images
        image_list = []

        # Loop through all the images
        for image in item.images:
            # Encode each image to base64
            image_b64 = base64.b64encode(image.image_data).decode('utf-8')
            image_list.append(f'data:{image.content_type};base64,{image_b64}')

        # Add the list of images to the item_data
        item_data['images'] = image_list if image_list else None

        return jsonify({
            'status': 'success',
            'listing': item_data  # Return the listing data
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500  # Return a server error status if something goes wrong
    
####################################DEBUGGING############################
@bp.route('/api/debug/users', methods=['GET'])
def debug_users():
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,  # Added full_name to debug output
        'verified': user.verified,
        'is_admin': user.is_admin,
        'description': user.description  # Added description to debug output
    } for user in users]
    
    return jsonify({
        'user_count': len(user_list),
        'users': user_list
    })

# Add a route to check specific user profile
@bp.route('/api/debug/profile/<username>', methods=['GET'])
def debug_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        }), 404
        
    return jsonify({
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'email': user.email,
        'verified': user.verified,
        'is_admin': user.is_admin,
        'description': user.description
    })