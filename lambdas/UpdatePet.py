import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

# Helper function to convert Decimal to float for JSON serialization
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)  # Convert Decimal to float for JSON serialization
    raise TypeError

def lambda_handler(event, context):
    try:
        # Get the pet_id from the path parameters
        pet_id = event['pathParameters']['id']

        # Parse the request body to get updated data
        updated_data = json.loads(event['body'])

        # Define the update expression and attribute values
        update_expression = 'SET '
        expression_attribute_values = {}

        # Add each field to the update expression
        for key, value in updated_data.items():
            update_expression += f"{key} = :{key}, "
            expression_attribute_values[f":{key}"] = value

        # Remove the last comma and space from the update expression
        update_expression = update_expression[:-2]

        # Update the pet item in DynamoDB
        response = table.update_item(
            Key={'pet_id': pet_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='UPDATED_NEW'
        )

        # Return a success response with Decimal values converted to float
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'message': 'Pet updated successfully',
                'updated_attributes': response['Attributes']
            }, default=decimal_default)  # Use the decimal_default function to handle Decimal conversion
        }

    except ClientError as e:
        print(f"Error updating pet: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust this for your production environment
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'error': 'Internal Server Error'
            })
        }
