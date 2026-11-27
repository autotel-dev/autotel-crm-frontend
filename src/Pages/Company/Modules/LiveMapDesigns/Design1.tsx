// Monitoring design 1: three columns. Vehicle list | map | selected vehicle.
import { FleetStatus, plateOf, STATUS_INFO, STATUS_ORDER, timeAgo } from "../LiveMap/fleetStatus";
import { compass } from "../LiveMap/FocusView";
import {
  customerName, customerPhone, fmtHrs, plural, imeiOf, Model, readings, renewsOn, Row, simOf, useMonitoringModel, vehicleLine,
} from "./useMonitoringModel";
import { CallButton, CamBar, CarTile, CommandHost, DayBar, EventList, FleetMap, ListStates, SearchBox, ShareButton, SpeedDial } from "./parts";
import "./designs.scss";

const rightLabel = (r: Row) => {
  const v = readings(r.d, r.s);
  if (r.s === "moving") return { text: `${v.speed} km/h`, color: "var(--at-moving)" };
  if (r.s === "offline" || r.s === "inactive") return { text: `Offline ${timeAgo(v.deviceTime).replace(" ago", "")}`, color: "var(--at-muted)" };
  return { text: STATUS_INFO[r.s].label, color: STATUS_INFO[r.s].color };
};

const ListRow = ({ r, on, onPick }: { r: Row; on: boolean; onPick: () => void }) => {
  const v = readings(r.d, r.s);
  const right = rightLabel(r);
  const meta = [customerName(r.d), vehicleLine(r.d)].filter(Boolean).join(" · ") || "—";
  return (
    <button type="button" className={`d1-row${on ? " is-on" : ""}`} aria-pressed={on} onClick={onPick}>
      <span className="d1-row__icon"><CarTile s={r.s} size={34} /></span>
      <span className="d1-row__main">
        <span className="d1-row__top"><strong>{plateOf(r.d)}</strong><b style={{ color: right.color }}>{right.text}</b></span>
        <span className="d1-row__meta">{meta}</span>
        <span className="d1-row__bottom">
          {v.ignition && <span>Key {v.ignition.toLowerCase()}</span>}
          {v.gsm && <span>GSM {v.gsm.toLowerCase()}</span>}
          {v.battery && <span>Batt {v.battery}</span>}
          <time>{v.deviceTime ? timeAgo(v.deviceTime).replace(" ago", "") : "never"}</time>
        </span>
      </span>
    </button>
  );
};

const Fact = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="d1-fact"><span>{k}</span><strong>{v ?? "—"}</strong></div>
);

