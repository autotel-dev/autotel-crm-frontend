// State for Live Monitoring (/company/modules/monitoring, Design1.tsx; the
// team picked design 1 of three trials on 28 Nov 2026). Same live data,
// statuses, today's track and pop-ups as the earlier LiveMap.tsx page.
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFleet } from "../LiveMap/useFleet";
import { kmFromTrack, readLimit, useTodayTrack } from "../LiveMap/FocusView";
import { deriveStatus, FleetStatus, isOnline, plateOf, searchText, STATUS_INFO, STATUS_ORDER } from "../LiveMap/fleetStatus";
import { findEvents, findStops, findTrips, isSignalGap, Pt, todayStr } from "../PlaybackV2/playbackUtils";
import { setSelectedSingleDevice } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { knotsToKmh } from "../../../../utils/speed";

const U = process.env.PUBLIC_URL || "";

export type Row = { d: any; s: FleetStatus; text: string };
export type CamMode = "follow" | "free";

/** "Offline" in the designs = every vehicle that isn't reporting. */
export const NOT_REPORTING: FleetStatus[] = ["offline", "inactive", "not_connected", "expired"];

export const useMonitoringModel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state: any) => state.user);
  const { devices, loading, failed, fetchDevices, lastAlert } = useFleet();
  const inactiveLimit = userData?.inactiveTimeLimit || 1440;

  const [filter, setFilter] = useState<FleetStatus[] | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [camMode, setCamModeState] = useState<CamMode>("follow");
  const [centerKey, setCenterKey] = useState(0);
  const [fitKey, setFitKey] = useState(0);
  const [limitKmh, setLimitKmh] = useState<number>(readLimit);
  // Commands panel: which vehicle, and which command to open first
  const [cmd, setCmd] = useState<{ vehicleId: string; plate?: string; key?: string } | null>(null);
  const openCommand = (d: any, key?: string) => d?.vehicle?._id && setCmd({ vehicleId: String(d.vehicle._id), plate: d?.vehicle?.registrationNo, key });
  const [address, setAddress] = useState("");
  const mapRef = useRef<any>(null);

  // Keep "x s ago" and statuses current between live updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const rows: Row[] = useMemo(() => devices.map((d) => ({ d, s: deriveStatus(d, inactiveLimit), text: searchText(d) })), [devices, inactiveLimit]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    STATUS_ORDER.forEach((s) => (c[s] = 0));
    rows.forEach((r) => (c[r.s] += 1));
    return c as Record<FleetStatus, number>;
  }, [rows]);

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const rank = (s: FleetStatus) => STATUS_ORDER.indexOf(s);
    return rows
      .filter((r) => (!filter || filter.includes(r.s)) && (!q || r.text.includes(q)))
      .sort((a, b) => rank(a.s) - rank(b.s) || plateOf(a.d).localeCompare(plateOf(b.d)));
  }, [rows, filter, q]);

  const items = useMemo(
    () =>
      (selectedId && !visible.some((r) => r.d._id === selectedId) ? [...visible, ...rows.filter((r) => r.d._id === selectedId)] : visible)
        .filter((r) => r.d?.latestPosition?.latitude && r.d?.latestPosition?.longitude)
        .map((r) => ({
          id: r.d._id,
          lat: Number(r.d.latestPosition.latitude),
          lng: Number(r.d.latestPosition.longitude),
          heading: Number(r.d.latestPosition.course) || 0,
          color: STATUS_INFO[r.s].hex,
          plate: plateOf(r.d),
          statusLabel: STATUS_INFO[r.s].label,
          vehicle: r.d.vehicle || null,
        })),
    [visible, rows, selectedId]
  );

  const selected = useMemo(() => rows.find((r) => r.d._id === selectedId) || null, [rows, selectedId]);
  const track = useTodayTrack(selected?.d || null);

  // Last 30 minutes of the selected vehicle, for the map trail
  const trail = useMemo(() => {
    const from = Date.now() - 30 * 60 * 1000;
    const pts = track.pts.filter((p) => p.t >= from);
    const solid: { lat: number; lng: number }[][] = [];
    const gaps: { lat: number; lng: number }[][] = [];
    let run: { lat: number; lng: number }[] = [];
    pts.forEach((p, i) => {
      const ll = { lat: p.lat, lng: p.lng };
      if (i > 0 && isSignalGap(pts[i - 1], p)) {
        if (run.length > 1) solid.push(run);
        gaps.push([{ lat: pts[i - 1].lat, lng: pts[i - 1].lng }, ll]);
        run = [];
      }
      run.push(ll);
    });
    if (run.length > 1) solid.push(run);
    return { solid, gaps };
  }, [track.pts]);

  const today = useMemo(() => dayStats(track.pts, limitKmh), [track.pts, limitKmh]);
  const kmToday = track.loaded ? kmFromTrack(track.pts, limitKmh) : null;

  useEffect(() => {
    if (selected) dispatch(setSelectedSingleDevice(selected.d));
  }, [selected, dispatch]);

  const select = (id: string | null) => {
    setSelectedId(id);
    setLimitKmh(readLimit());
    if (id) {
      setCamModeState("follow");
      setCenterKey((k) => k + 1);
    }
  };

  // Esc clears the selection
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !cmd) select(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  // Address of the selected vehicle (OpenStreetMap, as on the current page),
  // looked up again only after it moves ~150 m.
  const lastAddr = useRef<{ id: string; lat: number; lng: number } | null>(null);
  useEffect(() => {
    const p = selected?.d?.latestPosition;
    if (!selected || !p?.latitude) { setAddress(""); lastAddr.current = null; return; }
    const lat = Number(p.latitude), lng = Number(p.longitude);
    const prev = lastAddr.current;
    if (prev && prev.id === selected.d._id && Math.abs(prev.lat - lat) + Math.abs(prev.lng - lng) < 0.0015) return;
    if (!prev || prev.id !== selected.d._id) setAddress("");
    lastAddr.current = { id: selected.d._id, lat, lng };
    let alive = true;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`)
      .then((r) => r.json())
      .then((j) => alive && setAddress(j?.display_name ? j.display_name.split(",").slice(0, 3).join(",") : ""))
      .catch(() => alive && setAddress(""));
    return () => { alive = false; };
  }, [selected]);

  const setCamMode = (m: CamMode) => {
    setCamModeState(m);
    if (m === "follow") setCenterKey((k) => k + 1);
  };
  const fitAll = () => { setCamModeState("free"); setFitKey((k) => k + 1); };
  const zoom = (dir: 1 | -1) => {
    const m = mapRef.current;
    const g = (window as any).google;
    if (!m) return;
    m.setZoom(Math.max(3, Math.min(20, (m.getZoom() || 12) + dir)));
    if (camMode === "follow" && g?.maps?.event) g.maps.event.addListenerOnce(m, "idle", () => setCenterKey((k) => k + 1));
  };
  const openPlayback = (d: any) => {
    const id = d?.id ?? d?.vehicle?.traccarDeviceId;
    if (id == null) return;
    navigate(`${U}/company/modules/monitoring/playback?device=${id}&date=${todayStr()}`);
  };
  const openReports = () => navigate(`${U}/company/reports`);

  /** Props for <FleetMap>. */
  const mapProps = {
    items,
    selectedId,
    follow: camMode === "follow",
    fitKey,
    trail: selected ? trail : null,
    centerKey,
    onMap: (m: any) => (mapRef.current = m),
    onUserMove: () => selectedId && camMode === "follow" && setCamModeState("free"),
    onSelect: (id: string) => select(id),
    onHover: () => undefined,
  };

  return {
    devices, loading, failed, fetchDevices, lastAlert,
    rows, counts, visible, filter, setFilter, query, setQuery,
    selected, select, track, today, kmToday, address, limitKmh,
    camMode, setCamMode, fitAll, zoom, mapProps,
    cmd, openCommand, closeCommand: () => setCmd(null), openPlayback, openReports,
  };
};

export type Model = ReturnType<typeof useMonitoringModel>;

// ---------- Values shown by every design ----------

const GAP_MS = 10 * 60 * 1000; // same as Playback: longer silences are "no data"
const STOP_KMH = 3;
export type DayPart = "drive" | "idle" | "off" | "none";
export const PART_COLOR: Record<DayPart, string> = {
  drive: "var(--at-moving)",
  idle: "var(--at-idle)",
  off: "var(--at-stopped)",
  none: "var(--at-line)",
};

/** Today so far: time split, a 24 h bar, trips, km and events (from the track). */
export const dayStats = (pts: Pt[], limit: number) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const t0 = start.getTime();
  const DAY = 24 * 3600 * 1000;
  const now = Date.now();
  const ms: Record<DayPart, number> = { drive: 0, idle: 0, off: 0, none: 0 };
  const bar: { from: number; to: number; part: DayPart }[] = [];
  const push = (a: number, b: number, part: DayPart) => {
    if (b <= a) return;
    const last = bar[bar.length - 1];
    if (last && last.part === part && Math.abs(last.to - a) < 1e-6) last.to = b;
    else bar.push({ from: a, to: b, part });
  };
  let cursor = t0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (p.t < t0) continue;
    if (p.t > cursor) { push((cursor - t0) / DAY, (p.t - t0) / DAY, "none"); ms.none += p.t - cursor; }
    const next = i + 1 < pts.length ? pts[i + 1].t : Math.min(now, p.t + GAP_MS);
    const dt = Math.max(0, Math.min(next - p.t, GAP_MS));
    const part: DayPart = p.speed >= STOP_KMH ? "drive" : p.ignition ? "idle" : "off";
    ms[part] += dt;
    push((p.t - t0) / DAY, (p.t + dt - t0) / DAY, part);
    cursor = p.t + dt;
  }
  if (now > cursor) ms.none += now - cursor;
  const trips = findTrips(pts, limit);
  // A trip still under way (last point recent and moving) has no end yet
  const lastPt = pts[pts.length - 1];
  const ongoing = !!lastPt && now - lastPt.t < GAP_MS && lastPt.speed >= STOP_KMH && trips.length > 0;
  const lastTripId = trips.length ? trips[trips.length - 1].id : null;
  const events = findEvents(pts, trips, findStops(pts), limit).filter((e) => !(ongoing && e.key === `B${lastTripId}`));
  const km = trips.reduce((s, t) => s + t.km, 0);
  const maxKmh = pts.reduce((m, p) => Math.max(m, p.speed), 0);
  const overs = events.filter((e) => e.kind === "S").length;
  return { ms, bar, trips: trips.length, ongoing, km, maxKmh, overs, events, nowFrac: (now - t0) / DAY };
};

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const fmtHrs = (ms: number) => {
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};

/** Live readings, each null when the tracker doesn't send it. */
export const readings = (d: any, s: FleetStatus, lastKnown: Record<string, any> = {}) => {
  const p = d?.latestPosition || {};
  const live = p.attributes || {};
  // Live values win; status-packet readings fall back to today's last known value
  const a: Record<string, any> = { ...lastKnown };
  Object.keys(live).forEach((k) => { if (live[k] !== undefined && live[k] !== null) a[k] = live[k]; });
  const online = isOnline(s);
  const speed = Math.round(knotsToKmh(p.speed));
  const sat = a.sat != null ? Number(a.sat) : null;
  const rssi = a.rssi != null ? Number(a.rssi) : null;
  // gt06 trackers report 0–4 (or 0–5); others the modem's 0–31 scale
  const gsmFrac = rssi == null || !Number.isFinite(rssi) ? null : Math.max(0, Math.min(1, rssi <= 5 ? rssi / 4 : rssi / 31));
  const gsm = gsmFrac == null ? null : gsmFrac >= 0.6 ? "Good" : gsmFrac >= 0.3 ? "Fair" : gsmFrac > 0 ? "Weak" : "None";
  const battPct = a.batteryLevel != null ? Math.max(0, Math.min(100, Number(a.batteryLevel))) : null;
  const battV = a.battery != null ? Number(a.battery) : null;
  const power = a.power != null ? Number(a.power) : null;
  const odoM = a.odometer || a.totalDistance || null;
  return {
    online,
    speed,
    ignition: a.ignition === true ? "On" : a.ignition === false ? "Off" : null,
    heading: p.latitude ? Number(p.course) || 0 : null,
    gps: p.valid === false ? "No fix" : sat != null ? `Fix · ${sat} sats` : p.valid ? "Fix" : null,
    sat,
    satFrac: sat == null ? null : Math.min(1, sat / 12),
    gsm,
    gsmFrac,
    battery: battPct != null ? `${Math.round(battPct)}%` : battV != null ? `${battV.toFixed(1)} V` : null,
    battFrac: battPct != null ? battPct / 100 : battV != null ? Math.max(0, Math.min(1, (battV - 3.4) / 0.8)) : null,
    power: power != null ? `${power.toFixed(1)} V` : null,
    odometer: odoM ? `${Math.round(Number(odoM) / 1000).toLocaleString()} km` : null,
    lat: p.latitude ? Number(p.latitude) : null,
    lng: p.longitude ? Number(p.longitude) : null,
    deviceTime: p.deviceTime || null,
    protocol: p.protocol ? String(p.protocol).toUpperCase() : null,
  };
};

export const vehicleLine = (d: any) => [d?.vehicle?.make?.name, d?.vehicle?.model?.name].filter(Boolean).join(" ");
export const customerName = (d: any) => d?.vehicle?.customer?.fullName || "";
export const customerPhone = (d: any) => d?.vehicle?.customer?.phoneNo || "";
export const imeiOf = (d: any) => d?.vehicle?.imei || d?.uniqueId || "";
/** SIM: saved on the vehicle, else the ICCID the tracker reports (status packets). */
export const simOf = (d: any, lastKnown: Record<string, any> = {}) => {
  const iccid = d?.latestPosition?.attributes?.iccid || lastKnown.iccid;
  return d?.vehicle?.sim || d?.vehicle?.simNo || (iccid ? String(iccid).replace(/[^0-9]/g, "") : "");
};
export const renewsOn = (d: any) =>
  d?.vehicle?.serviceRenewalDate ? new Date(d.vehicle.serviceRenewalDate).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) : "";
export const mapsLink = (lat: number | null, lng: number | null) => (lat != null && lng != null ? `https://www.google.com/maps?q=${lat},${lng}` : "");
export const streetViewLink = (lat: number | null, lng: number | null) =>
  lat != null && lng != null ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}` : "";
