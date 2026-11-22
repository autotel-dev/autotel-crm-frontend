// Company dashboard (redesign Phase 2, design "C2 · Map-first dashboard").
// Data: GET /api/v1/overview/company (backend controllers/dashboard/OverviewController.js).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAll } from "../../../Utilities/api";
import { GET_COMPANY_OVERVIEW } from "../../../Utilities/api/apiEndpoints";
import { CarMarker, VehicleStatus } from "../../../components/ui";
import { fmtNum, fmtShortDate, humanize, pct, STATUS_META, timeAgo } from "../../Overview/format";

const U = process.env.PUBLIC_URL || "";

const markerStatus = (s: string): VehicleStatus =>
  s === "MOVING" ? "moving" : s === "IDLE" ? "idle" : s === "STOPPED" ? "stopped" : "offline";

const CompanyOverview = () => {
  const { userData } = useSelector((state: any) => state.user);
  const [data, setData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      getAll({ url: GET_COMPANY_OVERVIEW }).then((res: any) => {
        if (!alive) return;
        if (res && res.success) {
          setData(res.data);
          setFailed(false);
        } else setFailed(true);
      });
    load();
    const t = setInterval(load, 60000); // refresh every minute
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const fleet = data?.fleet;
  const sc = fleet?.statusCounts || {};
  const byHour: any[] = data?.alarms?.byHour || [];
  const hourMax = Math.max(1, ...byHour.map((h) => h.count));
  const byType: any[] = data?.alarms?.byType || [];
  const typeMax = Math.max(1, ...byType.map((t) => t.count));

  return (
    <div className="at-page">
      <div className="at-page__head">
        <div>
          <div className="at-page__eyebrow">{today}</div>
          <h2 className="at-page__title">Salam{userData?.fullName ? `, ${userData.fullName}` : ""}</h2>
        </div>
        <div style={{ flex: 1 }} />
        <Link to={`${U}/company/modules/monitoring`} className="at-btn at-btn--primary">Open live map</Link>
      </div>

      {failed && (
        <div className="at-tile" role="alert">
          <strong>Couldn't load the dashboard figures.</strong>
          <span className="at-tile__sub">They refresh every minute; you can also reload the page.</span>
        </div>
      )}

      <div className="at-bento">
        {/* Fleet hero */}
        <section className="at-tile at-tile--hero at-span-2" aria-label="Vehicles online">
          <span className="at-tile__label">Vehicles online right now</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span className="at-tile__big" style={{ fontSize: 68 }}>{fleet ? fmtNum(fleet.online) : "…"}</span>
            <span style={{ fontSize: 17, color: "#c7d2fe" }}>
              {fleet ? `of ${fmtNum(fleet.total)} · ${pct(fleet.online, fleet.total)}%` : ""}
            </span>
          </div>
          <div className="at-tile__spacer" />
          {fleet && fleet.total > 0 && (
            <>
              <div className="at-statusbar" aria-hidden="true">
                {Object.keys(STATUS_META).map((k) =>
                  sc[k] ? <span key={k} style={{ width: `${pct(sc[k], fleet.total)}%`, background: STATUS_META[k].color }} /> : null
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

        {/* Open alarms */}
        <section className="at-tile at-tile--lime" aria-label="Open alarms">
          <span className="at-tile__label" style={{ fontWeight: 600 }}>Assigned alarms still open</span>
          <span className="at-tile__big" style={{ fontSize: 60 }}>{data ? fmtNum(data.alarms.assignedOpen) : "…"}</span>
          {data && (
            <span className="at-tile__sub">
              {fmtNum(data.alarms.today)} alarms today · {fmtNum(data.alarms.completedToday)} closed today
            </span>
          )}
          <div className="at-tile__spacer" />
          <Link to={`${U}/company/modules/control-room`} className="at-tile__link">Go to Control Room →</Link>
        </section>

        {/* Complaints */}
        <section className="at-tile" aria-label="Open complaints">
          <span className="at-tile__label">Open complaints</span>
          <span className="at-tile__big">{data ? fmtNum(data.complaints.open) : "…"}</span>
          {data && (
            <span className="at-tile__sub" style={{ color: data.complaints.olderThan48h ? "var(--at-idle)" : undefined, fontWeight: data.complaints.olderThan48h ? 600 : 400 }}>
              {data.complaints.olderThan48h ? `${data.complaints.olderThan48h} waiting over 48 h` : "None waiting over 48 h"}
            </span>
          )}
          <div className="at-tile__spacer" />
          <Link to={`${U}/company/modules/complaint-center`} className="at-tile__link" style={{ color: "var(--at-primary)" }}>
            Complaint Center →
          </Link>
        </section>

        {/* Alarms by hour */}
        <section className="at-tile at-span-2" aria-label="Alarms today by hour">
          <h3 className="at-tile__title">Alarms today, by hour</h3>
          <div className="at-bars" style={{ height: 110 }} role="img" aria-label={`${data?.alarms?.today ?? 0} alarms today`}>
            {byHour.map((h) => (
              <span key={h.hour} style={{ height: `${Math.max(2, (h.count / hourMax) * 100)}%`, opacity: h.count ? 0.9 : 0.25 }} title={`${h.hour}:00 — ${h.count}`} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--at-muted)" }}>
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </section>

        {/* Alarms by type */}
        <section className="at-tile at-span-2" aria-label="Alarms today by type">
          <h3 className="at-tile__title">Alarms today, by type</h3>
          {data && byType.length === 0 && <span className="at-tile__sub">No alarms so far today.</span>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {byType.map((t) => (
              <div className="at-hbar" key={t.type}>
                <span className="at-hbar__name" title={humanize(t.type)}>{humanize(t.type)}</span>
                <span className="at-hbar__track"><span className="at-hbar__fill" style={{ width: `${(t.count / typeMax) * 100}%`, display: "block" }} /></span>
                <strong style={{ width: 40, textAlign: "right" }}>{fmtNum(t.count)}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Needs attention */}
        <section className="at-tile at-span-2" aria-label="Needs attention">
          <h3 className="at-tile__title">Needs attention</h3>
          {data && data.needsAttention.length === 0 && <span className="at-tile__sub">Every vehicle is reporting.</span>}
          <ul className="at-list">
            {(data?.needsAttention || []).map((v: any, i: number) => (
              <li key={`${v.registrationNo}-${i}`}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CarMarker status={markerStatus(v.status)} size={14} />
                  <strong>{v.registrationNo || "Unassigned device"}</strong>
                  <span className="at-list__muted">{STATUS_META[v.status]?.label || humanize(v.status)}</span>
                </span>
                <span className="at-list__muted">{v.since ? `for ${timeAgo(v.since)}` : "never reported"}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Renewals */}
        <section className="at-tile at-span-2" aria-label="Upcoming renewals">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 className="at-tile__title">Renewals in the next 30 days</h3>
            <strong style={{ font: "700 22px var(--at-font-display)", color: data?.renewals?.next30Days ? "var(--at-idle)" : undefined }}>
              {data ? fmtNum(data.renewals.next30Days) : ""}
            </strong>
          </div>
          {data && data.renewals.upcoming.length === 0 && <span className="at-tile__sub">No vehicle renewals due.</span>}
          <ul className="at-list">
            {(data?.renewals?.upcoming || []).map((r: any, i: number) => (
              <li key={`${r.registrationNo}-${i}`}>
                <span>
                  <strong>{r.customer || "—"}</strong>{" "}
                  <span className="at-list__muted">· {r.registrationNo}{r.package ? ` · ${r.package}` : ""}</span>
                </span>
                <span className="at-list__muted">{fmtShortDate(r.renewalDate)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CompanyOverview;
