import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../ReaduxToolkit/Hooks";
import Footer from "./Footer/Footer";
import Header from "./Header";
import TapTop from "./TapTop/TapTop";

import Sidebar from "./Sidebar/Sidebar";
import ThemeCustomizer from "./ThemeCustomizer/ThemeCustomizer";
import { setToggleSidebar } from "../ReaduxToolkit/Reducer/LayoutSlice";
import { addSidebarLayouts } from "../ReaduxToolkit/Reducer/ThemeCustomizerSlice";
import { useSelector } from "react-redux";
import { getUserRole } from "../Api/globals";
import Loader from "../Pages/Loader/Loader";
import Loaderr, { LoaderForPermissions } from "./Loader/Loader";
import { ROLES } from "../constants/roles";

const Layout = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  // console.log("userPermissions---> ", userPermissions);

  const [open, setOpen] = useState<boolean>(false);
  const { toggleSidebar, scroll } = useAppSelector((state) => state.layout);
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const dispatch = useAppDispatch();
  const compactSidebar = () => {
    const windowWidth = window.innerWidth;
    if (layout === "material-icon") {
      if (windowWidth < 1200) {
        dispatch(setToggleSidebar(true));
      } else {
        dispatch(setToggleSidebar(false));
      }
    } else if (layout === "horizontal-wrapper") {
      if (windowWidth < 992) {
        dispatch(setToggleSidebar(true));
        dispatch(addSidebarLayouts("material-icon"));
      } else {
        dispatch(setToggleSidebar(false));
        // horizontal-wrapper
        dispatch(addSidebarLayouts("horizontal-wrapper"));
      }
    }
  };
  useEffect(() => {
    compactSidebar();
    window.addEventListener("resize", () => {
      compactSidebar();
    });
  }, [layout]);
  return (
    <>
      {getUserRole() !== ROLES.SUPER_ADMIN && userPermissions.length < 0 ? (
        <Loader />
      ) : (
        <>
          <Loaderr />
          <TapTop />
          {/* changing with belo line  */}
          {/* <div className={`page-wrapper ${layout} ${layout === "material-icon" ? `compact-sidebar compact-small` : "" } `}> */}
          <div className={`page-wrapper horizontal-wrapper `}>
            {/* changing with belo line */}
            {/* <div
          className={`page-header ${open ? "" : ""} ${
            toggleSidebar ? "close_icon" : ""
          }  ${scroll ? "d-none" : "d-block"}`}
        > */}
            {/* <div className={`page-header ${open ? "sidebar-default" : ""} ${toggleSidebar ? "close_icon" : ""}  ${scroll ? "d-none" : "d-block"}`}> */}
            <div className={`page-header d-block`}>
              <Header />
            </div>
            <div className="page-body-wrapper">
              <Sidebar setOpen={setOpen} open={open} />
              <div
                className="page-body"
                // style={{
                //   backgroundColor: "yellow",
                // }}
              >
                <Outlet />
              </div>
              {/* <Footer /> */}
            </div>
          </div>
          {/* <ThemeCustomizer /> */}
        </>
      )}
    </>
  );
};

export default Layout;
