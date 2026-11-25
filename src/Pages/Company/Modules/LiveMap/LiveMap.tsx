// Live Monitoring (redesign Phase 3, design "C1/C4 · Map-first · Live").
// Overview: full-screen map with floating panels: filters on top, vehicle list
// on the left, fleet pulse at the bottom.
// Selecting a vehicle opens design B "Camera focus" (FocusView.tsx): the camera
// locks on it, with a live panel, camera modes and a bottom strip.
// Data and the existing pop-ups (edit device, icons, customer, playback,
// send command, add device) are reused from the old page (MonitoringLatest).
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FleetMap from "./FleetMap";
import { BottomStrip, CameraBar, CamMode, FocusCard, kmFromTrack, readLimit, useTodayTrack } from "./FocusView";
import { isSignalGap, todayStr } from "../PlaybackV2/playbackUtils";
import { useFleet } from "./useFleet";
import { deriveStatus, FleetStatus, isOnline, plateOf, searchText, STATUS_INFO, STATUS_ORDER, timeAgo } from "./fleetStatus";
import { create } from "../../../../Utilities/api";
import { GET_SINGLE_VEHICLE_START } from "../../../../Utilities/api/apiEndpoints";
import {
  setAlertsEnabled,
  setMonitoringSession,
  setSelectedSingleDevice,
  setVehicleHistoryDateRange,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { setInvoiceData, setIsInvoiceRenwed } from "../../../../ReaduxToolkit/Reducer/SalesSlice";
import { getUserRole } from "../../../../Utilities/globals/globals";
import { ROLES } from "../../../../constants/roles";
import { formatKmh } from "../../../../utils/speed";
import PlaybackModal from "../MonitoringLatest/components/SingleVehiceDetail/PlaybackModal/PlaybackModal";
import CustomerDetailsModal from "../MonitoringLatest/components/DevicesSidebar/CustomerDetailsModal";
import { EditDeviceModal } from "../MonitoringLatest/components/EditDeviceModal";
import { EditDeviceIconsModal } from "../MonitoringLatest/components/EditDeviceIconsModal";
import { AddDeviceModal } from "../MonitoringLatest/components/AddDeviceModal";
import SendCommand from "../ControlRoom copy/Analytics/components/SendCommand";
import { DetailTab, FocusDetails } from "./FocusDetails";
import "./liveMap.scss";

const U = process.env.PUBLIC_URL || "";

/** Small M3 car (square, turned to heading) as an image — immune to page SVG styles. */
const carIcon = (hex: string, heading = 0) =>
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-8 0 40 40">` +
      `<g transform="rotate(${Math.round(heading)} 12 20)">` +
      `<rect x="3" y="1" width="18" height="38" rx="7" fill="${hex}" stroke="#fff" stroke-width="1.8"/>` +
      `<rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".38"/>` +
      `<rect x="6" y="28" width="12" height="5" rx="2" fill="#000" opacity=".3"/></g></svg>`
  );

