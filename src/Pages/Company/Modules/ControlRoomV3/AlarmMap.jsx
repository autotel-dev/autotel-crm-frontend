// Control Room map: one pin per alarm, coloured by priority; the selected alarm
// pulses and the map pans to it. Uses the app's shared Google Maps loader.
import React, { useEffect, useRef, useState } from "react";
import { GoogleApiWrapper, Map } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../utils/googleMapsOptions";

// Keep in sync with --cr-map-bg in controlRoom.scss (shown while tiles load).
const DARK_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#1b1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#b4b4d4" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a12" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#34315c" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a4590" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a3a" }] },
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

const makeLayerClass = (google) =>
  class AlarmLayer extends google.maps.OverlayView {
    constructor(onSelect) {
      super();
      this.items = [];
      this.selectedId = null;
      this.onSelect = onSelect;
      this.nodes = new window.Map();
    }
    onAdd() {
      this.container = document.createElement("div");
      this.container.style.position = "absolute";
      this.getPanes().overlayMouseTarget.appendChild(this.container);
    }
    onRemove() {
      this.container?.remove();
      this.nodes.clear();
    }
    setData(items, selectedId) {
      this.items = items;
      this.selectedId = selectedId;
      this.draw();
    }
    node(it) {
      let el = this.nodes.get(it.id);
      if (!el) {
        el = document.createElement("button");
        el.type = "button";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this.onSelect(el.dataset.id);
        });
        this.container.appendChild(el);
        this.nodes.set(it.id, el);
      }
      el.dataset.id = it.id;
      el.className = `cr-pin cr-pin--p${it.priority}${it.id === this.selectedId ? " is-selected" : ""}${it.over ? " is-over" : ""}`;
      el.setAttribute("aria-label", it.label);
      el.title = it.label;
      return el;
    }
    draw() {
      const proj = this.getProjection();
      if (!proj || !this.container) return;
      const seen = new Set();
      // selected pin last so it sits on top
      const ordered = [...this.items].sort((a, b) => (a.id === this.selectedId) - (b.id === this.selectedId));
      ordered.forEach((it) => {
        const p = proj.fromLatLngToDivPixel(new google.maps.LatLng(it.lat, it.lng));
        if (!p) return;
        const el = this.node(it);
        el.style.left = `${p.x}px`;
        el.style.top = `${p.y}px`;
        this.container.appendChild(el);
        seen.add(it.id);
      });
      this.nodes.forEach((el, id) => {
        if (!seen.has(id)) {
          el.remove();
          this.nodes.delete(id);
        }
      });
    }
  };

const AlarmMap = ({ google, items, selectedId, onSelect, fitKey }) => {
  const [map, setMap] = useState(null);
  const layerRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const fittedRef = useRef(null);
  const lastSelRef = useRef(null);
  const dark = useIsDark();

  useEffect(() => {
    if (!map || !google) return;
    const Layer = makeLayerClass(google);
    const layer = new Layer((id) => onSelectRef.current(id));
    layer.setMap(map);
    layerRef.current = layer;
    return () => {
      layer.setMap(null);
      layerRef.current = null;
    };
  }, [map, google]);

  useEffect(() => {
    layerRef.current?.setData(items, selectedId);
  }, [items, selectedId, map]);

  // Fit the visible alarms when the list changes (tab, filters), not on every poll.
  useEffect(() => {
    if (!map || !google || items.length === 0 || selectedId) return;
    if (fittedRef.current === fitKey) return;
    fittedRef.current = fitKey;
    if (items.length === 1) {
      map.panTo({ lat: items[0].lat, lng: items[0].lng });
      map.setZoom(14);
      return;
    }
    const b = new google.maps.LatLngBounds();
    items.forEach((i) => b.extend({ lat: i.lat, lng: i.lng }));
    map.fitBounds(b, { top: 90, left: 400, right: 460, bottom: 40 });
  }, [map, google, items, fitKey, selectedId]);

  useEffect(() => {
    if (!map || !selectedId || lastSelRef.current === selectedId) {
      lastSelRef.current = selectedId;
      return;
    }
    const it = items.find((i) => i.id === selectedId);
    if (!it) return;
    lastSelRef.current = selectedId;
    map.panTo({ lat: it.lat, lng: it.lng });
    if ((map.getZoom() || 0) < 14) map.setZoom(15);
  }, [map, items, selectedId]);

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
      zoomControl
      gestureHandling="greedy"
      // Start with the right theme so the map never paints light first.
      styles={dark ? DARK_STYLES : null}
      onReady={(_, m) => setMap(m)}
      containerStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(AlarmMap);
