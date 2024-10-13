import boto3
import json
import os

# Initialize the S3 client
s3_client = boto3.client('s3')
BUCKET_NAME = os.environ['pet-profiles']

def lambda_handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body'])

        pet_id = body.get('pet_id')
        filenames = body.get('filenames', [])
        main_image = body.get('main_image', 'main.jpg')  # Default main image name

        if not pet_id or not filenames:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'pet_id and filenames are required'})
            }

        # Generate signed URLs for each filename, including the main image
        urls = {}

        # Main image URL
        main_image_key = f"pet-profiles/{pet_id}/{main_image}"
        main_upload_url = s3_client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': main_image_key,
                'ContentType': 'image/jpeg'  # Adjust according to the expected image type
            },
            ExpiresIn=3600
        )
        urls['main_image'] = {
            'upload_url': main_upload_url,
            'file_url': f"https://{BUCKET_NAME}.s3.amazonaws.com/{main_image_key}"
        }

        # Gallery images URLs
        for filename in filenames:
            key = f"pet-profiles/{pet_id}/{filename}"
            upload_url = s3_client.generate_presigned_url(
                ClientMethod='put_object',
                Params={
                    'Bucket': BUCKET_NAME,
                    'Key': key,
                    'ContentType': 'image/jpeg'  # Adjust according to the expected image type
                },
                ExpiresIn=3600
            )
            urls[filename] = {
                'upload_url': upload_url,
                'file_url': f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}"
            }

        # Return the generated URLs
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            'body': json.dumps(urls)
        }

    except Exception as e:
        print(f"Error generating signed URLs: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            'body': json.dumps({'error': str(e)})
        }
