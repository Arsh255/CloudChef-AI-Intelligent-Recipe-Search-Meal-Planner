import { CognitoUserPool } from "amazon-cognito-identity-js";

export const COGNITO = {
  USER_POOL_ID: "us-east-1_5Dqa8D8i7",
  CLIENT_ID: "6qrre3jn99ddasc9q6p7036vcg",
};

export const pool = new CognitoUserPool({
  UserPoolId: COGNITO.USER_POOL_ID,
  ClientId: COGNITO.CLIENT_ID,
  Storage: window.localStorage,
});
