import json
import boto3
from boto3.dynamodb.conditions import Key
import decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    # Log the event object to see what's being passed
    print("Received event: ", json.dumps(event))

    try:
        owner_id = event['pathParameters']['id']

        response = table.query(
            IndexName="owner_id-index",
            KeyConditionExpression=Key('owner_id').eq(owner_id)
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            },
            'body': json.dumps(response['Items'], default=decimal_default)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
