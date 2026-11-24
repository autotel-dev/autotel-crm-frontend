// Traccar reports speed in knots. Live screens read latestPosition.speed
// straight from Traccar, so convert before showing km/h.
// (History / Playback API already returns km/h; don't convert that.)
export const KNOTS_TO_KMH = 1.852;

export const knotsToKmh = (knots: unknown): number => {
  const n = Number(knots);
  return Number.isFinite(n) && n > 0 ? n * KNOTS_TO_KMH : 0;
};

/** km/h as text, e.g. formatKmh(54) -> "100". */
export const formatKmh = (knots: unknown, digits = 0): string =>
  knotsToKmh(knots).toFixed(digits);
