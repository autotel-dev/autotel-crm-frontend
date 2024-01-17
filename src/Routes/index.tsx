import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LayoutRoutes from "./LayoutRoutes";
import { authRoutes } from "./AuthRoutes";
import Login from "../Pages/Authentication/Login";
import LoginForm from "../Pages/Auth/Auth";

const Routers = () => {
  const token = localStorage.getItem("token");
  console.log(token);

   console.log("window.location.pathname: ", window.location.pathname)
   console.log("process.env.PUBLIC_URL: ", process.env.PUBLIC_URL);
   
  

  return (
    <BrowserRouter basename={"/"}>
      <Routes>
        {token !== null ? (
          <>
            <Route
              path={`${process.env.PUBLIC_URL}` || "/"}
              element={
                <Navigate
                  to={`${process.env.PUBLIC_URL}/dashboards/shoppingplace`}
                />
              }
            />
          </>
        ) : (
          ""
        )}
        <Route path={"/"} element={<PrivateRoute />}>
          <Route path={`/*`} element={<LayoutRoutes />} />
        </Route>
        {authRoutes.map(({ path, Component }, i) => (
          <Route path={path} element={Component} key={i} />
        ))}
        <Route
          path={`${process.env.PUBLIC_URL}${
            window.location.pathname === "/superAdminLogin"
              ? "superAdminLogin"
              : "login"
          }`}
          element={<LoginForm />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
