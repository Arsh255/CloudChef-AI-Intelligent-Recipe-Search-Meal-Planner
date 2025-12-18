import json
import os
import boto3
import urllib3
import re
from datetime import datetime
from boto3.dynamodb.conditions import Key

# ---------------- ENV ----------------
GROQ_API_KEY = os.environ["GROQ_API_KEY"]
USERS_TABLE = os.environ["USERS_TABLE"]
MEALPLANS_TABLE = os.environ["MEALPLANS_TABLE"]

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(USERS_TABLE)
mealplans_table = dynamodb.Table(MEALPLANS_TABLE)

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
        http_method = event.get("httpMethod")

        # ✅ Allow CORS preflight
        if http_method == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": ""
            }

        # ---------- Auth ---------- 
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
                "body": "Unauthorized"
            }

        # ==================================================
        # ✅ POST → GENERATE A NEW MEAL PLAN or GET EXISTING
        # ==================================================
        if http_method == "POST":
            body = json.loads(event.get("body", "{}"))

            # If body contains data, generate a new meal plan
            if body:
                # ---------- Load user preferences ----------
                pref = users_table.get_item(Key={"userId": user_id}).get("Item", {})
                dislikes = pref.get("dislikes", "none")
                cuisine = pref.get("cuisine", "any")
                allergies = pref.get("allergies", "none")

                # ---------- Prompt for generating meal plan ----------
                prompt = f"""
                Generate a 7-day meal plan.

                User preferences:
                - Dislikes: {dislikes}
                - Cuisine: {cuisine}
                - Allergies: {allergies}

                STRICT RULES:
                - Return ONLY valid JSON
                - No explanations, no markdown, no extra text
                - Keys must be Monday through Sunday
                - Each day must include breakfast, lunch, and dinner
                - No ingredients list
                - Meals must be realistic and home-style

                FORMAT:
                {{
                  "Monday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }},
                  "Tuesday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }},
                  "Wednesday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }},
                  "Thursday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }},
                  "Friday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }},
                  "Saturday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }},
                  "Sunday": {{ "breakfast": "...", "lunch": "...", "dinner": "..." }}
                }}
                """

                result_text = call_groq(prompt).strip()

                # ---------- Clean LLM output ----------
                match = re.search(r"```json\s*(.*?)\s*```", result_text, re.DOTALL)
                if match:
                    result_text = match.group(1).strip()

                try:
                    meal_plan = json.loads(result_text)
                except Exception:
                    raise Exception(f"Groq did not return valid JSON:\n{result_text}")

                # ---------- Persist the generated meal plan ----------
                mealplans_table.put_item(
                    Item={
                        "userId": user_id,
                        "weekId": datetime.utcnow().isoformat(),
                        "createdAt": datetime.utcnow().isoformat(),
                        "plan": meal_plan
                    }
                )

                return {
                    "statusCode": 200,
                    "headers": CORS_HEADERS,
                    "body": json.dumps(meal_plan)
                }

            # If no body, fetch meal plans
            response = mealplans_table.query(
                KeyConditionExpression=Key("userId").eq(user_id)
            )

            items = response.get("Items", [])

            # Sort items by created date (newest first)
            items.sort(
                key=lambda x: x.get("createdAt", ""),
                reverse=True
            )

            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(items)
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
