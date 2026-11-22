// Super-admin home. Replaces the design template's shop sample widgets.
// Live platform figures (devices, servers, gateways) come in Phase 2.
import { Link } from "react-router-dom";
import { ICONS } from "../../../Layout/Rail/icons";

const U = process.env.PUBLIC_URL || "";

const LINKS = [
  { name: "Companies", desc: "All companies and their packages", to: "/super-admin/companies", icon: "companies" },
  { name: "Create company", desc: "Add a new company", to: "/super-admin/companies/createComapany", icon: "companies" },
  { name: "Packages", desc: "Plans and what they include", to: "/super-admin/setup/package", icon: "module" },
  { name: "CRM modules", desc: "Modules companies can use", to: "/super-admin/setup/crm-module", icon: "module" },
  { name: "Server management", desc: "Parser servers and logs", to: "/super-admin/setup/server-management", icon: "setup" },
  { name: "Email gateway", desc: "Outgoing email settings", to: "/super-admin/setup/email-gateway", icon: "complaints" },
  { name: "WhatsApp gateway", desc: "WhatsApp sending settings", to: "/super-admin/setup/whatsapp-gateway", icon: "complaints" },
  { name: "Support tickets", desc: "Questions from companies", to: "/support", icon: "support" },
];

const SuperAdminHome = () => (
  <div className="at-page" style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--at-font)", color: "var(--at-text)" }}>
    <div>
      <div style={{ fontSize: 13, color: "var(--at-muted)" }}>Super-admin</div>
      <h2 style={{ margin: 0, font: "700 30px var(--at-font-display)" }}>Platform overview</h2>
    </div>
    <div className="at-quick-grid">
      {LINKS.map((l) => (
        <Link key={l.to} to={`${U}${l.to}`} className="at-quick-link">
          <span className="at-quick-link__icon">{ICONS[l.icon]}</span>
          <span>
            <span className="at-quick-link__name" style={{ display: "block" }}>{l.name}</span>
            <span className="at-quick-link__desc">{l.desc}</span>
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default SuperAdminHome;
