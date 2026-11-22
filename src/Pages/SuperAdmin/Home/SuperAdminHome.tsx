// Super-admin home: platform overview (redesign Phase 2, design "A7 / C7").
// Data: GET /api/v1/overview/super-admin (backend controllers/dashboard/OverviewController.js).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAll } from "../../../Utilities/api";
import { GET_SUPER_ADMIN_OVERVIEW } from "../../../Utilities/api/apiEndpoints";
import { ICONS } from "../../../Layout/Rail/icons";
import { fmtBytes, fmtDate, fmtNum, fmtUptime, pct, STATUS_META } from "../../Overview/format";

const U = process.env.PUBLIC_URL || "";

const LINKS = [
  { name: "Companies", desc: "All companies and their packages", to: "/super-admin/companies", icon: "companies" },
  { name: "Create company", desc: "Add a new company", to: "/super-admin/companies/createComapany", icon: "companies" },
  { name: "Packages", desc: "Plans and what they include", to: "/super-admin/setup/package", icon: "module" },
  { name: "Server management", desc: "Parser servers and logs", to: "/super-admin/setup/server-management", icon: "setup" },
  { name: "Email gateway", desc: "Outgoing email settings", to: "/super-admin/setup/email-gateway", icon: "complaints" },
  { name: "WhatsApp gateway", desc: "WhatsApp sending settings", to: "/super-admin/setup/whatsapp-gateway", icon: "complaints" },
];

const STATE_PILL: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "at-pill--ok" },
  RENEW_SOON: { label: "Renew soon", cls: "at-pill--warn" },
  EXPIRED: { label: "Package expired", cls: "at-pill--bad" },
  INACTIVE: { label: "Inactive", cls: "" },
};

