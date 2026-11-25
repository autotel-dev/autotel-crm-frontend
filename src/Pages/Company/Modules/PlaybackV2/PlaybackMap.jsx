// Trip Playback map: speed-coloured trail (T1), event marks (A/B/P/S),
// rotating car (M3) with a small info card. Same Maps loader and dark style
// as the rest of the app.
import React, { useEffect, useRef, useState } from "react";
import { GoogleApiWrapper, Map } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../utils/googleMapsOptions";
import { DARK_MAP_STYLES } from "../../../../utils/mapDarkStyles";

const TRAIL = {
  light: { move: "#65A30D", fast: "#D97706", over: "#DC2626" },
  dark: { move: "#A3E635", fast: "#FCD34D", over: "#F87171" },
};

const useIsDark = () => {
  const [dark, setDark] = useState(() => document.body.classList.contains("at-dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.body.classList.contains("at-dark")));
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const carSvg = (band, course) =>
  `<svg viewBox="0 0 24 40" width="26" height="42" style="transform:rotate(${Math.round(course)}deg)">` +
  `<rect x="3" y="1" width="18" height="38" rx="7" class="pb-car__body pb-car__body--${band}"/>` +
  `<rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".38"/>` +
  `<rect x="6" y="28" width="12" height="5" rx="2" fill="#000" opacity=".3"/></svg>`;

const makeLayer = (google) =>
  class PlaybackLayer extends google.maps.OverlayView {
    constructor() {
      super();
      this.events = [];
      this.car = null;
      this.card = null;
      this.onEvent = null;
    }
    onAdd() {
      this._evKey = null; // force a fresh draw of the event marks
      this.root = document.createElement("div");
      this.root.style.position = "absolute";
      this.getPanes().overlayMouseTarget.appendChild(this.root);
      this.evBox = document.createElement("div");
      this.carEl = document.createElement("div");
      this.carEl.className = "pb-car";
      this.cardEl = document.createElement("div");
      this.cardEl.className = "pb-card";
      this.root.append(this.evBox, this.carEl, this.cardEl);
    }
    onRemove() { this.root?.remove(); }
    // Not named "set": OverlayView inherits MVCObject.set(), which setMap() uses.
    update(data) { Object.assign(this, data); this.draw(); }
    place(el, lat, lng) {
      const p = this.getProjection()?.fromLatLngToDivPixel(new google.maps.LatLng(lat, lng));
      if (!p) return false;
      el.style.left = `${p.x}px`;
      el.style.top = `${p.y}px`;
      return true;
    }
    draw() {
      if (!this.root || !this.getProjection()) return;
      // events
      if (this._evKey !== this.evKey) {
        this.evBox.innerHTML = "";
        this.events.forEach((e) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = `pb-ev pb-ev--${e.kind}`;
          b.textContent = e.kind;
          b.title = e.label;
          b.setAttribute("aria-label", e.label);
          b.dataset.t = String(e.t);
          b.addEventListener("click", (ev) => { ev.stopPropagation(); this.onEvent && this.onEvent(e.t); });
          this.evBox.appendChild(b);
        });
        this._evKey = this.evKey;
      }
      Array.from(this.evBox.children).forEach((b, i) => { const e = this.events[i]; if (e) this.place(b, e.lat, e.lng); });
      // car + card
      if (this.car) {
        this.carEl.style.display = "";
        // Rebuild the car only when its colour changes; otherwise just turn it.
        // (Rebuilding it ~60 times a second made it blink during playback.)
        if (this._carBand !== this.car.band || !this._carSvg) {
          this.carEl.innerHTML = carSvg(this.car.band, this.car.course);
          this._carSvg = this.carEl.firstElementChild;
          this._carBand = this.car.band;
        }
        this._carSvg.style.transform = `rotate(${Math.round(this.car.course)}deg)`;
        this.place(this.carEl, this.car.lat, this.car.lng);
        if (this.card) {
          this.cardEl.style.display = "";
          if (this._card !== this.card) { this.cardEl.innerHTML = this.card; this._card = this.card; }
          this.place(this.cardEl, this.car.lat, this.car.lng);
        } else this.cardEl.style.display = "none";
      } else {
        this.carEl.style.display = "none";
        this.cardEl.style.display = "none";
      }
    }
  };

// Map area (container pixels) not covered by the top bar, trips panel and controls.
const visibleBox = (map) => {
  const div = map.getDiv?.();
  if (!div) return null;
  const m = div.getBoundingClientRect();
  const box = { l: 0, t: 0, r: m.width, b: m.height };
  const over = (r) => r.width > 0 && r.height > 0 && r.right > m.left && r.left < m.right && r.bottom > m.top && r.top < m.bottom;
  const get = (sel) => { const el = document.querySelector(sel); return el ? el.getBoundingClientRect() : null; };
  const top = get(".pb-top"), ctrl = get(".pb-ctrl"), trips = get(".pb-feed") || get(".pb-trips");
  if (top && over(top)) box.t = Math.max(box.t, top.bottom - m.top);
  if (ctrl && over(ctrl)) box.b = Math.min(box.b, ctrl.top - m.top);
  if (trips && over(trips) && trips.right - m.left < m.width / 2) box.l = Math.max(box.l, trips.right - m.left);
  if (box.r - box.l < 160 || box.b - box.t < 120) return { l: 0, t: 0, r: m.width, b: m.height };
  return box;
};

/** Dashed grey line for "no signal" gaps (the real road is unknown). */
export const gapLine = (google, dark) => ({
  clickable: false,
  strokeOpacity: 0,
  icons: [{ icon: { path: "M 0,-1 0,1", strokeOpacity: 0.9, strokeColor: dark ? "#8B8BA8" : "#6B7280", strokeWeight: 3, scale: 3 }, offset: "0", repeat: "14px" }],
});

const PlaybackMap = ({ google, pts, segments, events, car, card, fitKey, follow, onSeek }) => {
  const [map, setMap] = useState(null);
  const layerRef = useRef(null);
  const linesRef = useRef([]);
  const fittedRef = useRef(null);
  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;
  const dark = useIsDark();
  // Latest overlay data, so a layer created after the data arrived still gets it.
  const latest = useRef({});
  latest.current = { events: events || [], evKey: (events || []).map((e) => e.key).join("|") + (dark ? "d" : "l"), car, card };

  useEffect(() => {
    if (!map || !google) return;
    const L = makeLayer(google);
    const layer = new L();
    layer.onEvent = (t) => onSeekRef.current && onSeekRef.current(t);
    layer.setMap(map);
    layerRef.current = layer;
    layer.update(latest.current); // drawn once the overlay is added
    return () => { layer.setMap(null); layerRef.current = null; };
  }, [map, google]);

  // Trail polylines
  useEffect(() => {
    if (!map || !google) return;
    linesRef.current.forEach((l) => l.setMap(null));
    const colors = dark ? TRAIL.dark : TRAIL.light;
    linesRef.current = (segments || []).map((s) =>
      s.band === "gap"
        ? new google.maps.Polyline({ map, path: s.path, ...gapLine(google, dark), zIndex: 0 })
        : new google.maps.Polyline({ map, path: s.path, strokeColor: colors[s.band], strokeOpacity: 0.95, strokeWeight: 5, clickable: false, zIndex: s.band === "over" ? 3 : s.band === "fast" ? 2 : 1 })
    );
    return () => { linesRef.current.forEach((l) => l.setMap(null)); linesRef.current = []; };
  }, [map, google, segments, dark]);

  useEffect(() => {
    layerRef.current?.update({ events: events || [], evKey: (events || []).map((e) => e.key).join("|") + (dark ? "d" : "l") });
  }, [events, map, dark]);

  useEffect(() => { layerRef.current?.update({ car, card }); }, [car, card]);

  // Fit the trail when the selection changes
  useEffect(() => {
    if (!map || !google || !pts?.length || fittedRef.current === fitKey) return;
    fittedRef.current = fitKey;
    const b = new google.maps.LatLngBounds();
    pts.forEach((p) => b.extend({ lat: p.lat, lng: p.lng }));
    const narrow = window.innerWidth <= 760;
    map.fitBounds(b, narrow ? { top: 40, left: 30, right: 30, bottom: 40 } : { top: 50, left: 450, right: 80, bottom: 130 });
  }, [map, google, pts, fitKey]);

  // Follow the car: keep it inside the part of the map not covered by the
  // floating panels; once it leaves the middle of that area, re-centre on it.
  useEffect(() => {
    if (!map || !google || !car || !follow) return;
    const proj = layerRef.current?.getProjection?.();
    const box = visibleBox(map);
    if (!proj || !box) {
      const b = map.getBounds();
      if (b && !b.contains(new google.maps.LatLng(car.lat, car.lng))) map.panTo({ lat: car.lat, lng: car.lng });
      return;
    }
    const p = proj.fromLatLngToContainerPixel(new google.maps.LatLng(car.lat, car.lng));
    if (!p) return;
    // While playing, keep the car at the middle of the clear area every frame,
    // so the map glides with it instead of jumping half a screen at a time
    // (which looked like blinking when zoomed in at 16x / 64x).
    const dx = p.x - (box.l + box.r) / 2;
    const dy = p.y - (box.t + box.b) / 2;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    const div = map.getDiv();
    const far = Math.abs(dx) > (box.r - box.l) / 2 || Math.abs(dy) > (box.b - box.t) / 2;
    if (far || !div) { map.panBy(Math.round(dx), Math.round(dy)); return; }
    const c = proj.fromContainerPixelToLatLng(new google.maps.Point(div.clientWidth / 2 + dx, div.clientHeight / 2 + dy));
    if (c) map.setCenter(c);
  }, [map, google, car, follow]);

  useEffect(() => { if (map) map.setOptions({ styles: dark ? DARK_MAP_STYLES : null }); }, [map, dark]);

  const zoomBy = (d) => map && map.setZoom((map.getZoom() || 12) + d);

  if (!google) return null;
  return (
    <>
      <Map
        google={google}
        initialCenter={{ lat: 30.3753, lng: 69.3451 }}
        zoom={6}
        disableDefaultUI
        zoomControl={false}
        gestureHandling="greedy"
        styles={dark ? DARK_MAP_STYLES : null}
        onReady={(_, m) => setMap(m)}
        containerStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="pb-zoom" role="group" aria-label="Map zoom">
        <button type="button" onClick={() => zoomBy(1)} aria-label="Zoom in" title="Zoom in">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button type="button" onClick={() => zoomBy(-1)} aria-label="Zoom out" title="Zoom out">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
        </button>
      </div>
    </>
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(PlaybackMap);
