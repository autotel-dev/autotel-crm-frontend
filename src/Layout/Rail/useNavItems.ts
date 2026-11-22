// Menu for the icon rail, per role. Same links and permission rules as the
// old top menu (Layout/Sidebar/SidebarMain.tsx).
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getUserRole } from "../../Utilities/globals/globals";
import { ROLES } from "../../constants/roles";
import { moduleIcon } from "./icons";

export interface NavLink {
  title: string;
  link: string;
}
export interface NavItem {
  key: string;
  title: string;
  icon: string;
  link?: string;
  children?: NavLink[];
  /** Pinned to the bottom of the rail (e.g. Setup). */
  bottom?: boolean;
}

const U = process.env.PUBLIC_URL || "";

const SUPER_ADMIN_SETUP: NavLink[] = [
  ["Country", "countries"],
  ["Province", "province"],
  ["City", "cities"],
  ["Package", "package"],
  ["CRM Modules", "crm-module"],
  ["Banks", "banks"],
  ["Currencies", "currencies"],
  ["Languages", "languages"],
  ["Insurance", "insurance"],
  ["Vehicle Make", "vehicle-make"],
  ["Vehicle Model", "vehicle-model"],
  ["Network Provider", "network-provider"],
  ["Complain Types", "complain-types"],
  ["Server Details", "server-details"],
  ["Server Management", "server-management"],
  ["Email Gateway", "email-gateway"],
  ["WhatsApp Gateway", "whatsapp-gateway"],
  ["Email Templates", "email-template"],
  ["WhatsApp Templates", "whatsapp-template"],
  ["Geofence", "geofence"],
].map(([title, slug]) => ({ title, link: `${U}/super-admin/setup/${slug}` }));

const COMPANY_SETUP: NavLink[] = [
  ["Customers", "customers"],
  ["Devices", "devices"],
  ["Departments", "deparments"],
  ["Packages", "packages"],
  ["Groups", "groups"],
  ["Alert Management", "alert-management"],
  ["Complain Types", "complain-types"],
  ["Vehicle Make", "vehicle-make"],
  ["Vehicle Model", "vehicle-model"],
  ["Geofence", "geofence"],
].map(([title, slug]) => ({ title, link: `${U}/company/setup/${slug}` }));

// Module routes that exist under /operator/modules (see Routes/Route.tsx).
const OPERATOR_MODULE_ROUTES = ["/monitoring", "/control-room", "/complaint-center", "/saio-central"];

export const useNavItems = (): NavItem[] => {
  const { crmActiveModules } = useSelector((state: any) => state.crmModules);
  const { userPermissions } = useSelector((state: any) => state.userPermissions);
  const role = getUserRole();

  return useMemo(() => {
    const perms: any[] = userPermissions || [];
    const user = perms.find((p) => p.title === "User");
    const support = perms.find((p) => p.title === "Support");
    const modules: any[] = crmActiveModules || [];

    const moduleItems = (base: string): NavItem[] =>
      modules.map((m) => ({
        key: `module:${m.route}`,
        title: m.name,
        icon: moduleIcon(m.route),
        link: `${U}${base}${m.route}`,
      }));

    const dashboard: NavItem = { key: "dashboard", title: "Dashboard", icon: "dashboard", link: `${U}/dashboard` };
    const supportItem: NavItem = { key: "support", title: "Support", icon: "support", link: `${U}/support` };

    if (role === ROLES.SUPER_ADMIN) {
      return [
        dashboard,
        { key: "companies", title: "Companies", icon: "companies", link: `${U}/super-admin/companies` },
        supportItem,
        { key: "setup", title: "Setup", icon: "setup", children: SUPER_ADMIN_SETUP, bottom: true },
      ];
    }

    if (role === ROLES.OPERATOR) {
      // The old menu hid Support when the operator had no Support permission entry.
      const showSupport = support !== undefined && support.read;
      // Only modules that have an operator page (Routes/Route.tsx); others,
      // such as Trip Management, led to "Not Accessible".
      const operatorModules = moduleItems("/operator/modules").filter((m) =>
        OPERATOR_MODULE_ROUTES.some((r) => m.key === `module:${r}`)
      );
      return [dashboard, ...operatorModules, ...(showSupport ? [supportItem] : [])];
    }

    // Company (default, as in the old menu)
    const showUser = user !== undefined && user.read;
    const showSupport = support !== undefined && support.read;
    return [
      dashboard,
      ...moduleItems("/company/modules"),
      { key: "reports", title: "Reports", icon: "reports", link: `${U}/company/reports` },
      ...(showUser ? [{ key: "users", title: "Users", icon: "users", link: `${U}/company/users` }] : []),
      ...(showSupport ? [supportItem] : []),
      { key: "setup", title: "Setup", icon: "setup", children: COMPANY_SETUP, bottom: true },
    ];
  }, [crmActiveModules, userPermissions, role]);
};