const SuperAdminHome = () => {
  const [data, setData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getAll({ url: GET_SUPER_ADMIN_OVERVIEW }).then((res: any) => {
      if (!alive) return;
      if (res && res.success) setData(res.data);
      else setFailed(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const sc = data?.devices?.statusCounts || {};
  const total = data?.devices?.total || 0;
  const growth: any[] = data?.deviceGrowth || [];
  const growthMax = Math.max(1, ...growth.map((g) => g.count));
  const added6m = growth.reduce((s, g) => s + g.count, 0);

  return (
    <div className="at-page">
      <div className="at-page__head">
        <div>
          <div className="at-page__eyebrow">Super-admin · {today}</div>
          <h2 className="at-page__title">Platform overview</h2>
        </div>
        <div style={{ flex: 1 }} />
        <Link to={`${U}/super-admin/setup/server_management/AllLogs`} className="at-btn">View logs</Link>
        <Link to={`${U}/super-admin/companies/createComapany`} className="at-btn at-btn--primary">+ Create company</Link>
      </div>

      {failed && (
        <div className="at-tile" role="alert">
          <strong>Couldn't load the platform figures.</strong>
          <span className="at-tile__sub">Refresh the page to try again. The links below still work.</span>
        </div>
      )}

      <div className="at-bento">
        {/* Devices hero */}
        <section className="at-tile at-tile--hero at-span-2" aria-label="Devices on the platform">
          <span className="at-tile__label">Devices on the platform</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span className="at-tile__big" style={{ fontSize: 60 }}>{data ? fmtNum(total) : "…"}</span>
            <span style={{ fontSize: 16, color: "#e0e7ff" }}>
              {data ? `${fmtNum(data.devices.online)} online · ${fmtNum(data.companies.total)} companies` : ""}
            </span>
          </div>
          <div className="at-tile__spacer" />
          {data && total > 0 && (
            <>
              <div className="at-statusbar" aria-hidden="true">
                {Object.keys(STATUS_META).map((k) =>
                  sc[k] ? <span key={k} style={{ width: `${pct(sc[k], total)}%`, background: STATUS_META[k].color }} /> : null
                )}
              </div>
              <div className="at-legend" style={{ color: "#e0e7ff" }}>
                {Object.keys(STATUS_META).map((k) =>
                  sc[k] ? (
                    <span key={k}>
                      <i style={{ background: STATUS_META[k].color }} />
                      {STATUS_META[k].label} {fmtNum(sc[k])}
                    </span>
                  ) : null
                )}
              </div>
            </>
          )}
        </section>

        {/* Support tickets */}
        <section className="at-tile at-tile--lime" aria-label="Open support tickets">
          <span className="at-tile__label" style={{ fontWeight: 600 }}>Open support tickets</span>
          <span className="at-tile__big" style={{ fontSize: 56 }}>{data ? fmtNum(data.supportTickets.open) : "…"}</span>
          {data && (
            <span className="at-tile__sub">
              {data.supportTickets.byStatus.NEW} new · {data.supportTickets.byStatus.IN_PROGRESS} in progress ·{" "}
              {data.supportTickets.byStatus.PENDING} pending
            </span>
          )}
          <div className="at-tile__spacer" />
          <Link to={`${U}/support`} className="at-tile__link">Open support →</Link>
        </section>

        {/* Companies */}
        <section className="at-tile" aria-label="Companies">
          <span className="at-tile__label">Active companies</span>
          <span className="at-tile__big">{data ? fmtNum(data.companies.active) : "…"}</span>
          {data && (
            <span className="at-tile__sub">
              {data.companies.inactive} switched off
              {data.companies.expired ? (
                <>
                  {" · "}
                  <span style={{ color: "var(--at-stopped)", fontWeight: 600 }}>{data.companies.expired} with expired package</span>
                </>
              ) : null}
            </span>
          )}
          <div className="at-tile__spacer" />
          {data && (
            <span className="at-tile__sub" style={{ color: data.companies.expiringIn30Days ? "var(--at-idle)" : undefined }}>
              {data.companies.expiringIn30Days
                ? `${data.companies.expiringIn30Days} package(s) expire in 30 days`
                : "No packages expiring in the next 30 days"}
            </span>
          )}
        </section>

        {/* Servers */}
        <section className="at-tile at-span-2" aria-label="Servers">
          <h3 className="at-tile__title">Servers</h3>
          <ul className="at-list">
            {(data?.servers || []).slice(0, 4).map((s: any) => (
              <li key={s._id}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <i style={{ width: 10, height: 10, borderRadius: "50%", flex: "0 0 10px", background: s.isActive ? "var(--at-moving)" : "var(--at-offline)" }} />
                  <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</strong>
                </span>
                <span className="at-list__muted">{s.isActive ? "Active" : "Inactive"}</span>
              </li>
            ))}
            {!data && <li><span className="at-skel" style={{ width: "100%" }} /></li>}
          </ul>
          {data && (
            <span className="at-tile__sub">
              Database {fmtBytes(data.platform.databaseSizeBytes)} · API up {fmtUptime(data.platform.apiUptimeSeconds)}
              {data.servers.length > 4 ? ` · ${data.servers.length - 4} more` : ""}
            </span>
          )}
        </section>

        {/* Gateways */}
        <section className="at-tile" aria-label="Gateways">
          <h3 className="at-tile__title">Gateways</h3>
          <ul className="at-list">
            {data &&
              [
                ["Email (SMTP)", data.gateways.email],
                ["WhatsApp", data.gateways.whatsapp],
              ].map(([name, g]: any) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className={`at-pill ${g.active ? "at-pill--ok" : g.configured ? "at-pill--warn" : "at-pill--bad"}`}>
                    {g.active ? "Active" : g.configured ? "Switched off" : "Not set up"}
                  </span>
                </li>
              ))}
          </ul>
          <div className="at-tile__spacer" />
          <span className="at-tile__sub">Shows whether each gateway is set up and switched on, not whether the last message got through.</span>
        </section>

        {/* Device growth */}
        <section className="at-tile" aria-label="Devices added in the last 6 months">
          <span className="at-tile__label">Devices added · 6 months</span>
          <span className="at-tile__big" style={{ fontSize: 32 }}>{data ? `+${fmtNum(added6m)}` : "…"}</span>
          <div className="at-bars" role="img" aria-label={growth.map((g) => `${g.month} ${g.count}`).join(", ")}>
            {growth.map((g) => (
              <span key={g.month} style={{ height: `${Math.max(3, (g.count / growthMax) * 100)}%` }} title={`${g.month}: ${g.count}`} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--at-muted)" }}>
            {growth.map((g) => (
              <span key={g.month}>{g.month}</span>
            ))}
          </div>
        </section>

        {/* Companies table */}
        <section className="at-tile at-span-4" aria-label="Companies list">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="at-tile__title">Companies</h3>
            <Link to={`${U}/super-admin/companies`} style={{ fontSize: 13, color: "var(--at-primary)" }}>
              View all {data ? data.companies.total : ""}
            </Link>
          </div>
          <div className="at-table-wrap">
            <table className="at-table">
              <thead>
                <tr><th>Company</th><th>Package</th><th>Devices</th><th>Online</th><th>Package expires</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(data?.companies?.rows || []).map((c: any) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.package || "—"}</td>
                    <td>{fmtNum(c.devices)}</td>
                    <td>{c.devices ? `${pct(c.online, c.devices)}%` : "—"}</td>
                    <td>{fmtDate(c.packageExpirationDate)}</td>
                    <td><span className={`at-pill ${STATE_PILL[c.state]?.cls || ""}`}>{STATE_PILL[c.state]?.label || c.state}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
};

export default SuperAdminHome;
