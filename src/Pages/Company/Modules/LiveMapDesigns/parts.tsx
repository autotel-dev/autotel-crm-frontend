// Small pieces shared by the three monitoring designs.
import { useState } from "react";
import FleetMap from "../LiveMap/FleetMap";
import CommandPanel from "../../../../Component/Commands/CommandPanel";
import { EventMark, fmtHM } from "../PlaybackV2/playbackUtils";
import { FleetStatus, STATUS_INFO } from "../LiveMap/fleetStatus";
import { CamMode, DayPart, Model, PART_COLOR, mapsLink } from "./useMonitoringModel";
// Map marker, cluster and hover styles live with the current Live Monitoring page
import "../LiveMap/liveMap.scss";

export { FleetMap };

/** Top-view car (M3) as an image, coloured by status and turned to its heading. */
export const carIcon = (hex: string, heading = 0) =>
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-8 0 40 40">` +
      `<g transform="rotate(${Math.round(heading)} 12 20)">` +
      `<rect x="3" y="1" width="18" height="38" rx="7" fill="${hex}" stroke="#fff" stroke-width="1.8"/>` +
      `<rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".38"/>` +
      `<rect x="6" y="28" width="12" height="5" rx="2" fill="#000" opacity=".3"/></g></svg>`
  );

/** Upright car tile (no rotation), for list rows and headers. */
export const CarTile = ({ s, size = 40, heading }: { s: FleetStatus; size?: number; heading?: number }) => (
  <img src={carIcon(STATUS_INFO[s].hex, heading ?? 0)} width={size} height={size} alt="" aria-hidden="true" />
);

/** Ring gauge; `frac` 0–1 (null = no reading). */
export const Ring = ({ frac, color, size = 72, stroke = 8, track = "var(--at-soft)", children, label }: {
  frac: number | null; color: string; size?: number; stroke?: number; track?: string; children?: React.ReactNode; label?: string;
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const f = frac == null ? 0 : Math.max(0, Math.min(1, frac));
  return (
    <div className="lmd-ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        {f > 0 && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${f * c} ${c}`}
            // inline transform: a site-wide rule sets transform-origin on every circle
            style={{ transform: "rotate(-90deg)", transformBox: "view-box", transformOrigin: `${size / 2}px ${size / 2}px`, animation: "none", transition: "stroke-dasharray .6s ease" }}
          />
        )}
      </svg>
      {children != null && <div className="lmd-ring__in">{children}</div>}
    </div>
  );
};

export const speedColor = (speed: number, limit: number) =>
  speed > limit ? "var(--at-stopped)" : speed > limit * 0.9 ? "var(--at-idle)" : "var(--at-moving)";

/** Speed dial: ring fills up to 125 % of the limit. */
export const SpeedDial = ({ speed, limit, online, size = 120, stroke = 10 }: { speed: number; limit: number; online: boolean; size?: number; stroke?: number }) => (
  <Ring frac={online ? speed / (limit * 1.25) : null} color={speedColor(speed, limit)} size={size} stroke={stroke} label={online ? `${speed} km/h` : "Not reporting"}>
    <strong className="lmd-dial__val">{online ? speed : "—"}</strong>
    <small className="lmd-dial__unit">km/h</small>
  </Ring>
);

/** 00:00–24:00 bar: driving, idle, engine off, no data. */
export const DayBar = ({ bar, nowFrac, axis = false, height = 10 }: { bar: { from: number; to: number; part: DayPart }[]; nowFrac: number; axis?: boolean; height?: number }) => (
  <div className="lmd-daybar">
    <div className="lmd-daybar__track" style={{ height }} role="img" aria-label="Today: driving (green), idle (amber), engine off (red), no data (grey)">
      {bar.map((b, i) => (
        <span key={i} style={{ left: `${b.from * 100}%`, width: `${Math.max(0.2, (b.to - b.from) * 100)}%`, background: PART_COLOR[b.part] }} />
      ))}
      <i style={{ left: `${Math.min(100, nowFrac * 100)}%` }} aria-hidden="true" />
    </div>
    {axis && (
      <div className="lmd-daybar__axis" aria-hidden="true">
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
      </div>
    )}
  </div>
);

