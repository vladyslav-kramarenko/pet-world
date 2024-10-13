import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

def lambda_handler(event, context):
    try:
        # Get the pet_id from the path parameters
        pet_id = event['pathParameters']['pet_id']

        # Delete the pet item from DynamoDB
        response = table.delete_item(
            Key={'pet_id': pet_id},
            ConditionExpression='attribute_exists(pet_id)'  # Ensure pet exists before deleting
        )

        # Return a success response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',  # Update this to your frontend URL in production
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'message': 'Pet deleted successfully'
            })
        }

    except ClientError as e:
        print(f"Error deleting pet: {e}")
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',  # Update this to your frontend URL in production
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
                },
                'body': json.dumps({
                    'error': 'Pet not found'
                })
            }
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',  # Update this to your frontend URL in production
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'error': 'Internal Server Error'
            })
        }
