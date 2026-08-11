import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Form,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import Swal from "sweetalert2";
import { updateWithMultipart, update } from "../../../../../Utilities/api";
import {
  UPDATE_VEHICLE_ICONS,
  IMAGE_BASE_URL,
} from "../../../../../Utilities/api/apiEndpoints";

interface EditDeviceIconsModalProps {
  isOpen: boolean;
  toggle: () => void;
  device: any;
  onIconsUpdated?: () => void;
}

// The 6 status-icon fields accepted by update-vehicle-icons
const ICON_FIELDS = [
  { field: "vehicleIconMoving", label: "Moving" },
  { field: "vehicleIconStopped", label: "Stopped" },
  { field: "vehicleIconIdle", label: "Idle" },
  { field: "vehicleIconOffline", label: "Offline" },
  { field: "vehicleIconInactive", label: "Inactive" },
  { field: "vehicleIconNotConnected", label: "Not Connected" },
  { field: "vehicleIconExpired", label: "Expired" },
] as const;

// Build a full url for an already-uploaded icon (server stores a relative path
// like "vehicleIcons/xxx.png")
const existingIconUrl = (device: any, field: string): string | null => {
  const url = device?.vehicle?.[field]?.url;
  if (!url) return null;
  return `${IMAGE_BASE_URL}/${url}`.replace(/([^:]\/)\/+/g, "$1");
};

