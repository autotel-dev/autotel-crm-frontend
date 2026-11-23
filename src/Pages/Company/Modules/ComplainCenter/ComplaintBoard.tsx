// Complaint Center (redesign): one header row (search, date range, view
// switch, create / NR status), status tiles that also filter, department
// chips, then the complaints as a board or a list, with a quick-view panel.
// Data comes from the Redux store filled by ComplainCenter.tsx (same API calls
// as before); the create / NR status windows are the existing CreateNewComplain.
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../../../Utilities/api";
import { GET_ALL_INTERNAL_COMPLAINT, GET_COMPLAINT_CENTER_STATISTICS } from "../../../../Utilities/api/apiEndpoints";
import {
  setAllComplains,
  setComplainCenterRoles,
  setComplainCenterStatistics,
  setFilteredRole,
} from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import { getUserRole, formatUnderscoredString } from "../../../../Utilities/globals/globals";
import { ROLES } from "../../../../constants/roles";
import CreateNewComplain from "./CreateNewComplain";
import "./complaintBoard.css";

type StatusKey = "NEW" | "IN_PROGRESS" | "PENDING" | "RESOLVED";
type Range = "today" | "7d" | "30d" | "all";

const icon = (d: string, size = 18) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const RING = "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z";

const STATUSES: { key: StatusKey; label: string; color: string; soft: string; icon: JSX.Element }[] = [
  { key: "NEW", label: "New", color: "#2563EB", soft: "rgba(37,99,235,.14)", icon: icon("M12 5v14M5 12h14") },
  { key: "IN_PROGRESS", label: "In progress", color: "#D97706", soft: "rgba(217,119,6,.15)", icon: icon(`M12 7v5l3 2${RING}`) },
  { key: "PENDING", label: "Pending", color: "#DC2626", soft: "rgba(220,38,38,.13)", icon: icon(`M10 8v8M14 8v8${RING}`) },
  { key: "RESOLVED", label: "Resolved", color: "#65A30D", soft: "rgba(101,163,13,.15)", icon: icon(`M8 12.5l2.5 2.5L16 9.5${RING}`) },
];

const RANGES: { key: Range; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All" },
];

const PRIORITY: Record<string, { label: string; cls: string }> = {
  HIGH: { label: "High", cls: "is-high" },
  MEDIUM: { label: "Medium", cls: "is-medium" },
  LOW: { label: "Low", cls: "is-low" },
  GENERAL: { label: "General", cls: "is-low" },
};

const statusOf = (c: any): StatusKey => (STATUSES.some((s) => s.key === c?.status) ? c.status : "NEW");

const roleIcon = (name: string = "") => {
  const n = name.toLowerCase();
  const d = n.includes("sale")
    ? "M3 12V4h8l10 10-8 8L3 12zM7.5 7.5h.01"
    : n === "cro" || n.includes("support") || n.includes("call")
    ? "M4 13v-1a8 8 0 0 1 16 0v1M4 13h3v5H5a1 1 0 0 1-1-1v-4zM20 13h-3v5h2a1 1 0 0 0 1-1v-4z"
    : n.includes("install") || n.includes("tech") || n.includes("maint")
    ? "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z"
    : n.includes("account") || n.includes("finance") || n.includes("bill")
    ? "M4 7h16v12H4zM4 11h16M8 15h3"
    : "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 3.5a4 4 0 0 1 0 7.5M22 21c0-3-2-5-5-5.5";
  return icon(d, 16);
};

