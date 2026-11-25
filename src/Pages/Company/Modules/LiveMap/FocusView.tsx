// Live Monitoring — design B "Camera focus".
// When a vehicle is selected the page switches to a focus view: the camera
// locks on that vehicle, a panel shows its live state (speed dial, ignition,
// heading, km today, limit), and a bottom strip shows the last 30 minutes of
// speed and the rest of the fleet for quick switching.
import { useEffect, useMemo, useState } from "react";
import { getAll } from "../../../../Utilities/api";
import { GET_VEHICLE_HISTORY } from "../../../../Utilities/api/apiEndpoints";
import { dayRange, findTrips, Pt, toPoints, todayStr } from "../PlaybackV2/playbackUtils";
import { knotsToKmh } from "../../../../utils/speed";
import { FleetStatus, isOnline, plateOf, STATUS_INFO, timeAgo } from "./fleetStatus";

const SPARK_MS = 30 * 60 * 1000;
const REFRESH_MS = 60 * 1000;
const LIMITS = [60, 80, 100, 120];

/** Same speed limit setting as Trip Playback (remembered per browser). */
export const readLimit = () => {
  try {
    const v = Number(localStorage.getItem("pb-limit"));
    return LIMITS.includes(v) ? v : 80;
  } catch {
    return 80;
  }
};

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const compass = (deg: number) => `${COMPASS[Math.round((((deg % 360) + 360) % 360) / 45) % 8]} ${Math.round(((deg % 360) + 360) % 360)}°`;

/**
 * Today's track for the focused vehicle: loaded from the history API, refreshed
 * every minute, with the live position appended in between.
 */
export const useTodayTrack = (device: any | null) => {
  const histId = device?.id ?? device?.vehicle?.traccarDeviceId ?? null;
  const [pts, setPts] = useState<Pt[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPts([]);
    setLoaded(false);
    if (histId == null) return;
    let alive = true;
    const load = () => {
      const { from, to } = dayRange(todayStr());
      getAll({ url: `${GET_VEHICLE_HISTORY}/${histId}?fromDateTime=${encodeURIComponent(from)}&toDateTime=${encodeURIComponent(to)}` })
        .then((res: any) => {
          if (!alive) return;
          if (res && res.success !== false) setPts(toPoints(res?.data?.history));
          setLoaded(true);
        })
        .catch(() => alive && setLoaded(true));
    };
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [histId]);

  // Append the live position when it is newer than the last history point
  const p = device?.latestPosition;
  return useMemo(() => {
    const t = p?.deviceTime ? Date.parse(p.deviceTime) : NaN;
    const lat = Number(p?.latitude);
    const lng = Number(p?.longitude);
    const last = pts[pts.length - 1];
    const sameDay = Number.isFinite(t) && todayStr(new Date(t)) === todayStr();
    if (!sameDay || !Number.isFinite(lat) || !Number.isFinite(lng) || (last && t <= last.t)) return { pts, loaded };
    return {
      pts: [
        ...pts,
        { t, lat, lng, speed: knotsToKmh(p.speed), course: Number(p.course) || 0, ignition: Boolean(p?.attributes?.ignition), address: "", km: 0 },
      ],
      loaded,
    };
  }, [pts, loaded, p]);
};

