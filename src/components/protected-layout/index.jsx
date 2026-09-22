import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@context";
import { ROUTES } from "@constants";
import { Loader } from "../loader";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) return <Loader />;
  if (!user)
    return (
      <Navigate to={ROUTES.LOGIN.pathname} state={{ from: location }} replace />
    );

  return children;
}
