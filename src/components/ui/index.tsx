// Shared building blocks for the redesign (styles in src/theme/autotel.scss).
import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type Div = HTMLAttributes<HTMLDivElement>;

/** Rounded card. `floating` adds the shadow used for panels over the map. */
export const Panel = ({ floating, className = "", ...rest }: Div & { floating?: boolean }) => (
  <div className={`at-panel${floating ? " at-panel--floating" : ""} ${className}`} {...rest} />
);

type BtnVariant = "default" | "primary" | "highlight" | "danger";
export const AtButton = ({
  variant = "default",
  className = "",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) => (
  <button type={type} className={`at-btn${variant !== "default" ? ` at-btn--${variant}` : ""} ${className}`} {...rest} />
);

export const Pill = ({ className = "", ...rest }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={`at-pill ${className}`} {...rest} />
);

export const Stat = ({ label, value, sub }: { label: ReactNode; value: ReactNode; sub?: ReactNode }) => (
  <div className="at-stat">
    <div className="at-stat__label">{label}</div>
    <div className="at-stat__value">{value}</div>
    {sub && <div className="at-stat__label">{sub}</div>}
  </div>
);

export type VehicleStatus = "moving" | "idle" | "stopped" | "offline";

const STATUS_VAR: Record<VehicleStatus, string> = {
  moving: "var(--at-moving)",
  idle: "var(--at-idle)",
  stopped: "var(--at-stopped)",
  offline: "var(--at-offline)",
};

/**
 * M3 map marker: a car seen from above, turned to its heading (degrees,
 * 0 = north) and coloured by status. Use as SVG markup, or call
 * `carMarkerSvg()` for a data URL when a map library needs an image icon.
 */
export const CarMarker = ({
  status = "moving",
  heading = 0,
  size = 30,
  selected = false,
  title,
}: {
  status?: VehicleStatus;
  heading?: number;
  size?: number;
  selected?: boolean;
  title?: string;
}) => (
  <svg
    width={size}
    height={size * 1.6}
    viewBox="0 0 24 40"
    role={title ? "img" : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : true}
    style={{ overflow: "visible", filter: selected ? "drop-shadow(0 0 6px var(--at-primary))" : undefined }}
  >
    <g transform={`rotate(${heading} 12 20)`}>
      <rect x="3" y="1" width="18" height="38" rx="7" fill={STATUS_VAR[status]} stroke="var(--at-panel)" strokeWidth="1.6" />
      <rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".35" />
      <rect x="6" y="28" width="12" height="5" rx="2" fill="#000" opacity=".28" />
      <rect x="0.5" y="12" width="3" height="3" rx="1" fill={STATUS_VAR[status]} />
      <rect x="20.5" y="12" width="3" height="3" rx="1" fill={STATUS_VAR[status]} />
    </g>
  </svg>
);

const STATUS_HEX: Record<VehicleStatus, string> = {
  moving: "#65A30D",
  idle: "#D97706",
  stopped: "#DC2626",
  offline: "#6B7280",
};

/** Same car as a data-URL SVG, for Google Maps marker icons. */
export const carMarkerSvg = (status: VehicleStatus = "moving", heading = 0): string => {
  const c = STATUS_HEX[status];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-8 0 40 40">` +
    `<g transform="rotate(${heading} 12 20)">` +
    `<rect x="3" y="1" width="18" height="38" rx="7" fill="${c}" stroke="#fff" stroke-width="1.6"/>` +
    `<rect x="6" y="9" width="12" height="7" rx="2" fill="#000" opacity=".35"/>` +
    `<rect x="6" y="28" width="12" height="5" rx="2" fill="#000" opacity=".28"/>` +
    `</g></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
