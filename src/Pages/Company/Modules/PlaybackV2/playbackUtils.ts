// Trip Playback helpers: turn the history API points into trips, stops,
// speed bands (T1) and events, and interpolate the car position for a time.

export type Pt = {
  t: number; // ms epoch
  lat: number;
  lng: number;
  speed: number; // km/h
  course: number;
  ignition: boolean;
  address: string;
  km: number; // distance from previous point
};

export type Band = "move" | "fast" | "over" | "stop";

export type Stop = { start: number; end: number; lat: number; lng: number; address: string };

export type Trip = {
  id: number;
  start: number;
  end: number;
  from: number; // index into points
  to: number;
  km: number;
  maxSpeed: number;
  drivingMs: number;
  share: { move: number; fast: number; over: number }; // fraction of driving time
  fromAddress: string;
  toAddress: string;
};

export type EventMark = {
  key: string;
  kind: "A" | "B" | "P" | "S" | "I" | "O";
  t: number;
  lat: number;
  lng: number;
  label: string;
};

const STOP_SPEED = 3; // km/h: below this the vehicle is standing
const STOP_MIN_MS = 5 * 60 * 1000; // a stand of 5 min or more splits trips
const GAP_MS = 10 * 60 * 1000; // no data for 10 min also splits trips

export const toPoints = (history: any[]): Pt[] =>
  (history || [])
    .map((p) => ({
      t: Date.parse(p.timestamp),
      lat: Number(p.latitude),
      lng: Number(p.longitude),
      speed: Number(p.speed) || 0,
      course: Number(p.course) || 0,
      ignition: Boolean(p.ignition),
      address: p.address || "",
      km: Number(p.distanceFromPreviousKm) || 0,
    }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.lat) && Number.isFinite(p.lng) && !(Math.abs(p.lat) < 1e-4 && Math.abs(p.lng) < 1e-4))
    .sort((a, b) => a.t - b.t)
    .reduce(removeDrift(), [] as Pt[]);

// GPS drift while parked (same rules as the parser's utils/driftFilter.js, so
// days saved before that filter look the same): while the vehicle stands,
// positions within 50 m snap to the parking spot and short speed spikes count
// as 0, until it is more than 50 m away or 3 packets in a row are fast.
const DRIFT_KMH = 5;
const DRIFT_M = 50;
const DRIFT_FAST = 3;
const DRIFT_SILENCE_MS = 10 * 60 * 1000;
function removeDrift() {
  let st: { lat: number; lng: number; t: number; moving: boolean; fast: number } | null = null;
  return (out: Pt[], p: Pt) => {
    const fast = p.speed > DRIFT_KMH;
    if (!st || p.t - st.t > DRIFT_SILENCE_MS) {
      st = { lat: p.lat, lng: p.lng, t: p.t, moving: fast, fast: 0 };
      out.push(p);
      return out;
    }
    if (st.moving) {
      st = { lat: p.lat, lng: p.lng, t: p.t, moving: fast, fast: 0 };
      out.push(p);
      return out;
    }
    if (kmBetween(st, p) * 1000 > DRIFT_M) {
      st = { lat: p.lat, lng: p.lng, t: p.t, moving: fast, fast: 0 };
      out.push(p);
      return out;
    }
    st.fast = fast ? st.fast + 1 : 0;
    if (st.fast >= DRIFT_FAST) {
      st = { lat: p.lat, lng: p.lng, t: p.t, moving: true, fast: 0 };
      out.push(p);
      return out;
    }
    st.t = p.t;
    out.push({ ...p, lat: st.lat, lng: st.lng, speed: 0, km: 0 });
    return out;
  };
}

export const bandOf = (speed: number, limit: number): Band => {
  if (speed < STOP_SPEED) return "stop";
  if (speed > limit) return "over";
  if (speed > limit * 0.8) return "fast";
  return "move";
};

