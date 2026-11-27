// Photo of a vehicle model from the vehicle catalog.
// The backend fills it weekly from Wikimedia Commons (scripts/syncVehicleCatalog.js);
// a photo a user uploads (customImageUrl) always wins. Most Commons photos are
// CC BY / CC BY-SA, so the author and licence are shown under the photo.
// With no photo, a plain car outline is shown instead.
import { useEffect, useState } from "react";
import { IMAGE_BASE_URL } from "../../Utilities/api/apiEndpoints";
import { hasOwnPhoto, loadOwnPhoto } from "./vehiclePhotoData";
import "./vehiclePhoto.scss";

export interface CatalogModel {
  name?: string;
  imageUrl?: string | null;
  customImageUrl?: string | null;
  imageCredit?: string | null;
  imageLicense?: string | null;
  imagePageUrl?: string | null;
}

/** Full URL of the photo to show for a model, or null. */
export const vehiclePhotoUrl = (m?: CatalogModel | null): string | null => {
  const p = m?.customImageUrl || m?.imageUrl;
  if (!p) return null;
  return /^https?:\/\//.test(p) ? p : `${IMAGE_BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`;
};

interface Props {
  model?: CatalogModel | null;
  /** The vehicle; when it has its own photo, that is shown instead */
  vehicle?: any;
  /** e.g. "Suzuki Mehran"; used for the alt text */
  label?: string;
  /** "card" (16:9, used in panels) or "thumb" (small square, used in lists) */
  variant?: "card" | "thumb";
  className?: string;
}

const VehiclePhoto = ({ model, vehicle, label, variant = "card", className = "" }: Props) => {
  const [ownUrl, setOwnUrl] = useState<string | null>(null);
  const ownId = hasOwnPhoto(vehicle) ? String(vehicle._id) : null;
  const ownVer = vehicle?.photoUpdatedAt || null;
  useEffect(() => {
    let live = true;
    setOwnUrl(null);
    if (ownId) loadOwnPhoto(ownId, variant === "thumb" ? "marker" : "full", ownVer).then((u) => live && setOwnUrl(u));
    return () => { live = false; };
  }, [ownId, ownVer, variant]);
  const url = ownUrl || vehiclePhotoUrl(model);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  const own = !!ownUrl || !!model?.customImageUrl;
  const name = label || model?.name || "Vehicle";
  const show = url && !failed;

  return (
    <figure className={`at-vphoto at-vphoto--${variant} ${className}`}>
      <div className="at-vphoto__frame">
        {show ? (
          <img src={url as string} alt={name} loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <div className="at-vphoto__empty" role="img" aria-label={`${name}: no photo yet`}>
            <svg aria-hidden="true" viewBox="0 0 64 32" width="64" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M4 22v-5l6-2 7-7h22l9 7 10 2v5" />
              <circle cx="16" cy="23" r="4" />
              <circle cx="48" cy="23" r="4" />
              <path d="M20 23h24M4 22h8M52 22h8" />
            </svg>
            {variant === "card" && <span>No photo yet</span>}
          </div>
        )}
      </div>
      {variant === "card" && show && !own && (model?.imageCredit || model?.imageLicense) && (
        <figcaption className="at-vphoto__credit">
          {model?.imagePageUrl ? (
            <a href={model.imagePageUrl} target="_blank" rel="noopener noreferrer">
              Photo: {[model?.imageCredit, model?.imageLicense].filter(Boolean).join(" · ")}
            </a>
          ) : (
            <>Photo: {[model?.imageCredit, model?.imageLicense].filter(Boolean).join(" · ")}</>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default VehiclePhoto;
