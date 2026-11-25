// "More details" for the Camera focus card (replaces the old Today / Vehicle /
// Device / Sensors / Customer tabs from MonitoringLatest).
// Every value is real: "Today" is worked out from today's track with the same
// trip rules as Trip Playback; the other tabs show only fields that have data.
import { useMemo } from "react";
import { findTrips, fmtDur, fmtHM, Pt } from "../PlaybackV2/playbackUtils";
import { timeAgo } from "./fleetStatus";

export type DetailTab = "today" | "vehicle" | "device" | "customer";
export const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "vehicle", label: "Vehicle" },
  { key: "device", label: "Device" },
  { key: "customer", label: "Customer" },
];

const GAP_MS = 10 * 60 * 1000; // same as Playback: longer silences are "no data"
const STOP_KMH = 3;

/** Driving / idle / engine-off / no-data split of today so far. */
const daySplit = (pts: Pt[], limit: number) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const now = Date.now();
  let drive = 0, idle = 0, off = 0, over = 0, overRuns = 0, inOver = false;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const next = i + 1 < pts.length ? pts[i + 1].t : Math.min(now, p.t + GAP_MS);
    const dt = Math.max(0, Math.min(next - p.t, GAP_MS));
    if (p.speed >= STOP_KMH) drive += dt;
    else if (p.ignition) idle += dt;
    else off += dt;
    const isOver = p.speed > limit;
    if (isOver) over += dt;
    if (isOver && !inOver) overRuns++;
    inOver = isOver;
  }
  const total = Math.max(1, now - startOfDay.getTime());
  const none = Math.max(0, total - drive - idle - off);
  return { drive, idle, off, none, total, over, overRuns };
};

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="lm-kv__row">
    <dt>{k}</dt>
    <dd>{v}</dd>
  </div>
);

/** Key-value list that skips empty values. */
const KV = ({ rows }: { rows: [string, React.ReactNode][] }) => {
  const shown = rows.filter(([, v]) => v !== null && v !== undefined && v !== "" && v !== false);
  return shown.length ? (
    <dl className="lm-kv">{shown.map(([k, v]) => <Row key={k} k={k} v={v} />)}</dl>
  ) : (
    <div className="lm-empty">Nothing saved here yet.</div>
  );
};

const title = (s?: string) => (s ? s.toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "");
const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) : "");
const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) : "";