// Runs of standing still (or data gaps) long enough to count as a stop.
export const findStops = (pts: Pt[]): Stop[] => {
  const stops: Stop[] = [];
  let i = 0;
  while (i < pts.length) {
    if (pts[i].speed >= STOP_SPEED) { i++; continue; }
    let j = i;
    while (j + 1 < pts.length && pts[j + 1].speed < STOP_SPEED) j++;
    const start = pts[i].t;
    const end = j + 1 < pts.length ? pts[j + 1].t : pts[j].t;
    if (end - start >= STOP_MIN_MS) stops.push({ start, end, lat: pts[i].lat, lng: pts[i].lng, address: pts[i].address });
    i = j + 1;
  }
  return stops;
};

export const findTrips = (pts: Pt[], limit: number): Trip[] => {
  const trips: Trip[] = [];
  let i = 0;
  let id = 1;
  while (i < pts.length) {
    // skip standing points
    while (i < pts.length && pts[i].speed < STOP_SPEED) i++;
    if (i >= pts.length) break;
    // include the standing point just before, unless a data gap separates them
    let from = i > 0 && pts[i].t - pts[i - 1].t <= GAP_MS ? i - 1 : i;
    let j = i;
    let lastMoving = i;
    while (j + 1 < pts.length) {
      const next = pts[j + 1];
      if (next.t - pts[j].t > GAP_MS) break;
      if (next.speed >= STOP_SPEED) lastMoving = j + 1;
      else if (next.t - pts[lastMoving].t >= STOP_MIN_MS) break;
      j++;
    }
    // include the first standing point after, unless a data gap separates them
    const to = lastMoving + 1 < pts.length && pts[lastMoving + 1].t - pts[lastMoving].t <= GAP_MS ? lastMoving + 1 : lastMoving;
    const seg = pts.slice(from, to + 1);
    let km = 0, max = 0, move = 0, fast = 0, over = 0;
    for (let k = 1; k < seg.length; k++) {
      km += seg[k].km;
      max = Math.max(max, seg[k].speed);
      const dt = seg[k].t - seg[k - 1].t;
      const b = bandOf(seg[k].speed, limit);
      if (b === "move") move += dt; else if (b === "fast") fast += dt; else if (b === "over") over += dt;
    }
    const driving = move + fast + over;
    if (km >= 0.2 || driving >= 60000) {
      trips.push({
        id: id++, from, to, start: seg[0].t, end: seg[seg.length - 1].t, km, maxSpeed: max, drivingMs: driving,
        share: driving ? { move: move / driving, fast: fast / driving, over: over / driving } : { move: 1, fast: 0, over: 0 },
        fromAddress: seg[0].address, toAddress: seg[seg.length - 1].address,
      });
    }
    i = j + 1;
  }
  return trips;
};

