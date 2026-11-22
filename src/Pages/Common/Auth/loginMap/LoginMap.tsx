// Animated "live fleet" map for the login page: Pakistan and neighbours, vehicles with
// number plates driving real highways, and live alerts. Pure SVG, no map service needed.
// Vehicles are moved with requestAnimationFrame straight on the DOM (no React re-renders).
import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES, COUNTRY_LABELS, FOCUS, GWADAR, LAND_D, MAP_H, MAP_W, PAK_D, QUETTA, ROADS, TORKHAM } from "./mapData";
import "./loginMap.css";

type Kind = "car" | "truck" | "bus" | "bike";
type Alert = "over" | "border" | "geo" | "ok";
interface Vehicle {
  road: string;
  a: number;
  b: number;
  off: number;
  plate: string;
  kmh: number;
  st: Alert;
  kind: Kind;
}

const CYCLE = 12000; // ms for one full loop
const FADE = 0.07;

class RoadPath {
  pts: [number, number][];
  cum: number[] = [0];
  len: number;
  constructor(pts: [number, number][]) {
    this.pts = pts;
    for (let i = 0; i < pts.length - 1; i++) {
      this.cum.push(this.cum[i] + Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]));
    }
    this.len = this.cum[this.cum.length - 1];
  }
  at(u: number): [number, number, number] {
    const d = Math.max(0, Math.min(1, u)) * this.len;
    let i = 0;
    while (i < this.pts.length - 2 && d > this.cum[i + 1]) i++;
    const seg = this.cum[i + 1] - this.cum[i] || 1;
    const f = (d - this.cum[i]) / seg;
    const [ax, ay] = this.pts[i];
    const [bx, by] = this.pts[i + 1];
    const heading = (Math.atan2(bx - ax, -(by - ay)) * 180) / Math.PI;
    return [ax + (bx - ax) * f, ay + (by - ay) * f, heading];
  }
  fracNear([x, y]: [number, number]) {
    let best = 0;
    let bd = Infinity;
    this.pts.forEach((p, i) => {
      const d = Math.hypot(p[0] - x, p[1] - y);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return this.cum[best] / this.len;
  }
}

const PATHS: Record<string, RoadPath> = Object.fromEntries(Object.entries(ROADS).map(([k, v]) => [k, new RoadPath(v)]));
const TORKHAM_U = PATHS.KBL.fracNear(TORKHAM);

const VEHICLES: Vehicle[] = [
  { road: "M2", a: 0, b: 1, off: 0.1, plate: "LEB-2215", kmh: 118, st: "over", kind: "car" },
  { road: "KBL", a: 0.45, b: 0.98, off: 0, plate: "PRA-3381", kmh: 64, st: "border", kind: "truck" },
  { road: "N5", a: 0.3, b: 0.62, off: 0.3, plate: "MNA-772", kmh: 86, st: "ok", kind: "truck" },
  { road: "N5", a: 0.78, b: 0.4, off: 0.7, plate: "SKR-336", kmh: 74, st: "ok", kind: "bus" },
  { road: "N25", a: 0.05, b: 0.48, off: 0.55, plate: "AKS-610", kmh: 69, st: "ok", kind: "truck" },
  { road: "N10", a: 0.1, b: 0.97, off: 0.42, plate: "BKC-4417", kmh: 81, st: "geo", kind: "truck" },
  { road: "N40", a: 0.1, b: 0.95, off: 0.2, plate: "BLA-118", kmh: 77, st: "ok", kind: "truck" },
  { road: "KKH", a: 0.35, b: 0.99, off: 0.8, plate: "GLT-208", kmh: 52, st: "ok", kind: "car" },
  { road: "GT", a: 0, b: 0.98, off: 0.62, plate: "RIA-951", kmh: 71, st: "ok", kind: "bus" },
  { road: "N25", a: 0.7, b: 0.99, off: 0.35, plate: "QAB-447", kmh: 58, st: "ok", kind: "bike" },
  { road: "KBL", a: 0.02, b: 0.3, off: 0.15, plate: "MLT-93", kmh: 44, st: "ok", kind: "bike" },
  { road: "N5", a: 0, b: 0.16, off: 0.15, plate: "ICT-509", kmh: 96, st: "ok", kind: "car" },
];
// Time the border crossing and the geofence arrival to their alert cards.
VEHICLES[1].off = (((TORKHAM_U - VEHICLES[1].a) / (VEHICLES[1].b - VEHICLES[1].a) - 0.25) % 1 + 1) % 1;
VEHICLES[5].off = (0.92 - 0.5 + 1) % 1;

export const ALERTS = [
  { at: 0, st: "over", title: "Over-speed", sub: "LEB-2215 · 118 km/h · M-2" },
  { at: 0.25, st: "border", title: "Border crossed", sub: "PRA-3381 · Torkham" },
  { at: 0.5, st: "geo", title: "Geofence entered", sub: "BKC-4417 · Gwadar Port" },
  { at: 0.75, st: "idle", title: "Idle 25 min", sub: "QAA-1087 · Quetta" },
] as const;

const plateW = (s: string) => s.length * 5.9 + 10;
const bubbleW = (s: string) => s.length * 6.1 + 16;

const Shape = ({ kind }: { kind: Kind }) => {
  if (kind === "truck")
    return (
      <g>
        {[-20, 0, 7, 13].map((y) => (
          <rect key={y} x={-10.5} y={y} width={21} height={5} rx={2} className="al-tyre" />
        ))}
        <rect x={-7.5} y={-22} width={15} height={11} rx={4} className="al-body al-edge" />
        <rect x={-5.5} y={-19.5} width={11} height={3.5} rx={1} className="al-glass" />
        <rect x={-1.5} y={-11} width={3} height={2.5} className="al-tyre" />
        <rect x={-8.5} y={-8.5} width={17} height={30.5} rx={2} className="al-cargo" />
        {[1, 2, 3, 4].map((k) => (
          <line key={k} x1={-5.5} x2={5.5} y1={-8.5 + k * 6} y2={-8.5 + k * 6} className="al-rib" />
        ))}
      </g>
    );
  if (kind === "bus")
    return (
      <g>
        {[-15, 10].map((y) => (
          <rect key={y} x={-10} y={y} width={20} height={5} rx={2} className="al-tyre" />
        ))}
        <rect x={-8} y={-21} width={16} height={42} rx={5} className="al-body al-edge" />
        <rect x={-5.5} y={-18.5} width={11} height={4.5} rx={2} className="al-glass" />
        <rect x={-4} y={-10} width={8} height={27} rx={2} className="al-roof" />
      </g>
    );
  if (kind === "bike")
    return (
      <g>
        <rect x={-2.2} y={-14} width={4.4} height={8} rx={2} className="al-tyre" />
        <rect x={-2.2} y={6} width={4.4} height={8} rx={2} className="al-tyre" />
        <rect x={-3.2} y={-8} width={6.4} height={16} rx={3} className="al-body al-edge" />
        <line x1={-6} x2={6} y1={-5.5} y2={-5.5} className="al-bar" />
        <circle cx={0} cy={1} r={4.6} className="al-helmet" />
        <circle cx={0} cy={1} r={3.3} className="al-body" />
      </g>
    );
  return (
    <g>
      {[-9, 6].map((y) => (
        <rect key={y} x={-9.5} y={y} width={19} height={6} rx={2} className="al-tyre" />
      ))}
      <rect x={-7.5} y={-13.5} width={15} height={27} rx={6} className="al-body al-edge" />
      <rect x={-5} y={-7.5} width={10} height={5} rx={2} className="al-glass" />
      <rect x={-4.5} y={5.5} width={9} height={4} rx={2} className="al-glass" />
    </g>
  );
};

const Bubble = ({ text, cls, dy }: { text: string; cls: string; dy: number }) => {
  const w = bubbleW(text);
  return (
    <g className={`al-bubble ${cls}`} transform={`translate(0 ${dy})`}>
      <rect x={-w / 2} y={-19} width={w} height={19} rx={8} />
      <path d="M-5 0 L5 0 L0 5 Z" />
      <text x={0} y={-9.5}>
        {text}
      </text>
    </g>
  );
};

const Plate = ({ text, dy }: { text: string; dy: number }) => {
  const w = plateW(text);
  return (
    <g className="al-plate" transform={`translate(0 ${dy})`}>
      <rect x={-w / 2} y={-7.5} width={w} height={15} rx={4} />
      <text x={0} y={0.5}>
        {text}
      </text>
    </g>
  );
};

interface Props {
  theme?: "light" | "dark";
  /** Called when the newest alert changes (index into ALERTS). */
  onAlert?: (index: number) => void;
}

const LoginMap = ({ theme = "light", onAlert }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vehRefs = useRef<(SVGGElement | null)[]>([]);
  const [box, setBox] = useState({ x: FOCUS.x, y: FOCUS.y, w: FOCUS.w, h: FOCUS.h });
  const [compact, setCompact] = useState(false);
  const alertRef = useRef(-1);
  const onAlertRef = useRef(onAlert);
  onAlertRef.current = onAlert;

  // Fit the focus area (Pakistan + neighbours) into whatever shape the panel has.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => {
      const cw = el.clientWidth || 1;
      const ch = el.clientHeight || 1;
      const ar = cw / ch;
      let w = FOCUS.w;
      let h = FOCUS.h;
      if (w / h < ar) w = h * ar;
      else h = w / ar;
      w = Math.min(w, MAP_W);
      h = Math.min(h, MAP_H);
      const cx = FOCUS.x + FOCUS.w / 2;
      const cy = FOCUS.y + FOCUS.h / 2;
      const x = Math.max(0, Math.min(MAP_W - w, cx - w / 2));
      const y = Math.max(0, Math.min(MAP_H - h, cy - h / 2));
      setBox({ x, y, w, h });
      setCompact(cw < 560);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = reduce ? 0.3 : ((now - start) % CYCLE) / CYCLE;
      VEHICLES.forEach((v, i) => {
        const g = vehRefs.current[i];
        if (!g) return;
        const c = (t + v.off) % 1;
        const u = v.a + (v.b - v.a) * c;
        const alpha = Math.max(0, Math.min(1, c / FADE, (1 - c) / FADE));
        let st = "ok";
        if (v.st === "over") st = "over";
        else if (v.st === "border" && u >= TORKHAM_U) st = "border";
        else if (v.st === "geo" && c >= 0.9) st = "geo";
        const [x, y, h] = PATHS[v.road].at(u);
        const heading = v.b < v.a ? h + 180 : h;
        g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        (g.firstChild as SVGGElement | null)?.setAttribute("transform", `rotate(${heading.toFixed(1)})`);
        g.style.opacity = alpha.toFixed(2);
        if (g.dataset.st !== st) g.dataset.st = st;
      });
      let idx = 0;
      ALERTS.forEach((a, k) => {
        if (a.at <= t) idx = k;
      });
      if (idx !== alertRef.current) {
        alertRef.current = idx;
        onAlertRef.current?.(idx);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const roadPaths = useMemo(
    () => Object.values(ROADS).map((pts) => "M" + pts.map((p) => `${p[0]} ${p[1]}`).join("L")),
    []
  );
  const [gx, gy] = GWADAR;
  const [qx, qy] = QUETTA;

  return (
    <div ref={wrapRef} className={`al-map al-map--${theme}${compact ? " is-compact" : ""}`} aria-hidden="true">
      <svg viewBox={`${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.w.toFixed(1)} ${box.h.toFixed(1)}`} preserveAspectRatio="xMidYMid slice">
        <rect x={0} y={0} width={MAP_W} height={MAP_H} className="al-sea" />
        <path d={LAND_D} className="al-land" />
        <path d={PAK_D} className="al-pak" />
        <path d={PAK_D} className="al-pakline" />
        {COUNTRY_LABELS.map(([n, x, y, big]) => (
          <text key={n} x={x} y={y} className={big ? "al-country al-country--pk" : "al-country"}>
            {big ? n.split("").join(" ") : n}
          </text>
        ))}
        {roadPaths.map((d, i) => (
          <g key={i}>
            <path d={d} className="al-road" />
            <path d={d} className="al-road-hi" />
          </g>
        ))}
        <circle cx={gx} cy={gy} r={22} className="al-fence" />
        {CITIES.map(([n, x, y]) => (
          <g key={n} className="al-city">
            <circle cx={x} cy={y} r={3.5} />
            <text x={x + 7} y={y}>
              {n}
            </text>
          </g>
        ))}

        {/* Idle vehicle parked near Quetta */}
        <g className="al-veh al-veh--idle" data-st="idle" transform={`translate(${qx + 30} ${qy + 20})`}>
          <g transform="rotate(-30)">
            <Shape kind="truck" />
          </g>
          <circle r={14} className="al-pulse" />
          <Plate text="QAA-1087" dy={30} />
          <Bubble text="Idle 25 min" cls="al-bubble--idle" dy={-24} />
        </g>

        {VEHICLES.map((v, i) => {
          const big = v.kind === "truck" || v.kind === "bus";
          return (
            <g key={v.plate} ref={(el) => (vehRefs.current[i] = el)} className="al-veh" data-st="ok" data-kind={v.kind}>
              <g>
                <Shape kind={v.kind} />
              </g>
              <circle r={big ? 18 : 14} className="al-pulse" />
              <Plate text={v.plate} dy={big ? 30 : 22} />
              {v.st === "over" && <Bubble text={`${v.kmh} km/h  OVER-SPEED`} cls="al-bubble--over" dy={big ? -26 : -18} />}
              {v.st === "border" && <Bubble text="Border crossed" cls="al-bubble--border" dy={-26} />}
              {v.st === "geo" && <Bubble text="Entered geofence" cls="al-bubble--geo" dy={-26} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default LoginMap;
