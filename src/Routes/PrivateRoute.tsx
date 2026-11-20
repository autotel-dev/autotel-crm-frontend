import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getLoginPath, isTokenExpired } from "../Utilities/auth/session";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const { companyId } = useParams();

  useEffect(() => {
    // Remember which company login page this user came from.
    if (companyId) {
      localStorage.setItem("userId", companyId);
    }
  }, [companyId]);

  if (token === null) {
    return <Navigate to="/login" />;
  }

  if (isTokenExpired(token)) {
    // Work out the right login page before the token (and its role) is gone.
    const loginPath = getLoginPath();
    localStorage.removeItem("token");
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
