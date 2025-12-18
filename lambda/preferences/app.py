import json
import os
import boto3

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ["USERS_TABLE"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
}

def lambda_handler(event, context):
    try:
        http_method = event.get("httpMethod")

        if http_method == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": ""
            }

        # Extract user_id from the Cognito Authorization header
        user_id = (
            event.get("requestContext", {})
                 .get("authorizer", {})
                 .get("claims", {})
                 .get("sub")
        )

        if not user_id:
            return {
                "statusCode": 401,
                "headers": CORS_HEADERS,
                "body": "Unauthorized",
            }

        # ---------- POST: Fetch preferences or save/update preferences ----------
        if http_method == "POST":
            # Check if the request body is empty (for GET-like behavior)
            body = json.loads(event.get("body", "{}"))
            
            # If body is empty, treat it as a fetch request
            if not body:
                # Fetch user preferences from DynamoDB
                response = users_table.get_item(
                    Key={"userId": user_id}
                )

                item = response.get("Item")

                if not item:
                    return {
                        "statusCode": 404,
                        "headers": CORS_HEADERS,
                        "body": json.dumps({"message": "No preferences found"})
                    }

                return {
                    "statusCode": 200,
                    "headers": CORS_HEADERS,
                    "body": json.dumps(item)
                }

            # Otherwise, treat it as a save/update request
            # Save/update user preferences in DynamoDB
            users_table.put_item(
                Item={
                    "userId": user_id,
                    **body
                }
            )

            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "message": "Preferences saved",
                    "data": body
                })
            }

        return {
            "statusCode": 405,
            "headers": CORS_HEADERS,
            "body": "Method Not Allowed"
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }
