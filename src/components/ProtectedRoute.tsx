import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location.pathname]); // ✅ reacts on navigation

  if (isAuthenticated === null) return null; // prevent flicker

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}