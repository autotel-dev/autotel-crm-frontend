// Trip Playback (Phase 5): map-first replay of one vehicle's day.
// Data: GET /vehicle/get-vehicle-history/:traccarDeviceId (same as before),
// device list: GET /company/get-parser-devices.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getAll } from "../../../../Utilities/api";
import { GET_PARSER_DEVICES, GET_VEHICLE_HISTORY } from "../../../../Utilities/api/apiEndpoints";
import PlaybackMap from "./PlaybackMap";
import {
  Pt, Trip, bandOf, dayLabel, dayRange, findEvents, findStops, findTrips, fmtClock, fmtDur, fmtHM,
  hasAddr, positionAt, shiftDay, shortAddr, toCsv, toPoints, todayStr, trailSegments,
} from "./playbackUtils";
import "./playback.scss";

const SPEEDS = [1, 4, 8, 16, 32, 64];
const LIMITS = [60, 80, 100, 120];
const readLimit = () => {
  try { const v = Number(localStorage.getItem("pb-limit")); return LIMITS.includes(v) ? v : 80; } catch { return 80; }
};

const deviceLabel = (d: any) => d?.vehicle?.registrationNo || d?.name || `Device ${d?.id}`;

const PlaybackV2 = () => {
  const [params, setParams] = useSearchParams();
  const { selectedSingleDevice, vehicleHistoryDateRange } = useSelector((s: any) => s.monitoring || {});

  const [devices, setDevices] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState<string>(
    params.get("device") || String(selectedSingleDevice?.traccarDeviceId ?? selectedSingleDevice?.id ?? "")
  );
  const [day, setDay] = useState<string>(() => {
    const q = params.get("date");
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
    const s = vehicleHistoryDateRange?.start ? new Date(vehicleHistoryDateRange.start) : null;
    return s && !isNaN(s.getTime()) ? todayStr(s) : todayStr();
  });
  const [limit, setLimit] = useState<number>(readLimit);
  const [pts, setPts] = useState<Pt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tripId, setTripId] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mult, setMult] = useState(16);
  const [showCard, setShowCard] = useState(true);

  // Device list
  useEffect(() => {
    getAll({ url: GET_PARSER_DEVICES }).then((res: any) => {
      const list = (Array.isArray(res?.data) ? res.data : []).filter((d: any) => d?.id != null);
      list.sort((a: any, b: any) => deviceLabel(a).localeCompare(deviceLabel(b)));
      setDevices(list);
      setDeviceId((cur) => {
        if (cur && list.some((d: any) => String(d.id) === cur)) return cur;
        const recent = [...list].sort((a: any, b: any) => Date.parse(b.lastUpdate || 0) - Date.parse(a.lastUpdate || 0))[0];
        return recent ? String(recent.id) : "";
      });
    });
  }, []);

  // Keep the URL shareable
  useEffect(() => {
    if (!deviceId) return;
    const next = new URLSearchParams(params);
    next.set("device", deviceId);
    next.set("date", day);
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [deviceId, day]); // eslint-disable-line react-hooks/exhaustive-deps

  // History for the chosen day
  useEffect(() => {
    if (!deviceId) return;
    let cancelled = false;
    setLoading(true); setError(""); setPlaying(false); setTripId(null);
    const { from, to } = dayRange(day);
    getAll({ url: `${GET_VEHICLE_HISTORY}/${deviceId}?fromDateTime=${encodeURIComponent(from)}&toDateTime=${encodeURIComponent(to)}` })
      .then((res: any) => {
        if (cancelled) return;
        if (!res || res.success === false) { setError(res?.message || "Couldn't load the history."); setPts([]); return; }
        const p = toPoints(res?.data?.history);
        setPts(p);
        // Open on the first trip (the day view squeezes short trips); "Whole day" stays one click away.
        const first = findTrips(p, readLimit())[0];
        setTripId(first ? first.id : null);
        setT(first ? first.start : p.length ? p[0].t : 0);
      })
      .catch(() => { if (!cancelled) { setError("Couldn't load the history."); setPts([]); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [deviceId, day]);

  useEffect(() => { try { localStorage.setItem("pb-limit", String(limit)); } catch { /* private mode */ } }, [limit]);

  const trips = useMemo(() => findTrips(pts, limit), [pts, limit]);
  const stops = useMemo(() => findStops(pts), [pts]);
  const trip: Trip | null = trips.find((x) => x.id === tripId) || null;
  const range = useMemo(() => (trip ? pts.slice(trip.from, trip.to + 1) : pts), [pts, trip]);
  const segments = useMemo(() => trailSegments(range, limit), [range, limit]);
  const events = useMemo(() => {
    const all = findEvents(pts, trips, stops, limit);
    return trip ? all.filter((e) => e.t >= trip.start && e.t <= trip.end) : all;
  }, [pts, trips, stops, limit, trip]);
  const start = range.length ? range[0].t : 0;
  const end = range.length ? range[range.length - 1].t : 0;

  const totals = useMemo(() => {
    const km = trips.reduce((s, x) => s + x.km, 0);
    const driving = trips.reduce((s, x) => s + x.drivingMs, 0);
    const max = pts.reduce((m, p) => Math.max(m, p.speed), 0);
    const alerts = findEvents(pts, trips, stops, limit).filter((e) => e.kind === "S").length;
    return { km, driving, max, alerts };
  }, [pts, trips, stops, limit]);

  // Playback clock
  const lastFrame = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) { lastFrame.current = null; return; }
    let raf = 0;
    const step = (now: number) => {
      const prev = lastFrame.current ?? now;
      lastFrame.current = now;
      setT((cur) => {
        const next = cur + (now - prev) * mult;
        if (next >= end) { setPlaying(false); return end; }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, mult, end]);

  const seek = useCallback((to: number) => setT(Math.min(end, Math.max(start, to))), [start, end]);
  const togglePlay = useCallback(() => {
    if (!range.length) return;
    if (!playing && t >= end) setT(start);
    setPlaying((p) => !p);
  }, [range.length, playing, t, start, end]);

  // Keyboard: Space play/pause, arrows ±30 s (not while typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      else if (e.key === "ArrowRight") seek(t + 30000);
      else if (e.key === "ArrowLeft") seek(t - 30000);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, seek, t]);

  const pos = useMemo(() => (range.length ? positionAt(range, t) : null), [range, t]);
  const band = pos ? bandOf(pos.speed, limit) : "stop";
  const car = pos ? { lat: pos.lat, lng: pos.lng, course: pos.course, band } : null;
  const badge = band === "over" ? "Over limit" : band === "fast" ? "Fast" : band === "stop" ? "Stopped" : "Moving";
  const card = pos && showCard
    ? `<div class="pb-card__in"><div class="pb-card__row"><strong>${fmtClock(t)}</strong><span class="pb-badge pb-badge--${band}">${badge}</span></div>` +
      `<div class="pb-card__speed"><b>${Math.round(pos.speed)}</b> km/h <span>· limit ${limit}</span></div>` +
      (shortAddr(pos.address) ? `<div class="pb-card__addr">${shortAddr(pos.address).replace(/</g, "&lt;")}</div>` : `<div class="pb-card__addr">${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}</div>`) + `</div>`
    : null;

  const exportCsv = () => {
    if (!range.length) return;
    const dev = devices.find((d) => String(d.id) === deviceId);
    const blob = new Blob([toCsv(range, deviceLabel(dev))], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `playback-${deviceLabel(dev)}-${day}${trip ? `-trip${trip.id}` : ""}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  // Speed chart geometry (viewBox 1000 × 70)
  const W = 1000, H = 70;
  const maxY = Math.max(limit * 1.25, totals.max * 1.05, 40);
  const xOf = (time: number) => (end > start ? ((time - start) / (end - start)) * W : 0);
  const yOf = (sp: number) => H - (sp / maxY) * (H - 4);
  const chart = useMemo(() => {
    if (range.length < 2) return [] as { band: string; d: string }[];
    const out: { band: string; d: string }[] = [];
    for (let k = 1; k < range.length; k++) {
      const b = bandOf(range[k].speed, limit);
      const piece = `M${xOf(range[k - 1].t).toFixed(1)} ${yOf(range[k - 1].speed).toFixed(1)} L${xOf(range[k].t).toFixed(1)} ${yOf(range[k].speed).toFixed(1)}`;
      const last = out[out.length - 1];
      if (last && last.band === b) last.d += ` L${xOf(range[k].t).toFixed(1)} ${yOf(range[k].speed).toFixed(1)}`;
      else out.push({ band: b, d: piece });
    }
    return out;
  }, [range, limit, maxY]); // eslint-disable-line react-hooks/exhaustive-deps
  const strip = useMemo(() => {
    const out: { band: string; x: number; w: number }[] = [];
    for (let k = 1; k < range.length; k++) {
      const b = bandOf(range[k].speed, limit);
      const x = xOf(range[k - 1].t), w = xOf(range[k].t) - x;
      const last = out[out.length - 1];
      if (last && last.band === b && Math.abs(last.x + last.w - x) < 0.01) last.w += w;
      else out.push({ band: b, x, w });
    }
    return out;
  }, [range, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrubRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const seekFromEvent = (clientX: number) => {
    const el = scrubRef.current; if (!el || end <= start) return;
    const r = el.getBoundingClientRect();
    seek(start + ((clientX - r.left) / r.width) * (end - start));
  };

  const dev = devices.find((d) => String(d.id) === deviceId);
  const today = todayStr();

  return (
    <div className="pb-root">
      <div className="pb-mapbox">
        <PlaybackMap
          pts={range}
          segments={segments}
          events={events}
          car={car}
          card={card}
          fitKey={`${deviceId}|${day}|${tripId ?? "all"}|${range.length > 0}`}
          follow={playing}
          onSeek={(time: number) => { setPlaying(false); seek(time); }}
        />
      </div>

      {/* Top bar */}
      <header className="pb-panel pb-top">
        <h1 className="pb-title">Playback</h1>
        <label className="pb-hidden" htmlFor="pb-device">Vehicle</label>
        <select id="pb-device" className="pb-select" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
          {!devices.length && <option value="">Loading vehicles…</option>}
          {devices.map((d) => (
            <option key={d.id} value={String(d.id)}>{deviceLabel(d)}</option>
          ))}
        </select>
        <div className="pb-day" role="group" aria-label="Day">
          <button type="button" className="pb-btn pb-btn--icon" onClick={() => setDay((d) => shiftDay(d, -1))} aria-label="Previous day">‹</button>
          <label className="pb-day__label">
            <span>{dayLabel(day)}</span>
            <input type="date" value={day} max={today} onChange={(e) => e.target.value && setDay(e.target.value)} aria-label="Pick a day" />
          </label>
          <button type="button" className="pb-btn pb-btn--icon" onClick={() => setDay((d) => shiftDay(d, 1))} disabled={day >= today} aria-label="Next day">›</button>
        </div>
        <div className="pb-spacer" />
        <span className="pb-sum">
          {loading ? "Loading…" : pts.length
            ? <>{totals.km.toFixed(1)} km · {fmtDur(totals.driving)} driving · max {Math.round(totals.max)} km/h · {totals.alerts} over-limit</>
            : "No movement recorded"}
        </span>
        <label className="pb-hidden" htmlFor="pb-limit">Speed limit</label>
        <select id="pb-limit" className="pb-select pb-select--sm" value={limit} onChange={(e) => setLimit(Number(e.target.value))} title="Speed limit used for colours and over-limit marks">
          {LIMITS.map((l) => <option key={l} value={l}>Limit {l}</option>)}
        </select>
        <button type="button" className="pb-btn" onClick={exportCsv} disabled={!range.length}>Export</button>
      </header>

      {/* Trips */}
      <section className="pb-panel pb-trips" aria-label="Trips">
        <div className="pb-trips__head">
          <strong>Trips</strong>
          <span>{trips.length ? `${trips.length} on ${day === today ? "today" : "this day"}` : ""}</span>
        </div>
        {loading ? (
          <div className="pb-skel" aria-hidden="true"><i /><i /><i /></div>
        ) : error ? (
          <p className="pb-empty">{error}</p>
        ) : !pts.length ? (
          <p className="pb-empty">No positions for {dev ? deviceLabel(dev) : "this vehicle"} on {dayLabel(day)}. Try another day.</p>
        ) : (
          <div className="pb-trips__list">
            <button type="button" className={`pb-trip${tripId === null ? " is-on" : ""}`} onClick={() => { setTripId(null); setPlaying(false); setT(pts[0].t); }}>
              <div className="pb-trip__row"><strong>Whole day</strong><span>{totals.km.toFixed(1)} km</span></div>
              <div className="pb-trip__sub">{fmtHM(pts[0].t)} – {fmtHM(pts[pts.length - 1].t)} · {pts.length} points</div>
            </button>
            {trips.map((tr) => (
              <button type="button" key={tr.id} className={`pb-trip${tripId === tr.id ? " is-on" : ""}`} onClick={() => { setTripId(tr.id); setPlaying(false); setT(tr.start); }}>
                <div className="pb-trip__row"><strong>{fmtHM(tr.start)} – {fmtHM(tr.end)}</strong><span>{tr.km.toFixed(1)} km</span></div>
                {hasAddr(tr.fromAddress) || hasAddr(tr.toAddress) ? (
                  <div className="pb-trip__sub" title={`${tr.fromAddress} → ${tr.toAddress}`}>{shortAddr(tr.fromAddress) || "Unknown"} → {shortAddr(tr.toAddress) || "Unknown"}</div>
                ) : null}
                <div className="pb-trip__bar" aria-label={`Normal ${Math.round(tr.share.move * 100)}%, fast ${Math.round(tr.share.fast * 100)}%, over limit ${Math.round(tr.share.over * 100)}%`}>
                  <i className="pb-b--move" style={{ width: `${tr.share.move * 100}%` }} />
                  <i className="pb-b--fast" style={{ width: `${tr.share.fast * 100}%` }} />
                  <i className="pb-b--over" style={{ width: `${tr.share.over * 100}%` }} />
                </div>
                <div className="pb-trip__sub">max {Math.round(tr.maxSpeed)} km/h · {fmtDur(tr.drivingMs)} driving</div>
              </button>
            ))}
            {!trips.length && <p className="pb-empty">The vehicle didn't move this day (positions only).</p>}
          </div>
        )}
        <div className="pb-legend">
          <span><i className="pb-b--move" /> Normal</span>
          <span><i className="pb-b--fast" /> Fast</span>
          <span><i className="pb-b--over" /> Over {limit}</span>
        </div>
      </section>

      {/* Controls + speed chart */}
      <section className="pb-panel pb-ctrl" aria-label="Playback controls">
        <div className="pb-ctrl__row">
          <button type="button" className="pb-play" onClick={togglePlay} disabled={!range.length} aria-label={playing ? "Pause" : "Play"} title="Space">
            {playing ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z" /></svg>
            )}
          </button>
          <button type="button" className="pb-btn" onClick={() => seek(t - 30000)} disabled={!range.length} title="Left arrow">−30s</button>
          <button type="button" className="pb-btn" onClick={() => seek(t + 30000)} disabled={!range.length} title="Right arrow">+30s</button>
          <div className="pb-speeds" role="group" aria-label="Playback speed">
            {SPEEDS.map((s) => (
              <button type="button" key={s} className={`pb-speed${mult === s ? " is-on" : ""}`} aria-pressed={mult === s} onClick={() => setMult(s)}>{s}×</button>
            ))}
          </div>
          <label className="pb-check"><input type="checkbox" checked={showCard} onChange={(e) => setShowCard(e.target.checked)} /> Info card</label>
          <div className="pb-spacer" />
          <span className="pb-clock">{range.length ? fmtClock(t) : "--:--:--"}</span>
          <span className="pb-clock__end">/ {range.length ? fmtClock(end) : "--:--:--"}</span>
        </div>
        <div
          className="pb-scrub"
          ref={scrubRef}
          role="slider"
          tabIndex={0}
          aria-label="Playback position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={end > start ? Math.round(((t - start) / (end - start)) * 100) : 0}
          aria-valuetext={range.length ? fmtClock(t) : "No data"}
          onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setPlaying(false); seekFromEvent(e.clientX); }}
          onPointerMove={(e) => { if (dragging.current) seekFromEvent(e.clientX); }}
          onPointerUp={() => { dragging.current = false; }}
          onKeyDown={(e) => { if (e.key === "ArrowRight") seek(t + 30000); if (e.key === "ArrowLeft") seek(t - 30000); }}
        >
          <svg className="pb-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" x2={W} y1={yOf(limit)} y2={yOf(limit)} className="pb-chart__limit" />
            {chart.map((c, i) => <path key={i} d={c.d} className={`pb-chart__line pb-chart__line--${c.band}`} />)}
            {range.length > 0 && <line x1={xOf(t)} x2={xOf(t)} y1="0" y2={H} className="pb-chart__cursor" />}
          </svg>
          <svg className="pb-strip" viewBox={`0 0 ${W} 10`} preserveAspectRatio="none" aria-hidden="true">
            {strip.map((s, i) => <rect key={i} x={s.x} y="0" width={Math.max(0.5, s.w)} height="10" className={`pb-strip--${s.band}`} />)}
          </svg>
          <div className="pb-ticks">
            {range.length ? <><span>{fmtHM(start)}</span><span>{fmtHM(start + (end - start) / 2)}</span><span>{fmtHM(end)}</span></> : <span>&nbsp;</span>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaybackV2;
