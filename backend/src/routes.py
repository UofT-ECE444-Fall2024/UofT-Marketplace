from flask import Blueprint, jsonify, request
from src.models import db, User, Item, ItemImage, Favorite
from src.search_algorithm import search_algorithm
from src.s3_utils import upload_to_s3, delete_image_from_s3
from sqlalchemy import and_
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, redirect, session
from src.models import db, User, Item, ItemImage
import base64
from stytch import Client as StytchClient
import os
from dotenv import load_dotenv  # Add this import
from urllib.parse import urlencode
import json

bp = Blueprint('main', __name__)

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
            location=data['location'],
            condition=data['condition'],
            category=data['category']
        )
        db.session.add(new_item)
        
        # Handle images
        for image_data in data['images']:
            # Remove data URL prefix (e.g., 'data:image/jpeg;base64,')
            image_parts = image_data.split(',')
            content_type = image_parts[0].split(':')[1].split(';')[0]
            binary_data = base64.b64decode(image_parts[1])
            
            image_url = upload_to_s3(binary_data, content_type)

            new_image = ItemImage(
                item=new_item,
                image_url=image_url
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
            'message': e
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
            filters.append(Item.condition.in_(conditions))

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
                item_data['image'] = first_image.image_url
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

@bp.route('/api/listings/user/<int:user_id>', methods=['GET'])
def get_items_by_user(user_id):

    if not user_id:
        return jsonify({'error': 'user_id is required'}), 404
    
    try:
        items = Item.query.filter_by(user_id=user_id).all()
        listings = []
        
        for item in items:
            # Get the basic item data
            item_data = item.to_dict()
            
            # Add the image if it exists
            first_image = item.images[0] if item.images else None
            if first_image:
                item_data['image'] = first_image.image_url
            else:
                item_data['image'] = None
                
            listings.append(item_data)

        return jsonify({
            'status': 'success',
            'items': listings
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
            }), 500

@bp.route('/api/listings/<int:id>', methods=['GET'])
def get_listing(id):
    try:
        # Retrieve the specific item by ID
        item = db.session.get(Item, id)

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
            image_list.append(image.image_url)

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
        item = db.session.get(Item, id)

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

            image_url = upload_to_s3(binary_data, content_type)

            new_image = ItemImage(
                item=item,
                image_url=image_url
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

        # Remove images from db & S3
        image = item.images[image_index]
        delete_image_from_s3(image.image_url)
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
    item = db.session.get(Item, id)

    # Remove images from S3
    for image in item.images:
        delete_image_from_s3(image.image_url)

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

@bp.route('/api/profile/rate', methods=['POST'])
def write_rating():
    data = request.get_json()
    username = data.get('username')
    rating_input = data.get('rating')

    # Get user that we're writing review for from database
    user = User.query.filter_by(username=username).first()

    prev_rating = user.rating
    rating_count = user.rating_count

    # Calculate new user rating using a formula.
    new_rating = (prev_rating*rating_count + rating_input)/(rating_count+1)

    user.rating_count += 1
    user.rating = new_rating

    db.session.commit()

    return {'msg': 'Rating submitted successfully.'}, 200

@bp.route('/api/profile/rating/<username>', methods=['GET'])
def read_rating(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        }), 404

    user_rating = user.rating

    return jsonify({
        'status': 'success',
        'user_rating': user_rating
    }), 200

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
        'description': user.description,  # Added description to debug output
        'joined_on': user.joined_on
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

## Favorites Feature
@bp.route('/api/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    try:
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        favorite_listings = []
        
        for fav in favorites:
            item_data = fav.item.to_dict()
            # Add the image if it exists
            first_image = fav.item.images[0] if fav.item.images else None
            if first_image:
                item_data['image'] = first_image.image_url
            else:
                item_data['image'] = None
                
            favorite_listings.append(item_data)
            
        return jsonify({
            'status': 'success',
            'favorites': favorite_listings
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/api/favorites', methods=['POST'])
def add_favorite():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        item_id = data.get('item_id')
        # Check if favorite already exists
        existing_favorite = Favorite.query.filter_by(
            user_id=user_id,
            item_id=item_id
        ).first()
        
        if existing_favorite:
            return jsonify({
                'status': 'error',
                'message': 'Already in favorites'
            }), 409
            
        new_favorite = Favorite(user_id=user_id, item_id=item_id)
        db.session.add(new_favorite)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Added to favorites'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/api/favorites/<int:user_id>/<int:item_id>', methods=['DELETE'])
def remove_favorite(user_id, item_id):
    try:
        favorite = Favorite.query.filter_by(
            user_id=user_id,
            item_id=item_id
        ).first()
        
        if not favorite:
            return jsonify({
                'status': 'error',
                'message': 'Favorite not found'
            }), 404
            
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Removed from favorites'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500