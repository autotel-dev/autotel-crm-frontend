// Live Monitoring map (redesign Phase 3).
// - Google Maps via the app's shared loader (GoogleApiWrapper + GOOGLE_MAPS_OPTIONS),
//   so Maps is only ever loaded once.
// - One overlay layer draws every vehicle (M3 car seen from above, turned to
//   its heading, coloured by status) and the clusters, reusing DOM nodes
//   between updates instead of creating one overlay per vehicle.
// - Hover → onHover(id, rect) for the L3 card; click → onSelect(id).
import React, { useEffect, useRef, useState } from "react";
import { GoogleApiWrapper, Map } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../utils/googleMapsOptions";

const CAR_W = 22;
const CAR_H = 36;

const carSvg = (color, selected) => {
  const w = selected ? 28 : CAR_W;
  const h = selected ? 46 : CAR_H;
  return (
    `<svg width="${w}" height="${h}" viewBox="0 0 24 40" style="overflow:visible;display:block">` +
    `<rect x="3" y="1" width="18" height="38" rx="7" fill="${color}" stroke="#fff" stroke-width="1.8"/>` +
    `<rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".38"/>` +
    `<rect x="6" y="28" width="12" height="5" rx="2" fill="#000" opacity=".3"/>` +
    `<rect x="0.5" y="12" width="3" height="3" rx="1" fill="${color}"/>` +
    `<rect x="20.5" y="12" width="3" height="3" rx="1" fill="${color}"/>` +
    `</svg>`
  );
};