const Detail = ({ m }: { m: Model }) => {
  const sel = m.selected!;
  const { d, s } = sel;
  const v = readings(d, s, m.track.attrs);
  const t = m.today;
  const sub = [vehicleLine(d), v.protocol, imeiOf(d) && `IMEI ${imeiOf(d)}`].filter(Boolean).join(" · ");
  return (
    <div className="d1-detail">
      <header className="d1-detail__head">
        <div style={{ minWidth: 0 }}>
          <span className="lmd-kicker">Selected vehicle</span>
          <h2 className="d1-plate">{plateOf(d)}</h2>
          <div className="lmd-muted">{sub || "—"}</div>
        </div>
        <span className="lmd-pill" style={{ color: STATUS_INFO[s].color, background: `color-mix(in srgb, ${STATUS_INFO[s].hex} 18%, transparent)` }}>{STATUS_INFO[s].label}</span>
        <button type="button" className="lmd-close" aria-label="Close vehicle panel" onClick={() => m.select(null)}>✕</button>
      </header>

      <div className="d1-live">
        <SpeedDial speed={v.speed} limit={m.limitKmh} online={v.online} size={136} stroke={12} />
        <div className="d1-facts">
          <Fact k={v.online ? "Ignition" : "Last ignition"} v={v.ignition} />
          <Fact k="Heading" v={v.heading != null ? compass(v.heading) : null} />
          <Fact k="Odometer" v={v.odometer} />
          <Fact k="Limit" v={`${m.limitKmh} km/h`} />
        </div>
      </div>

      <div className="d1-where">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
        <div style={{ minWidth: 0, flex: 1 }}>
          <strong>{m.address || (v.lat != null ? "Looking up address…" : "No position yet")}</strong>
          <div className="lmd-muted">
            {v.lat != null ? `${v.lat.toFixed(4)}, ${v.lng!.toFixed(4)} · ` : ""}updated {timeAgo(v.deviceTime)}
            {customerName(d) ? ` · customer ${customerName(d)}` : ""}
          </div>
        </div>
        <ShareButton lat={v.lat} lng={v.lng} className="lmd-btn" />
      </div>

      <div className="d1-cards">
        <section className="d1-card">
          <h3>Today</h3>
          <div className="d1-km"><strong>{m.track.loaded ? t.km.toFixed(1) : "…"}</strong> km · {plural(t.trips, "trip")}{t.ongoing ? " · driving now" : ""}</div>
          <DayBar bar={t.bar} nowFrac={t.nowFrac} height={8} />
          <div className="d1-split">
            <span>Run<b>{fmtHrs(t.ms.drive)}</b></span>
            <span>Idle<b>{fmtHrs(t.ms.idle)}</b></span>
            <span>Stop<b>{fmtHrs(t.ms.off)}</b></span>
          </div>
        </section>
        <section className="d1-card">
          <h3>Device health</h3>
          <dl className="d1-health">
            <div><dt>GPS</dt><dd className={v.gps && v.gps !== "No fix" ? "is-good" : ""}>{v.gps || "—"}</dd></div>
            <div><dt>GSM</dt><dd className={v.gsm === "Good" ? "is-good" : ""}>{v.gsm || "—"}</dd></div>
            <div><dt>Battery</dt><dd className={v.battFrac != null && v.battFrac > 0.5 ? "is-good" : ""}>{v.battery || "—"}</dd></div>
            <div><dt>Power</dt><dd className={v.power ? "is-good" : ""}>{v.power || "—"}</dd></div>
          </dl>
        </section>
        <section className="d1-card">
          <div className="d1-card__row"><h3>Engine</h3><span className="lmd-muted">{v.ignition ? `Ignition ${v.ignition.toLowerCase()}` : ""}</span></div>
          <button type="button" className="lmd-btn lmd-btn--danger d1-wide" onClick={() => m.openCommand(d, "engineStop")}>Cut engine</button>
          <div className="d1-two">
            <button type="button" className="lmd-btn" onClick={() => m.openCommand(d, "engineResume")}>Resume</button>
            <button type="button" className="lmd-btn" onClick={() => m.openCommand(d)}>More…</button>
          </div>
        </section>
        <section className="d1-card">
          <div className="d1-card__row"><h3>Events today</h3><span className="lmd-muted">{t.events.length || ""}</span></div>
          <EventList events={t.events} max={3} loaded={m.track.loaded} />
        </section>
      </div>

      <div className="d1-sim">
        <span>{simOf(d, m.track.attrs) ? `SIM ${simOf(d, m.track.attrs)}` : ""}</span>
        <span>{renewsOn(d) ? `Renews ${renewsOn(d)}` : ""}</span>
      </div>

      <div className="d1-actions">
        <button type="button" className="lmd-btn lmd-btn--primary" onClick={() => m.openPlayback(d)}>Playback</button>
        <button type="button" className="lmd-btn" onClick={m.openReports}>Reports</button>
        <CallButton phone={customerPhone(d)} name={customerName(d)} className="lmd-btn" />
      </div>
    </div>
  );
};

