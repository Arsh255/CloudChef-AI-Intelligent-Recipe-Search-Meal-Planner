import { pool } from "./cognito";
import { CognitoUser } from "amazon-cognito-identity-js";

export function getCurrentUser() {
  return pool.getCurrentUser();
}

export function getSessionToken() {
  return new Promise((resolve, reject) => {
    const user = getCurrentUser();
    if (!user) return resolve(null);

    user.getSession((err, session) => {
      if (err || !session.isValid()) {
        return resolve(null);
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
}
