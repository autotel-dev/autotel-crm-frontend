// Monitoring design 3: map on top (list floating inside it), cards underneath:
// selected vehicle, speed with the last 30 minutes, today, location, device
// health and latest events.
import { FleetStatus, plateOf, STATUS_INFO, timeAgo } from "../LiveMap/fleetStatus";
import { compass } from "../LiveMap/FocusView";
import { Pt } from "../PlaybackV2/playbackUtils";
import {
  customerName, customerPhone, fmtHrs, plural, imeiOf, Model, NOT_REPORTING, PART_COLOR, readings, renewsOn, Row, simOf, streetViewLink, useMonitoringModel, vehicleLine,
} from "./useMonitoringModel";
import { CallButton, CamBar, CarTile, CommandHost, EventList, FleetMap, ListStates, SearchBox, ShareButton, speedColor } from "./parts";
import "./designs.scss";

const TILES: { key: string; label: string; set: FleetStatus[]; color: string }[] = [
  { key: "moving", label: "Moving", set: ["moving"], color: STATUS_INFO.moving.color },
  { key: "idle", label: "Idle", set: ["idle"], color: STATUS_INFO.idle.color },
  { key: "stopped", label: "Stopped", set: ["stopped"], color: STATUS_INFO.stopped.color },
  { key: "offline", label: "Offline", set: NOT_REPORTING, color: "var(--at-muted)" },
];

const ListRow = ({ r, on, onPick }: { r: Row; on: boolean; onPick: () => void }) => {
  const v = readings(r.d, r.s);
  const right = r.s === "moving" ? `${v.speed} km/h` : v.deviceTime ? timeAgo(v.deviceTime).replace(" ago", "") : "—";
  return (
    <button type="button" className={`d3-row${on ? " is-on" : ""}`} aria-pressed={on} onClick={onPick}>
      <i style={{ background: STATUS_INFO[r.s].color }} aria-label={STATUS_INFO[r.s].label} />
      <span className="d3-row__main">
        <strong>{plateOf(r.d)}</strong>
        <span>{[vehicleLine(r.d), customerName(r.d)].filter(Boolean).join(" · ") || STATUS_INFO[r.s].label}</span>
      </span>
      <b>{right}</b>
    </button>
  );
};

/** Half-circle speed gauge (fills up to 125 % of the limit). */
const Gauge = ({ speed, limit, online }: { speed: number; limit: number; online: boolean }) => {
  const r = 80, cx = 100, cy = 96;
  const len = Math.PI * r;
  const f = online ? Math.max(0, Math.min(1, speed / (limit * 1.25))) : 0;
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className="d3-gauge" role="img" aria-label={online ? `${speed} km/h, limit ${limit}` : "Not reporting"}>
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <path d={arc} fill="none" stroke="var(--at-soft)" strokeWidth="14" strokeLinecap="round" />
        {f > 0 && <path d={arc} fill="none" stroke={speedColor(speed, limit)} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${f * len} ${len}`} style={{ transition: "stroke-dasharray .6s ease" }} />}
      </svg>
      <div className="d3-gauge__val"><strong>{online ? speed : "—"}</strong><small>km/h · limit {limit}</small></div>
    </div>
  );
};

/** Speed over the last 30 minutes, limit as a dashed line. */
const SpeedChart = ({ pts, limit }: { pts: Pt[]; limit: number }) => {
  const W = 640, H = 120, SPAN = 30 * 60 * 1000;
  const now = Date.now(), from = now - SPAN;
  const recent = pts.filter((p) => p.t >= from);
  const top = Math.max(limit * 1.2, ...recent.map((p) => p.speed), 1);
  const x = (t: number) => ((t - from) / SPAN) * W;
  const y = (v: number) => H - 4 - (Math.min(v, top) / top) * (H - 10);
  const runs: Pt[][] = [];
  recent.forEach((p, i) => {
    if (i === 0 || p.t - recent[i - 1].t > 3 * 60 * 1000) runs.push([]);
    runs[runs.length - 1].push(p);
  });
  return (
    <svg className="d3-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={recent.length ? "Speed, last 30 minutes" : "No data in the last 30 minutes"}>
      {runs.map((run, i) => {
        const line = run.map((p, j) => `${j ? "L" : "M"}${x(p.t).toFixed(1)} ${y(p.speed).toFixed(1)}`).join(" ");
        const area = `${line} L${x(run[run.length - 1].t).toFixed(1)} ${H} L${x(run[0].t).toFixed(1)} ${H} Z`;
        return (
          <g key={i}>
            <path d={area} fill="var(--at-primary)" opacity=".18" />
            <path d={line} fill="none" stroke="var(--at-primary)" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
      <line x1="0" x2={W} y1={y(limit)} y2={y(limit)} stroke="var(--at-stopped)" strokeWidth="1.5" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

/** Donut of today's time: running, idle, stopped. */
const Donut = ({ ms }: { ms: Record<string, number> }) => {
  const parts = [
    { k: "drive", v: ms.drive, c: PART_COLOR.drive },
    { k: "idle", v: ms.idle, c: PART_COLOR.idle },
    { k: "off", v: ms.off, c: PART_COLOR.off },
  ];
  const total = parts.reduce((s, p) => s + p.v, 0);
  const r = 40, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="Today's time split">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--at-soft)" strokeWidth="12" />
      {total > 0 && parts.map((p) => {
        const len = (p.v / total) * c;
        const el = (
          <circle key={p.k} cx="50" cy="50" r={r} fill="none" stroke={p.c} strokeWidth="12" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc}
            style={{ transform: "rotate(-90deg)", transformBox: "view-box", transformOrigin: "50px 50px", animation: "none" }} />
        );
        acc += len;
        return el;
      })}
    </svg>
  );
};

const Cards = ({ m }: { m: Model }) => {
  const { d, s } = m.selected!;
  const v = readings(d, s, m.track.attrs);
  const t = m.today;
  return (
    <div className="d3-cards">
      <section className="d3-card d3-sel">
        <div className="d3-card__row">
          <span className="lmd-kicker">Selected</span>
          <span className="lmd-pill" style={{ color: STATUS_INFO[s].color, background: `color-mix(in srgb, ${STATUS_INFO[s].hex} 18%, transparent)` }}>{STATUS_INFO[s].label}</span>
          <button type="button" className="lmd-close" aria-label="Close vehicle" onClick={() => m.select(null)}>✕</button>
        </div>
        <div className="d3-sel__id">
          <CarTile s={s} size={30} />
          <div style={{ minWidth: 0 }}>
            <h2>{plateOf(d)}</h2>
            <div className="lmd-muted">{[vehicleLine(d), customerName(d)].filter(Boolean).join(" · ") || "—"}</div>
          </div>
        </div>
        <dl className="d3-kv">
          <div><dt>Tracker</dt><dd>{[v.protocol, imeiOf(d)].filter(Boolean).join(" · ") || "—"}</dd></div>
          <div><dt>SIM</dt><dd>{simOf(d, m.track.attrs) || "—"}</dd></div>
          <div><dt>Odometer</dt><dd>{v.odometer || "—"}</dd></div>
          <div><dt>Renews</dt><dd>{renewsOn(d) || "—"}</dd></div>
        </dl>
        <div className="d3-sel__btns">
          <button type="button" className="lmd-btn lmd-btn--primary" onClick={() => m.openPlayback(d)}>Playback</button>
          <button type="button" className="lmd-btn" onClick={m.openReports}>Reports</button>
          <CallButton phone={customerPhone(d)} name={customerName(d)} className="lmd-btn">Call</CallButton>
          <button type="button" className="lmd-btn lmd-btn--danger" onClick={() => m.openCommand(d, "engineStop")}>Cut engine</button>
        </div>
      </section>

      <section className="d3-card d3-speed">
        <Gauge speed={v.speed} limit={m.limitKmh} online={v.online} />
        <div className="d3-speed__chart">
          <div className="d3-card__row"><h3>Speed, last 30 min</h3><span className="lmd-muted">{t.maxKmh ? `max today ${Math.round(t.maxKmh)} km/h` : ""}</span></div>
          <SpeedChart pts={m.track.pts} limit={m.limitKmh} />
          <div className="d3-speed__facts">
            <span>Ignition <b>{v.ignition || "—"}</b></span>
            <span>Heading <b>{v.heading != null ? compass(v.heading) : "—"}</b></span>
            <span>Updated <b>{timeAgo(v.deviceTime)}</b></span>
          </div>
        </div>
      </section>

      <section className="d3-card d3-today">
        <h3>Today</h3>
        <div className="d3-today__main">
          <Donut ms={t.ms} />
          <div>
            <strong>{m.track.loaded ? `${t.km.toFixed(1)} km` : "…"}</strong>
            <div className="lmd-muted">{plural(t.trips, "trip")} · {t.overs} over limit</div>
          </div>
        </div>
        <div className="d3-today__split">
          <span>Run {fmtHrs(t.ms.drive)}</span><span>Idle {fmtHrs(t.ms.idle)}</span><span>Stop {fmtHrs(t.ms.off)}</span>
        </div>
      </section>

      <section className="d3-card d3-loc">
        <h3>Location</h3>
        <strong>{m.address || (v.lat != null ? "Looking up address…" : "No position yet")}</strong>
        <div className="lmd-muted">{v.lat != null ? `${v.lat.toFixed(4)}, ${v.lng!.toFixed(4)}` : ""}</div>
        <div className="d3-two">
          <ShareButton lat={v.lat} lng={v.lng} className="lmd-btn">Share live</ShareButton>
          {v.lat != null ? (
            <a className="lmd-btn" href={streetViewLink(v.lat, v.lng)} target="_blank" rel="noreferrer">Street view</a>
          ) : (
            <button type="button" className="lmd-btn" disabled>Street view</button>
          )}
        </div>
      </section>

      <section className="d3-card d3-health">
        <h3>Device health</h3>
        <div className="d3-health__grid">
          <div><span>GPS</span><b>{v.sat != null ? `${v.sat} sats` : v.gps || "—"}</b></div>
          <div><span>GSM</span><b>{v.gsm || "—"}</b></div>
          <div><span>Battery</span><b>{v.battery || "—"}</b></div>
          <div><span>Power</span><b>{v.power || "—"}</b></div>
        </div>
      </section>

      <section className="d3-card d3-events">
        <h3>Latest events</h3>
        <EventList events={t.events} max={4} loaded={m.track.loaded} />
      </section>
    </div>
  );
};

const Design3 = () => {
  const m = useMonitoringModel();
  const sel = m.selected;
  const count = (set: FleetStatus[]) => set.reduce((n, s) => n + m.counts[s], 0);
  return (
    <div className={`lmd-root d3${sel ? " has-sel" : ""}`}>
      <div className="d3-map">
        <FleetMap {...m.mapProps} />
        <aside className="d3-list lmd-over-left" aria-label="Vehicles">
          <SearchBox m={m} id="d3-search" placeholder={`Search ${m.devices.length} vehicles`} />
          <div className="d3-tiles" role="group" aria-label="Filter by status">
            {TILES.map((f) => {
              const on = !!m.filter && m.filter.length === f.set.length && f.set.every((x) => m.filter!.includes(x));
              return (
                <button key={f.key} type="button" className={on ? "is-on" : ""} aria-pressed={on} onClick={() => m.setFilter(on ? null : f.set)}>
                  <b style={{ color: f.color }}>{count(f.set)}</b><span>{f.label}</span>
                </button>
              );
            })}
          </div>
          <div className="d3-list__body">
            <ListStates m={m} />
            {m.visible.map((r) => <ListRow key={r.d._id} r={r} on={r.d._id === sel?.d._id} onPick={() => m.select(r.d._id)} />)}
          </div>
        </aside>
        <CamBar mode={m.camMode} onMode={m.setCamMode} onFitAll={m.fitAll} onZoom={m.zoom} className="d3-cam lmd-over-top" />
      </div>

      {sel ? (
        <Cards m={m} />
      ) : (
        <div className="d3-empty">
          <div className="d3-card">
            <h3>{m.counts.moving + m.counts.idle + m.counts.stopped} of {m.devices.length} vehicles online</h3>
            <p className="lmd-muted">Pick a vehicle in the list or on the map. Its speed, today's driving, location, device health and latest events show here.</p>
          </div>
        </div>
      )}
      <CommandHost m={m} />
    </div>
  );
};

export default Design3;
