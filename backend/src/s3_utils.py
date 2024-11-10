import boto3
import uuid

# TO-DO: Figure out way to store keys & tokens
AWS_ACCESS_KEY_ID = 'AKIASDRANCKCVV52NGGU'
AWS_SECRET_ACCESS_KEY = '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'
AWS_REGION ='us-east-2'
AWS_BUCKET_NAME = 'uoftmarketplacebucket'

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
    