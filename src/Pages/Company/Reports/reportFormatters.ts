// Shared formatting + column definitions for the card-style reports.
// Single source of truth used by the View modal, the Excel export and the PDF generator.
// NOTE: no react-pdf / jsPDF imports here on purpose - this stays cheap to load.

export const CARD_REPORT_TYPES = [
  "/get-travel-summary-report",
  "/get-daily-travel-report",
  "/get-event-agent-response-report",
  "/get-vehicle-history-report",
];

export const REPORT_TYPE_TITLES: Record<string, string> = {
  "/get-travel-summary-report": "Travel Summary",
  "/get-daily-travel-report": "Daily Travel Report",
  "/get-event-agent-response-report": "Events Agent Response",
  "/get-vehicle-history-report": "Vehicle History",
};

/**
 * Format an ISO timestamp using its UTC clock components (no client shift) as
 * "DD-MM-YYYY hh:mm:ss AM/PM". Values that are not parseable dates (already-formatted
 * strings such as "10-07-2026" or "N/A") are returned untouched.
 */
export const formatReportDateTime = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return String(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  let hours = d.getUTCHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${pad(hours)}:${pad(
    d.getUTCMinutes()
  )}:${pad(d.getUTCSeconds())} ${ampm}`;
};

/** Build the "start - end (UTC +5)" header range from a "a - b" string or separate values. */
export const formatReportRange = (range?: string, start?: string, end?: string): string => {
  let s = start;
  let e = end;
  if (range && range.includes(" - ")) {
    const [a, b] = range.split(" - ");
    s = a;
    e = b;
  }
  if (!s && !e) return "";
  return `${formatReportDateTime(s)} - ${formatReportDateTime(e)} (UTC +5)`;
};

export const positionAddress = (position: any): string =>
  position?.address || (typeof position === "string" ? position : "N/A");

const val = (v: any): string => (v === null || v === undefined || v === "" ? "N/A" : String(v));

/** Group a flat event list into per-device blocks, preserving order. */
export const groupEventsByDevice = (rows: any[]) => {
  const map = new Map<string, { registrationNo: string; events: any[] }>();
  rows.forEach((r) => {
    const key = r.vehicleId || r.registrationNo || "unknown";
    if (!map.has(key)) map.set(key, { registrationNo: r.registrationNo || "N/A", events: [] });
    map.get(key)!.events.push(r);
  });
  return Array.from(map.values());
};

/** Count occurrences of each distinct event value within a device's events. */
export const eventTotals = (events: any[]): Array<[string, number]> => {
  const m = new Map<string, number>();
  events.forEach((e) => {
    const k = e.event || "N/A";
    m.set(k, (m.get(k) || 0) + 1);
  });
  return Array.from(m.entries());
};

/** A column is a label + a lazy accessor, so rows are only formatted when actually rendered. */
export type ReportCol = { label: string; width: number; get: (row: any) => string };

const TRAVEL_SUMMARY_COLS: ReportCol[] = [
  { label: "Device", width: 160, get: (r) => val(r.deviceLabel || r.registrationNo) },
  { label: "Route Start", width: 150, get: (r) => formatReportDateTime(r.routeStart) },
  { label: "Route End", width: 150, get: (r) => formatReportDateTime(r.routeEnd) },
  { label: "Route Length", width: 90, get: (r) => val(r.routeLength) },
  { label: "Move Duration", width: 100, get: (r) => val(r.moveDuration) },
  { label: "Stop Duration", width: 110, get: (r) => val(r.stopDuration) },
  { label: "Top Speed", width: 80, get: (r) => val(r.topSpeed) },
  { label: "Average Speed", width: 90, get: (r) => val(r.averageSpeed) },
  { label: "Overspeed Count", width: 100, get: (r) => val(r.overspeedCount ?? 0) },
  { label: "Engine Hours", width: 90, get: (r) => val(r.engineHours) },
  { label: "Engine Work", width: 90, get: (r) => val(r.engineWork) },
  { label: "Engine Idle", width: 90, get: (r) => val(r.engineIdle) },
  { label: "Odometer", width: 90, get: (r) => val(r.odometer) },
  // Estimated fuel (backend utils/fuelEstimate.js); N/A for reports made before it
  { label: "Fuel (est.)", width: 80, get: (r) => val(r.fuelLitres) },
  { label: "Idle Fuel", width: 80, get: (r) => val(r.fuelIdleLitres) },
  { label: "Fuel Cost", width: 100, get: (r) => val(r.fuelCost) },
  { label: "km/L", width: 70, get: (r) => val(r.fuelKmPerLitre) },
];

const DAILY_TRAVEL_COLS: ReportCol[] = [
  { label: "Device", width: 160, get: (r) => val(r.__device) },
  { label: "Date", width: 90, get: (r) => val(r.date) },
  { label: "Travel start time", width: 150, get: (r) => formatReportDateTime(r.travelStartTime) },
  { label: "Travel end time", width: 150, get: (r) => formatReportDateTime(r.travelEndTime) },
  { label: "Travel time", width: 110, get: (r) => val(r.travelTime) },
  { label: "Distance travelled", width: 120, get: (r) => val(r.distanceTravelled) },
  { label: "Move duration", width: 110, get: (r) => val(r.moveDuration) },
  { label: "Engine idle", width: 100, get: (r) => val(r.engineIdle) },
  { label: "Fuel (est.)", width: 80, get: (r) => val(r.fuelLitres) },
  { label: "Idle fuel", width: 80, get: (r) => val(r.fuelIdleLitres) },
  { label: "Fuel cost", width: 100, get: (r) => val(r.fuelCost) },
];

// responseTime / agentResponseTime arrive pre-formatted from the API - never re-parse them.
const EVENT_COLS: ReportCol[] = [
  { label: "Device", width: 120, get: (r) => val(r.registrationNo) },
  { label: "Time", width: 150, get: (r) => formatReportDateTime(r.alertGenerationTime) },
  { label: "Event", width: 110, get: (r) => val(r.event) },
  { label: "Position", width: 320, get: (r) => positionAddress(r.position) },
  { label: "Description", width: 220, get: (r) => val(r.description) },
  { label: "Operator", width: 100, get: (r) => val(r.operator) },
  { label: "Response Time", width: 130, get: (r) => val(r.responseTime) },
  { label: "Agent Response Time", width: 120, get: (r) => val(r.agentResponseTime) },
];

const VEHICLE_HISTORY_COLS: ReportCol[] = [
  { label: "Time", width: 150, get: (r) => formatReportDateTime(r.timestamp) },
  { label: "Latitude", width: 110, get: (r) => val(r.latitude) },
  { label: "Longitude", width: 110, get: (r) => val(r.longitude) },
  { label: "Address", width: 300, get: (r) => val(r.address) },
  { label: "Altitude", width: 70, get: (r) => `${r.altitude ?? 0} m` },
  { label: "Speed", width: 70, get: (r) => `${Math.round(Number(r.speed) || 0)} kph` },
  { label: "Course", width: 70, get: (r) => val(r.course) },
  { label: "Ignition", width: 70, get: (r) => (r.ignition ? "on" : "off") },
  { label: "Motion", width: 70, get: (r) => (r.motion ? "on" : "off") },
];

/**
 * Build the flat table for a card report. Rows stay RAW (unformatted) so that huge
 * datasets cost nothing to prepare - callers format only the rows they actually render.
 */
export function getCardTable(type: string, data: any): { columns: ReportCol[]; rows: any[] } {
  const reportData: any[] = Array.isArray(data?.reportData) ? data.reportData : [];
  switch (type) {
    case "/get-travel-summary-report":
      return { columns: TRAVEL_SUMMARY_COLS, rows: reportData };
    case "/get-daily-travel-report": {
      const rows: any[] = [];
      reportData.forEach((v) =>
        (v.dailyData || []).forEach((d: any) =>
          rows.push({ ...d, __device: v.deviceLabel || v.registrationNo })
        )
      );
      return { columns: DAILY_TRAVEL_COLS, rows };
    }
    case "/get-event-agent-response-report":
      return { columns: EVENT_COLS, rows: reportData };
    case "/get-vehicle-history-report":
      return { columns: VEHICLE_HISTORY_COLS, rows: reportData };
    default:
      return { columns: [], rows: [] };
  }
}

/** Column sets used by the PDF card layouts (Device is shown in the card header instead). */
export const EVENT_PDF_COLS = EVENT_COLS.filter((c) => c.label !== "Device");
export const DAILY_TRAVEL_PDF_COLS = DAILY_TRAVEL_COLS.filter((c) => c.label !== "Device");
export const VEHICLE_HISTORY_PDF_COLS = VEHICLE_HISTORY_COLS;