// Dark map for theme C4
const DARK_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#12121f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b8bb0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a12" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#23213f" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2f2c55" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1530" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const useIsDark = () => {
  const [dark, setDark] = useState(() => document.body.classList.contains("at-dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.body.classList.contains("at-dark")));
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

/** Builds the overlay class once Google Maps is available. */
const makeLayerClass = (google) =>
  class FleetLayer extends google.maps.OverlayView {
    constructor(handlers) {
      super();
      this.items = [];
      this.selectedId = null;
      this.handlers = handlers;
      this.nodes = new window.Map(); // id → car div
      this.clusterNodes = [];
    }

    onAdd() {
      this.container = document.createElement("div");
      this.container.style.position = "absolute";
      this.getPanes().overlayMouseTarget.appendChild(this.container);
    }

    onRemove() {
      this.container?.remove();
      this.nodes.clear();
      this.clusterNodes = [];
    }

    setData(items, selectedId) {
      this.items = items;
      this.selectedId = selectedId;
      this.draw();
    }

    carNode(item) {
      let el = this.nodes.get(item.id);
      if (!el) {
        el = document.createElement("div");
        el.style.position = "absolute";
        el.style.cursor = "pointer";
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this.handlers.onSelect(el.dataset.id);
        });
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter") this.handlers.onSelect(el.dataset.id);
        });
        el.addEventListener("mouseenter", () => this.handlers.onHover(el.dataset.id, el.getBoundingClientRect()));
        el.addEventListener("mouseleave", () => this.handlers.onHover(null));
        this.container.appendChild(el);
        this.nodes.set(item.id, el);
      }
      el.dataset.id = item.id;
      const sel = item.id === this.selectedId;
      const key = `${item.color}|${sel}|${Math.round(item.heading || 0)}`;
      if (el.dataset.key !== key) {
        el.dataset.key = key;
        const w = sel ? 28 : CAR_W;
        const h = sel ? 46 : CAR_H;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.zIndex = sel ? "5" : "1";
        el.innerHTML =
          (sel
            ? `<span style="position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(129,140,248,.2);border:2px solid var(--at-primary)"></span>`
            : "") +
          `<span style="position:absolute;inset:0;transform:rotate(${item.heading || 0}deg);transform-origin:50% 50%">${carSvg(item.color, sel)}</span>`;
      }
      el.setAttribute("aria-label", `${item.plate}, ${item.statusLabel}`);
      return el;
    }

    draw() {
      const proj = this.getProjection();
      const map = this.getMap();
      if (!proj || !this.container || !map) return;
      const zoom = map.getZoom() || 8;
      const pts = this.items.map((it) => ({
        it,
        p: proj.fromLatLngToDivPixel(new google.maps.LatLng(it.lat, it.lng)),
      }));

      // Grid clustering below zoom 15 (selected vehicle always shown on its own)
      const cell = zoom >= 15 ? 0 : zoom >= 12 ? 70 : zoom >= 9 ? 90 : 120;
      const singles = [];
      const cells = new window.Map();
      for (const x of pts) {
        if (!cell || x.it.id === this.selectedId) {
          singles.push(x);
          continue;
        }
        const k = `${Math.floor(x.p.x / cell)}:${Math.floor(x.p.y / cell)}`;
        if (!cells.has(k)) cells.set(k, []);
        cells.get(k).push(x);
      }
      const clusters = [];
      cells.forEach((group) => {
        if (group.length === 1) singles.push(group[0]);
        else clusters.push(group);
      });

      // Cars
      const seen = new Set();
      for (const { it, p } of singles) {
        const el = this.carNode(it);
        seen.add(it.id);
        const w = parseInt(el.style.width, 10);
        const h = parseInt(el.style.height, 10);
        el.style.left = `${p.x - w / 2}px`;
        el.style.top = `${p.y - h / 2}px`;
        el.style.display = "block";
      }
      this.nodes.forEach((el, id) => {
        if (!seen.has(id)) {
          if (this.items.some((i) => i.id === id)) el.style.display = "none";
          else {
            el.remove();
            this.nodes.delete(id);
          }
        }
      });

      // Clusters (few; simply rebuilt)
      this.clusterNodes.forEach((n) => n.remove());
      this.clusterNodes = clusters.map((group) => {
        const x = group.reduce((s, g) => s + g.p.x, 0) / group.length;
        const y = group.reduce((s, g) => s + g.p.y, 0) / group.length;
        const size = Math.min(58, 36 + group.length * 0.6);
        const n = document.createElement("button");
        n.type = "button";
        n.className = "at-cluster";
        n.textContent = String(group.length);
        n.setAttribute("aria-label", `${group.length} vehicles here, zoom in`);
        n.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;`;
        n.addEventListener("click", (e) => {
          e.stopPropagation();
          const lat = group.reduce((s, g) => s + g.it.lat, 0) / group.length;
          const lng = group.reduce((s, g) => s + g.it.lng, 0) / group.length;
          map.panTo({ lat, lng });
          map.setZoom(Math.min(18, zoom + 2));
        });
        this.container.appendChild(n);
        return n;
      });
    }
  };

// Map area (container pixels) not covered by the floating panels.
// Each panel blocks one side: left/right panels (list, card, focus card) and
// top/bottom bars. A side panel that spans most of the width (phones) blocks
// the top or bottom instead.
const SIDES = [
  [".lm-top", "top"],
  [".lm-list", "left"],
  [".lm-focus", "left"],
  [".lm-card", "right"],
  [".lm-pulse", "bottom"],
  [".lm-strip", "bottom"],
];
const visibleBox = (map) => {
  const div = map.getDiv?.();
  if (!div) return null;
  const m = div.getBoundingClientRect();
  const box = { l: 0, t: 0, r: m.width, b: m.height };
  for (const [sel, side] of SIDES) {
    document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0 && r.right > m.left && r.left < m.right && r.bottom > m.top && r.top < m.bottom)) return;
      const L = r.left - m.left, R = r.right - m.left, T = r.top - m.top, B = r.bottom - m.top;
      let s = side;
      if ((s === "left" && R > m.width / 2) || (s === "right" && L < m.width / 2)) s = T + (B - T) / 2 < m.height / 2 ? "top" : "bottom";
      if (s === "left") box.l = Math.max(box.l, R);
      else if (s === "right") box.r = Math.min(box.r, L);
      else if (s === "top" && B < m.height / 2 + 1) box.t = Math.max(box.t, B);
      else if (s === "bottom" && T > m.height / 2 - 1) box.b = Math.min(box.b, T);
    });
  }
  if (box.r - box.l < 160 || box.b - box.t < 120) return { l: 0, t: 0, r: m.width, b: m.height };
  return box;
};

const FleetMap = ({ google, items, selectedId, follow, onSelect, onHover, fitKey, trail, centerKey, onMap, onUserMove }) => {
  const [map, setMap] = useState(null);
  const layerRef = useRef(null);
  const handlersRef = useRef({ onSelect, onHover, onUserMove });
  handlersRef.current = { onSelect, onHover, onUserMove };
  const trailRef = useRef(null);
  const centerRef = useRef(centerKey);
  const fittedRef = useRef(null);
  const lastSelRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const dark = useIsDark();

  // Create the layer once the map is ready
  useEffect(() => {
    if (!map || !google) return;
    const Layer = makeLayerClass(google);
    const layer = new Layer({
      onSelect: (id) => handlersRef.current.onSelect(id),
      onHover: (id, rect) => handlersRef.current.onHover(id, rect),
    });
    layer.setMap(map);
    layerRef.current = layer;
    const idle = map.addListener("zoom_changed", () => handlersRef.current.onHover(null));
    const drag = map.addListener("dragstart", () => handlersRef.current.onUserMove?.());
    onMap?.(map);
    return () => {
      idle.remove();
      drag.remove();
      layer.setMap(null);
      layerRef.current = null;
    };
  }, [map, google]);

  // Push data to the layer
  useEffect(() => {
    layerRef.current?.setData(items, selectedId);
  }, [items, selectedId, map]);

  // Fit all vehicles on first load (and when "Fit all" bumps fitKey)
  useEffect(() => {
    if (!map || !google || items.length === 0) return;
    if (fittedRef.current === fitKey) return;
    // First load with a vehicle already selected (e.g. back from Playback):
    // start on that vehicle instead of fitting the whole fleet.
    if (fittedRef.current === null && selectedId) {
      const it = items.find((i) => i.id === selectedId);
      if (!it) return;
      fittedRef.current = fitKey;
      map.setZoom(15);
      map.setCenter({ lat: it.lat, lng: it.lng });
      return;
    }
    fittedRef.current = fitKey;
    const b = new google.maps.LatLngBounds();
    items.forEach((i) => b.extend({ lat: i.lat, lng: i.lng }));
    if (items.length === 1) {
      map.panTo({ lat: items[0].lat, lng: items[0].lng });
      map.setZoom(15);
    } else map.fitBounds(b, 80);
  }, [map, google, items, fitKey, selectedId]);

  // Selecting a vehicle centres it in the clear part of the map (between the
  // panels); "Follow" keeps it there as it moves, re-centring once it leaves
  // the middle half of that area.
  useEffect(() => {
    if (!map) return; // keep "fresh" until the map exists
    if (!selectedId) {
      lastSelRef.current = selectedId;
      return;
    }
    const it = items.find((i) => i.id === selectedId);
    if (!it) return;
    const recentre = centerRef.current !== centerKey;
    centerRef.current = centerKey;
    const fresh = lastSelRef.current !== selectedId;
    if (fresh) {
      lastSelRef.current = selectedId;
      if ((map.getZoom() || 0) < 14) map.setZoom(15);
      // A fleet-wide fitBounds still finishing (first load, e.g. back from
      // Playback) can undo that zoom; check again once the map settles.
      const sel = selectedId;
      google.maps.event.addListenerOnce(map, "idle", () => {
        if (lastSelRef.current !== sel || (map.getZoom() || 0) >= 14) return;
        const cur = itemsRef.current.find((i) => i.id === sel);
        if (!cur) return;
        map.setZoom(15);
        map.setCenter({ lat: cur.lat, lng: cur.lng });
      });
    }
    if (!fresh && !recentre && !follow) return;
    const proj = layerRef.current?.getProjection?.();
    const box = visibleBox(map);
    const p = proj && box ? proj.fromLatLngToContainerPixel(new google.maps.LatLng(it.lat, it.lng)) : null;
    if (!p) { map.panTo({ lat: it.lat, lng: it.lng }); return; }
    const cx = (box.l + box.r) / 2, cy = (box.t + box.b) / 2;
    const mx = (box.r - box.l) * 0.25, my = (box.b - box.t) * 0.25;
    const inside = p.x >= box.l + mx && p.x <= box.r - mx && p.y >= box.t + my && p.y <= box.b - my;
    if (fresh || recentre || !inside) map.panBy(Math.round(p.x - cx), Math.round(p.y - cy));
  }, [map, google, items, selectedId, follow, centerKey]);

  // Trail of the focused vehicle (last 30 minutes): solid runs, plus dashed
  // grey "no signal" gaps where the tracker sent nothing while moving.
  useEffect(() => {
    if (!map || !google) return;
    (trailRef.current || []).forEach((l) => l.setMap(null));
    const color = dark ? "#A3E635" : "#65A30D";
    const solid = (trail?.solid || []).map((path) =>
      new google.maps.Polyline({ map, path, clickable: false, strokeColor: color, strokeOpacity: 0.95, strokeWeight: 5, zIndex: 2 })
    );
    const gaps = (trail?.gaps || []).map((path) =>
      new google.maps.Polyline({
        map, path, clickable: false, strokeOpacity: 0, zIndex: 1,
        icons: [{ icon: { path: "M 0,-1 0,1", strokeOpacity: 0.9, strokeColor: dark ? "#8B8BA8" : "#6B7280", strokeWeight: 3, scale: 3 }, offset: "0", repeat: "14px" }],
      })
    );
    trailRef.current = [...solid, ...gaps];
  }, [map, google, trail, dark]);
  useEffect(() => () => { (trailRef.current || []).forEach((l) => l.setMap(null)); trailRef.current = null; }, []);

  useEffect(() => {
    if (map) map.setOptions({ styles: dark ? DARK_STYLES : null });
  }, [map, dark]);

  if (!google) return null;

  return (
    <Map
      google={google}
      initialCenter={{ lat: 30.3753, lng: 69.3451 }}
      zoom={6}
      disableDefaultUI
      gestureHandling="greedy"
      onReady={(_, m) => setMap(m)}
      onClick={() => onHover(null)}
      containerStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(FleetMap);
