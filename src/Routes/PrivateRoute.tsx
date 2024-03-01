import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

const PrivateRoute = () => {
  

  // const login = JSON.parse(localStorage.getItem("login")!)
  //   ? JSON.parse(localStorage.getItem("login")!)
  //   : false;
  const token = localStorage.getItem("token");
  console.log(token);

  // const condition =
  //   window.location.pathname === "/superAdminLogin"
  //     ? "/superAdminLogin"
  //     : "/login";

  // console.log("condtion: ", condition);
  // console.log("condtion: ", window.location.pathname);

  // console.log("env: ", process.env.PUBLIC_URL);

  const { userId } = useParams();

  useEffect(() => {

    console.log("userId", userId);
  }, []);

  return token !== null ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        localStorage.getItem("userId") == null ||
        localStorage.getItem("userId") == undefined
          ? `${process.env.PUBLIC_URL}login/${userId}`
          : `${process.env.PUBLIC_URL}login`
      }
    />
  );
};

export default PrivateRoute;
