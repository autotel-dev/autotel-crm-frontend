// Monitoring design 2: full map, floating panels. List grouped by customer on
// the left, status filter on top, vehicle panel with four gauges on the right.
import { useMemo } from "react";
import { FleetStatus, plateOf, STATUS_INFO, timeAgo } from "../LiveMap/fleetStatus";
import { compass } from "../LiveMap/FocusView";
import { customerName, customerPhone, fmtHrs, plural, imeiOf, Model, NOT_REPORTING, readings, renewsOn, Row, useMonitoringModel, vehicleLine } from "./useMonitoringModel";
import { CallButton, CamBar, CarTile, CommandHost, DayBar, EventList, FleetMap, ListStates, Ring, SearchBox, ShareButton, speedColor } from "./parts";
import "./designs.scss";

const FILTERS: { key: string; label: string; set: FleetStatus[] | null; color: string }[] = [
  { key: "moving", label: "Moving", set: ["moving"], color: STATUS_INFO.moving.color },
  { key: "idle", label: "Idle", set: ["idle"], color: STATUS_INFO.idle.color },
  { key: "stopped", label: "Stopped", set: ["stopped"], color: STATUS_INFO.stopped.color },
  { key: "offline", label: "Offline", set: NOT_REPORTING, color: STATUS_INFO.offline.color },
  { key: "all", label: "All", set: null, color: "var(--at-primary)" },
];

const sameSet = (a: FleetStatus[] | null, b: FleetStatus[] | null) => (!a && !b) || (!!a && !!b && a.length === b.length && a.every((x) => b.includes(x)));

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const I = {
  play: "M7 4l13 8-13 8z",
  bars: "M4 20V10M10 20V4M16 20v-7M3 20h18",
  share: "M18 8a3 3 0 1 0-2.8-4M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  power: "M12 2v10M5.6 6.6a9 9 0 1 0 12.8 0",
};

const ListRow = ({ r, on, onPick }: { r: Row; on: boolean; onPick: () => void }) => {
  const v = readings(r.d, r.s);
  const right = r.s === "moving" ? `${v.speed} km/h` : v.deviceTime ? timeAgo(v.deviceTime).replace(" ago", "") : "No data";
  return (
    <button type="button" className={`d2-row${on ? " is-on" : ""}`} aria-pressed={on} onClick={onPick}>
      <i className="d2-row__bar" style={{ background: STATUS_INFO[r.s].color }} aria-label={STATUS_INFO[r.s].label} />
      <span className="d2-row__main">
        <strong>{plateOf(r.d)}</strong>
        <span>{vehicleLine(r.d) || STATUS_INFO[r.s].label}</span>
      </span>
      <b>{right}</b>
    </button>
  );
};

