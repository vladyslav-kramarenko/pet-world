import json
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

def lambda_handler(event, context):
    try:
        # Get the pet_id from the path parameters
        pet_id = event['pathParameters']['id']
        print(f"Received pet_id: {pet_id}")

        # Query the DynamoDB table to get the pet details
        response = table.get_item(Key={'pet_id': pet_id})

        # Check if the pet was found
        if 'Item' in response:
            pet = response['Item']
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
                },
                'body': json.dumps(pet, default=decimal_default)  # Use the custom serializer here
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
                },
                'body': json.dumps({
                    'error': 'Pet not found'
                })
            }

    except ClientError as e:
        print(f"Error fetching pet: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'error': 'Internal Server Error'
            })
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'error': str(e)
            })
        }


def decimal_default(obj):
    """
    Custom JSON serializer for Decimal type, to handle JSON serialization of Decimal types.
    """
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError
