// Floating top bar: current section name on the left, clock / notifications /
// profile (the existing RightHeader) on the right.
import { useLocation } from "react-router-dom";
import RightHeader from "../Header/RightHeader/RightHeader";
import { NavItem } from "./useNavItems";

const U = process.env.PUBLIC_URL || "";

// Sub-pages that aren't in the menu (checked first, so they win over their parent).
const SPECIAL: [string, string][] = [
  ["/users/account", "My account"],
  ["/users/settings", "Settings"],
  ["/super-admin/companies/createComapany", "Create company"],
  ["/super-admin/setup/company/update-company", "Update company"],
  ["/super-admin/setup/server_management/AllLogs", "Server logs"],
  ["/super-admin/setup/server-details/create-new-Server", "New server"],
  ["/super-admin/setup/server-details/update-server", "Update server"],
  ["/support/ticketDetails", "Ticket"],
  ["/company/trip-reports", "Trip reports"],
];

const titleFor = (items: NavItem[], path: string): string => {
  for (const [p, t] of SPECIAL) if (path.startsWith(p)) return t;
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
