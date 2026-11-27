// "Vehicle photo" block for the Add / Edit device pop-ups.
// Shows the vehicle's own photo, else the catalog photo of its model, with
// Add / Change / Remove buttons for the user's own photo.
//  - Edit (vehicleId given): the photo uploads as soon as it is picked.
//  - Add (no vehicle yet): the prepared photo is handed to the parent with
//    onPending and uploaded after the vehicle has been created.
// Photos are resized in the browser first (max 1280 px, plus a 160 px map copy),
// which also strips the phone's location data.
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import VehiclePhoto, { vehiclePhotoUrl } from "./VehiclePhoto";
import { forgetOwnPhoto, loadOwnPhoto, photoFormData, preparePhoto, VEHICLE_PHOTO_URL } from "./vehiclePhotoData";
import { header } from "../../Utilities/headers/header";
import "./vehiclePhoto.scss";

export type PreparedPhoto = { photo: Blob; marker: Blob };

const MAX_PICK = 15 * 1024 * 1024; // phone photos are large; we shrink them before upload

/** Upload a prepared photo for a vehicle. Resolves to the saved fields, or throws with a message. */
export const uploadVehiclePhoto = async (vehicleId: string, p: PreparedPhoto) => {
  try {
    const res = await axios.put(`${VEHICLE_PHOTO_URL}/${encodeURIComponent(vehicleId)}`, photoFormData(p), {
      headers: { Authorization: header().Authorization },
    });
    forgetOwnPhoto(vehicleId);
    return res.data?.data || {};
  } catch (e: any) {
    throw new Error(e?.response?.data?.message || "The photo didn't upload. Try again.");
  }
};

interface Props {
  vehicleId?: string | null;
  /** photoFile / photoUpdatedAt of the saved vehicle (Edit) */
  ownPhoto?: { photoFile?: string | null; photoUpdatedAt?: string | null } | null;
  /** catalog model of the chosen make/model */
  model?: any;
  label?: string;
  disabled?: boolean;
  /** Add mode: the photo waiting to be uploaded after the vehicle is created */
  pending?: PreparedPhoto | null;
  onPending?: (p: PreparedPhoto | null) => void;
  /** Edit mode: called after the photo was saved or removed */
  onSaved?: (fields: { photoFile: string | null; photoUpdatedAt: string | null }) => void;
}

const VehiclePhotoField = ({ vehicleId, ownPhoto, model, label, disabled, pending, onPending, onSaved }: Props) => {
  const [own, setOwn] = useState(ownPhoto || null);
  const [ownUrl, setOwnUrl] = useState<string | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => setOwn(ownPhoto || null), [ownPhoto?.photoFile, ownPhoto?.photoUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load the saved own photo (private: fetched with the login token)
  useEffect(() => {
    let live = true;
    setOwnUrl(null);
    if (vehicleId && own?.photoFile) loadOwnPhoto(vehicleId, "full", own.photoUpdatedAt || null).then((u) => live && setOwnUrl(u));
    return () => { live = false; };
  }, [vehicleId, own?.photoFile, own?.photoUpdatedAt]);

  // Preview of a photo waiting to be uploaded (Add)
  useEffect(() => {
    if (!pending) { setPendingUrl(null); return; }
    const u = URL.createObjectURL(pending.photo);
    setPendingUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [pending]);

  const pick = async (file?: File | null) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) { Swal.fire({ text: "Choose a photo (JPG, PNG or WebP).", icon: "warning" }); return; }
    if (file.size > MAX_PICK) { Swal.fire({ text: "That photo is larger than 15 MB. Choose a smaller one.", icon: "warning" }); return; }
    setBusy(true);
    try {
      const prepared = await preparePhoto(file);
      if (vehicleId) {
        const saved = await uploadVehiclePhoto(vehicleId, prepared);
        const fields = { photoFile: saved.photoFile || "set", photoUpdatedAt: saved.photoUpdatedAt || new Date().toISOString() };
        setOwn(fields);
        onSaved?.(fields);
      } else onPending?.(prepared);
    } catch (e: any) {
      Swal.fire({ text: e?.message || "The photo didn't upload. Try again.", icon: "error" });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const remove = async () => {
    if (!vehicleId) { onPending?.(null); return; }
    setBusy(true);
    try {
      const res = await axios.delete(`${VEHICLE_PHOTO_URL}/${encodeURIComponent(vehicleId)}`, { headers: { Authorization: header().Authorization } });
      forgetOwnPhoto(vehicleId);
      const fields = { photoFile: null, photoUpdatedAt: res.data?.data?.photoUpdatedAt || new Date().toISOString() };
      setOwn(fields);
      onSaved?.(fields);
    } catch (e: any) {
      Swal.fire({ text: e?.response?.data?.message || "The photo wasn't removed. Try again.", icon: "error" });
    } finally {
      setBusy(false);
    }
  };

  const hasOwn = !!(vehicleId ? own?.photoFile : pending);
  const shownOwn = vehicleId ? ownUrl : pendingUrl;
  const name = label || model?.name || "Vehicle";

  return (
    <div className="at-vphoto-field">
      {hasOwn ? (
        <figure className="at-vphoto at-vphoto--card">
          <div className="at-vphoto__frame">
            {shownOwn ? <img src={shownOwn} alt={name} /> : <div className="at-vphoto__empty">Loading photo…</div>}
          </div>
          <figcaption className="at-vphoto__credit">Your photo{vehicleId ? "" : " · uploads when the vehicle is added"}</figcaption>
        </figure>
      ) : vehiclePhotoUrl(model) ? (
        <VehiclePhoto model={model} label={name} />
      ) : null}
      <div className="at-vphoto-field__actions">
        <label className={`btn btn-sm btn-secondary${busy || disabled ? " disabled" : ""}`} aria-disabled={busy || disabled}>
          {busy ? "Saving…" : hasOwn ? "Change photo" : "Add your photo"}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            disabled={busy || disabled}
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>
        {hasOwn && (
          <button type="button" className="btn btn-sm btn-link at-vphoto-field__remove" disabled={busy || disabled} onClick={remove}>
            Remove photo
          </button>
        )}
      </div>
      {!hasOwn && <p className="at-vphoto-field__help">Your own photo shows on the map instead of the catalog one. Only your company can see it.</p>}
    </div>
  );
};

export default VehiclePhotoField;
