import pytest
from unittest.mock import patch, MagicMock
from src.s3_utils import AWS_BUCKET_NAME, AWS_REGION, upload_to_s3, delete_image_from_s3

def test_upload_to_s3():
    # Mock the S3 client and uuid
    with patch('boto3.client') as mock_client, patch('uuid.uuid4') as mock_uuid:
        
        # Setup mocks
        mock_s3 = MagicMock()
        mock_client.return_value = mock_s3
        mock_uuid.return_value = "test-image"
        
        # Test data
        image_data = b'fake-image-data'
        content_type = 'image/jpeg'
        
        # Call the function
        url = upload_to_s3(image_data, content_type)
        
        # Assertions
        expected_filename = 'test-image.jpeg'
        expected_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{expected_filename}"
        
        assert url == expected_url

def test_delete_image_from_s3():
    # Mock the S3 client
    with patch('boto3.client') as mock_client:
        # Setup mock
        mock_s3 = MagicMock()
        mock_client.return_value = mock_s3
        
        # Test data
        test_filename = 'test-image.jpeg'
        image_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{test_filename}"
        
        # Call the function
        success, message = delete_image_from_s3(image_url)
        
        # Assertions
        assert success is True
        assert message == "Image deleted successfully"
        