const EV_COLOR: Record<string, string> = { S: "var(--at-stopped)", A: "var(--at-moving)", B: "var(--at-primary)", P: "var(--at-idle)" };

/** Latest events from today's track (newest first). */
export const EventList = ({ events, max = 4, loaded }: { events: EventMark[]; max?: number; loaded: boolean }) => {
  const list = [...events].reverse().slice(0, max);
  if (!loaded) return <div className="lmd-muted">Loading…</div>;
  if (!list.length) return <div className="lmd-muted">Nothing yet today.</div>;
  return (
    <ul className="lmd-events">
      {list.map((e) => (
        <li key={e.key}>
          <i style={{ background: EV_COLOR[e.kind] || "var(--at-muted)" }} />
          <span>{e.label}</span>
          <time>{fmtHM(e.t)}</time>
        </li>
      ))}
    </ul>
  );
};

/** Copies a Google Maps link to the vehicle's position. */
export const ShareButton = ({ lat, lng, className = "", children = "Share" }: { lat: number | null; lng: number | null; className?: string; children?: React.ReactNode }) => {
  const [done, setDone] = useState(false);
  const url = mapsLink(lat, lng);
  return (
    <button
      type="button"
      className={className}
      disabled={!url}
      title={url ? "Copy a Google Maps link to this position" : "No position yet"}
      onClick={async () => {
        try { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1800); }
        catch { window.open(url, "_blank", "noopener"); }
      }}
    >
      {done ? "Link copied" : children}
    </button>
  );
};

export const CallButton = ({ phone, name, className = "", children = "Call" }: { phone: string; name: string; className?: string; children?: React.ReactNode }) =>
  phone ? (
    <a className={className} href={`tel:${String(phone).replace(/[^\d+]/g, "")}`} title={`Call ${name || "customer"} (${phone})`}>{children}</a>
  ) : (
    <button type="button" className={className} disabled title="No phone number saved for this customer">{children}</button>
  );

export const CamBar = ({ mode, onMode, onFitAll, onZoom, className = "" }: { mode: CamMode; onMode: (m: CamMode) => void; onFitAll: () => void; onZoom?: (d: 1 | -1) => void; className?: string }) => (
  <div className={`lmd-cam ${className}`} role="group" aria-label="Camera">
    <button type="button" aria-pressed={mode === "follow"} className={mode === "follow" ? "is-on" : ""} onClick={() => onMode("follow")}>Follow</button>
    <button type="button" aria-pressed={mode === "free"} className={mode === "free" ? "is-on" : ""} onClick={() => onMode("free")}>Free</button>
    <button type="button" onClick={onFitAll}>Fit all</button>
    {onZoom && (
      <>
        <button type="button" aria-label="Zoom in" onClick={() => onZoom(1)}>+</button>
        <button type="button" aria-label="Zoom out" onClick={() => onZoom(-1)}>−</button>
      </>
    )}
  </div>
);

/** Commands panel, opened by Command / Cut engine / Resume. */
export const CommandHost = ({ m }: { m: Model }) =>
  m.cmd ? <CommandPanel vehicleId={m.cmd.vehicleId} plate={m.cmd.plate} initialKey={m.cmd.key} onClose={m.closeCommand} /> : null;

export const ListStates = ({ m }: { m: Model }) => (
  <>
    {m.loading && m.devices.length === 0 && <div className="lmd-empty">Loading vehicles…</div>}
    {m.failed && m.devices.length === 0 && (
      <div className="lmd-empty">Couldn't load vehicles. <button type="button" className="lmd-link" onClick={m.fetchDevices}>Try again</button></div>
    )}
    {!m.loading && m.devices.length > 0 && m.visible.length === 0 && <div className="lmd-empty">No vehicles match.</div>}
  </>
);

export const SearchBox = ({ m, placeholder, id }: { m: Model; placeholder: string; id: string }) => (
  <div className="lmd-search">
    <label htmlFor={id} className="visually-hidden">Search vehicles</label>
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0.01 0M20 20l-4-4" /></svg>
    <input id={id} placeholder={placeholder} value={m.query} onChange={(e) => m.setQuery(e.target.value)} />
    {m.query && <button type="button" aria-label="Clear search" onClick={() => m.setQuery("")}>✕</button>}
  </div>
);
