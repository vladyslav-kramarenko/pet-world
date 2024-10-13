import json
import boto3
from decimal import Decimal, InvalidOperation
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

# DynamoDB resource setup
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))  # Log the full event with better readability

    try:
        # Extract query parameters
        query_params = event.get('queryStringParameters', {}) or {}  # Ensure query_params is always a dictionary
        print(f"Raw query parameters: {query_params}")  # Log raw query parameters

        # Safely extract query parameters, with fallback to None for empty or missing values
        pet_type = query_params.get('type') if query_params.get('type', '').strip() else None
        age = query_params.get('age') if query_params.get('age', '').strip() else None
        sort = query_params.get('sort') if query_params.get('sort', '').strip() else None
        country = query_params.get('country') if query_params.get('country', '').strip() else None
        province = query_params.get('province') if query_params.get('province', '').strip() else None
        town = query_params.get('town') if query_params.get('town', '').strip() else None

        # Safe conversion for price parameters with default values
        min_price = safe_decimal_conversion(query_params.get('min_price'), Decimal("0.0"))
        max_price = safe_decimal_conversion(query_params.get('max_price'), Decimal("9999999.99"))  # Large max default

        # Log the extracted query parameters and default values used
        print(f"Extracted parameters - pet_type: {pet_type}, age: {age}, sort: {sort}, "
              f"country: {country}, province: {province}, town: {town}, "
              f"min_price: {min_price}, max_price: {max_price}")

        # Initialize scan parameters
        scan_kwargs = {}
        filter_expression = []

        # Add filters based on query parameters
        if pet_type:
            filter_expression.append(Attr('pet_type').eq(pet_type))
        if country:
            filter_expression.append(Attr('country').eq(country))
        if province:
            filter_expression.append(Attr('province').eq(province))
        if town:
            filter_expression.append(Attr('town').eq(town))
        if age:
            filter_expression.append(Attr('age').eq(age))

        # Add price filters as Decimal
        filter_expression.append(Attr('price').gte(min_price) & Attr('price').lte(max_price))

        # Combine filter expressions if any are present
        if filter_expression:
            scan_kwargs['FilterExpression'] = filter_expression[0]
            for condition in filter_expression[1:]:
                scan_kwargs['FilterExpression'] &= condition

        # Log filter expression before scanning
        print(f"Final Filter Expression: {scan_kwargs.get('FilterExpression')}")

        # Perform DynamoDB scan operation
        response = table.scan(**scan_kwargs)
        print(f"DynamoDB scan response: {response}")  # Log the full DynamoDB response

        pets = response.get('Items', [])
        print(f"Retrieved pets: {pets}")  # Log the retrieved pets list

        # Sorting logic based on the 'sort' query parameter
        if sort:
            if sort == 'price_asc':
                pets.sort(key=lambda x: float(x['price']) if 'price' in x else float('inf'))
            elif sort == 'price_desc':
                pets.sort(key=lambda x: float(x['price']) if 'price' in x else float('-inf'), reverse=True)

        # Return success response with CORS headers
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            'body': json.dumps({'pets': pets}, default=decimal_default)
        }
    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
        print(f"Full error response: {e.response}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            'body': json.dumps({'error': f"Client error occurred: {e.response['Error']['Message']}"})
        }
    except Exception as e:
        print(f"Exception: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            'body': json.dumps({'error': f"An unexpected error occurred: {str(e)}"})
        }


def safe_decimal_conversion(value, default):
    """
    Safely convert a value to Decimal. If conversion fails or value is None/empty, return default.
    """
    try:
        if value is None or value.strip() == '':
            return default
        return Decimal(value)
    except (ValueError, InvalidOperation):
        return default

def decimal_default(obj):
    """
    Custom JSON serializer for Decimal type, to handle JSON serialization of Decimal types.
    """
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError
