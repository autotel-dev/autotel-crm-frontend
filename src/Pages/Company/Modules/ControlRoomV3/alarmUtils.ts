// Control Room helpers: alert labels, priorities, response playbooks, time formatting.
import { useEffect, useState } from "react";

export type Priority = 1 | 2 | 3 | 4;

export const PRIORITY_INFO: Record<Priority, { label: string; short: string }> = {
  1: { label: "Critical", short: "P1" },
  2: { label: "High", short: "P2" },
  3: { label: "Medium", short: "P3" },
  4: { label: "Low", short: "P4" },
};

const TYPE_LABELS: Record<string, string> = {
  POWER_CUT: "Power cut / tamper",
  POWER_RESTORE: "Power restored",
  TAMPER: "Tamper",
  SOS: "Panic button",
  GEOFENCE_EXIT: "Geofence exit",
  GEOFENCE_ENTER: "Geofence entry",
  OVER_SPEEDING: "Over-speed",
  IGNITION_ON: "Ignition on",
  IGNITION_OFF: "Ignition off",
  OVERSTAY_ALERT: "Overstay",
  LATE_ARRIVAL: "Late arrival",
  LATE_DEPARTURE: "Late departure",
  EARLY_ARRIVAL: "Early arrival",
  EARLY_DEPARTURE: "Early departure",
  STOP_ARRIVAL: "Stop reached",
  STOP_DEPARTURE: "Left stop",
  TRIP_COMPLETED: "Trip completed",
};

export const typeLabel = (t?: string) =>
  (t && TYPE_LABELS[t]) || String(t || "Alert").toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Text inside [brackets] in an alert message (the rule's own name), if any. */
export const ruleName = (msg?: string) => {
  const m = /\[([^\]]+)\]/.exec(msg || "");
  return m ? m[1] : "";
};
export const cleanMessage = (msg?: string) => String(msg || "").replace(/\s*\[[^\]]*\]\s*/g, " ").trim();

export type StepAction = "call_customer" | "call_emergency" | "share_location" | "engine_cut";
export interface PlaybookStep {
  key: string;
  label: string;
  hint?: string;
  action?: StepAction;
}

const CRITICAL: PlaybookStep[] = [
  { key: "check_position", label: "Check live position and speed", hint: "Is the vehicle moving? Where is it heading?" },
  { key: "call_customer", label: "Call the customer and confirm the safety code", action: "call_customer" },
  { key: "call_emergency", label: "Call the emergency contact", action: "call_emergency" },
  { key: "police", label: "Inform police (15) and share the location", action: "share_location" },
];

export const PLAYBOOKS: Record<string, PlaybookStep[]> = {
  POWER_CUT: CRITICAL,
  TAMPER: CRITICAL,
  SOS: CRITICAL,
  GEOFENCE_EXIT: [
    { key: "check_route", label: "Check where the vehicle is heading" },
    { key: "call_customer", label: "Call the customer: was this trip expected?", action: "call_customer" },
    { key: "call_emergency", label: "Not expected? Call the emergency contact", action: "call_emergency" },
  ],
  OVER_SPEEDING: [
    { key: "check_speed", label: "Check the speed and the road" },
    { key: "call_customer", label: "Call the driver or customer and warn them", action: "call_customer" },
  ],
};
const DEFAULT_PLAYBOOK: PlaybookStep[] = [
  { key: "review", label: "Review the alert on the map" },
  { key: "call_customer", label: "Contact the customer if needed", action: "call_customer" },
];
export const playbookFor = (type?: string) => (type && PLAYBOOKS[type]) || DEFAULT_PLAYBOOK;

export interface StepLog {
  key: string;
  label?: string;
  status: "DONE" | "SKIPPED" | "NOTE";
  note?: string;
  byName?: string;
  at: string;
}

/** Latest status per playbook step key. */
export const stepState = (steps: StepLog[] = []) => {
  const m: Record<string, StepLog> = {};
  steps.forEach((s) => {
    if (s.status !== "NOTE") m[s.key] = s;
  });
  return m;
};

/** Alarm start time: when the live alert came in. */
export const alarmStart = (a: any): number =>
  new Date(a?.alertTime || a?.createdAt || a?.serverDateAndTime || Date.now()).getTime();

export const fmtClock = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
};

export const fmtAgo = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export const fmtTime = (d?: string | number | Date) =>
  d ? new Date(d).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

/** Ticks every `ms` so timers re-render. */
export const useNow = (ms = 1000) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
};

/** [lat, lng] of an alarm, from GeoJSON (stored as [lng, lat]) or the packet. */
export const alarmLatLng = (a: any): { lat: number; lng: number } | null => {
  const c = a?.location?.coordinates;
  if (Array.isArray(c) && c.length === 2 && Number.isFinite(c[0]) && Number.isFinite(c[1])) {
    return { lat: Number(c[1]), lng: Number(c[0]) };
  }
  const lat = Number(a?.packetData?.latitude);
  const lng = Number(a?.packetData?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && (lat || lng) ? { lat, lng } : null;
};

export const plateOf = (a: any) => a?.vehicle?.registrationNo || a?.deviceName || "Unknown vehicle";