const TodayTab = ({ pts, loaded, limit, onOpenPlayback }: { pts: Pt[]; loaded: boolean; limit: number; onOpenPlayback: () => void }) => {
  const trips = useMemo(() => findTrips(pts, limit), [pts, limit]);
  const split = useMemo(() => daySplit(pts, limit), [pts, limit]);
  if (!loaded) return <div className="lm-empty">Loading today…</div>;
  if (!pts.length) return <div className="lm-empty">No data from this vehicle today.</div>;
  const km = trips.reduce((s, t) => s + t.km, 0);
  const driving = trips.reduce((s, t) => s + t.drivingMs, 0);
  const max = pts.reduce((m, p) => Math.max(m, p.speed), 0);
  const avg = driving > 0 ? km / (driving / 3600000) : 0;
  const parts = [
    { key: "drive", label: "Driving", ms: split.drive, color: "var(--at-moving)" },
    { key: "idle", label: "Idle", ms: split.idle, color: "var(--at-idle)" },
    { key: "off", label: "Engine off", ms: split.off, color: "var(--at-stopped)" },
    { key: "none", label: "No data", ms: split.none, color: "var(--at-line)" },
  ];
  return (
    <div className="lm-today">
      <div className="lm-tiles">
        <div><span className="lm-muted">Driven</span><strong>{km.toFixed(1)} km</strong></div>
        <div><span className="lm-muted">Trips</span><strong>{trips.length}</strong></div>
        <div><span className="lm-muted">Driving time</span><strong>{fmtDur(split.drive)}</strong></div>
        <div><span className="lm-muted">Top speed</span><strong className={max > limit ? "is-over" : ""}>{Math.round(max)} km/h</strong></div>
      </div>

      <div className="lm-split" aria-label="How today was spent">
        <div className="lm-split__bar" role="img" aria-label={parts.map((p) => `${p.label} ${fmtDur(p.ms)}`).join(", ")}>
          {parts.map((p) => (p.ms > 0 ? <span key={p.key} style={{ flexGrow: p.ms, background: p.color }} /> : null))}
        </div>
        <ul className="lm-split__legend">
          {parts.map((p) => (
            <li key={p.key}><i style={{ background: p.color }} />{p.label}<b>{fmtDur(p.ms)}</b></li>
          ))}
        </ul>
      </div>

      <KV
        rows={[
          ["Average while driving", avg ? `${Math.round(avg)} km/h` : ""],
          ["Over the limit", split.overRuns ? `${split.overRuns} time${split.overRuns === 1 ? "" : "s"} · ${fmtDur(split.over)} above ${limit} km/h` : `Never above ${limit} km/h`],
          ["First movement", trips[0] ? fmtHM(trips[0].start) : ""],
          ["Last stop", trips.length ? fmtHM(trips[trips.length - 1].end) : ""],
        ]}
      />

      {trips.length > 0 && (
        <div className="lm-trips">
          <div className="lm-trips__head">
            <strong>Trips</strong>
            <button type="button" className="lm-link" onClick={onOpenPlayback}>Open in Playback</button>
          </div>
          <ol>
            {[...trips].reverse().map((t) => (
              <li key={t.id}>
                <span className="lm-trips__time">{fmtHM(t.start)}–{fmtHM(t.end)}</span>
                <span>{t.km.toFixed(1)} km</span>
                <span className="lm-muted">{fmtDur(t.end - t.start)}</span>
                <span className={t.maxSpeed > limit ? "is-over" : "lm-muted"}>max {Math.round(t.maxSpeed)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

const VehicleTab = ({ d }: { d: any }) => {
  const v = d?.vehicle || {};
  const renew = v.serviceRenewalDate ? new Date(v.serviceRenewalDate).getTime() : null;
  const days = renew ? Math.ceil((renew - Date.now()) / 86400000) : null;
  return (
    <KV
      rows={[
        ["Registration", v.registrationNo],
        ["VRN", v.vrn && v.vrn !== v.registrationNo ? v.vrn : ""],
        ["Make and model", [v.make?.name, v.model?.name].filter(Boolean).join(" ")],
        ["Year", v.year ? String(v.year) : ""],
        ["Type", title(v.vehicleType)],
        ["Fuel", title(v.fuelType)],
        ["Gearbox", title(v.transmissionType)],
        ["Colour", v.color],
        ["Chassis no.", v.chasisNo],
        ["Engine no.", v.engineNo],
        ["Group", v.group?.name],
        ["Insurance", v.insurance?.name],
        ["Bank", v.bank?.name],
        ["Installation", title(v.installationStatus)],
        [
          "Subscription",
          renew ? (
            <span className={days !== null && days < 30 ? "is-over" : ""}>
              {days !== null && days < 0 ? "Expired " : "Renews "}
              {fmtDate(v.serviceRenewalDate)}
              {days !== null && days >= 0 ? ` · ${days} days left` : ""}
            </span>
          ) : "",
        ],
      ]}
    />
  );
};

const DeviceTab = ({ d }: { d: any }) => {
  const p = d?.latestPosition || {};
  const a = p.attributes || {};
  const delay = p.serverTime && p.deviceTime ? (Date.parse(p.serverTime) - Date.parse(p.deviceTime)) / 1000 : null;
  const lat = Number(p.latitude), lng = Number(p.longitude);
  const hasPos = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
  return (
    <KV
      rows={[
        ["IMEI", d?.vehicle?.imei || d?.uniqueId],
        ["Connection", d?.status ? title(d.status) : ""],
        ["Protocol", p.protocol ? String(p.protocol).toUpperCase() : ""],
        ["Last fix", p.deviceTime ? `${fmtDateTime(p.deviceTime)} (${timeAgo(p.deviceTime)})` : ""],
        ["Reached server", delay !== null && Number.isFinite(delay) ? (delay < 60 ? `${Math.max(0, Math.round(delay))} s later` : `${fmtDur(delay * 1000)} later (buffered)`) : ""],
        ["GPS", p.valid === false ? "No fix" : a.sat != null ? `${a.sat} satellites` : p.valid ? "Fix" : ""],
        [
          "Position",
          hasPos ? (
            <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer">{lat.toFixed(5)}, {lng.toFixed(5)}</a>
          ) : "",
        ],
        ["Altitude", p.altitude ? `${Math.round(p.altitude)} m` : ""],
        ["Odometer", a.odometer ? `${Math.round(a.odometer / 1000).toLocaleString()} km` : a.totalDistance ? `${Math.round(a.totalDistance / 1000).toLocaleString()} km` : ""],
        ["Engine hours", a.hours ? `${Math.round(a.hours / 3600000).toLocaleString()} h` : ""],
        ["Ignition", a.ignition === true ? (a.ignitionInferred ? "On (from speed)" : "On") : a.ignition === false ? "Off" : ""],
        ["Ignition since", a.ignitionTime ? fmtDateTime(a.ignitionTime) : ""],
        ["Moving (device)", a.motion === true ? "Yes" : a.motion === false ? "No" : ""],
        ["External power", a.power != null ? `${Number(a.power).toFixed(1)} V` : ""],
        ["Battery", a.battery != null ? `${Number(a.battery).toFixed(1)} V` : a.batteryLevel != null ? `${a.batteryLevel}%` : ""],
        ["Analog input", a.adc1 ?? a.adc ?? ""],
        ["Signal", a.rssi != null ? `${a.rssi}` : ""],
        ["Clock corrected", a.clockFixedHours ? `${a.clockFixedHours} h (tracker clock is wrong)` : ""],
      ]}
    />
  );
};

const CustomerTab = ({ d }: { d: any }) => {
  const c = d?.vehicle?.customer || {};
  const phone = c.phoneNo ? String(c.phoneNo) : "";
  return (
    <KV
      rows={[
        ["Name", c.fullName],
        ["Phone", phone ? <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a> : ""],
        ["Email", c.emailAddress ? <a href={`mailto:${c.emailAddress}`}>{c.emailAddress}</a> : ""],
      ]}
    />
  );
};

export const FocusDetails = ({ tab, onTab, d, pts, loaded, limit, onOpenPlayback }: { tab: DetailTab; onTab: (t: DetailTab) => void; d: any; pts: Pt[]; loaded: boolean; limit: number; onOpenPlayback: () => void }) => (
  <div className="lm-details">
    <div className="lm-tabs" role="tablist" aria-label="Vehicle details">
      {DETAIL_TABS.map((t) => (
        <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`lm-tab${tab === t.key ? " is-on" : ""}`} onClick={() => onTab(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
    <div className="lm-details__body" role="tabpanel">
      {tab === "today" && <TodayTab pts={pts} loaded={loaded} limit={limit} onOpenPlayback={onOpenPlayback} />}
      {tab === "vehicle" && <VehicleTab d={d} />}
      {tab === "device" && <DeviceTab d={d} />}
      {tab === "customer" && <CustomerTab d={d} />}
    </div>
  </div>
);
