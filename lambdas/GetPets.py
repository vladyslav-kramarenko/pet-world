import json
import boto3
from decimal import Decimal, InvalidOperation
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

# DynamoDB resource setup
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Pets')

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))  # Log the full event

    try:
        # Extract query parameters
        query_params = event.get('queryStringParameters', {}) or {}
        print(f"Raw query parameters: {query_params}")

        # Extract query parameters
        pet_type = query_params.get('type') if query_params.get('type', '').strip() else None
        age = query_params.get('age') if query_params.get('age', '').strip() else None
        sort = query_params.get('sort') if query_params.get('sort', '').strip() else None
        country = query_params.get('country') if query_params.get('country', '').strip() else None
        province = query_params.get('province') if query_params.get('province', '').strip() else None
        town = query_params.get('town') if query_params.get('town', '').strip() else None

        # Extract pagination parameters
        limit = int(query_params.get('limit', '10'))  # Default to 10 items per page
        next_token = query_params.get('nextToken')  # Handle pagination with ExclusiveStartKey

        # Safe conversion for price parameters, but only apply if they are provided
        min_price = safe_decimal_conversion(query_params.get('min_price'), None)
        max_price = safe_decimal_conversion(query_params.get('max_price'), None)

        print(f"Extracted parameters - pet_type: {pet_type}, age: {age}, sort: {sort}, "
              f"country: {country}, province: {province}, town: {town}, "
              f"min_price: {min_price}, max_price: {max_price}, limit: {limit}, nextToken: {next_token}")

        # Initialize scan parameters
        scan_kwargs = {'Limit': limit}
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

        # Add price filters only if explicitly provided
        if min_price is not None and max_price is not None:
            filter_expression.append(Attr('price').gte(min_price) & Attr('price').lte(max_price))

        # Combine filter expressions if any are present
        if filter_expression:
            scan_kwargs['FilterExpression'] = filter_expression[0]
            for condition in filter_expression[1:]:
                scan_kwargs['FilterExpression'] &= condition

        # Handle pagination with ExclusiveStartKey
        if next_token:
            scan_kwargs['ExclusiveStartKey'] = json.loads(next_token)

        print(f"Final Filter Expression: {scan_kwargs.get('FilterExpression')}")

        # Perform DynamoDB scan operation
        response = table.scan(**scan_kwargs)
        print(f"DynamoDB scan response: {response}")

        pets = response.get('Items', [])
        print(f"Retrieved pets: {pets}")

        # Get the pagination token for the next set of results
        last_evaluated_key = response.get('LastEvaluatedKey', None)

        # Sorting logic (if applicable)
        if sort:
            if sort == 'price_asc':
                pets.sort(key=lambda x: float(x['price']) if 'price' in x else float('inf'))
            elif sort == 'price_desc':
                pets.sort(key=lambda x: float(x['price']) if 'price' in x else float('-inf'), reverse=True)

        # Build the response
        result = {
            'pets': pets,
            'nextToken': json.dumps(last_evaluated_key) if last_evaluated_key else None  # Pagination token
        }

        # Return success response with CORS headers
        return {
            'statusCode': 200,
            'body': json.dumps(result, default=decimal_default)
        }

    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f"Client error occurred: {e.response['Error']['Message']}"})
        }
    except Exception as e:
        print(f"Exception: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f"An unexpected error occurred: {str(e)}"})
        }

# Helper functions remain the same
def safe_decimal_conversion(value, default):
    try:
        if value is None or value.strip() == '':
            return default
        return Decimal(value)
    except (ValueError, InvalidOperation):
        return default

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError
