import json
import os
import boto3
import urllib3

RECIPES_TABLE = os.environ["RECIPES_TABLE"]
GROQ_API_KEY = os.environ["GROQ_API_KEY"]
# GROQ_API_KEY = os.environ["GroqApiKey"]
dynamodb = boto3.resource("dynamodb")
recipes_table = dynamodb.Table(RECIPES_TABLE)

http = urllib3.PoolManager()

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
}

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
        "max_tokens": 900,
        "temperature": 0.5
    })

    response = http.request("POST", url, body=payload, headers=headers)

    raw = response.data.decode("utf-8")

    try:
        data = json.loads(raw)
    except Exception:
        raise Exception(f"Invalid JSON from Groq: {raw}")

    try:
        return data["choices"][0]["message"]["content"]
    except Exception:
        raise Exception(f"Unexpected Groq response: {data}")


def lambda_handler(event, context):
    try:
        query = event.get("queryStringParameters", {}).get("query", "")

        if not query:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": "Missing query"
            }

        prompt = f"""
            Generate 5 recipes for: {query}

            STRICT RULES:
            - Each recipe MUST have exactly two fields: "title" and "fullrecipe"
            - fullrecipe MUST be in one paragraph 
            - DO NOT include ingredients list
            - DO NOT include markdown
            - DO NOT include ```json``` or any code block
            - Return ONLY valid JSON array. Nothing else.

            Format:
            [
            {{
                "title": "...",
                "fullrecipe": "..."
            }}
            ]
            """

        # CALL GROQ (corrected)
        result_text = call_groq(prompt)
        import re

        # Clean LLM output
        cleaned = result_text.strip()

        # Extract JSON if wrapped in markdown ```json ... ```
        match = re.search(r"```json\s*(.*?)\s*```", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1).strip()

        # Try to parse JSON
        try:
            recipes = json.loads(cleaned)
        except Exception:
            raise Exception(f"LLM did not return valid JSON: {result_text}\n\nCleaned: {cleaned}")

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(recipes)
        }


    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }
