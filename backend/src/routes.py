from flask import Blueprint, jsonify, request, redirect, session
from src.models import db, User, Item, ItemImage
import base64
from stytch import Client as StytchClient
import os
from dotenv import load_dotenv  # Add this import
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

def create_error_response(message, clear_oauth=False):
    """Helper function to create error redirect response with optional OAuth clearing"""
    params = {
        'status': 'error',
        'message': message
    }
    if clear_oauth:
        params['clear_oauth'] = 'true'
    return redirect(f'http://localhost:3000?{urlencode(params)}')


def decode_access_token(token):
    """Decode JWT token and extract payload"""
    try:
        token_parts = token.split('.')
        if len(token_parts) != 3:
            raise ValueError("Invalid token format")
        
        payload = token_parts[1] + '=' * ((4 - len(token_parts[1]) % 4) % 4)
        return json.loads(base64.b64decode(payload))
    except Exception:
        raise ValueError("Invalid token format")

def create_new_user(email, full_name):
    """Create new user with unique username"""
    base_username = email.split('@')[0]
    username = base_username
    counter = 1
    
    while User.query.filter_by(username=username).first():
        username = f"{base_username}{counter}"
        counter += 1
    
    user = User(
        username=username,
        email=email,
        full_name=full_name,
        verified=True,
        description='',
        is_admin=False
    )
    db.session.add(user)
    db.session.commit()
    return user

@bp.route('/authenticate')
def authenticate():
    token = request.args.get('token')
    if not token:
        return create_error_response('Authentication failed - no token provided', clear_oauth=True)
    
    try:
        # Authenticate with Stytch
        response = stytch_client.oauth.authenticate(token)
        
        # Extract and validate email
        token_data = decode_access_token(response.provider_values.access_token)
        email = token_data.get('upn') or token_data.get('unique_name')
        
        if not email:
            return create_error_response('Could not retrieve email from Microsoft account', clear_oauth=True)
        
        # Validate email domain
        if not any(email.lower().endswith(domain) for domain in ['@mail.utoronto.ca', '@utoronto.ca']):
            return create_error_response('Please sign in with your UToronto email address', clear_oauth=True)
        
        
        # Get or create user
        user = User.query.filter_by(email=email).first()
        is_new_user = user is None
        
        if is_new_user:
            full_name = f"{response.user.name.first_name} {response.user.name.last_name}".strip()
            user = create_new_user(email, full_name)
        
        # Prepare user info
        user_info = {
            'user_id': str(user.id),
            'username': user.username,
            'name': user.full_name,
            'email': user.email,
            'verified': user.verified,
            'is_admin': user.is_admin,
            'description': user.description
        }
        
        # Store in session and prepare response
        session['user'] = user_info
        welcome_message = "Welcome! Your account has been created." if is_new_user else "Welcome back!"
        
        success_params = urlencode({
            'status': 'success',
            'message': welcome_message,
            'userData': urlencode(user_info)
        })
        
        return redirect(f'http://localhost:3000/?{success_params}')
        
    except Exception as e:
        error_messages = {
            'oauth_state_used': 'Authentication session expired. Please try logging in again.',
            'invalid_token': 'Invalid authentication token. Please try logging in again.',
            'Invalid token format': 'Could not process Microsoft login. Please try again.'
        }
        
        error_message = error_messages.get(
            next((key for key in error_messages if key in str(e)), None),
            'Authentication error. Please try again.'
        )
        
        return create_error_response(error_message, clear_oauth=True)

@bp.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    # Query the database instead of checking config
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        }), 404
        
    user_data = user.to_dict()
    
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
            user_id=int(data['user_id']),
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
            'message': error
        }), 500

@bp.route('/api/listings', methods=['GET'])
def get_listings():
    search_query = request.args.get("search")
    condition_query = request.args.get("condition")
    location_query = request.args.get("location")
    date_listed_query = request.args.get("daysSinceListed")
    min_price_query = request.args.get("minPrice")
    max_price_query = request.args.get("maxPrice")
    sort_by_query = request.args.get("sortBy")

    try:
        # Initialize the base query
        query = Item.query

        # Add filters based on the presence of query parameters
        filters = []

        if condition_query:
            # Split the comma-separated string into a list and filter using `in_`
            conditions = condition_query.split(',')
            # filters.append(Item.condition.in_(conditions))

        if location_query:
            # Split the comma-separated string into a list and filter using `in_`
            locations = location_query.split(',')
            filters.append(Item.location.in_(locations))

        if date_listed_query:
            # Calculate date threshold based on days since listed
            days_threshold = datetime.now() - timedelta(days=int(date_listed_query))
            filters.append(Item.created_at >= days_threshold)

        if min_price_query:
            filters.append(Item.price >= float(min_price_query))

        if max_price_query:
            filters.append(Item.price <= float(max_price_query))

        # Apply all collected filters at once using `.filter(*filters)`
        if filters:
            query = query.filter(and_(*filters))

        # Apply sorting based on `sort_by_query`, defaulting to created_at desc if not specified
        if sort_by_query == 'price_asc':
            query = query.order_by(Item.price.asc())
        elif sort_by_query == 'price_desc':
            query = query.order_by(Item.price.desc())
        elif sort_by_query == 'date_asc':
            query = query.order_by(Item.created_at.asc())
        else:
            query = query.order_by(Item.created_at.desc())
        
        items = query.all()

        # Only perform search if search query is in the URL
        if search_query:
            items = search_algorithm(items, search_query)

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
    
@bp.route('/api/listings/<int:id>', methods=['PUT'])
def update_listing(id):
    try:
        data = request.json

        # Retrieve the existing item by ID
        item = Item.query.get(id)

        if not item:
            return jsonify({
                'status': 'error',
                'message': 'Listing not found'
            }), 404

        # Update item fields
        item.title = data.get('title', item.title)
        item.description = data.get('description', item.description)
        item.price = float(data['price'].replace('$', '')) if 'price' in data else item.price
        item.location = data.get('location', item.location)

        # Handle image updates
        for image_data in data.get('images', []):
            # Remove data URL prefix (e.g., 'data:image/jpeg;base64,')
            image_parts = image_data.split(',')
            content_type = image_parts[0].split(':')[1].split(';')[0]
            binary_data = base64.b64decode(image_parts[1])

            new_image = ItemImage(
                item=item,
                image_data=binary_data,
                content_type=content_type
            )
            db.session.add(new_image)

        db.session.commit()

        # Return the updated item data using the to_dict method
        return jsonify({
            'status': 'success',
            'message': 'Listing updated successfully',
            'item': item.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/api/listings/<int:listing_id>/images/<int:image_index>', methods=['DELETE'])
def delete_image(listing_id, image_index):
    try:
        item = Item.query.get(listing_id)
        if not item:
            return jsonify({'status': 'error', 'message': 'Listing not found'}), 404

        # Get the list of images for the item
        images = item.images
        if image_index < 0 or image_index >= len(images):
            return jsonify({'status': 'error', 'message': 'Image index out of range'}), 404

        item.images.pop(image_index)
        db.session.commit()

        return jsonify({
            'status': 'success', 
            'message': 'Image deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error', 
            'message': str(e)
        }), 500

    
@bp.route('/api/listings/<int:id>', methods=['DELETE'])
def delete_listing(id):
    # Retrieve the specific item by ID
    item = Item.query.get(id)

    db.session.delete(item)
    db.session.commit()
    return jsonify({
        "status": "success", 
        "message": "Listing deleted successfully"
    }), 200

    return jsonify({
        "status": "error", 
        "message": "Unauthorized or listing not found"
    }), 404

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