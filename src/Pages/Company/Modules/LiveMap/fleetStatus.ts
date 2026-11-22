// One place that decides a vehicle's status for the Live Monitoring page.
// Same rules as the old page (MonitoringLatest), applied to the list, chips,
// map and vehicle card alike.

export type FleetStatus =
  | "moving"
  | "idle"
  | "stopped"
  | "offline"
  | "inactive"
  | "not_connected"
  | "expired";

export const STATUS_ORDER: FleetStatus[] = [
  "moving",
  "idle",
  "stopped",
  "offline",
  "inactive",
  "not_connected",
  "expired",
];

export const STATUS_INFO: Record<FleetStatus, { label: string; color: string; hex: string }> = {
  moving: { label: "Moving", color: "var(--at-moving)", hex: "#65A30D" },
  idle: { label: "Idle", color: "var(--at-idle)", hex: "#D97706" },
  stopped: { label: "Stopped", color: "var(--at-stopped)", hex: "#DC2626" },
  offline: { label: "Offline", color: "var(--at-offline)", hex: "#6B7280" },
  inactive: { label: "Inactive", color: "#94a3b8", hex: "#94A3B8" },
  not_connected: { label: "Not connected", color: "#475569", hex: "#475569" },
  expired: { label: "Expired", color: "#a78bfa", hex: "#A78BFA" },
};

/**
 * Priority (as before): expired → not connected → offline (backend says
 * inactive) → inactive (no data for longer than the company's limit) →
 * moving / idle / stopped from the backend status.
 */
export const deriveStatus = (d: any, inactiveLimitMin = 1440, now = Date.now()): FleetStatus => {
  const renewal = d?.vehicle?.serviceRenewalDate ? new Date(d.vehicle.serviceRenewalDate).getTime() : null;
  if (renewal && renewal < now) return "expired";

  const t = d?.latestPosition?.deviceTime ? new Date(d.latestPosition.deviceTime).getTime() : null;
  if (!t) return "not_connected";

  const main = String(d?.mainVehicleStatus || "").toLowerCase();
  if (main === "inactive") return "offline";
  if ((now - t) / 60000 > inactiveLimitMin) return "inactive";

  if (main === "moving") return "moving";
  if (main === "idle") return "idle";
  return "stopped"; // "stopped", "stop" and anything unknown
};

export const isOnline = (s: FleetStatus) => s === "moving" || s === "idle" || s === "stopped";

export const plateOf = (d: any) => d?.vehicle?.registrationNo || d?.vehicle?.imei || "Unnamed vehicle";

export const searchText = (d: any) =>
  [
    d?.vehicle?.registrationNo,
    d?.vehicle?.imei,
    d?.vehicle?.make?.name,
    d?.vehicle?.model?.name,
    d?.vehicle?.chasisNo,
    d?.vehicle?.engineNo,
    d?.vehicle?.customer?.fullName,
    d?.vehicle?.customer?.phoneNo,
    d?.vehicle?.customer?.emailAddress,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const timeAgo = (iso?: string | null) => {
  if (!iso) return "never";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${Math.round(s)} s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
};
