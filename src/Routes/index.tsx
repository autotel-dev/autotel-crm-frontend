import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Loader from "../Pages/Utilities/Loader/Loader";
import LayoutRoutes from "./LayoutRoutes";
// import { authRoutes } from "./AuthRoutes";

import { lazy, Suspense, useEffect } from "react";

// Pages load on demand: each page's code downloads the first time it is opened.
const VerifyOTP = lazy(() => import("../Pages/Common/VerifyOTP/VerifyOTP"));
const LoginForm = lazy(() => import("../Pages/Common/Auth/Auth"));
const ForgotPassword = lazy(() => import("../Pages/Common/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("../Pages/Common/ResetPassword/ResetPassword"));
const VerifyOTPForForgotPassword = lazy(() => import("../Pages/Common/VerifyOTPForForgotPassword/VerifyOTPForForgotPassword"));

// Sign-in pages keep their own light design: drop the app's dark theme there
// (e.g. a session that expired and redirected straight to /login).
const AUTH_PAGE = /^\/(login|verifyOTP|forgot-password|verifyOTPForForgotPassword|reset-password)(\/|$)/;
const AuthThemeGuard = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (AUTH_PAGE.test(pathname)) {
      document.body.classList.remove("at-shell-on");
      // The login page follows the light/dark theme (it has its own toggle);
      // the older OTP / password-reset pages only have a light design.
      if (!/^\/login(\/|$)/.test(pathname)) {
        document.body.classList.remove("at-dark");
        document.documentElement.classList.remove("at-dark");
      }
    }
  }, [pathname]);
  return null;
};

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
      <AuthThemeGuard />
      <Suspense fallback={<Loader />}>
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
          path={`${process.env.PUBLIC_URL}/verifyOTP`}
          element={<VerifyOTP />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/forgot-password`}
          element={<ForgotPassword />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/verifyOTPForForgotPassword`}
          element={<VerifyOTPForForgotPassword />}
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
      </Suspense>
    </BrowserRouter>
  );
};

export default Routers;