/** Speed dial (ring fills up to 125 % of the limit). */
const SpeedDial = ({ speed, limit, online }: { speed: number; limit: number; online: boolean }) => {
  const r = 50;
  const c = 2 * Math.PI * r;
  const frac = online ? Math.min(1, speed / (limit * 1.25)) : 0;
  const color = speed > limit ? "var(--at-stopped)" : speed > limit * 0.9 ? "var(--at-idle)" : "var(--at-moving)";
  return (
    <div className="lm-dial" role="img" aria-label={online ? `${speed} km/h` : "Not reporting"}>
      <svg viewBox="0 0 120 120" width="116" height="116" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--at-soft)" strokeWidth="10" />
        {frac > 0 && <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${frac * c} ${c}`}
          // inline transform: a site-wide rule sets transform-origin on every circle
          style={{ transform: "rotate(-90deg)", transformBox: "view-box", transformOrigin: "60px 60px", animation: "none", transition: "stroke-dasharray .6s ease" }}
        />}
      </svg>
      <div className="lm-dial__val">
        <strong>{online ? speed : "—"}</strong>
        <small>km/h</small>
      </div>
    </div>
  );
};

type FocusCardProps = {
  d: any;
  s: FleetStatus;
  address: string;
  limit: number;
  kmToday: number | null;
  onClose: () => void;
  onPlayback: () => void;
  onCommand: () => void;
  details: React.ReactNode;
  detailsOpen: boolean;
  onToggleDetails: () => void;
};

export const FocusCard = ({ d, s, address, limit, kmToday, onClose, onPlayback, onCommand, details, detailsOpen, onToggleDetails }: FocusCardProps) => {
  const pos = d?.latestPosition;
  const online = isOnline(s);
  const speed = Math.round(knotsToKmh(pos?.speed));
  const ign = pos?.attributes?.ignition;
  const phone = d?.vehicle?.customer?.phoneNo;
  const who = [[d?.vehicle?.make?.name, d?.vehicle?.model?.name].filter(Boolean).join(" "), d?.vehicle?.customer?.fullName].filter(Boolean).join(" · ");
  return (
    <section className={`lm-panel lm-focus${detailsOpen ? " is-wide" : ""}`} aria-label={`Following ${plateOf(d)}`}>
      <div className="lm-focus__head">
        <div style={{ minWidth: 0 }}>
          <span className="lm-muted lm-focus__kicker">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
            Camera on
            <span className="lm-status lm-status--sm"><i style={{ background: STATUS_INFO[s].hex }} />{STATUS_INFO[s].label}</span>
          </span>
          <div className="lm-focus__plate">{plateOf(d)}</div>
          <div className="lm-muted lm-focus__who">{who || "—"}</div>
        </div>
        <button type="button" className="lm-focus__close" aria-label="Stop following and show all vehicles" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="lm-focus__live">
        <SpeedDial speed={speed} limit={limit} online={online} />
        <div className="lm-focus__facts">
          <div><span className="lm-muted">{online ? "Ignition" : "Last ignition"}</span><strong>{ign === true ? "On" : ign === false ? "Off" : "—"}</strong></div>
          <div><span className="lm-muted">Heading</span><strong>{pos?.latitude ? compass(Number(pos.course) || 0) : "—"}</strong></div>
          <div><span className="lm-muted">Today</span><strong>{kmToday == null ? "…" : `${kmToday.toFixed(1)} km`}</strong></div>
          <div><span className="lm-muted">Limit</span><strong>{limit}</strong></div>
        </div>
      </div>

      <div className="lm-muted lm-focus__where">
        {address || (pos?.latitude ? `${Number(pos.latitude).toFixed(5)}, ${Number(pos.longitude).toFixed(5)}` : "No position yet")}
        {" · "}updated {timeAgo(pos?.deviceTime)}
      </div>

      <div className="lm-focus__actions">
        <button type="button" className="at-btn at-btn--primary" onClick={onPlayback}>Playback</button>
        <button type="button" className="at-btn" onClick={onCommand}>Command</button>
        {phone ? (
          <a className="at-btn" href={`tel:${String(phone).replace(/[^\d+]/g, "")}`} title={`Call ${d?.vehicle?.customer?.fullName || "customer"} (${phone})`}>Call customer</a>
        ) : (
          <button type="button" className="at-btn" disabled title="No phone number saved for this customer">Call customer</button>
        )}
      </div>
      <button type="button" className="lm-link lm-focus__more" aria-expanded={detailsOpen} onClick={onToggleDetails}>
        {detailsOpen ? "Hide details" : "More details"}
      </button>
      {detailsOpen && details}
    </section>
  );
};

export type CamMode = "follow" | "free";

export const CameraBar = ({ mode, onMode, onFitAll, onZoom }: { mode: CamMode; onMode: (m: CamMode) => void; onFitAll: () => void; onZoom: (dir: 1 | -1) => void }) => (
  <div className="lm-cam">
    <div className="lm-panel lm-cam__modes" role="group" aria-label="Camera">
      <button type="button" aria-pressed={mode === "follow"} className={mode === "follow" ? "is-on" : ""} onClick={() => onMode("follow")}>Follow</button>
      <button type="button" aria-pressed={mode === "free"} className={mode === "free" ? "is-on" : ""} onClick={() => onMode("free")}>Free</button>
      <button type="button" onClick={onFitAll}>Fit all</button>
    </div>
    <div className="lm-panel lm-cam__zoom" role="group" aria-label="Zoom">
      <button type="button" aria-label="Zoom in" onClick={() => onZoom(1)}>+</button>
      <button type="button" aria-label="Zoom out" onClick={() => onZoom(-1)}>−</button>
    </div>
  </div>
);

/** Last 30 minutes of speed with the limit as a dashed line. */
const Spark = ({ pts, limit }: { pts: Pt[]; limit: number }) => {
  const W = 600;
  const H = 48;
  const now = Date.now();
  const from = now - SPARK_MS;
  const recent = pts.filter((p) => p.t >= from);
  const top = Math.max(limit * 1.15, ...recent.map((p) => p.speed), 1);
  const y = (v: number) => H - 3 - (Math.min(v, top) / top) * (H - 6);
  const x = (t: number) => ((t - from) / SPARK_MS) * W;
  // Break the line where data is missing for more than 3 minutes
  let d = "";
  recent.forEach((p, i) => {
    const gap = i === 0 || p.t - recent[i - 1].t > 3 * 60 * 1000;
    d += `${gap ? "M" : "L"}${x(p.t).toFixed(1)} ${y(p.speed).toFixed(1)} `;
  });
  const max = recent.reduce((m, p) => Math.max(m, p.speed), 0);
  return (
    <svg className="lm-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={recent.length ? `Speed over the last 30 minutes, top ${Math.round(max)} km/h` : "No data in the last 30 minutes"}>
      <line x1="0" x2={W} y1={y(limit)} y2={y(limit)} stroke="var(--at-stopped)" strokeWidth="1.5" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
      {d && <path d={d} fill="none" stroke="var(--at-moving)" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
};

type StripRow = { d: any; s: FleetStatus };

export const BottomStrip = ({ pts, loaded, limit, others, selectedId, onPick }: { pts: Pt[]; loaded: boolean; limit: number; others: StripRow[]; selectedId: string; onPick: (id: string) => void }) => {
  const trips = useMemo(() => findTrips(pts, limit), [pts, limit]);
  const km = trips.reduce((s, t) => s + t.km, 0);
  const hasRecent = pts.some((p) => p.t >= Date.now() - SPARK_MS);
  return (
    <div className="lm-strip">
      <div className="lm-panel lm-strip__speed">
        <div className="lm-strip__row">
          <span>{loaded ? `Today · ${trips.length} trip${trips.length === 1 ? "" : "s"} · ${km.toFixed(1)} km` : "Today · loading…"}</span>
          <span>last 30 min speed{hasRecent ? "" : " · no data"}</span>
        </div>
        <Spark pts={pts} limit={limit} />
      </div>
      <div className="lm-panel lm-strip__fleet" aria-label="Other vehicles">
        {others.map(({ d, s }) => (
          <button key={d._id} type="button" className={`lm-strip__car${d._id === selectedId ? " is-on" : ""}`} aria-pressed={d._id === selectedId} onClick={() => onPick(d._id)}>
            <span className="lm-strip__plate"><i style={{ background: STATUS_INFO[s].hex }} />{plateOf(d)}</span>
            <span className="lm-muted">{d._id === selectedId ? "Following" : `${STATUS_INFO[s].label} · ${timeAgo(d?.latestPosition?.deviceTime)}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/** Today's km from the track (same trip rules as Trip Playback). */
export const kmFromTrack = (pts: Pt[], limit: number) => findTrips(pts, limit).reduce((s, t) => s + t.km, 0);
