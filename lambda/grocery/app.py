import json
import os
import boto3
import urllib3
import re
from datetime import datetime

# ---------------- ENV ----------------
GROQ_API_KEY = os.environ["GROQ_API_KEY"]
GROCERY_TABLE = os.environ["GROCERY_TABLE"]

dynamodb = boto3.resource("dynamodb")
grocery_table = dynamodb.Table(GROCERY_TABLE)

http = urllib3.PoolManager()

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
}

# ---------------- GROQ CALL ----------------
def call_groq(prompt):
    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = json.dumps({
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 1200,
        "temperature": 0.4
    })

    response = http.request("POST", url, body=payload, headers=headers)
    raw = response.data.decode("utf-8")

    try:
        data = json.loads(raw)
        return data["choices"][0]["message"]["content"]
    except Exception:
        raise Exception(f"Invalid Groq response: {raw}")

# ---------------- LAMBDA ----------------
def lambda_handler(event, context):
    try:
        # ---------- Auth ----------
        user_id = event.get("requestContext", {}).get("authorizer", {}).get("claims", {}).get("sub")
        if not user_id:
            return {
                "statusCode": 401,
                "headers": CORS_HEADERS,
                "body": "Unauthorized"
            }

        # ---------- POST REQUEST BODY ----------
        body = json.loads(event.get("body", "{}"))
        recipe_name = body.get("recipe", "").strip()

        if not recipe_name:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Recipe name is required"})
            }

        # ---------- Generate grocery list prompt with quantity ----------
        prompt = f"""
        Generate a grocery list for the recipe: {recipe_name}

        STRICT RULES:
        - Include both the name and quantity of each item in the grocery list.
        - Format each grocery item as: "<quantity> <item>" (e.g., "2 tomatoes", "1 onion").
        - Return the list as a JSON array of strings, where each string is an item with quantity.
        - Only return the grocery list, no extra text.
        """

        result_text = call_groq(prompt).strip()

        # ---------- Clean LLM output ----------
        match = re.search(r"```json\s*(.*?)\s*```", result_text, re.DOTALL)
        if match:
            result_text = match.group(1).strip()

        try:
            grocery_list = json.loads(result_text)
        except Exception:
            raise Exception(f"Groq did not return valid JSON:\n{result_text}")

        # ---------- Persist grocery list (optional, if you want to store it) ----------
        grocery_table.put_item(
            Item={
                "userId": user_id,
                "listId": "latest",
                "createdAt": datetime.utcnow().isoformat(),
                "items": grocery_list
            }
        )

        # ---------- Return the grocery list ----------
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"groceryList": grocery_list})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }
