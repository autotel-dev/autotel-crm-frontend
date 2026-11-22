// Floating top bar: current section name on the left, clock / notifications /
// profile (the existing RightHeader) on the right.
import { useLocation } from "react-router-dom";
import RightHeader from "../Header/RightHeader/RightHeader";
import { NavItem } from "./useNavItems";

const U = process.env.PUBLIC_URL || "";

const titleFor = (items: NavItem[], path: string): string => {
  for (const item of items) {
    for (const c of item.children || []) {
      const l = c.link.replace(U, "");
      if (path === l || path.startsWith(l + "/")) return c.title;
    }
    if (item.link) {
      const l = item.link.replace(U, "");
      if (path === l || path.startsWith(l + "/")) return item.title;
    }
  }
  if (path.startsWith("/users/account")) return "My account";
  if (path.startsWith("/users/settings")) return "Settings";
  return "Autotel";
};

const TopBar = ({ items }: { items: NavItem[] }) => {
  const { pathname } = useLocation();
  return (
    <header className="at-topbar">
      <h1 className="at-topbar__title">{titleFor(items, pathname.replace(U, ""))}</h1>
      <div className="at-topbar__spacer" />
      {/* Wrapped in the template's header classes so the bell and profile
          menu keep their original sizes and hover behaviour. */}
      <div className="page-header at-topbar__hdr">
        <div className="header-wrapper row m-0">
          <RightHeader />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
