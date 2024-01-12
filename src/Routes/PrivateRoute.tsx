import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const login = JSON.parse(localStorage.getItem("login")!) ? JSON.parse(localStorage.getItem("login")!) : false;
  const token = localStorage.getItem("token");
  console.log(token);

  const condition = window.location.pathname === "/crm/superAdminLogin"
  ? "/superAdminLogin"
  : "/login";

  console.log("condtion: ", condition);
  console.log("condtion: ", window.location.pathname);

  console.log("env: ", process.env.PUBLIC_URL);

  return token !== null ? (
    <Outlet />
  ) : (
    <Navigate to={`${process.env.PUBLIC_URL}/${
      window.location.pathname === "/crm/superAdminLogin"
        ? "superAdminLogin"
        : "login"
    }`} />
  );
};

export default PrivateRoute;