// Straight-line distance in km between two points.
export const kmBetween = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const r = (x: number) => (x * Math.PI) / 180;
  const dLat = r(b.lat - a.lat);
  const dLng = r(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// A "no signal" gap: no point for over 2.5 minutes while the vehicle moved
// more than 500 m (e.g. lost mobile data). Drawn dashed, since the real road
// between the two points is unknown. (Shorter limits flag normal data: some
// trackers report once a minute, and days over 1,500 points are thinned.)
export const SIGNAL_GAP_MS = 150 * 1000;
export const SIGNAL_GAP_KM = 0.5;
export const isSignalGap = (a: { t: number; lat: number; lng: number }, b: { t: number; lat: number; lng: number }) =>
  b.t - a.t > SIGNAL_GAP_MS && kmBetween(a, b) > SIGNAL_GAP_KM;

// Coloured trail pieces: consecutive points with the same band; signal gaps
// become their own "gap" pieces.
export const trailSegments = (pts: Pt[], limit: number) => {
  const segs: { band: Band | "gap"; path: { lat: number; lng: number }[] }[] = [];
  for (let k = 1; k < pts.length; k++) {
    if (isSignalGap(pts[k - 1], pts[k])) {
      segs.push({ band: "gap", path: [{ lat: pts[k - 1].lat, lng: pts[k - 1].lng }, { lat: pts[k].lat, lng: pts[k].lng }] });
      continue;
    }
    const b = bandOf(Math.max(pts[k].speed, pts[k - 1].speed), limit);
    const band = b === "stop" ? "move" : b;
    const last = segs[segs.length - 1];
    const a = { lat: pts[k - 1].lat, lng: pts[k - 1].lng };
    const c = { lat: pts[k].lat, lng: pts[k].lng };
    if (last && last.band === band) last.path.push(c);
    else segs.push({ band, path: [a, c] });
  }
  return segs;
};

export const findEvents = (pts: Pt[], trips: Trip[], stops: Stop[], limit: number): EventMark[] => {
  const ev: EventMark[] = [];
  trips.forEach((tr) => {
    const a = pts[tr.from], b = pts[tr.to];
    ev.push({ key: `A${tr.id}`, kind: "A", t: a.t, lat: a.lat, lng: a.lng, label: `Trip ${tr.id} start` });
    ev.push({ key: `B${tr.id}`, kind: "B", t: b.t, lat: b.lat, lng: b.lng, label: `Trip ${tr.id} end` });
  });
  stops.forEach((s, i) => ev.push({ key: `P${i}`, kind: "P", t: s.start, lat: s.lat, lng: s.lng, label: `Stop ${fmtDur(s.end - s.start)}` }));
  // one S mark per over-limit run, at its fastest point
  let k = 0;
  while (k < pts.length) {
    if (pts[k].speed <= limit) { k++; continue; }
    let best = k, j = k;
    while (j + 1 < pts.length && pts[j + 1].speed > limit) { j++; if (pts[j].speed > pts[best].speed) best = j; }
    const p = pts[best];
    ev.push({ key: `S${best}`, kind: "S", t: p.t, lat: p.lat, lng: p.lng, label: `Over limit ${Math.round(p.speed)} km/h` });
    k = j + 1;
  }
  return ev.sort((x, y) => x.t - y.t);
};

// Position at time t (linear between points); index = last point at or before t.
export const positionAt = (pts: Pt[], t: number) => {
  if (!pts.length) return null;
  if (t <= pts[0].t) return { ...pts[0], index: 0 };
  if (t >= pts[pts.length - 1].t) return { ...pts[pts.length - 1], index: pts.length - 1 };
  let lo = 0, hi = pts.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pts[mid].t <= t) lo = mid; else hi = mid; }
  const a = pts[lo], b = pts[hi];
  const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
  // Only glide between points that are close in time; across gaps, jump.
  const glide = b.t - a.t < GAP_MS ? f : 0;
  return {
    ...a,
    lat: a.lat + (b.lat - a.lat) * glide,
    lng: a.lng + (b.lng - a.lng) * glide,
    speed: a.speed + (b.speed - a.speed) * glide,
    course: b.speed >= STOP_SPEED ? b.course : a.course,
    index: lo,
  };
};

export const fmtDur = (ms: number) => {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};
export const fmtClock = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
export const fmtHM = (t: number) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
const noAddr = (a: string) => !a || /^(n\/?a|null|undefined|-)$/i.test(a.trim());
export const hasAddr = (a: string) => !noAddr(a);
export const shortAddr = (a: string) => (noAddr(a) ? "" : a.split(",").slice(0, 2).join(",").trim());

// Local-day range as ISO strings (the API accepts ISO).
export const dayRange = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0);
  const end = new Date(y, m - 1, d, 23, 59, 59);
  return { from: start.toISOString(), to: end.toISOString() };
};
export const todayStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const shiftDay = (day: string, n: number) => {
  const [y, m, d] = day.split("-").map(Number);
  return todayStr(new Date(y, m - 1, d + n));
};
export const dayLabel = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

export const toCsv = (pts: Pt[], plate: string) => {
  const head = "time,latitude,longitude,speed_kmh,course,ignition,address";
  const rows = pts.map((p) => [new Date(p.t).toISOString(), p.lat.toFixed(6), p.lng.toFixed(6), p.speed.toFixed(1), Math.round(p.course), p.ignition ? "on" : "off", `"${(p.address || "").replace(/"/g, '""')}"`].join(","));
  return `# ${plate}\n${head}\n${rows.join("\n")}\n`;
};

