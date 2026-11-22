import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import TapTop from "./TapTop/TapTop";
import { getUserRole } from "../Utilities/globals/globals";
import Loader from "../Pages/Utilities/Loader/Loader";
import Loaderr from "./Loader/Loader";
import { ROLES } from "../constants/roles";
import RailNav from "./Rail/RailNav";
import TopBar from "./Rail/TopBar";
import { useNavItems } from "./Rail/useNavItems";
import { useAtTheme } from "./Rail/useAtTheme";

// App shell (redesign Option C): slim icon rail on the left, floating top bar,
// page content below. The old top menu lives in ./Sidebar and is no longer used.
const Layout = () => {
  const { userPermissions } = useSelector((state: any) => state.userPermissions);
  const items = useNavItems();
  const { theme, toggle } = useAtTheme();

  useEffect(() => {
    document.body.classList.add("at-shell-on");
    return () => document.body.classList.remove("at-shell-on");
  }, []);

  if (getUserRole() !== ROLES.SUPER_ADMIN && userPermissions.length < 0) {
    return <Loader />;
  }

  return (
    <>
      <Loaderr />
      <TapTop />
      <div className="page-wrapper at-shell">
        <RailNav items={items} theme={theme} onToggleTheme={toggle} />
        <main className="at-main">
          <TopBar items={items} />
          <div className="page-body">
            {/* Shows the loader while a page's code downloads; rail and top bar stay. */}
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
