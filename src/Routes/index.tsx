import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LayoutRoutes from "./LayoutRoutes";
// import { authRoutes } from "./AuthRoutes";

import VerifyOTP from "../Pages/Common/VerifyOTP/VerifyOTP";
import { useEffect } from "react";
import LoginForm from "../Pages/Common/Auth/Auth";
import ForgotPassword from "../Pages/Common/ForgotPassword/ForgotPassword";
import ResetPassword from "../Pages/Common/ResetPassword/ResetPassword";

const Routers = () => {
  useEffect(() => {
    // console.log("userId", userId);
    // // console.log("useParams", userId);
  }, []);
  // if (id !== "" && id !== undefined) {
  //   localStorageId = localStorage.setItem("userId", id);
  // }
  const token = localStorage.getItem("token");
  // console.log(token);

  // console.log("window.location.pathname: ", window.location.pathname);
  // console.log("process.env.PUBLIC_URL: ", process.env.PUBLIC_URL);

  return (
    <BrowserRouter basename={"/"}>
      <Routes>
        {token !== null ? (
          <>
            <Route
              path={`${process.env.PUBLIC_URL}` || "/"}
              element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard`} />}
            />
          </>
        ) : (
          ""
        )}
        <Route path={"/"} element={<PrivateRoute />}>
          <Route path={`/*`} element={<LayoutRoutes />} />
        </Route>
        {/* {authRoutes.map(({ path, Component }, i) => (
          <Route path={path} element={Component} key={i} />
        ))} */}
        {/* <Route
          path={`${process.env.PUBLIC_URL}login/:userId`}
          element={<LoginForm />}
        /> */}
        <Route path="/login/:companyId" element={<PrivateRoute />} />
        <Route
          path={`${process.env.PUBLIC_URL}/login`}
          element={<LoginForm />}
        />
        {/* <Route
          path={`${process.env.PUBLIC_URL}login`}
          element={<Navigate to={"/login"} />}
        /> */}

        <Route
          path={`${process.env.PUBLIC_URL}/forgot-password`}
          element={<ForgotPassword />}
        />

        <Route
          path={`${process.env.PUBLIC_URL}/verifyOTP`}
          element={<VerifyOTP />}
        />

        <Route
          path={`${process.env.PUBLIC_URL}/reset-password`}
          element={<ResetPassword />}
        />
        {/* <Route
          path={`${process.env.PUBLIC_URL}/verifyOTP`}
          element={<VerifyOTP />}
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
