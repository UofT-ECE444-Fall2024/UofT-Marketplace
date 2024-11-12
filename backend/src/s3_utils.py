import boto3
import uuid
from urllib.parse import urlparse
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def upload_to_s3(image_data, content_type):
    try:
        bucket_name = AWS_BUCKET_NAME
        # Generate unique filename
        file_extension = content_type.split('/')[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=filename,
            Body=image_data,
            ContentType=content_type
        )
        
        # Generate URL
        url = f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{filename}"
        return url
    except Exception as e:
        raise Exception(f"S3 upload error: {str(e)}")

def delete_image_from_s3(image_url):
    try:
        url_base = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/"
        filename = image_url[len(url_base):]
        
        # Delete the object
        s3_client.delete_object(
            Bucket=AWS_BUCKET_NAME,
            Key=filename
        )
        
        return True, "Image deleted successfully"
        
    except Exception as e:
        error_message = f"Error deleting image: {str(e)}"
        return False, error_message
    