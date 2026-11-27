// Vehicle photos for the maps and the device pop-ups.
//
// Which photo a vehicle shows (first match wins):
//   1. the vehicle's own photo (uploaded on Add/Edit device). Private: fetched
//      with the login token from GET /vehicle/photo/:id/:size, kept as a blob URL;
//   2. the model's photo set by the super admin (customMarkerUrl / customImageUrl);
//   3. the catalog photo from the weekly sync (markerUrl / imageUrl);
//   4. nothing: the maps keep drawing the plain car icon.
// Maps use the small "marker" copies (about 160-250 px, 5-25 KB). Each URL is
// fetched once and shared by every vehicle that uses it.
import { API_BASE_URL, IMAGE_BASE_URL } from "../../Utilities/api/apiEndpoints";
import { header } from "../../Utilities/headers/header";

export const VEHICLE_PHOTO_URL = `${API_BASE_URL}/vehicle/photo`;

const abs = (p?: string | null) => (!p ? null : /^https?:\/\//.test(p) ? p : `${IMAGE_BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

/** Public catalog photo for the map marker (small copy when there is one). */
export const catalogMarkerUrl = (m?: any): string | null =>
  abs(m?.customImageUrl ? m?.customMarkerUrl || m?.customImageUrl : m?.markerUrl || m?.imageUrl);

export const hasOwnPhoto = (v?: any) => !!v?.photoFile;

// ---- Private photos (blob URLs, cached per vehicle + size + version) ----
const cache = new Map<string, string | null>();
const waiting = new Map<string, Promise<string | null>>();
let running = 0;
const queue: (() => void)[] = [];
const slot = () => new Promise<void>((res) => { if (running < 4) { running++; res(); } else queue.push(() => { running++; res(); }); });
const release = () => { running--; const next = queue.shift(); if (next) next(); };

const keyOf = (vehicleId: string, size: "full" | "marker", version?: string | null) => `${vehicleId}|${size}|${version || ""}`;

/** Cached blob URL if already loaded; undefined while unknown. */
export const cachedOwnPhoto = (vehicleId: string, size: "full" | "marker", version?: string | null) =>
  cache.get(keyOf(vehicleId, size, version));

export const loadOwnPhoto = (vehicleId: string, size: "full" | "marker", version?: string | null): Promise<string | null> => {
  const key = keyOf(vehicleId, size, version);
  if (cache.has(key)) return Promise.resolve(cache.get(key) as string | null);
  if (waiting.has(key)) return waiting.get(key)!;
  const p = (async () => {
    await slot();
    try {
      const res = await fetch(`${VEHICLE_PHOTO_URL}/${encodeURIComponent(vehicleId)}/${size}${version ? `?v=${encodeURIComponent(version)}` : ""}`, {
        headers: { Authorization: header().Authorization },
      });
      const url = res.ok ? URL.createObjectURL(await res.blob()) : null;
      cache.set(key, url);
      return url;
    } catch {
      return null; // not cached: try again next time
    } finally {
      release();
      waiting.delete(key);
    }
  })();
  waiting.set(key, p);
  return p;
};

/** Forget a vehicle's cached photo (after upload or remove). */
export const forgetOwnPhoto = (vehicleId: string) => {
  Array.from(cache.keys()).forEach((k) => {
    if (k.startsWith(`${vehicleId}|`)) {
      const u = cache.get(k);
      if (u) URL.revokeObjectURL(u);
      cache.delete(k);
    }
  });
};

/**
 * Marker photo for a vehicle, right now: a URL, or null (no photo / not loaded
 * yet). When the vehicle's own photo still has to load, onReady runs once it has.
 */
export const markerPhotoFor = (vehicle: any, onReady?: () => void): string | null => {
  if (vehicle?._id && hasOwnPhoto(vehicle)) {
    const v = vehicle.photoUpdatedAt || null;
    const hit = cachedOwnPhoto(vehicle._id, "marker", v);
    if (hit !== undefined) return hit || catalogMarkerUrl(vehicle.model);
    loadOwnPhoto(vehicle._id, "marker", v).then(() => onReady && onReady());
    return catalogMarkerUrl(vehicle.model);
  }
  return catalogMarkerUrl(vehicle?.model);
};

// ---- Resizing in the browser before upload ----
// Re-drawing on a canvas also drops the photo's EXIF data (phone GPS location).
const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a photo we can read.")); };
    img.src = url;
  });

const toBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b && b.type === "image/webp") return resolve(b);
      canvas.toBlob((j) => (j ? resolve(j) : reject(new Error("Could not prepare the photo."))), "image/jpeg", quality);
    }, "image/webp", quality);
  });

/** Two copies of a photo: "photo" (max 1280 px) and "marker" (160 px square, centre crop). */
export const preparePhoto = async (file: File): Promise<{ photo: Blob; marker: Blob }> => {
  const img = await loadImage(file);
  const w = img.naturalWidth, h = img.naturalHeight;
  if (!w || !h) throw new Error("That file isn't a photo we can read.");
  const big = document.createElement("canvas");
  const k = Math.min(1, 1280 / Math.max(w, h));
  big.width = Math.round(w * k);
  big.height = Math.round(h * k);
  big.getContext("2d")!.drawImage(img, 0, 0, big.width, big.height);
  const small = document.createElement("canvas");
  small.width = small.height = 160;
  const side = Math.min(w, h);
  small.getContext("2d")!.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, 160, 160);
  return { photo: await toBlob(big, 0.82), marker: await toBlob(small, 0.8) };
};

export const photoFormData = (p: { photo: Blob; marker: Blob }, photoField = "photo") => {
  const ext = (b: Blob) => (b.type === "image/webp" ? "webp" : "jpg");
  const fd = new FormData();
  fd.append(photoField, p.photo, `photo.${ext(p.photo)}`);
  fd.append("marker", p.marker, `marker.${ext(p.marker)}`);
  return fd;
};

// ---- Map marker (design A): round photo, status ring, heading arrow ----
const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** HTML for a photo marker of the given size, centred on the vehicle's position. */
export const photoMarkerHtml = (src: string, color: string, heading: number, size: number) => {
  const ring = 3;
  return (
    `<span class="at-pmk" style="position:absolute;inset:0;border-radius:50%;background:#fff;border:${ring}px solid ${color};box-sizing:border-box;box-shadow:0 2px 6px rgba(0,0,0,.28);overflow:hidden">` +
    `<img src="${escAttr(src)}" alt="" draggable="false" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none"/></span>` +
    `<span class="at-pmk__dir" style="position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(${Math.round(heading) || 0}deg)">` +
    `<span style="position:absolute;left:-7px;top:${-(size / 2) - 10}px;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:10px solid ${color};filter:drop-shadow(0 0 1px #fff)"></span></span>`
  );
};
