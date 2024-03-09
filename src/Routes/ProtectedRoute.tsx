import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

const ProtectedRoute = () => {

    const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {

  }, [hasPermission]);



  return hasPermission ? (
    <Outlet />
  ) :  (
    <Navigate to={`${process.env.PUBLIC_URL}/dashboards/shoppingplace`} />
  );
};

export default ProtectedRoute;