const Panel = ({ m }: { m: Model }) => {
  const { d, s } = m.selected!;
  const v = readings(d, s, m.track.attrs);
  const t = m.today;
  return (
    <aside className="d2-panel lmd-over-right" aria-label={`Vehicle ${plateOf(d)}`}>
      <header className="d2-head">
        <span className="d2-head__tile"><CarTile s={s} size={46} /></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2>{plateOf(d)}</h2>
          <div className="lmd-muted">{[vehicleLine(d), customerName(d), v.protocol].filter(Boolean).join(" · ") || "—"}</div>
        </div>
        <span className="lmd-pill" style={{ color: STATUS_INFO[s].color, background: `color-mix(in srgb, ${STATUS_INFO[s].hex} 18%, transparent)` }}>{STATUS_INFO[s].label}</span>
        <button type="button" className="lmd-close" aria-label="Close vehicle panel" onClick={() => m.select(null)}>✕</button>
      </header>

      <div className="d2-rings">
        <div><Ring frac={v.online ? v.speed / (m.limitKmh * 1.25) : null} color={speedColor(v.speed, m.limitKmh)} size={78} stroke={8} label="Speed"><b>{v.online ? v.speed : "—"}</b><small>km/h</small></Ring><span>Speed</span></div>
        <div><Ring frac={v.satFrac} color="var(--at-moving)" size={78} stroke={8} label="GPS satellites"><b>{v.sat ?? "—"}</b><small>sats</small></Ring><span>GPS sats</span></div>
        <div><Ring frac={v.gsmFrac} color="var(--at-moving)" size={78} stroke={8} label="GSM signal"><b className="d2-ring__word">{v.gsm || "—"}</b></Ring><span>GSM</span></div>
        <div><Ring frac={v.battFrac} color="var(--at-moving)" size={78} stroke={8} label="Battery"><b className="d2-ring__word">{v.battery || "—"}</b></Ring><span>Battery</span></div>
      </div>

      <div className="d2-where">
        <strong>{m.address || (v.lat != null ? "Looking up address…" : "No position yet")}</strong>
        <div className="lmd-muted">
          {v.lat != null ? `${v.lat.toFixed(4)}, ${v.lng!.toFixed(4)} · ` : ""}
          {v.heading != null ? `heading ${compass(v.heading)} · ` : ""}updated {timeAgo(v.deviceTime)}
        </div>
      </div>

      <div className="d2-today">
        <div className="d2-today__head">
          <strong>Today · {m.track.loaded ? `${t.km.toFixed(1)} km` : "…"} · {plural(t.trips, "trip")}</strong>
          <span className="lmd-muted">max {Math.round(t.maxKmh)} km/h</span>
        </div>
        <DayBar bar={t.bar} nowFrac={t.nowFrac} height={12} />
        <div className="d2-tiles">
          <div><span>Running</span><b>{fmtHrs(t.ms.drive)}</b></div>
          <div><span>Idle</span><b>{fmtHrs(t.ms.idle)}</b></div>
          <div><span>Stopped</span><b>{fmtHrs(t.ms.off)}</b></div>
        </div>
      </div>

      <div className="d2-events">
        <h3>Latest events</h3>
        <EventList events={t.events} max={4} loaded={m.track.loaded} />
      </div>

      <div className="d2-meta">
        {imeiOf(d) && <span>IMEI {imeiOf(d)}</span>}
        {v.odometer && <span>Odometer {v.odometer}</span>}
        {renewsOn(d) && <span>Renews {renewsOn(d)}</span>}
      </div>

      <div className="d2-actions">
        <button type="button" className="is-primary" onClick={() => m.openPlayback(d)}><Icon d={I.play} />Playback</button>
        <button type="button" onClick={m.openReports}><Icon d={I.bars} />Reports</button>
        <ShareButton lat={v.lat} lng={v.lng}><Icon d={I.share} />Share</ShareButton>
        <CallButton phone={customerPhone(d)} name={customerName(d)}><Icon d={I.phone} />Call</CallButton>
        <button type="button" className="is-danger" onClick={() => m.openCommand(d, "engineStop")}><Icon d={I.power} />Cut engine</button>
      </div>
    </aside>
  );
};

const Design2 = () => {
  const m = useMonitoringModel();
  const sel = m.selected;
  const counts: Record<string, number> = {
    moving: m.counts.moving,
    idle: m.counts.idle,
    stopped: m.counts.stopped,
    offline: NOT_REPORTING.reduce((n, s) => n + m.counts[s], 0),
    all: m.devices.length,
  };
  // Group by customer (vehicles without one go last)
  const groups = useMemo(() => {
    const g = new Map<string, Row[]>();
    m.visible.forEach((r) => {
      const k = customerName(r.d) || "No customer";
      if (!g.has(k)) g.set(k, []);
      g.get(k)!.push(r);
    });
    // Customers with vehicles reporting first (most first), then by name
    const live = (rs: Row[]) => rs.filter((r) => r.s === "moving" || r.s === "idle" || r.s === "stopped").length;
    return Array.from(g.entries()).sort(
      (a, b) => (a[0] === "No customer" ? 1 : 0) - (b[0] === "No customer" ? 1 : 0) || live(b[1]) - live(a[1]) || a[0].localeCompare(b[0])
    );
  }, [m.visible]);

  return (
    <div className={`lmd-root d2${sel ? " has-sel" : ""}`}>
      <FleetMap {...m.mapProps} />

      <aside className="d2-list lmd-over-left" aria-label="Vehicles">
        <div className="d2-brand"><span className="d2-brand__logo">A</span><strong>Autotel live</strong></div>
        <SearchBox m={m} id="d2-search" placeholder="Plate, IMEI, customer" />
        <div className="d2-list__body">
          <ListStates m={m} />
          {groups.map(([name, rs]) => (
            <section key={name} className="d2-group">
              <h3><span>{name}</span><span>{rs.length}</span></h3>
              {rs.map((r) => <ListRow key={r.d._id} r={r} on={r.d._id === sel?.d._id} onPick={() => m.select(r.d._id)} />)}
            </section>
          ))}
        </div>
      </aside>

      <div className="d2-filters lmd-over-top" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => {
          const on = sameSet(m.filter, f.set);
          return (
            <button key={f.key} type="button" className={on ? "is-on" : ""} aria-pressed={on} onClick={() => m.setFilter(on ? null : f.set)}>
              <i style={{ background: f.color }} />{f.label} <b>{counts[f.key]}</b>
            </button>
          );
        })}
      </div>

      {sel && <Panel m={m} />}

      <CamBar mode={m.camMode} onMode={m.setCamMode} onFitAll={m.fitAll} onZoom={m.zoom} className="d2-cam lmd-over-bottom" />
      <CommandHost m={m} />
    </div>
  );
};

export default Design2;