export const EditDeviceIconsModal: React.FC<EditDeviceIconsModalProps> = ({
  isOpen,
  toggle,
  device,
  onIconsUpdated,
}) => {
  // newly selected File per field (null = keep existing)
  const [files, setFiles] = useState<Record<string, File | null>>({});
  // fields whose existing icon the user chose to remove
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  // Reset selections whenever the modal opens for a (possibly) different device
  useEffect(() => {
    if (isOpen) {
      setFiles({});
      setRemoved({});
    }
  }, [isOpen, device?.vehicle?._id]);

  // object URLs for previews of newly picked files (revoked on change/unmount)
  const previews = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(files).forEach(([field, file]) => {
      if (file) map[field] = URL.createObjectURL(file);
    });
    return map;
  }, [files]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previews]);

  const handleFile = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    // Picking a file cancels a pending removal for that field
    if (file) setRemoved((prev) => ({ ...prev, [field]: false }));
  };

  const handleRemove = (field: string) => {
    // Mark existing icon for removal and drop any newly picked file
    setRemoved((prev) => ({ ...prev, [field]: true }));
    setFiles((prev) => ({ ...prev, [field]: null }));
  };

  const handleUndoRemove = (field: string) => {
    setRemoved((prev) => ({ ...prev, [field]: false }));
  };

  const handleClose = () => {
    setFiles({});
    setRemoved({});
    setSaving(false);
    toggle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleId = device?.vehicle?._id;
    if (!vehicleId) {
      Swal.fire({ text: "Vehicle reference is missing.", icon: "error" });
      return;
    }

    const url = UPDATE_VEHICLE_ICONS.replace(":vehicleId", vehicleId);

    // New files → multipart upload. Removals → JSON body so the value is a real
    // null (multipart can only carry strings, not an actual null).
    const uploadFields = ICON_FIELDS.filter(({ field }) => files[field]);
    const removeFields = ICON_FIELDS.filter(
      ({ field }) => !files[field] && removed[field]
    );

    if (uploadFields.length === 0 && removeFields.length === 0) {
      Swal.fire({
        text: "Please select an icon to upload or remove.",
        icon: "warning",
        timer: 4000,
        showConfirmButton: false,
      });
      return;
    }

    setSaving(true);
    try {
      const requests: Promise<any>[] = [];

      if (uploadFields.length > 0) {
        const formData = new FormData();
        uploadFields.forEach(({ field }) => formData.append(field, files[field] as File));
        requests.push(
          updateWithMultipart(formData, { url }) as unknown as Promise<any>
        );
      }

      if (removeFields.length > 0) {
        const body: Record<string, null> = {};
        removeFields.forEach(({ field }) => {
          body[field] = null;
        });
        requests.push(update(body, { url }) as unknown as Promise<any>);
      }

      const results = await Promise.all(requests);
      const failed = results.find((r: any) => !r || !r.success);

      if (!failed) {
        Swal.fire({
          text: "Vehicle icons updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        onIconsUpdated?.();
        handleClose();
      } else {
        Swal.fire({
          text: failed?.message || failed?.description || "Failed to update icons.",
          icon: "error",
        });
      }
    } catch (err: any) {
      console.error("Update icons error:", err);
      Swal.fire({
        text: err?.response?.data?.message || "An error occurred while updating icons.",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" centered backdrop="static">
      <div className="modal-header" style={{ borderBottom: "1px solid #dee2e6" }}>
        <h4 className="modal-title" style={{ color: "#333", fontWeight: "bold" }}>
          Edit Device Icons
          {device?.vehicle?.registrationNo ? ` — ${device.vehicle.registrationNo}` : ""}
        </h4>
        <Button
          color="transparent"
          className="btn-close"
          onClick={handleClose}
          style={{ fontSize: "1.2rem", fontWeight: "bold", opacity: 0.5, border: "none" }}
        ></Button>
      </div>
      <ModalBody style={{ maxHeight: "80vh", overflowY: "auto", padding: "24px" }} className="theme-scrollbar">
        <Form onSubmit={handleSubmit}>
          <Card style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <CardHeader style={{ backgroundColor: "rgba(109, 191, 184, 0.1)", borderBottom: "1px solid rgba(109, 191, 184, 0.2)" }}>
              <h5 className="mb-0" style={{ color: "#6dbfb8", fontWeight: "600" }}>
                Status Icons
              </h5>
              <small style={{ color: "#888" }}>
                Only the icons you replace here will be uploaded; the rest stay unchanged.
              </small>
            </CardHeader>
            <CardBody>
              <Row className="g-3">
                {ICON_FIELDS.map(({ field, label }) => {
                  const isNew = !!files[field];
                  const isRemoved = !!removed[field];
                  const existing = existingIconUrl(device, field);
                  // What to show in the preview box
                  const preview = isRemoved ? null : previews[field] || existing;
                  const hasExisting = !!existing;
                  return (
                    <Col md={3} sm={6} key={field} className="mb-3">
                      <div className="p-2 border rounded text-center" style={{ backgroundColor: "#fbfcfc", height: "100%" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "8px" }}>
                          {label}
                        </span>

                        <div
                          className="d-flex align-items-center justify-content-center mb-2"
                          style={{ height: "84px", background: "#fff", border: "1px solid #eee", borderRadius: "6px", overflow: "hidden" }}
                        >
                          {preview ? (
                            <img
                              src={preview}
                              alt={label}
                              style={{ maxHeight: "78px", maxWidth: "100%", objectFit: "contain" }}
                            />
                          ) : (
                            <span style={{ fontSize: "11px", color: isRemoved ? "#d9534f" : "#bbb" }}>
                              {isRemoved ? "Will be removed" : "No icon"}
                            </span>
                          )}
                        </div>

                        {isNew && (
                          <div className="text-success mb-1" style={{ fontSize: "10px", fontWeight: "bold" }}>
                            New selected
                          </div>
                        )}

                        <FormGroup className="mb-0">
                          {isRemoved ? (
                            <Button
                              color="link"
                              size="sm"
                              className="p-0 text-secondary"
                              style={{ fontSize: "11px" }}
                              onClick={() => handleUndoRemove(field)}
                            >
                              Undo remove
                            </Button>
                          ) : (
                            <>
                              <Label
                                className="btn btn-sm w-100"
                                style={{ backgroundColor: "#6dbfb8", color: "white", fontSize: "11px", marginBottom: 0, cursor: "pointer" }}
                              >
                                {preview ? "Replace" : "Upload"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    const f = e.target.files;
                                    if (f && f.length > 0) handleFile(field, f[0]);
                                    e.target.value = ""; // allow re-selecting same file
                                  }}
                                />
                              </Label>
                              {isNew && (
                                <Button
                                  color="link"
                                  size="sm"
                                  className="p-0 mt-1 text-danger d-block w-100"
                                  style={{ fontSize: "10px" }}
                                  onClick={() => handleFile(field, null)}
                                >
                                  Undo
                                </Button>
                              )}
                              {/* Remove is only offered when an icon already exists on the server */}
                              {hasExisting && !isNew && (
                                <Button
                                  color="link"
                                  size="sm"
                                  className="p-0 mt-1 text-danger d-block w-100"
                                  style={{ fontSize: "10px" }}
                                  onClick={() => handleRemove(field)}
                                >
                                  Remove
                                </Button>
                              )}
                            </>
                          )}
                        </FormGroup>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </CardBody>
          </Card>

          <div className="text-end mt-4">
            <Button color="secondary" className="me-2" onClick={handleClose} disabled={saving} style={{ borderRadius: "6px" }}>
              Close
            </Button>
            <Button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: "#6dbfb8", borderColor: "#6dbfb8", color: "white", fontWeight: "600", borderRadius: "6px" }}
            >
              {saving ? "Uploading..." : "Save Icons"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
