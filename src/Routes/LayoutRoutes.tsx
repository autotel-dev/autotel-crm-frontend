import { Route, Routes } from "react-router-dom";
import routes from "./Route";
import Layout from "../Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

const LayoutRoutes = () => {
  return (
    <>
      {/* <Routes>
        {routes.map(({ path, Component }, i) => (
          <Route element={<Layout />} key={i}>
          
            <Route path={path} element={Component} />
          </Route>
        ))}
      </Routes> */}

      <Routes>
        {routes.map(({ path, Component, permission }, i) =>
          permission ? (
            <Route element={<ProtectedRoute />} key={i}>
              <Route element={<Layout />} key={i}>
                <Route path={path} element={Component} />
              </Route>
            </Route>
          ) : (
            <Route element={<Layout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          )
        )}
      </Routes>
    </>
  );
};

export default LayoutRoutes;
