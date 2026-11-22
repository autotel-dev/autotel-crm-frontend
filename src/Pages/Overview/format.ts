// Small display helpers shared by the Phase 2 dashboards.

export const fmtNum = (n: number | null | undefined) =>
  typeof n === "number" ? n.toLocaleString("en-US") : "—";

export const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

export const fmtDate = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const fmtShortDate = (d?: string | Date | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";

export const timeAgo = (d?: string | Date | null) => {
  if (!d) return "never";
  const s = Math.max(0, (Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${Math.round(s)} s`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} days`;
};

export const fmtBytes = (b: number) => {
  if (!b) return "—";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  return `${(b / Math.pow(1024, i)).toFixed(i >= 3 ? 2 : 0)} ${u[i]}`;
};

export const fmtUptime = (sec: number) => {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/** "GEOFENCE_EXIT" → "Geofence exit" */
export const humanize = (s?: string | null) =>
  s ? s.toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "—";

export const STATUS_META: Record<string, { label: string; color: string }> = {
  MOVING: { label: "Moving", color: "var(--at-moving)" },
  IDLE: { label: "Idle", color: "var(--at-idle)" },
  STOPPED: { label: "Stopped", color: "var(--at-stopped)" },
  OFFLINE: { label: "Offline", color: "var(--at-offline)" },
  INACTIVE: { label: "Inactive", color: "#94a3b8" },
  EXPIRED: { label: "Expired", color: "#a78bfa" },
  NOT_CONNECTED: { label: "Not connected", color: "#475569" },
};
