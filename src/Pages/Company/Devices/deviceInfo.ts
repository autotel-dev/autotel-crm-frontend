// Setup · Devices (redesign Phase 6): turns one device from
// GET /company/get-parser-devices into what the table and the side panel show.
// Status uses the same rules as Live Monitoring (LiveMap/fleetStatus.ts).

import { deriveStatus, FleetStatus, plateOf, searchText, timeAgo } from "../Modules/LiveMap/fleetStatus";

export type Tone = "good" | "bad" | "warn" | "plain";
export interface HealthItem { key: string; label: string; value: string; tone: Tone }

const attrs = (d: any) => d?.latestPosition?.attributes || {};

/** Tracker protocol as a readable model name. */
const PROTOCOLS: Record<string, string> = { gt06: "Concox GT06", upro: "UPRO", xexun2: "Xexun", teltonika: "Teltonika" };
export const protocolOf = (d: any) => {
  const p = String(d?.latestPosition?.protocol || "").toLowerCase();
  return p ? PROTOCOLS[p] || p.toUpperCase() : "";
};

export const imeiOf = (d: any) => d?.vehicle?.imei || d?.uniqueId || "";

/** SIM: ICCID the tracker reports, else a SIM card from the vehicle's inventory. */
export const simOf = (d: any) => {
  const iccid = attrs(d).iccid;
  // ICCIDs are often padded with a trailing "F".
  if (iccid) return String(iccid).replace(/f$/i, "");
  const sim = (d?.vehicle?.inventory || []).find((i: any) => /sim/i.test(String(i?.productType || "")));
  return sim?.serialNumber ? String(sim.serialNumber) : "";
};

export const lastDataOf = (d: any): string | null =>
  d?.latestPosition?.deviceTime || d?.latestPosition?.serverTime || d?.lastUpdate || null;

/** GSM level: GT06 trackers send 0–4, others 0–31. */
const gsmLabel = (rssi: any): { value: string; tone: Tone } | null => {
  if (rssi === undefined || rssi === null || rssi === "") return null;
  const n = Number(rssi);
  if (!Number.isFinite(n)) return null;
  const level = n <= 4 ? n : Math.round((Math.min(n, 31) / 31) * 4);
  const names = ["None", "Weak", "Fair", "Good", "Strong"];
  return { value: names[Math.max(0, Math.min(4, level))], tone: level <= 1 ? "bad" : level === 2 ? "warn" : "good" };
};

export const healthOf = (d: any): HealthItem[] => {
  const a = attrs(d);
  const p = d?.latestPosition || {};
  const items: HealthItem[] = [];

  const sats = a.sat !== undefined ? Number(a.sat) : null;
  if (p.valid === false) items.push({ key: "gps", label: "GPS", value: "No fix", tone: "bad" });
  else if (p.latitude !== undefined) items.push({ key: "gps", label: "GPS", value: sats !== null ? `Fix · ${sats} sats` : "Fix", tone: sats !== null && sats < 4 ? "warn" : "good" });
  else items.push({ key: "gps", label: "GPS", value: "No data", tone: "plain" });

  const gsm = gsmLabel(a.rssi);
  items.push({ key: "gsm", label: "GSM signal", value: gsm ? gsm.value : "Not reported", tone: gsm ? gsm.tone : "plain" });

  const level = a.batteryLevel !== undefined ? Number(a.batteryLevel) : null;
  const volts = a.battery !== undefined ? Number(a.battery) : null;
  items.push({
    key: "battery",
    label: "Tracker battery",
    value: level !== null && Number.isFinite(level) ? `${Math.round(level)}%` : volts !== null && Number.isFinite(volts) ? `${volts.toFixed(1)} V` : "Not reported",
    tone: level !== null && level < 20 ? "bad" : level !== null && level < 50 ? "warn" : level !== null ? "good" : "plain",
  });

  const power = a.power !== undefined ? Number(a.power) : null;
  if (a.charge !== undefined) items.push({ key: "power", label: "External power", value: a.charge ? "Connected" : "Disconnected", tone: a.charge ? "good" : "bad" });
  else if (power !== null && Number.isFinite(power)) items.push({ key: "power", label: "External power", value: `${power.toFixed(1)} V`, tone: power < 9 ? "bad" : "good" });
  else items.push({ key: "power", label: "External power", value: "Not reported", tone: "plain" });

  return items;
};

/** Engine cut state when the tracker reports it. */
export const engineCutOf = (d: any): boolean | null => {
  const b = attrs(d).blocked;
  return b === undefined ? null : Boolean(b);
};

/** A short warning for the side panel, or null when the device looks fine. */
export const warningOf = (d: any, s: FleetStatus): string | null => {
  const last = lastDataOf(d);
  if (s === "expired") return "Service package has expired. Renew it to keep tracking.";
  if (s === "not_connected") return "This tracker has never sent data. Check the installation, SIM and server settings.";
  if (s === "offline" || s === "inactive") return `No data since ${timeAgo(last)}. Check power, SIM balance and GSM coverage.`;
  if (d?.vehicle?.installationStatus && d.vehicle.installationStatus !== "INSTALLED") return "Installation is not marked as finished.";
  return null;
};

/** "Honda Civic"; skips the make when the model name already includes it ("Peugeot" + "Peugeot"). */
const makeModelOf = (d: any) => {
  const make = String(d?.vehicle?.make?.name || "").trim();
  const model = String(d?.vehicle?.model?.name || "").trim();
  if (make && model.toLowerCase().startsWith(make.toLowerCase())) return model;
  return [make, model].filter(Boolean).join(" ");
};

export interface DeviceRow {
  d: any;
  key: string;
  s: FleetStatus;
  plate: string;
  imei: string;
  model: string;
  customer: string;
  sim: string;
  last: string | null;
  text: string;
}

export const toRow = (d: any, limit: number): DeviceRow => {
  const sim = simOf(d);
  return {
    d,
    key: String(d?._id || d?.id || imeiOf(d)),
    s: deriveStatus(d, limit),
    plate: plateOf(d),
    imei: imeiOf(d),
    model: [protocolOf(d), makeModelOf(d)].filter(Boolean).join(" · "),
    customer: d?.vehicle?.customer?.fullName || "",
    sim,
    last: lastDataOf(d),
    text: `${searchText(d)} ${sim} ${d?.uniqueId || ""}`.toLowerCase(),
  };
};

export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";
