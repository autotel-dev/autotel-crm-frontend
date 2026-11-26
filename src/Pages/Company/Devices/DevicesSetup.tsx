// Setup · Devices (redesign Phase 6, design "final/Devices" on the canvas).
// Device table with search, status chips and Excel export on the left; the
// selected device's health, warning, commands, recent commands and
// installation details on the right. Add / Edit / Send command reuse the
// existing pop-ups used by Live Monitoring.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAll } from "../../../Utilities/api";
import { GET_COMMANDS_BY_VEHICLE_ID, GET_PARSER_DEVICES } from "../../../Utilities/api/apiEndpoints";
import { setDevices, setSelectedSingleDevice } from "../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { EditDeviceModal } from "../Modules/MonitoringLatest/components/EditDeviceModal";
import { AddDeviceModal } from "../Modules/MonitoringLatest/components/AddDeviceModal";
import SendCommand from "../Modules/ControlRoom copy/Analytics/components/SendCommand";
import { FleetStatus, STATUS_INFO, timeAgo } from "../Modules/LiveMap/fleetStatus";
import { DeviceRow, engineCutOf, fmtDate, healthOf, protocolOf, toRow, warningOf } from "./deviceInfo";
import VehiclePhoto, { vehiclePhotoUrl } from "../../../Component/VehiclePhoto/VehiclePhoto";
import "./devices.scss";

const U = process.env.PUBLIC_URL || "";

const TABS: { label: string; to: string }[] = [
  { label: "Devices", to: "/company/setup/devices" },
  { label: "Customers", to: "/company/setup/customers" },
  { label: "Groups", to: "/company/setup/groups" },
  { label: "Branches", to: "/company/setup/branches" },
  { label: "Users", to: "/company/users" },
  { label: "Alert rules", to: "/company/setup/alert-management" },
  { label: "Geofences", to: "/company/setup/geofence" },
  { label: "Gateways", to: "/company/setup/email-gateway" },
];

type Filter = "all" | "online" | "offline" | "attention";
const FILTERS: { key: Filter; label: string; test: (s: FleetStatus) => boolean }[] = [
  { key: "all", label: "All", test: () => true },
  { key: "online", label: "Online", test: (s) => s === "moving" || s === "idle" || s === "stopped" },
  { key: "offline", label: "Offline", test: (s) => s === "offline" || s === "inactive" },
  { key: "attention", label: "Not connected / expired", test: (s) => s === "not_connected" || s === "expired" },
];

const COMMAND_LABEL: Record<string, string> = { engineStop: "Engine cut", engineResume: "Engine resume", custom: "Custom" };
const COMMAND_TONE: Record<string, string> = { EXECUTED: "good", GATEWAY_ACCEPTED: "good", DISPATCHED: "warn", PENDING: "warn", FAILED: "bad" };
const COMMAND_STATUS_LABEL: Record<string, string> = { PENDING: "pending", DISPATCHED: "sent", GATEWAY_ACCEPTED: "sent to tracker", EXECUTED: "done", FAILED: "failed" };

const CarIcon = ({ color }: { color: string }) => (
  <svg aria-hidden="true" width="12" height="20" viewBox="0 0 24 40">
    <rect x="3" y="1" width="18" height="38" rx="7" fill={color} />
    <rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".35" />
  </svg>
);

const DevicesSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state: any) => state.user);
  const limit = userData?.inactiveTimeLimit || 1440;

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<null | "add" | "edit" | "command">(null);
  const [history, setHistory] = useState<{ loading: boolean; items: any[] }>({ loading: false, items: [] });

  const fetchDevices = useCallback(() => {
    setLoading(true);
    setFailed(false);
    getAll({ url: GET_PARSER_DEVICES })
      .then((res: any) => {
        const data = res?.success && Array.isArray(res.data) ? res.data : [];
        setList(data);
        dispatch(setDevices(data.map((x: any) => ({ ...x, checked: true }))));
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const rows = useMemo(() => list.map((d) => toRow(d, limit)), [list, limit]);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: 0, online: 0, offline: 0, attention: 0 };
    rows.forEach((r) => FILTERS.forEach((f) => { if (f.test(r.s)) c[f.key] += 1; }));
    return c;
  }, [rows]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const test = FILTERS.find((f) => f.key === filter)!.test;
    return rows.filter((r) => test(r.s) && (!q || r.text.includes(q)));
  }, [rows, query, filter]);

  // Keep a selection: the chosen row, else the first visible one.
  const selected: DeviceRow | undefined = useMemo(
    () => rows.find((r) => r.key === selectedKey) || visible[0],
    [rows, visible, selectedKey]
  );

  // Show the top of the side panel when another device is picked.
  const sideRef = useRef<HTMLElement>(null);
  useEffect(() => { sideRef.current?.scrollTo({ top: 0 }); }, [selected?.key]);

  // Recent commands for the selected vehicle.
  const vehicleId = selected?.d?.vehicle?._id;
  useEffect(() => {
    if (!vehicleId) { setHistory({ loading: false, items: [] }); return; }
    let alive = true;
    setHistory({ loading: true, items: [] });
    getAll({ url: `${GET_COMMANDS_BY_VEHICLE_ID}?vehicleId=${vehicleId}&limit=4` })
      .then((res: any) => { if (alive) setHistory({ loading: false, items: res?.data?.commands || [] }); })
      .catch(() => alive && setHistory({ loading: false, items: [] }));
    return () => { alive = false; };
  }, [vehicleId, modal]);

  const toggle = (key: string) => setChecked((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
  const allChecked = visible.length > 0 && visible.every((r) => checked.has(r.key));
  const toggleAll = () => setChecked(allChecked ? new Set() : new Set(visible.map((r) => r.key)));

  const exportExcel = () => {
    const pick = checked.size ? rows.filter((r) => checked.has(r.key)) : visible;
    const content = pick.map((r) => ({
      plate: r.plate,
      imei: r.imei,
      model: r.model,
      customer: r.customer,
      phone: r.d?.vehicle?.customer?.phoneNo || "",
      sim: r.sim,
      status: STATUS_INFO[r.s].label,
      last: r.last ? new Date(r.last).toLocaleString() : "",
      installation: r.d?.vehicle?.installationStatus || "",
      renewal: fmtDate(r.d?.vehicle?.serviceRenewalDate),
    }));
    const sheet = [{
      sheet: "Devices",
      columns: [
        { label: "Vehicle", value: "plate" }, { label: "IMEI", value: "imei" }, { label: "Model", value: "model" },
        { label: "Customer", value: "customer" }, { label: "Customer phone", value: "phone" }, { label: "SIM", value: "sim" },
        { label: "Status", value: "status" }, { label: "Last data", value: "last" },
        { label: "Installation", value: "installation" }, { label: "Renewal", value: "renewal" },
      ],
      content,
    }];
    // The Excel library is large, so it is only downloaded when someone exports.
    import("json-as-xlsx").then(({ default: xlsx }) => xlsx(sheet as any, { fileName: `devices-${new Date().toISOString().slice(0, 10)}` }));
  };

  const openOnMap = (r: DeviceRow) => {
    dispatch(setSelectedSingleDevice(r.d));
    navigate(`${U}/company/modules/monitoring?focus=${encodeURIComponent(String(r.d?.id ?? r.d?._id))}`);
  };
  // The reused pop-ups read the selected device from the store, as on Live Monitoring.
  const open = (kind: "edit" | "command") => {
    if (selected) dispatch(setSelectedSingleDevice(selected.d));
    setModal(kind);
  };
  const commandItem = (d: any) => ({ ...d, id: d?.traccarDeviceId || d?.deviceId, value: d?._id, name: d?.vehicle?.registrationNo });

  return (
    <div className="dv-root">
      <section className="dv-main" aria-label="Devices">
        <header className="dv-head">
          <h1 className="dv-title">Setup</h1>
          <nav className="dv-tabs" aria-label="Setup sections">
            {TABS.map((t) => (
              <Link key={t.to} to={`${U}${t.to}`} className={t.label === "Devices" ? "is-on" : ""} aria-current={t.label === "Devices" ? "page" : undefined}>
                {t.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="dv-tools">
          <label htmlFor="dv-search" className="dv-sr">Search devices</label>
          <input id="dv-search" className="dv-search" type="search" placeholder="Search IMEI, plate, SIM, customer…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="dv-chips" role="group" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" className={`dv-chip${filter === f.key ? " is-on" : ""}`} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label} <span>{counts[f.key]}</span>
              </button>
            ))}
          </div>
          <div className="dv-spacer" />
          <button type="button" className="at-btn" onClick={exportExcel} disabled={!rows.length}>
            {checked.size ? `Export ${checked.size} selected` : "Export Excel"}
          </button>
          <button type="button" className="at-btn at-btn--primary" onClick={() => setModal("add")}>+ Add device</button>
        </div>

        <div className="dv-tablewrap">
          {loading && !list.length ? (
            <div className="dv-empty">Loading devices…</div>
          ) : failed && !list.length ? (
            <div className="dv-empty">Couldn't load devices. <button type="button" className="at-btn" onClick={fetchDevices}>Try again</button></div>
          ) : !visible.length ? (
            <div className="dv-empty">{rows.length ? "No devices match this search or filter." : "No devices yet. Use “Add device” to register one."}</div>
          ) : (
            <table className="dv-table">
              <thead>
                <tr>
                  <th className="dv-c-check"><input type="checkbox" aria-label="Select all shown" checked={allChecked} onChange={toggleAll} /></th>
                  <th>Vehicle</th>
                  <th>IMEI / model</th>
                  <th>Customer</th>
                  <th>SIM</th>
                  <th>Last data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const info = STATUS_INFO[r.s];
                  const isSel = selected?.key === r.key;
                  return (
                    <tr key={r.key} className={isSel ? "is-sel" : ""} onClick={() => setSelectedKey(r.key)} aria-selected={isSel}>
                      <td className="dv-c-check" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" aria-label={`Select ${r.plate}`} checked={checked.has(r.key)} onChange={() => toggle(r.key)} />
                      </td>
                      <td>
                        <button type="button" className="dv-plate" onClick={() => setSelectedKey(r.key)}>
                          <CarIcon color={info.hex} /> <strong>{r.plate}</strong>
                        </button>
                      </td>
                      <td>{r.imei || "—"}<div className="dv-sub">{r.model || "Model not known"}</div></td>
                      <td>{r.customer || <span className="dv-sub">No customer</span>}</td>
                      <td className="dv-mono">{r.sim || <span className="dv-sub">Not reported</span>}</td>
                      <td className="dv-sub dv-nowrap" title={r.last ? new Date(r.last).toLocaleString() : ""}>{r.last ? timeAgo(r.last) : "Never"}</td>
                      <td><span className={`dv-status dv-status--${r.s}`}>{info.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="dv-foot">{visible.length} of {rows.length} devices{checked.size ? ` · ${checked.size} selected` : ""}</div>
      </section>

      <aside className="dv-side" aria-label="Device details" ref={sideRef}>
        {!selected ? (
          <div className="dv-empty">Select a device to see its health and commands.</div>
        ) : (() => {
          const d = selected.d;
          const v = d?.vehicle || {};
          const warn = warningOf(d, selected.s);
          const cut = engineCutOf(d);
          return (
            <>
              {vehiclePhotoUrl(d?.vehicle?.model) && (
                <VehiclePhoto
                  model={d.vehicle.model}
                  label={[d?.vehicle?.make?.name, d?.vehicle?.model?.name].filter(Boolean).join(" ")}
                />
              )}
              <div>
                <div className="dv-eyebrow">DEVICE</div>
                <h2 className="dv-h2">{selected.plate}</h2>
                <div className="dv-sub">{[protocolOf(d) || "Model not known", selected.imei && `IMEI ${selected.imei}`].filter(Boolean).join(" · ")}</div>
                <span className={`dv-status dv-status--${selected.s}`}>{STATUS_INFO[selected.s].label}</span>
                <span className="dv-sub"> · last data {selected.last ? timeAgo(selected.last) : "never"}</span>
              </div>

              <div className="dv-health">
                {healthOf(d).map((h) => (
                  <div key={h.key} className="dv-tile">
                    <div className="dv-tile__k">{h.label}</div>
                    <div className={`dv-tile__v dv-tone--${h.tone}`}>{h.value}</div>
                  </div>
                ))}
              </div>

              {warn && <div className="dv-warn" role="status">{warn}</div>}

              <div className="dv-block">
                <strong>Commands</strong>
                {cut !== null && <span className={`dv-sub dv-tag${cut ? " dv-tone--bad" : ""}`}>engine {cut ? "cut" : "normal"}</span>}
                <div className="dv-cmds">
                  <button type="button" className="at-btn" onClick={() => open("command")}>Send command…</button>
                </div>
                <ul className="dv-history" aria-label="Recent commands">
                  {history.loading ? <li className="dv-sub">Loading recent commands…</li>
                    : !history.items.length ? <li className="dv-sub">No commands sent yet.</li>
                    : history.items.map((c) => (
                      <li key={c._id}>
                        <span>{COMMAND_LABEL[c.commandType] || c.commandType}{c.commandType === "custom" && c.customData ? `: ${c.customData}` : ""}</span>
                        <span className={`dv-tone--${COMMAND_TONE[c.status] || "plain"}`}>{COMMAND_STATUS_LABEL[c.status] || String(c.status || "").toLowerCase()}</span>
                        <span className="dv-sub">{timeAgo(c.createdAt)}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="dv-block">
                <strong>Installation</strong>
                <dl className="dv-dl">
                  <dt>Status</dt><dd>{v.installationStatus ? v.installationStatus.replace(/_/g, " ").toLowerCase() : "—"}</dd>
                  <dt>Installer</dt><dd>{v.installer?.fullName || "—"}</dd>
                  <dt>Added</dt><dd>{fmtDate(v.createdAt) || "—"}</dd>
                  <dt>Renews</dt><dd>{fmtDate(v.serviceRenewalDate) || "—"}</dd>
                  <dt>Group</dt><dd>{v.group?.name || "—"}</dd>
                  <dt>Customer</dt><dd>{v.customer?.fullName ? `${v.customer.fullName}${v.customer.phoneNo ? ` · ${v.customer.phoneNo}` : ""}` : "—"}</dd>
                </dl>
              </div>

              <div className="dv-grow" />
              <div className="dv-actions">
                <button type="button" className="at-btn" onClick={() => open("edit")}>Edit</button>
                <button type="button" className="at-btn at-btn--highlight" onClick={() => openOnMap(selected)}>Open on map</button>
              </div>
            </>
          );
        })()}
      </aside>

      {modal === "add" && <AddDeviceModal isOpen toggle={() => setModal(null)} onDeviceAdded={fetchDevices} />}
      {modal === "edit" && selected && (
        <EditDeviceModal isOpen toggle={() => setModal(null)} device={selected.d} onDeviceUpdated={fetchDevices} />
      )}
      {modal === "command" && selected && (
        <SendCommand addModal setAddModal={() => setModal(null)} prevItem={commandItem(selected.d)} />
      )}
    </div>
  );
};

export default DevicesSetup;
