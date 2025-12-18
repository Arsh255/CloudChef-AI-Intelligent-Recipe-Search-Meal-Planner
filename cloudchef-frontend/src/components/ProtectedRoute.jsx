import { useAuth } from "../auth/authContext.jsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  // Wait for Cognito session to load
  if (authLoading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
}