const LiveMap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = getUserRole();
  const isCompany = role === ROLES.COMPANY;
  const base = role === ROLES.OPERATOR ? "/operator" : "/company";
  const { userData } = useSelector((state: any) => state.user);
  const { alertsEnabled } = useSelector((state: any) => state.monitoring);
  const { devices, loading, failed, fetchDevices, lastAlert } = useFleet();
  const limit = userData?.inactiveTimeLimit || 1440;

  const [status, setStatus] = useState<FleetStatus | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Camera: "follow" keeps the selected vehicle in view; "free" leaves the map
  // where the user puts it (dragging the map switches to free). Remembered per browser.
  const [camMode, setCamModeState] = useState<CamMode>(() => {
    try { return localStorage.getItem("lm-follow") === "0" ? "free" : "follow"; } catch { return "follow"; }
  });
  useEffect(() => { try { localStorage.setItem("lm-follow", camMode === "follow" ? "1" : "0"); } catch { /* private mode */ } }, [camMode]);
  const follow = camMode === "follow";
  const [centerKey, setCenterKey] = useState(0);
  const mapRef = useRef<any>(null);
  const [limitKmh, setLimitKmh] = useState<number>(readLimit);
  const setCamMode = (m: CamMode) => {
    setCamModeState(m);
    if (m === "follow") setCenterKey((k) => k + 1);
  };
  const [hover, setHover] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [fitKey, setFitKey] = useState(0);
  const [details, setDetails] = useState<DetailTab | null>(null);
  const [address, setAddress] = useState<string>("");
  const [listOpen, setListOpen] = useState(true);

  // Pop-ups reused from the old page
  const [modal, setModal] = useState<null | "edit" | "icons" | "customer" | "playback" | "command" | "add">(null);
  const [playbackFilter, setPlaybackFilter] = useState<"Today" | "Yesterday" | undefined>(undefined);
  const [modalDevice, setModalDevice] = useState<any>(null);

  // Clock tick so "x min ago" and statuses stay current between updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Status for every vehicle, once per render
  const rows = useMemo(
    () => devices.map((d) => ({ d, s: deriveStatus(d, limit), text: searchText(d) })),
    [devices, limit]
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    STATUS_ORDER.forEach((s) => (c[s] = 0));
    rows.forEach((r) => (c[r.s] += 1));
    return c;
  }, [rows]);
  const online = counts.moving + counts.idle + counts.stopped;

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => rows.filter((r) => (!status || r.s === status) && (!q || r.text.includes(q))),
    [rows, status, q]
  );

  const groups = useMemo(() => {
    const m = new Map<string, { name: string; rows: typeof visible }>();
    visible.forEach((r) => {
      const id = r.d?.vehicle?.group?._id || "ungrouped";
      const name = r.d?.vehicle?.group?.name || "Ungrouped";
      if (!m.has(id)) m.set(id, { name, rows: [] });
      m.get(id)!.rows.push(r);
    });
    return Array.from(m.entries()).sort((a, b) => (a[0] === "ungrouped" ? -1 : b[0] === "ungrouped" ? 1 : a[1].name.localeCompare(b[1].name)));
  }, [visible]);

  // Map items: visible vehicles that have a position, plus the selected one
  // even when the filter hides it (the fleet strip can pick any vehicle)
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
        })),
    [visible, rows, selectedId]
  );

  const selected = useMemo(() => rows.find((r) => r.d._id === selectedId) || null, [rows, selectedId]);
  // Focus view data
  const track = useTodayTrack(selected?.d || null);
  // Last 30 minutes, split into solid runs and dashed "no signal" gaps
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
  const kmToday = useMemo(() => (track.loaded ? kmFromTrack(track.pts, limitKmh) : null), [track, limitKmh]);
  const others = useMemo(() => {
    if (!selected) return [];
    const rank: Record<string, number> = { moving: 0, idle: 1, stopped: 2 };
    const rest = rows
      .filter((r) => r.d._id !== selected.d._id && isOnline(r.s))
      // stable order (status, then plate) so cards don't jump under the cursor
      .sort((a, b) => rank[a.s] - rank[b.s] || plateOf(a.d).localeCompare(plateOf(b.d)))
      .slice(0, 15);
    return [{ d: selected.d, s: selected.s }, ...rest];
  }, [rows, selected]);

  // Coming back from Playback (?focus=<device id>): open that vehicle in focus
  const [params, setParams] = useSearchParams();
  const focusParam = params.get("focus");
  useEffect(() => {
    if (!focusParam || !devices.length) return;
    const d = devices.find((x: any) => String(x?.id) === focusParam || x?._id === focusParam);
    if (d) select(d._id);
    const next = new URLSearchParams(params);
    next.delete("focus");
    setParams(next, { replace: true });
  }, [focusParam, devices.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Esc leaves the focus view
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !modal) select(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const zoom = (dir: 1 | -1) => {
    const m = mapRef.current;
    const g = (window as any).google;
    if (!m) return;
    m.setZoom(Math.max(3, Math.min(20, (m.getZoom() || 12) + dir)));
    if (follow && g?.maps?.event) g.maps.event.addListenerOnce(m, "idle", () => setCenterKey((k) => k + 1));
  };
  const openPlayback = (d: any) => {
    const id = d?.id ?? d?.vehicle?.traccarDeviceId;
    if (id == null) return openModal("playback", d, "Today");
    navigate(`${U}/company/modules/monitoring/playback?device=${id}&date=${todayStr()}`);
  };

  const hovered = useMemo(() => (hover ? rows.find((r) => r.d._id === hover.id) || null : null), [rows, hover]);

  // Keep the shared "selected vehicle" (used by the reused tabs and pop-ups) live
  useEffect(() => {
    if (selected) dispatch(setSelectedSingleDevice(selected.d));
  }, [selected, dispatch]);

  const select = (id: string | null) => {
    setSelectedId(id);
    setLimitKmh(readLimit());
    setDetails(null);
    setHover(null);
    if (!id) return;
    const d = devices.find((x) => x._id === id);
    if (d) dispatch(setSelectedSingleDevice(d));
  };

  // Address of the selected vehicle (same OpenStreetMap lookup as before), only
  // when it moves more than ~150 m so we don't flood the free service.
  const lastAddrPos = useRef<{ id: string; lat: number; lng: number } | null>(null);
  useEffect(() => {
    const p = selected?.d?.latestPosition;
    if (!selected || !p?.latitude) {
      setAddress("");
      lastAddrPos.current = null;
      return;
    }
    const lat = Number(p.latitude);
    const lng = Number(p.longitude);
    const prev = lastAddrPos.current;
    if (prev && prev.id === selected.d._id && Math.abs(prev.lat - lat) + Math.abs(prev.lng - lng) < 0.0015) return;
    lastAddrPos.current = { id: selected.d._id, lat, lng };
    let alive = true;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`)
      .then((r) => r.json())
      .then((j) => alive && setAddress(j?.display_name ? j.display_name.split(",").slice(0, 3).join(",") : ""))
      .catch(() => alive && setAddress(""));
    return () => {
      alive = false;
    };
  }, [selected]);

  // Close the row menu on any outside click
  useEffect(() => {
    if (!menuFor) return;
    const close = () => setMenuFor(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuFor]);

  const openModal = (kind: typeof modal, d: any, filter?: "Today" | "Yesterday") => {
    setMenuFor(null);
    setModalDevice(d);
    dispatch(setSelectedSingleDevice(d));
    if (kind === "playback") {
      dispatch(setVehicleHistoryDateRange(null));
      setPlaybackFilter(filter);
    }
    setModal(kind);
  };

  const renew = (d: any) => {
    setMenuFor(null);
    dispatch(setInvoiceData({ vehicles: [d?.vehicle?.registrationNo], ...d?.vehicle }));
    dispatch(setIsInvoiceRenwed(true));
    navigate(`${U}/company/modules/saio-central/sales/invoices/create-invoice`);
  };

  const liveTab = async (d: any) => {
    setMenuFor(null);
    try {
      const res: any = await create({ vehicleId: d?.vehicle?._id }, { url: GET_SINGLE_VEHICLE_START });
      if (res?.success && res?.data) {
        dispatch(setMonitoringSession(res.data.session));
        dispatch(
          setSelectedSingleDevice({
            ...res.data.vehicle,
            traccarDevice: res.data.traccarDevice,
            latestPosition: res.data.latestPosition,
            mainVehicleStatus: res.data.vehicleStatus,
          })
        );
      }
    } finally {
      window.open(`${window.location.origin}${U}${base}/modules/monitoring-for-single-vehicle/${d?.vehicle?._id}`, "_blank");
    }
  };

  const commandItem = (d: any) => ({ ...d, id: d?.traccarDeviceId || d?.deviceId, value: d?._id, name: d?.vehicle?.registrationNo });


  return (
    <div className="lm-root">
      <FleetMap
        items={items}
        selectedId={selectedId}
        follow={follow}
        fitKey={fitKey}
        trail={selected ? trail : null}
        centerKey={centerKey}
        onMap={(m: any) => (mapRef.current = m)}
        onUserMove={() => selectedId && follow && setCamModeState("free")}
        onSelect={(id: string) => select(id)}
        onHover={(id: string | null, rect?: DOMRect) => setHover(id && rect ? { id, rect } : null)}
      />

      {/* Vehicle list */}
      <section className={`lm-panel lm-list${listOpen ? "" : " is-closed"}`} aria-label="Vehicles" hidden={!!selected}>
        <div className="lm-list__head">
          <strong>Vehicles</strong>
          <span className="lm-muted">{visible.length === devices.length ? devices.length : `${visible.length} of ${devices.length}`}</span>
          <button
            type="button"
            className={`lm-icon-btn lm-bell${alertsEnabled ? " is-on" : ""}`}
            aria-pressed={alertsEnabled}
            aria-label={alertsEnabled ? "Alert pop-ups on (click to mute)" : "Alert pop-ups off (click to turn on)"}
            title={alertsEnabled ? "Alert pop-ups on" : "Alert pop-ups off"}
            onClick={() => dispatch(setAlertsEnabled(!alertsEnabled))}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              {!alertsEnabled && <path d="M2 2l20 20" />}
            </svg>
          </button>
          {isCompany && (
            <button type="button" className="lm-icon-btn lm-add" aria-label="Add device" title="Add device" onClick={() => openModal("add", null)}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          )}
          <button type="button" className="lm-icon-btn" aria-label={listOpen ? "Hide list" : "Show list"} onClick={() => setListOpen(!listOpen)}>
            {listOpen ? "‹" : "›"}
          </button>
        </div>
        {listOpen && (
          <div className="lm-filters">
            <label htmlFor="lm-search" className="visually-hidden">Search vehicles</label>
            <div className="lm-search-wrap">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0.01 0M20 20l-4-4" /></svg>
              <input id="lm-search" className="lm-search" placeholder="Search plate, IMEI, customer…" value={query} onChange={(e) => setQuery(e.target.value)} />
              {query && <button type="button" className="lm-search-clear" aria-label="Clear search" onClick={() => setQuery("")}>✕</button>}
            </div>
            <div className="lm-mix" role="img" aria-label={STATUS_ORDER.filter((s) => counts[s]).map((s) => `${STATUS_INFO[s].label} ${counts[s]}`).join(", ")}>
              {STATUS_ORDER.map((s) => (counts[s] ? <span key={s} style={{ flexGrow: counts[s], background: STATUS_INFO[s].color }} /> : null))}
            </div>
            <div className="lm-stat-grid" role="group" aria-label="Filter by status">
              <button type="button" className={`lm-stat${!status ? " is-on" : ""}`} aria-pressed={!status} onClick={() => setStatus(null)}>
                <span>All</span><b>{devices.length}</b>
              </button>
              {STATUS_ORDER.map((s) =>
                counts[s] ? (
                  <button key={s} type="button" className={`lm-stat${status === s ? " is-on" : ""}`} aria-pressed={status === s} onClick={() => setStatus(status === s ? null : s)}>
                    <span><i style={{ background: STATUS_INFO[s].color }} />{STATUS_INFO[s].label}</span><b>{counts[s]}</b>
                  </button>
                ) : null
              )}
            </div>
          </div>
        )}
        {listOpen && (
          <div className="lm-list__body">
            {loading && devices.length === 0 && <div className="lm-empty">Loading vehicles…</div>}
            {failed && devices.length === 0 && (
              <div className="lm-empty">
                Couldn't load vehicles.{" "}
                <button type="button" className="lm-link" onClick={fetchDevices}>Try again</button>
              </div>
            )}
            {!loading && devices.length > 0 && visible.length === 0 && <div className="lm-empty">No vehicles match.</div>}
            {groups.map(([gid, g]) => (
              <div key={gid} className="lm-group">
                <button
                  type="button"
                  className="lm-group__head"
                  aria-expanded={!collapsed.has(gid)}
                  onClick={() => {
                    const n = new Set(collapsed);
                    n.has(gid) ? n.delete(gid) : n.add(gid);
                    setCollapsed(n);
                  }}
                >
                  <span>{collapsed.has(gid) ? "▸" : "▾"} {g.name}</span>
                  <span className="lm-muted">{g.rows.length}</span>
                </button>
                {!collapsed.has(gid) &&
                  g.rows.map(({ d, s }) => (
                    <div key={d._id} className={`lm-row${d._id === selectedId ? " is-sel" : ""}`}>
                      <button type="button" className="lm-row__main" onClick={() => select(d._id)}>
                        <span className="lm-row__icon" style={{ background: `${STATUS_INFO[s].hex}22` }}>
                          <img src={carIcon(STATUS_INFO[s].hex, Number(d?.latestPosition?.course) || 0)} width={26} height={26} alt="" />
                        </span>
                        <span className="lm-row__text">
                          <strong>{plateOf(d)}</strong>
                          <span className="lm-muted">
                            {STATUS_INFO[s].label} · {timeAgo(d?.latestPosition?.deviceTime)}
                          </span>
                        </span>
                        <span className="lm-row__speed">{isOnline(s) ? formatKmh(d?.latestPosition?.speed) : "—"}</span>
                      </button>
                      <button
                        type="button"
                        className="lm-icon-btn"
                        aria-label={`More actions for ${plateOf(d)}`}
                        aria-haspopup="menu"
                        aria-expanded={menuFor === d._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuFor(menuFor === d._id ? null : d._id);
                        }}
                      >
                        ⋮
                      </button>
                      {menuFor === d._id && (
                        <div className="lm-menu" role="menu" onClick={(e) => e.stopPropagation()}>
                          <button role="menuitem" type="button" onClick={() => openModal("playback", d, "Today")}>History today</button>
                          <button role="menuitem" type="button" onClick={() => openModal("playback", d, "Yesterday")}>History yesterday</button>
                          <button role="menuitem" type="button" onClick={() => liveTab(d)}>Live monitoring (new tab)</button>
                          <button role="menuitem" type="button" onClick={() => openModal("customer", d)}>Customer details</button>
                          {isCompany && <button role="menuitem" type="button" onClick={() => openModal("edit", d)}>Edit device</button>}
                          {isCompany && <button role="menuitem" type="button" onClick={() => openModal("icons", d)}>Edit device icons</button>}
                          {isCompany && s === "expired" && <button role="menuitem" type="button" onClick={() => renew(d)}>Renew subscription</button>}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Design B · Camera focus */}
      {selected && (
        <>
          <FocusCard
            d={selected.d}
            s={selected.s}
            address={address}
            limit={limitKmh}
            kmToday={kmToday}
            onClose={() => select(null)}
            onPlayback={() => openPlayback(selected.d)}
            onCommand={() => openModal("command", selected.d)}
            detailsOpen={!!details}
            onToggleDetails={() => setDetails(details ? null : "today")}
            details={
              details && (
                <FocusDetails
                  tab={details}
                  onTab={setDetails}
                  d={selected.d}
                  pts={track.pts}
                  loaded={track.loaded}
                  limit={limitKmh}
                  onOpenPlayback={() => openPlayback(selected.d)}
                />
              )
            }
          />
          <CameraBar
            mode={camMode}
            onMode={setCamMode}
            onFitAll={() => {
              setCamModeState("free");
              setFitKey((k) => k + 1);
            }}
            onZoom={zoom}
          />
          <BottomStrip pts={track.pts} loaded={track.loaded} limit={limitKmh} others={others} selectedId={selected.d._id} onPick={(id) => select(id)} />
        </>
      )}

      {/* Fleet pulse */}
      <div className="lm-panel lm-pulse" aria-label="Fleet summary" hidden={!!selected}>
        <div><span className="lm-muted">Online</span><strong>{online}<small> / {devices.length}</small></strong></div>
        <div><span className="lm-muted">Moving</span><strong>{counts.moving}</strong></div>
        <div className="lm-hide-sm"><span className="lm-muted">Not reporting</span><strong>{counts.offline + counts.inactive + counts.not_connected}</strong></div>
        <div style={{ flex: 1 }} />
        {lastAlert ? (
          <div className="lm-alert">
            <i />
            <span>
              <strong>{lastAlert.type ? lastAlert.type.toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "Alert"}</strong>
              {lastAlert.plate ? ` · ${lastAlert.plate}` : ""} · {timeAgo(new Date(lastAlert.at).toISOString())}
            </span>
            <Link className="at-btn at-btn--highlight" to={`${U}${base}/modules/control-room`}>Open</Link>
          </div>
        ) : (
          <span className="lm-muted lm-hide-sm">No new alarms since this page opened</span>
        )}
        <button type="button" className="at-btn" onClick={() => setFitKey((k) => k + 1)}>Fit all</button>
      </div>

      {/* L3 hover card */}
      {hovered && hover && hovered.d._id !== selectedId && (
        <div className="lm-hover" style={{ left: Math.min(hover.rect.right + 12, window.innerWidth - 270), top: Math.max(8, hover.rect.top - 30) }} role="tooltip">
          <div className="lm-hover__top">
            <strong>{plateOf(hovered.d)}</strong>
            <span className="lm-muted">{timeAgo(hovered.d?.latestPosition?.deviceTime)}</span>
          </div>
          <div className="lm-muted">
            {[hovered.d?.vehicle?.customer?.fullName, [hovered.d?.vehicle?.make?.name, hovered.d?.vehicle?.model?.name].filter(Boolean).join(" ")].filter(Boolean).join(" · ") || "—"}
          </div>
          <div className="lm-hover__facts">
            <span><b>{isOnline(hovered.s) ? formatKmh(hovered.d?.latestPosition?.speed) : "—"}</b> km/h</span>
            <span>Ignition {hovered.d?.latestPosition?.attributes?.ignition ? "on" : "off"}</span>
            <span style={{ color: STATUS_INFO[hovered.s].color, fontWeight: 700 }}>{STATUS_INFO[hovered.s].label}</span>
          </div>
        </div>
      )}

      {/* Reused pop-ups */}
      {modal === "playback" && modalDevice && (
        <PlaybackModal isVisible setIsVisible={(v: boolean) => !v && setModal(null)} initialFilter={playbackFilter} />
      )}
      {modal === "customer" && modalDevice && (
        <CustomerDetailsModal isVisible setIsVisible={(v: boolean) => !v && setModal(null)} device={modalDevice} />
      )}
      {modal === "edit" && modalDevice && (
        <EditDeviceModal isOpen toggle={() => setModal(null)} device={modalDevice} onDeviceUpdated={fetchDevices} />
      )}
      {modal === "icons" && modalDevice && (
        <EditDeviceIconsModal isOpen toggle={() => setModal(null)} device={modalDevice} onIconsUpdated={fetchDevices} />
      )}
      {modal === "command" && modalDevice && (
        <SendCommand addModal setAddModal={() => setModal(null)} prevItem={commandItem(modalDevice)} />
      )}
      {modal === "add" && <AddDeviceModal isOpen toggle={() => setModal(null)} onDeviceAdded={fetchDevices} />}
    </div>
  );
};

export default LiveMap;