const Overview = ({ m }: { m: Model }) => {
  const online = m.counts.moving + m.counts.idle + m.counts.stopped;
  return (
    <div className="d1-detail d1-overview">
      <span className="lmd-kicker">Fleet now</span>
      <h2 className="d1-plate">{online} <small>of {m.devices.length} online</small></h2>
      <div className="d1-ov-grid">
        {STATUS_ORDER.map((s) => (
          <button key={s} type="button" className="d1-ov" onClick={() => m.setFilter([s])}>
            <i style={{ background: STATUS_INFO[s].color }} />
            <span>{STATUS_INFO[s].label}</span>
            <b>{m.counts[s]}</b>
          </button>
        ))}
      </div>
      <p className="lmd-muted">Pick a vehicle in the list or on the map to see its live speed, today's driving, device health and engine controls.</p>
      {m.lastAlert && (
        <div className="d1-card">
          <h3>Latest alert</h3>
          <div>{m.lastAlert.message || m.lastAlert.type}</div>
          <div className="lmd-muted">{m.lastAlert.plate} · {timeAgo(new Date(m.lastAlert.at).toISOString())}</div>
        </div>
      )}
    </div>
  );
};

const CHIPS: (FleetStatus | null)[] = [null, ...STATUS_ORDER];

const Design1 = () => {
  const m = useMonitoringModel();
  const sel = m.selected;
  return (
    <div className="lmd-root d1">
      <aside className="d1-list" aria-label="Vehicles">
        <div className="d1-list__head">
          <h1>Live monitoring</h1>
          <span className="lmd-muted">{m.devices.length} vehicles</span>
        </div>
        <SearchBox m={m} id="d1-search" placeholder="Plate, IMEI, customer…" />
        <div className="lmd-mix" aria-hidden="true">
          {STATUS_ORDER.map((s) => (m.counts[s] ? <span key={s} style={{ flexGrow: m.counts[s], background: STATUS_INFO[s].color }} /> : null))}
        </div>
        <div className="d1-chips" role="group" aria-label="Filter by status">
          {CHIPS.map((s) => {
            if (s && !m.counts[s]) return null;
            const on = s ? m.filter?.length === 1 && m.filter[0] === s : !m.filter;
            return (
              <button key={s || "all"} type="button" className={`d1-chip${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => m.setFilter(s && !on ? [s] : null)}>
                <i style={{ background: s ? STATUS_INFO[s].color : "var(--at-primary)" }} />
                {s ? STATUS_INFO[s].label : "All"} <b>{s ? m.counts[s] : m.devices.length}</b>
              </button>
            );
          })}
        </div>
        <div className="d1-list__body">
          <ListStates m={m} />
          {m.visible.map((r) => <ListRow key={r.d._id} r={r} on={r.d._id === sel?.d._id} onPick={() => m.select(r.d._id)} />)}
        </div>
      </aside>

      <main className="d1-map">
        <FleetMap {...m.mapProps} />
        <CamBar mode={m.camMode} onMode={m.setCamMode} onFitAll={m.fitAll} className="d1-cam lmd-over-top" />
        <div className="d1-zoom lmd-over-right" role="group" aria-label="Zoom">
          <button type="button" aria-label="Zoom in" onClick={() => m.zoom(1)}>+</button>
          <button type="button" aria-label="Zoom out" onClick={() => m.zoom(-1)}>−</button>
        </div>
        {sel ? (
          <section className="d1-today lmd-over-bottom" aria-label="Today">
            <div className="d1-today__head">
              <strong>Today · {plateOf(sel.d)}</strong>
              <span className="lmd-muted">{m.track.loaded ? `${plural(m.today.trips, "trip")} · ${m.today.km.toFixed(1)} km · ${m.today.overs} over limit` : "loading…"}</span>
            </div>
            <DayBar bar={m.today.bar} nowFrac={m.today.nowFrac} axis height={16} />
          </section>
        ) : (
          <section className="d1-today lmd-over-bottom" aria-label="Fleet summary">
            <div className="d1-today__head">
              <strong>{m.counts.moving + m.counts.idle + m.counts.stopped} of {m.devices.length} online</strong>
              <span className="lmd-muted">{m.counts.moving} moving · {m.counts.offline + m.counts.inactive + m.counts.not_connected} not reporting</span>
            </div>
          </section>
        )}
      </main>

      <aside className="d1-side" aria-label={sel ? `Vehicle ${plateOf(sel.d)}` : "Fleet"}>
        {sel ? <Detail m={m} /> : <Overview m={m} />}
      </aside>
      <CommandHost m={m} />
    </div>
  );
};

export default Design1;

