// Live Monitoring (redesign Phase 3, design "C1/C4 · Map-first · Live").
// Full-screen map with floating panels: filters on top, vehicle list on the
// left, the selected vehicle on the right, fleet pulse at the bottom.
// Data and the existing pop-ups (edit device, icons, customer, playback,
// send command, add device) are reused from the old page (MonitoringLatest).
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FleetMap from "./FleetMap";
import { useFleet } from "./useFleet";
import { deriveStatus, FleetStatus, isOnline, plateOf, searchText, STATUS_INFO, STATUS_ORDER, timeAgo } from "./fleetStatus";
import { CarMarker } from "../../../../components/ui";
import { getAll, create } from "../../../../Utilities/api";
import { GET_DEVICE_ANALYTICS, GET_SINGLE_VEHICLE_START } from "../../../../Utilities/api/apiEndpoints";
import {
  setAlertsEnabled,
  setDeviceAnalytics,
  setMonitoringSession,
  setSelectedSingleDevice,
  setVehicleHistoryDateRange,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { setInvoiceData, setIsInvoiceRenwed } from "../../../../ReaduxToolkit/Reducer/SalesSlice";
import { getUserRole } from "../../../../Utilities/globals/globals";
import { ROLES } from "../../../../constants/roles";
import PlaybackModal from "../MonitoringLatest/components/SingleVehiceDetail/PlaybackModal/PlaybackModal";
import CustomerDetailsModal from "../MonitoringLatest/components/DevicesSidebar/CustomerDetailsModal";
import { EditDeviceModal } from "../MonitoringLatest/components/EditDeviceModal";
import { EditDeviceIconsModal } from "../MonitoringLatest/components/EditDeviceIconsModal";
import { AddDeviceModal } from "../MonitoringLatest/components/AddDeviceModal";
import SendCommand from "../ControlRoom copy/Analytics/components/SendCommand";
import Analytics from "../MonitoringLatest/components/SingleVehiceDetail/Analytics/Analytics";
import VehicleInfo from "../MonitoringLatest/components/SingleVehiceDetail/VehicleInfo/VehicleInfo";
import DeviceInfo from "../MonitoringLatest/components/SingleVehiceDetail/DeviceInfo/DeviceInfo";
import SensorInfo from "../MonitoringLatest/components/SingleVehiceDetail/SensorInfo/SensorInfo";
import CustomerInfo from "../MonitoringLatest/components/SingleVehiceDetail/CustomerInfo/CustomerInfo";
import "./liveMap.scss";

const U = process.env.PUBLIC_URL || "";
const DETAIL_TABS = [
  { key: "analytics", label: "Today", C: Analytics },
  { key: "vehicle", label: "Vehicle", C: VehicleInfo },
  { key: "device", label: "Device", C: DeviceInfo },
  { key: "sensors", label: "Sensors", C: SensorInfo },
  { key: "customer", label: "Customer", C: CustomerInfo },
];

const markerStatus = (s: FleetStatus) =>
  s === "moving" ? "moving" : s === "idle" ? "idle" : s === "stopped" ? "stopped" : "offline";

const LiveMap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = getUserRole();
  const isCompany = role === ROLES.COMPANY;
  const base = role === ROLES.OPERATOR ? "/operator" : "/company";
  const { userData } = useSelector((state: any) => state.user);
  const { alertsEnabled, deviceAnalytics } = useSelector((state: any) => state.monitoring);
  const { devices, loading, failed, fetchDevices, lastAlert } = useFleet();
  const limit = userData?.inactiveTimeLimit || 1440;

  const [status, setStatus] = useState<FleetStatus | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [follow, setFollow] = useState(false);
  const [hover, setHover] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [fitKey, setFitKey] = useState(0);
  const [details, setDetails] = useState<string | null>(null);
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

  // Map items: visible vehicles that have a position
  const items = useMemo(
    () =>
      visible
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
    [visible]
  );

  const selected = useMemo(() => rows.find((r) => r.d._id === selectedId) || null, [rows, selectedId]);
  const hovered = useMemo(() => (hover ? rows.find((r) => r.d._id === hover.id) || null : null), [rows, hover]);

  // Keep the shared "selected vehicle" (used by the reused tabs and pop-ups) live
  useEffect(() => {
    if (selected) dispatch(setSelectedSingleDevice(selected.d));
  }, [selected, dispatch]);

  const select = async (id: string | null) => {
    setSelectedId(id);
    setFollow(false);
    setDetails(null);
    setHover(null);
    if (!id) return;
    const d = devices.find((x) => x._id === id);
    if (d) dispatch(setSelectedSingleDevice(d));
    try {
      const res: any = await getAll({ url: `${GET_DEVICE_ANALYTICS}?vehicleId=${id}` });
      dispatch(setDeviceAnalytics(res?.success && res?.data ? res.data : null));
    } catch (e) {
      dispatch(setDeviceAnalytics(null));
    }
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

  const pos = selected?.d?.latestPosition;
  const ign = pos?.attributes?.ignition;
  const speed = Math.round(Number(pos?.speed) || 0);
  const DetailComp = DETAIL_TABS.find((t) => t.key === details)?.C;

  return (
    <div className="lm-root">
      <FleetMap
        items={items}
        selectedId={selectedId}
        follow={follow}
        fitKey={fitKey}
        onSelect={(id: string) => select(id)}
        onHover={(id: string | null, rect?: DOMRect) => setHover(id && rect ? { id, rect } : null)}
      />

      {/* Top bar: search + status chips */}
      <div className="lm-panel lm-top">
        <label htmlFor="lm-search" className="visually-hidden">Search vehicles</label>
        <input
          id="lm-search"
          className="lm-search"
          placeholder="Search plate, IMEI, customer, make…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="lm-chips" role="group" aria-label="Filter by status">
          <button type="button" className={`lm-chip${!status ? " is-on" : ""}`} onClick={() => setStatus(null)}>
            All <b>{devices.length}</b>
          </button>
          {STATUS_ORDER.map((s) =>
            counts[s] ? (
              <button key={s} type="button" className={`lm-chip${status === s ? " is-on" : ""}`} onClick={() => setStatus(status === s ? null : s)}>
                <i style={{ background: STATUS_INFO[s].color }} />
                {STATUS_INFO[s].label} <b>{counts[s]}</b>
              </button>
            ) : null
          )}
        </div>
        <div className="lm-top__end">
          <button type="button" className={`lm-toggle${alertsEnabled ? " is-on" : ""}`} aria-pressed={alertsEnabled} onClick={() => dispatch(setAlertsEnabled(!alertsEnabled))}>
            Alert pop-ups {alertsEnabled ? "on" : "off"}
          </button>
          {isCompany && (
            <button type="button" className="at-btn at-btn--primary" onClick={() => openModal("add", null)}>
              + Add device
            </button>
          )}
        </div>
      </div>

      {/* Vehicle list */}
      <section className={`lm-panel lm-list${listOpen ? "" : " is-closed"}`} aria-label="Vehicles">
        <div className="lm-list__head">
          <strong>Vehicles</strong>
          <span className="lm-muted">{visible.length === devices.length ? devices.length : `${visible.length} of ${devices.length}`}</span>
          <button type="button" className="lm-icon-btn" aria-label={listOpen ? "Hide list" : "Show list"} onClick={() => setListOpen(!listOpen)}>
            {listOpen ? "‹" : "›"}
          </button>
        </div>
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
                          <CarMarker status={markerStatus(s)} size={13} heading={Number(d?.latestPosition?.course) || 0} />
                        </span>
                        <span className="lm-row__text">
                          <strong>{plateOf(d)}</strong>
                          <span className="lm-muted">
                            {STATUS_INFO[s].label} · {timeAgo(d?.latestPosition?.deviceTime)}
                          </span>
                        </span>
                        <span className="lm-row__speed">{isOnline(s) ? `${Math.round(Number(d?.latestPosition?.speed) || 0)}` : "—"}</span>
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

      {/* Selected vehicle */}
      {selected && (
        <article className="lm-panel lm-card" aria-label={`Vehicle ${plateOf(selected.d)}`}>
          <div className="lm-card__head">
            <div style={{ minWidth: 0 }}>
              <div className="lm-card__plate">{plateOf(selected.d)}</div>
              <div className="lm-muted">
                {[selected.d?.vehicle?.make?.name, selected.d?.vehicle?.model?.name].filter(Boolean).join(" ") || "—"}
                {selected.d?.vehicle?.customer?.fullName ? ` · ${selected.d.vehicle.customer.fullName}` : ""}
              </div>
            </div>
            <span className="lm-status" style={{ background: `${STATUS_INFO[selected.s].hex}26`, color: STATUS_INFO[selected.s].color }}>
              {STATUS_INFO[selected.s].label}
            </span>
            <button type="button" className="lm-icon-btn" aria-label="Close vehicle panel" onClick={() => select(null)}>
              ✕
            </button>
          </div>
          <div className="lm-speed">
            <span>{isOnline(selected.s) ? speed : "—"}</span> <small>km/h</small>
          </div>
          <div className="lm-facts">
            <div><span className="lm-muted">Ignition</span><strong>{ign === true ? "On" : ign === false ? "Off" : "—"}</strong></div>
            <div><span className="lm-muted">Today</span><strong>{deviceAnalytics?.distanceForDay || "—"}</strong></div>
            <div><span className="lm-muted">Satellites</span><strong>{pos?.attributes?.sat ?? "—"}</strong></div>
          </div>
          <div className="lm-muted" style={{ fontSize: 13 }}>
            {address || (pos?.latitude ? `${Number(pos.latitude).toFixed(5)}, ${Number(pos.longitude).toFixed(5)}` : "No position yet")}
            {" · "}updated {timeAgo(pos?.deviceTime)}
          </div>
          <div className="lm-actions">
            <button type="button" className="at-btn at-btn--primary" onClick={() => openModal("playback", selected.d, "Today")}>Playback</button>
            <button type="button" className={`at-btn${follow ? " at-btn--highlight" : ""}`} aria-pressed={follow} onClick={() => setFollow(!follow)}>
              {follow ? "Following" : "Follow"}
            </button>
            <button type="button" className="at-btn" onClick={() => openModal("command", selected.d)}>Send command</button>
            <button type="button" className="at-btn" aria-expanded={!!details} onClick={() => setDetails(details ? null : "analytics")}>
              {details ? "Hide details" : "More details"}
            </button>
          </div>
          {details && (
            <div className="lm-details">
              <div className="lm-tabs" role="tablist">
                {DETAIL_TABS.map((t) => (
                  <button key={t.key} type="button" role="tab" aria-selected={details === t.key} className={`lm-tab${details === t.key ? " is-on" : ""}`} onClick={() => setDetails(t.key)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="lm-details__body">{DetailComp && <DetailComp />}</div>
            </div>
          )}
        </article>
      )}

      {/* Fleet pulse */}
      <div className="lm-panel lm-pulse" aria-label="Fleet summary">
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
            <span><b>{isOnline(hovered.s) ? Math.round(Number(hovered.d?.latestPosition?.speed) || 0) : "—"}</b> km/h</span>
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
