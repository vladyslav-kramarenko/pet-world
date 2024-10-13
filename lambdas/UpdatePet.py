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

        # Return a success response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',  # Update this to your frontend URL in production
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
            },
            'body': json.dumps({
                'message': 'Pet updated successfully',
                'updated_attributes': response['Attributes']
            })
        }

    except ClientError as e:
        print(f"Error updating pet: {e}")
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