const age = (iso?: string) => {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} d`;
};
const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const inRange = (iso: string | undefined, r: Range) => {
  if (r === "all") return true;
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (r === "today") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return t >= d.getTime();
  }
  return t >= Date.now() - (r === "7d" ? 7 : 30) * 86400000;
};

const ComplaintBoard = () => {
  const dispatch = useDispatch();
  const { allComplains, complainCenterRoles, filteredRole } = useSelector((state: any) => state.complainCenter);
  const role = getUserRole();
  const base = role === ROLES.OPERATOR ? "/operator" : "/company";

  const [range, setRange] = useState<Range>("all");
  const [status, setStatus] = useState<StatusKey | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"board" | "list">(() => {
    try {
      return (localStorage.getItem("cc-view") as any) || "board";
    } catch {
      return "board";
    }
  });
  const [openId, setOpenId] = useState<string | null>(null);
  // Escape closes the quick-view panel
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  useEffect(() => {
    try {
      localStorage.setItem("cc-view", view);
    } catch {
      /* ignore */
    }
  }, [view]);

  // The details page (other tab) posts "updated" after a change: reload.
  useEffect(() => {
    const reload = () => {
      getAll({ url: GET_COMPLAINT_CENTER_STATISTICS }).then((data: any) => {
        if (data?.success) {
          const st = data.data.InternalComplaintsStatistics;
          dispatch(setComplainCenterRoles(st.subRoleCounts));
          const mapped = Object.entries(st)
            .filter(([k]) => k !== "subRoleCounts")
            .map(([k, v]) => ({ key: k.replace("total", "").replace("Count", ""), value: v }));
          dispatch(setComplainCenterStatistics(mapped));
        }
      });
      getAll({ url: GET_ALL_INTERNAL_COMPLAINT }).then((data: any) => {
        if (data?.success) dispatch(setAllComplains(data.data.allInternalComplaints));
      });
    };
    const listener = (e: MessageEvent) => {
      if (typeof e.data === "string" && e.data === "updated") reload();
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [dispatch]);

  const q = query.trim().toLowerCase();
  // Date range + search, before status / department filters
  const scoped = useMemo(
    () =>
      (allComplains || []).filter((c: any) => {
        if (!inRange(c?.createdAt, range)) return false;
        if (!q) return true;
        return [c?.complaintId, c?.description, c?.deviceName, c?.subRole?.name, c?.type?.value, c?.createdBy?.fullName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      }),
    [allComplains, range, q]
  );

  const byRole = useMemo(
    () => (filteredRole && filteredRole !== "All" ? scoped.filter((c: any) => c?.subRole?.name === filteredRole) : scoped),
    [scoped, filteredRole]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { NEW: 0, IN_PROGRESS: 0, PENDING: 0, RESOLVED: 0 };
    byRole.forEach((x: any) => (c[statusOf(x)] += 1));
    return c;
  }, [byRole]);

  const roleCounts = useMemo(() => {
    const m: Record<string, number> = {};
    scoped.forEach((c: any) => {
      const n = c?.subRole?.name;
      if (n) m[n] = (m[n] || 0) + 1;
    });
    return m;
  }, [scoped]);
  const roles: string[] = useMemo(() => {
    const names = (complainCenterRoles || []).map((r: any) => r?.name).filter(Boolean);
    Object.keys(roleCounts).forEach((n) => !names.includes(n) && names.push(n));
    return names;
  }, [complainCenterRoles, roleCounts]);

  const visible = useMemo(() => (status ? byRole.filter((c: any) => statusOf(c) === status) : byRole), [byRole, status]);
  const sorted = useMemo(
    () => [...visible].sort((a: any, b: any) => new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime()),
    [visible]
  );
  const opened = useMemo(() => (allComplains || []).find((c: any) => c?._id === openId) || null, [allComplains, openId]);

  const openDetails = (c: any) =>
    window.open(`${process.env.PUBLIC_URL || ""}${base}/modules/complain-center/complainDetails/${c?._id}`, "_blank");

  const rangeLabel = RANGES.find((r) => r.key === range)?.label.toLowerCase();
  const emptyText = q
    ? "No complaints match your search."
    : range === "all"
    ? "No complaints yet."
    : `No complaints in the last ${range === "today" ? "day" : rangeLabel}.`;

  const Card = ({ c }: { c: any }) => {
    const p = PRIORITY[c?.priorty] || null;
    const old = statusOf(c) !== "RESOLVED" && Date.now() - new Date(c?.createdAt).getTime() > 2 * 86400000;
    return (
      <button type="button" className={`cb-card${openId === c?._id ? " is-open" : ""}`} onClick={() => setOpenId(c?._id)}>
        <span className="cb-card__top">
          <span className="cb-muted">{c?.complaintId}</span>
          <span className={`cb-age${old ? " is-old" : ""}`}>{age(c?.createdAt)}</span>
        </span>
        <strong className="cb-card__title">{c?.type?.value ? formatUnderscoredString(c.type.value) : "Complaint"}</strong>
        <span className="cb-muted cb-ellipsis">{[c?.deviceName, c?.subRole?.name].filter(Boolean).join(" · ") || "—"}</span>
        {c?.description && <span className="cb-card__desc">{c.description}</span>}
        <span className="cb-card__foot">
          {p ? <span className={`cb-prio ${p.cls}`}>{p.label}</span> : <span className="cb-prio">No priority</span>}
          <span className="cb-muted cb-ellipsis">{c?.createdBy?.fullName || ""}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="cb-page">
      {/* Header row */}
      <div className="cb-head">
        <label htmlFor="cb-search" className="cb-hidden">Search complaints</label>
        <input id="cb-search" className="cb-search" placeholder="Search ticket, vehicle, department, type…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="cb-seg" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r.key} type="button" className={range === r.key ? "is-on" : ""} aria-pressed={range === r.key} onClick={() => setRange(r.key)}>
              {r.label}
            </button>
          ))}
        </div>
        <div className="cb-seg" role="group" aria-label="View">
          <button type="button" className={view === "board" ? "is-on" : ""} aria-pressed={view === "board"} onClick={() => setView("board")}>Board</button>
          <button type="button" className={view === "list" ? "is-on" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
        </div>
        {(role === ROLES.COMPANY || role === ROLES.OPERATOR || role === ROLES.SUPER_ADMIN) && (
          <div className="cb-actions">
            <CreateNewComplain />
          </div>
        )}
      </div>

      {/* Status tiles (click to filter) */}
      <div className="cb-tiles">
        <button type="button" className={`cb-tile${!status ? " is-on" : ""}`} aria-pressed={!status} onClick={() => setStatus(null)}>
          <span className="cb-tile__icon" style={{ background: "var(--at-primary-soft)", color: "var(--at-primary)" }}>{icon("M4 6h16M4 12h16M4 18h10")}</span>
          <span><strong>{byRole.length}</strong><span className="cb-muted">All</span></span>
        </button>
        {STATUSES.map((s) => (
          <button key={s.key} type="button" className={`cb-tile${status === s.key ? " is-on" : ""}`} aria-pressed={status === s.key} onClick={() => setStatus(status === s.key ? null : s.key)}>
            <span className="cb-tile__icon" style={{ background: s.soft, color: s.color }}>{s.icon}</span>
            <span><strong>{counts[s.key]}</strong><span className="cb-muted">{s.label}</span></span>
          </button>
        ))}
      </div>

      {/* Departments */}
      <div className="cb-roles" role="group" aria-label="Filter by department">
        {["All", ...roles].map((name) => {
          const on = (filteredRole || "All") === name;
          const n = name === "All" ? scoped.length : roleCounts[name] || 0;
          return (
            <button key={name} type="button" className={`cb-role${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => dispatch(setFilteredRole(name))}>
              <span className="cb-role__icon">{roleIcon(name)}</span>
              {name}
              <span className="cb-role__count">{n}</span>
            </button>
          );
        })}
      </div>

      {/* Complaints */}
      {view === "board" ? (
        <div className="cb-board">
          {STATUSES.filter((s) => !status || s.key === status).map((s) => {
            const items = sorted.filter((c: any) => statusOf(c) === s.key);
            return (
              <section key={s.key} className="cb-col" aria-label={s.label}>
                <div className="cb-col__head">
                  <i style={{ background: s.color }} />
                  <strong>{s.label}</strong>
                  <span className="cb-muted">{items.length}</span>
                </div>
                <div className="cb-col__body">
                  {items.length === 0 ? <div className="cb-col__empty">Nothing here</div> : items.map((c: any) => <Card key={c._id} c={c} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="cb-list">
          {sorted.length === 0 ? (
            <div className="cb-empty">{emptyText}</div>
          ) : (
            <div className="cb-table-wrap">
              <table className="cb-table">
                <thead>
                  <tr><th>Ticket</th><th>Type</th><th>Vehicle</th><th>Department</th><th>Priority</th><th>Status</th><th>Created by</th><th>Updated</th></tr>
                </thead>
                <tbody>
                  {sorted.map((c: any) => {
                    const s = STATUSES.find((x) => x.key === statusOf(c))!;
                    const p = PRIORITY[c?.priorty];
                    return (
                      <tr key={c._id} className={openId === c._id ? "is-open" : ""} onClick={() => setOpenId(c._id)}>
                        <td><strong>{c?.complaintId}</strong></td>
                        <td>{c?.type?.value ? formatUnderscoredString(c.type.value) : "—"}</td>
                        <td>{c?.deviceName || "—"}</td>
                        <td>{c?.subRole?.name || "—"}</td>
                        <td>{p ? <span className={`cb-prio ${p.cls}`}>{p.label}</span> : "—"}</td>
                        <td><span className="cb-status"><i style={{ background: s.color }} />{s.label}</span></td>
                        <td>{c?.createdBy?.fullName || "—"}</td>
                        <td className="cb-muted">{fmt(c?.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {view === "board" && sorted.length === 0 && <div className="cb-empty">{emptyText}</div>}

      {/* Quick view */}
      {opened && (
        <>
          <div className="cb-scrim" onClick={() => setOpenId(null)} />
          <aside className="cb-panel" aria-label={`Complaint ${opened.complaintId}`}>
            <div className="cb-panel__head">
              <div>
                <div className="cb-muted">{opened.complaintId}</div>
                <h2>{opened?.type?.value ? formatUnderscoredString(opened.type.value) : "Complaint"}</h2>
              </div>
              <button type="button" className="cb-x" aria-label="Close" onClick={() => setOpenId(null)}>✕</button>
            </div>
            <div className="cb-panel__pills">
              {(() => {
                const s = STATUSES.find((x) => x.key === statusOf(opened))!;
                return <span className="cb-status cb-status--pill"><i style={{ background: s.color }} />{s.label}</span>;
              })()}
              {PRIORITY[opened?.priorty] && <span className={`cb-prio ${PRIORITY[opened.priorty].cls}`}>{PRIORITY[opened.priorty].label} priority</span>}
              <span className="cb-muted">Open for {age(opened?.createdAt)}</span>
            </div>
            <dl className="cb-dl">
              <dt>Vehicle</dt><dd>{opened?.deviceName || "—"}</dd>
              <dt>Department</dt><dd>{opened?.subRole?.name || "—"}</dd>
              <dt>Server</dt><dd>{opened?.server?.companyName || "—"}</dd>
              <dt>Created by</dt><dd>{opened?.createdBy?.fullName || "—"}</dd>
              <dt>Created</dt><dd>{fmt(opened?.createdAt)}</dd>
              <dt>Last update</dt><dd>{fmt(opened?.updatedAt)}</dd>
              {opened?.resolvingDate && (<><dt>Resolved</dt><dd>{fmt(opened.resolvingDate)}</dd></>)}
            </dl>
            {opened?.description && (
              <div className="cb-desc">
                <div className="cb-muted">Description</div>
                <p>{opened.description}</p>
              </div>
            )}
            <div className="cb-panel__spacer" />
            <button type="button" className="at-btn at-btn--primary" onClick={() => openDetails(opened)}>
              Open full details, history &amp; status
            </button>
          </aside>
        </>
      )}
    </div>
  );
};

export default ComplaintBoard;
