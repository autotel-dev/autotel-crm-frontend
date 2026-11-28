// Estimated fuel, same formula as the backend's utils/fuelEstimate.js
// (Wialon-style "math consumption", for trackers without fuel sensors):
//   driving litres = km × litres-per-km blended by average driving speed
//                    (city rate at ≤36 km/h, highway rate at ≥80 km/h)
//   idle litres    = idle hours × litres per hour
//   × summer extra (AC), cost = litres × price on that day.
// The backend sends `fuelContext` (profile, price, season factor) with the
// history, so Playback can price a single trip exactly like the reports.

export type FuelProfile = {
  fuelType: string;
  cityKmPerL: number;
  highwayKmPerL: number;
  idleLPerHour: number;
  source?: "vehicle" | "mixed" | "company" | "default";
};
export type FuelContext = { profile: FuelProfile; pricePerLitre: number | null; seasonFactor: number };
export type FuelEstimate = {
  driveLitres: number;
  idleLitres: number;
  litres: number;
  kmPerLitre: number | null;
  cost: number | null;
  idleCost: number | null;
};

export const FUEL_TYPE_LABEL: Record<string, string> = { PETROL: "Petrol", DIESEL: "Diesel", "CNG-OR-LPG": "CNG / LPG" };
export const FUEL_TYPE_OPTIONS = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "CNG-OR-LPG", label: "CNG / LPG" },
];

const CITY_KMH = 36;
const HIGHWAY_KMH = 80;

export const litresPerKm = (avgKmh: number, p: FuelProfile) => {
  const city = 1 / p.cityKmPerL;
  const highway = 1 / p.highwayKmPerL;
  if (!Number.isFinite(avgKmh) || avgKmh <= CITY_KMH) return city;
  if (avgKmh >= HIGHWAY_KMH) return highway;
  return city + (highway - city) * ((avgKmh - CITY_KMH) / (HIGHWAY_KMH - CITY_KMH));
};

export const estimateFuel = (
  { distanceKm = 0, movingMs = 0, idleMs = 0 }: { distanceKm?: number; movingMs?: number; idleMs?: number },
  ctx: FuelContext | null | undefined
): FuelEstimate | null => {
  if (!ctx?.profile) return null;
  const km = Math.max(0, distanceKm || 0);
  const moving = Math.max(0, movingMs || 0);
  const idle = Math.max(0, idleMs || 0);
  const avg = moving > 0 ? km / (moving / 3600000) : NaN;
  const f = ctx.seasonFactor || 1;
  const driveLitres = km * litresPerKm(avg, ctx.profile) * f;
  const idleLitres = (idle / 3600000) * ctx.profile.idleLPerHour * f;
  const litres = driveLitres + idleLitres;
  const price = ctx.pricePerLitre || null;
  return {
    driveLitres,
    idleLitres,
    litres,
    kmPerLitre: litres > 0 && km > 0 ? km / litres : null,
    cost: price ? litres * price : null,
    idleCost: price ? idleLitres * price : null,
  };
};

export const fmtLitres = (l: number | null | undefined) =>
  l === null || l === undefined ? "—" : `${l < 10 ? l.toFixed(1) : Math.round(l).toLocaleString("en-US")} L`;
export const fmtPkr = (v: number | null | undefined) =>
  v === null || v === undefined ? "" : `PKR ${Math.round(v).toLocaleString("en-US")}`;
