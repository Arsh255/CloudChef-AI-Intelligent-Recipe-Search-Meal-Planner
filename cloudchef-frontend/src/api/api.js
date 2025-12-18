import { getSessionToken } from "../auth/cognitoSession";

// Base URL of your API Gateway
const API_BASE = "https://sryh2mh2sg.execute-api.us-east-1.amazonaws.com/prod/api";

// Generic GET request
export async function apiGet(path) {
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${text}`);
  }

  return res.json();
}

// Generic POST request
export async function apiPost(path, body) {
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${text}`);
  }

  return res.json();
}
