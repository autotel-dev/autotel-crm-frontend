// Shared frame for every Setup page (company and super admin): "Setup" title,
// section tabs (most-used first, the rest under "More"), and the .st-page scope
// that restyles the older template pages inside it (setup.scss). Data and
// saving logic of each page are untouched.
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserRole } from "../../Utilities/globals/globals";
import { ROLES } from "../../constants/roles";
import "./setup.scss";

const U = process.env.PUBLIC_URL || "";

type Tab = { label: string; to: string };
type Group = { title: string; tabs: Tab[] };

const c = (label: string, slug: string): Tab => ({ label, to: `/company/setup/${slug}` });
const s = (label: string, slug: string): Tab => ({ label, to: `/super-admin/setup/${slug}` });

const COMPANY: { main: Tab[]; more: Group[] } = {
  main: [
    c("Devices", "devices"),
    c("Customers", "customers"),
    c("Groups", "groups"),
    c("Geofences", "geofence"),
    c("Alert rules", "alert-management"),
    { label: "Users", to: "/company/users" },
  ],
  more: [
    { title: "Organisation", tabs: [c("Branches", "branches"), c("Departments", "deparments"), c("Warehouses", "warehouses"), c("Service packages", "packages")] },
    { title: "Vehicles", tabs: [c("Vehicle makes", "vehicle-make"), c("Vehicle models", "vehicle-model")] },
    { title: "Complaints", tabs: [c("Complaint types", "complain-types")] },
    { title: "Messages", tabs: [c("Email templates", "email-template"), c("WhatsApp templates", "whatsapp-template"), c("Email gateway", "email-gateway"), c("WhatsApp gateway", "whatsApp-gateway")] },
  ],
};

const SUPER_ADMIN: { main: Tab[]; more: Group[] } = {
  main: [
    s("Countries", "countries"),
    s("Provinces", "province"),
    s("Cities", "cities"),
    s("Packages", "package"),
    s("CRM modules", "crm-module"),
    s("Servers", "server-details"),
  ],
  more: [
    { title: "Reference data", tabs: [s("Banks", "banks"), s("Currencies", "currencies"), s("Languages", "languages"), s("Insurance", "insurance"), s("Network providers", "network-provider")] },
    { title: "Vehicles", tabs: [s("Vehicle makes", "vehicle-make"), s("Vehicle models", "vehicle-model")] },
    { title: "Complaints", tabs: [s("Complaint types", "complain-types")] },
    { title: "Servers", tabs: [s("Server management", "server-management")] },
    { title: "Messages", tabs: [s("Email templates", "email-template"), s("WhatsApp templates", "whatsapp-template"), s("Email gateway", "email-gateway"), s("SMS gateway", "sms-gateway"), s("WhatsApp gateway", "whatsApp-gateway")] },
    { title: "Map", tabs: [s("Geofence", "geofence")] },
  ],
};

/** Title for Setup pages the main menu doesn't list (used by the top bar). */
export const SETUP_TITLES: [string, string][] = [...COMPANY.main, ...COMPANY.more.flatMap((g) => g.tabs), ...SUPER_ADMIN.main, ...SUPER_ADMIN.more.flatMap((g) => g.tabs)]
  .map((t) => [t.to, t.label] as [string, string]);

const isOn = (path: string, t: Tab) => path.toLowerCase() === t.to.toLowerCase() || path.toLowerCase().startsWith(t.to.toLowerCase() + "/");

export const SetupTabs = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(U, "");
  const set = getUserRole() === ROLES.SUPER_ADMIN ? SUPER_ADMIN : COMPANY;
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  // the current page, when it lives under "More", also shows as a tab
  const current = set.more.flatMap((g) => g.tabs).find((t) => isOn(path, t));

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="st-tabs" aria-label="Setup sections">
      {[...set.main, ...(current ? [current] : [])].map((t) => (
        <Link key={t.to} to={`${U}${t.to}`} className={isOn(path, t) ? "is-on" : ""} aria-current={isOn(path, t) ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
      <div className="st-more" ref={box}>
        <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          More <span aria-hidden="true">▾</span>
        </button>
        {open && (
          <div className="st-more__menu" role="menu">
            {set.more.map((g) => (
              <div key={g.title} className="st-more__group">
                <span>{g.title}</span>
                {g.tabs.map((t) => (
                  <Link key={t.to} role="menuitem" to={`${U}${t.to}`} className={isOn(path, t) ? "is-on" : ""}>{t.label}</Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const SetupShell = ({ children }: { children: React.ReactNode }) => (
  <div className="st-page">
    <header className="st-head">
      <h1 className="st-title">Setup</h1>
      <SetupTabs />
    </header>
    <div className="st-body">{children}</div>
  </div>
);

export default SetupShell;
