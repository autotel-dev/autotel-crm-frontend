// Stroke icons for the icon rail (24×24, currentColor).
import { ReactElement } from "react";

const S = (children: ReactElement | ReactElement[]) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const ICONS: Record<string, ReactElement> = {
  dashboard: S([
    <rect key="a" x="3" y="3" width="7" height="7" rx="1.5" />,
    <rect key="b" x="14" y="3" width="7" height="7" rx="1.5" />,
    <rect key="c" x="3" y="14" width="7" height="7" rx="1.5" />,
    <rect key="d" x="14" y="14" width="7" height="7" rx="1.5" />,
  ]),
  monitoring: S([
    <path key="a" d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />,
    <circle key="b" cx="12" cy="10" r="2.5" />,
  ]),
  controlRoom: S([<path key="a" d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />, <path key="b" d="M10 21h4" />]),
  complaints: S(<path d="M21 12a8 8 0 0 1-12 7l-5 1 1-4a8 8 0 1 1 16-4z" />),
  trips: S([<circle key="a" cx="6" cy="19" r="2" />, <circle key="b" cx="18" cy="5" r="2" />, <path key="c" d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />]),
  saio: S([<path key="a" d="M3 7h18v13H3z" />, <path key="b" d="M8 7V4h8v3M3 12h18" />]),
  module: S([<path key="a" d="M21 8l-9-5-9 5 9 5 9-5z" />, <path key="b" d="M3 8v8l9 5 9-5V8M12 13v8" />]),
  reports: S(<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />),
  users: S([<circle key="a" cx="9" cy="8" r="3.5" />, <path key="b" d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-5.2-5-5.8" />]),
  support: S([<circle key="a" cx="12" cy="12" r="9" />, <path key="b" d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-1 1.7M12 17h.01" />]),
  companies: S([<path key="a" d="M3 21V7l7-4v18M10 21h11V11l-11-4" />, <path key="b" d="M14 14h3M14 17h3" />]),
  // Sliders, so Setup doesn't look like the sun (theme) button.
  setup: S([
    <path key="a" d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />,
    <circle key="b" cx="16" cy="6" r="2" />,
    <circle key="c" cx="10" cy="12" r="2" />,
    <circle key="d" cx="18" cy="18" r="2" />,
  ]),
  sun: S([
    <circle key="a" cx="12" cy="12" r="4" />,
    <path key="b" d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />,
  ]),
  moon: S(<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />),
};

/** Picks an icon for a CRM module from its route. */
export const moduleIcon = (route: string = ""): string => {
  if (route.includes("monitoring")) return "monitoring";
  if (route.includes("control-room")) return "controlRoom";
  if (route.includes("complaint")) return "complaints";
  if (route.includes("trip")) return "trips";
  if (route.includes("saio")) return "saio";
  return "module";
};