// Journey feed (design B): the day's events in time order.
export type FeedKind = "ign" | "stop" | "start" | "fast" | "over" | "end";
export type FeedItem = { key: string; t: number; kind: FeedKind; icon: string; title: string; sub: string };

const IGN_MIN_MS = 60 * 1000; // ignore ignition flips shorter than this
const RUN_MIN_MS = 20 * 1000; // fast / over-limit stretches shorter than this are noise

const placeOf = (p?: Pt) => (p ? shortAddr(p.address) || `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}` : "");

export const buildFeed = (pts: Pt[], trips: Trip[], stops: Stop[], limit: number): FeedItem[] => {
  const out: FeedItem[] = [];
  if (!pts.length) return out;

  // Ignition changes; on/off spells shorter than a minute are ignored
  const spells: { on: boolean; k: number }[] = [];
  for (let k = 0; k < pts.length; k++) {
    if (!spells.length || spells[spells.length - 1].on !== pts[k].ignition) spells.push({ on: pts[k].ignition, k });
  }
  const kept: { on: boolean; k: number }[] = [];
  spells.forEach((sp, i) => {
    const endT = i + 1 < spells.length ? pts[spells[i + 1].k].t : pts[pts.length - 1].t;
    const short = i > 0 && i + 1 < spells.length && endT - pts[sp.k].t < IGN_MIN_MS;
    if (short) return;
    if (kept.length && kept[kept.length - 1].on === sp.on) return;
    kept.push(sp);
  });
  kept.slice(1).forEach((sp) =>
    out.push({ key: `I${sp.k}`, t: pts[sp.k].t, kind: "ign", icon: sp.on ? "I" : "O", title: sp.on ? "Ignition on" : "Ignition off", sub: placeOf(pts[sp.k]) })
  );

  stops.forEach((s, i) =>
    out.push({ key: `P${i}`, t: s.start, kind: "stop", icon: "P", title: `Stop · ${fmtDur(s.end - s.start)}`, sub: shortAddr(s.address) || `${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}` })
  );

  trips.forEach((tr) => {
    const a = pts[tr.from], b = pts[tr.to];
    const route = [shortAddr(tr.fromAddress), shortAddr(tr.toAddress)].filter(Boolean).join(" → ");
    out.push({ key: `A${tr.id}`, t: a.t, kind: "start", icon: "A", title: `Trip ${tr.id} started`, sub: route || placeOf(a) });
    out.push({ key: `B${tr.id}`, t: b.t, kind: "end", icon: "B", title: `Trip ${tr.id} ended · ${tr.km.toFixed(1)} km`, sub: placeOf(b) });
  });

  // Fast and over-limit stretches (one item per run, at its fastest point)
  const runs = (test: (sp: number) => boolean, kind: "fast" | "over") => {
    let k = 0;
    while (k < pts.length) {
      if (!test(pts[k].speed)) { k++; continue; }
      let j = k, best = k;
      while (j + 1 < pts.length && test(pts[j + 1].speed) && pts[j + 1].t - pts[j].t < GAP_MS) { j++; if (pts[j].speed > pts[best].speed) best = j; }
      const dur = pts[j].t - pts[k].t;
      if (kind === "over" || dur >= RUN_MIN_MS) {
        const p = pts[best], secs = Math.max(1, Math.round(dur / 1000));
        out.push(kind === "over"
          ? { key: `S${best}`, t: p.t, kind, icon: "S", title: `Over limit · ${Math.round(p.speed)} km/h`, sub: `${placeOf(p)} · ${secs < 60 ? `${secs} s` : fmtDur(dur)}` }
          : { key: `F${best}`, t: p.t, kind, icon: "↑", title: `Fast stretch · ${Math.round(p.speed)} km/h`, sub: placeOf(p) });
      }
      k = j + 1;
    }
  };
  runs((sp) => sp > limit * 0.8 && sp <= limit, "fast");
  runs((sp) => sp > limit, "over");

  const order: Record<FeedKind, number> = { ign: 0, end: 1, stop: 2, start: 3, fast: 4, over: 5 };
  return out.sort((x, y) => x.t - y.t || order[x.kind] - order[y.kind]);
};
