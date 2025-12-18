import { createContext, useContext, useState, useEffect } from "react";
import { pool } from "./cognito.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const sessionUser = pool.getCurrentUser();

    if (!sessionUser) {
      setAuthLoading(false);
      return;
    }

    sessionUser.getSession((err, session) => {
      if (!err && session.isValid()) {
        setUser(sessionUser);
      }
      setAuthLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
