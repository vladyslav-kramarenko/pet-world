# src/lambdas/create_pet_lambda.py

import json
import boto3
import uuid
from botocore.exceptions import ClientError
from decimal import Decimal

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))

    if 'body' not in event:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Bad Request: Missing "body" key'})
        }

    try:
        # Parse the request body
        pet_data = json.loads(event['body'])

        # Generate a unique pet_id
        pet_id = str(uuid.uuid4())

        # Prepare item to insert into DynamoDB
        item = {
            'pet_id': pet_id,
            'pet_name': pet_data.get('pet_name', 'Unnamed'),
            'pet_type': pet_data.get('pet_type', 'Unknown'),
            'age': pet_data.get('age', 'Unknown'),
            'country': pet_data.get('country', 'Unknown'),
            'province': pet_data.get('province', 'Unknown'),
            'town': pet_data.get('town', 'Unknown'),
            'description': pet_data.get('description', 'No description'),
            'price': Decimal(str(pet_data.get('price', 0))),  # Convert price to Decimal
            'gender': pet_data.get('gender', 'Unknown'),
            'health_status': pet_data.get('health_status', []),  # Default to empty list
            'documents': pet_data.get('documents', []),          # Default to empty list
            'image_url': pet_data.get('image_url', '')
        }

        # Log the item being inserted
        print(f"Inserting item into DynamoDB: {item}")

        # Insert item into DynamoDB table
        table.put_item(Item=item)

        # Success response
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Pet created successfully', 'pet_id': pet_id})
        }

    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error'})
        }
    except Exception as e:
        print(f"Exception: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error'})
        }