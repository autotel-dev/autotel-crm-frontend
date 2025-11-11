import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../../utils/Constant";
import { H4, P } from "../../../../AbstractElements";
import { useState, useMemo, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { Select } from "antd";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import "./styles.css";
import { create, getAll } from "../../../../Utilities/api";
import {
  CREATE_ALERT_RULE,
  GET_ALERT_RULES,
  GET_ALL_GEOFENCES,
  GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT,
} from "../../../../Utilities/api/apiEndpoints";

import Swal from "sweetalert2";
import {
  setAlertRules,
  setAlertRuleStart,
  setFilterAlertRules,
  setInActiveActiveAlertRules,
} from "../../../../ReaduxToolkit/Reducer/AlertRuleSlice";

interface AlertsModalProps {
  isVisible: any;
  setIsVisible: any;
}

interface Device {
  _id: string;
  registrationNo: string;
  engineNo: string;
  imei: string;
  geofences?: string[];
  group?: {
    _id: string;
    name: string;
  };
}

interface Geofence {
  _id: string;
  title: string;
  geofenceId: string;
  type: string;
  user: string;
  geofencePositions: any;
  createdBySuperAdmin: boolean;
  isActive: boolean;
  geofenceGroup?: {
    _id: string;
    title: string;
    isActive: boolean;
  } | null;
  geofenceSubGroup?: {
    _id: string;
    title: string;
    isActive: boolean;
  } | null;
  geofenceCounter: number;
}

interface AlertFormData {
  name: string;
}

const AlertsModal: React.FC<AlertsModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlertFormData>();

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [thresholdValue, setThresholdValue] = useState<number | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [devicesData, setDevicesData] = useState<Device[]>([]);
  const [geofencesData, setGeofencesData] = useState<Geofence[]>([]);
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(
    null
  );
  const [autoCheckedDevices, setAutoCheckedDevices] = useState<string[]>([]);

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      resetForm();
    }
  };

  const resetForm = () => {
    reset();
    setType("");
    setThresholdValue(null);
    setSelectedDevices([]);
    setSearchTerm("");
    setSelectedGeofence(null);
    setAutoCheckedDevices([]);
  };

  // Fetch devices data
  useEffect(() => {
    getAll({ url: GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          console.log("data", data.data);
          setDevicesData(data.data);
        }
      }
    });
  }, [dispatch]);

  // Fetch geofences data
  useEffect(() => {
    getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          console.log("geofences data", data.data);
          setGeofencesData(data.data);
        }
      }
    });
  }, []);

  // --- GROUPING LOGIC ---
  const groupedDevices = useMemo(() => {
    if (!devicesData || devicesData.length === 0) return {};
    return devicesData.reduce((groups: any, device: Device) => {
      const groupName = device.group?.name || "Ungrouped";
      const groupId = device.group?._id || "ungrouped";
      if (!groups[groupId]) {
        groups[groupId] = { name: groupName, devices: [] };
      }
      groups[groupId].devices.push(device);
      return groups;
    }, {});
  }, [devicesData]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Expand all by default
    setExpandedGroups(new Set(Object.keys(groupedDevices)));
  }, [groupedDevices]);

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) newExpanded.delete(groupId);
    else newExpanded.add(groupId);
    setExpandedGroups(newExpanded);
  };

  const isGroupFullyChecked = (groupId: string) => {
    const group = groupedDevices[groupId]?.devices || [];
    return (
      group.length > 0 &&
      group.every((d: Device) => selectedDevices.includes(d._id))
    );
  };

  const isGroupPartiallyChecked = (groupId: string) => {
    const group = groupedDevices[groupId]?.devices || [];
    const count = group.filter((d: Device) =>
      selectedDevices.includes(d._id)
    ).length;
    return count > 0 && count < group.length;
  };

  const handleGroupCheckboxClick = (groupId: string, checked: boolean) => {
    const group = groupedDevices[groupId]?.devices || [];
    // Only include devices that are not auto-checked (not already linked to geofence)
    const deviceIds = group
      .filter((d: Device) => !autoCheckedDevices.includes(d._id))
      .map((d: Device) => d._id);
    setSelectedDevices((prev) => {
      if (checked) {
        // add all from group
        return Array.from(new Set([...prev, ...deviceIds]));
      } else {
        // remove all from group
        return prev.filter((id) => !deviceIds.includes(id));
      }
    });
  };

  const handleDeviceToggle = (deviceId: string) => {
    // Don't allow toggling if device is auto-checked (already has the geofence)
    if (autoCheckedDevices.includes(deviceId)) return;

    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((d) => d !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAll = () => {
    const allDeviceIds = devicesData.map((d: Device) => d._id);
    setSelectedDevices(allDeviceIds);
  };

  const handleDeselectAll = () => {
    // Keep only auto-checked devices when deselecting all
    setSelectedDevices(autoCheckedDevices);
  };

  // Function to chunk array into groups of 4 for grid layout
  const chunkArray = (array: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  // Check if threshold field should be shown
  const shouldShowThreshold = () => {
    return ["OVER_SPEEDING", "POWER_CUT", "POWER_RESTORE"].includes(type);
  };

  // Check if geofence dropdown should be shown
  const shouldShowGeofence = () => {
    return ["GEOFENCE_ENTER", "GEOFENCE_EXIT"].includes(type);
  };

  // Get threshold placeholder based on type
  const getThresholdPlaceholder = () => {
    switch (type) {
      case "OVER_SPEEDING":
        return "Enter speed threshold (kph)";
      case "POWER_CUT":
      case "POWER_RESTORE":
        return "Enter power threshold";
      default:
        return "Enter threshold value";
    }
  };

  // Get threshold label based on type
  const getThresholdLabel = () => {
    switch (type) {
      case "OVER_SPEEDING":
        return "Speed Threshold (kph)";
      case "POWER_CUT":
      case "POWER_RESTORE":
        return "Power Threshold";
      default:
        return "Threshold Value";
    }
  };

  // Build payload based on alert type
  const buildPayload = (formData: AlertFormData) => {
    const basePayload: any = {
      ruleName: formData.name,
      alertType: type,
      // Filter out auto-checked devices (already linked to geofence)
      vehicleIds: selectedDevices.filter(
        (id) => !autoCheckedDevices.includes(id)
      ),
      threshold: {},
    };

    switch (type) {
      case "IGNITION_ON":
        basePayload.threshold = {
          ignitionThreshold: {
            ignitionValue: true,
          },
        };
        break;

      case "IGNITION_OFF":
        basePayload.threshold = {
          ignitionThreshold: {
            ignitionValue: false,
          },
        };
        break;

      case "OVER_SPEEDING":
        basePayload.threshold = {
          speedThreshold: {
            speedValue: thresholdValue || 0,
          },
        };
        break;

      case "POWER_CUT":
        basePayload.threshold = {
          powerThreshold: {
            powerValue: thresholdValue || 0,
          },
        };
        break;

      case "POWER_RESTORE":
        basePayload.threshold = {
          powerThreshold: {
            powerValue: thresholdValue || 0,
          },
        };
        break;

      case "GEOFENCE_ENTER":
      case "GEOFENCE_EXIT":
        basePayload.threshold = {
          geofenceThreshold: {
            geofenceId: selectedGeofence?._id,
            geofenceData: selectedGeofence,
          },
        };
        break;

      default:
        basePayload.threshold = {};
    }

    return basePayload;
  };

  const addAlertRule: SubmitHandler<AlertFormData> = async (
    formData: AlertFormData
  ) => {
    setLoading(true);

    // Validation
    if (!formData.name || !type) {
      Swal.fire({
        text: "Please fill all required fields ",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    // Check if devices are selected
    if (selectedDevices.length === 0) {
      Swal.fire({
        text: "Please select at least one device",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    // Additional validation for threshold types
    if (shouldShowThreshold() && !thresholdValue) {
      Swal.fire({
        text: `Please enter ${getThresholdLabel().toLowerCase()}`,
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    // Additional validation for geofence types
    if (shouldShowGeofence() && !selectedGeofence) {
      Swal.fire({
        text: "Please select a geofence",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    try {
      const payload = buildPayload(formData);
      console.log("Sending payload:", payload); // Debug log

      await create(payload, { url: CREATE_ALERT_RULE }).then(
        (response: any) => {
          if (response !== undefined) {
            if (!response.success) {
              Swal.fire({
                text: response.message || "Failed to create alert rule",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
            } else {
              Swal.fire({
                text: "Alert rule created successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
              // Reset form and close modal on success
              resetForm();

              dispatch(setAlertRuleStart());
              getAll({ url: GET_ALERT_RULES }).then((data: any) => {
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActiveAlertRules("All"));
                  dispatch(setAlertRules([]));
                  dispatch(setFilterAlertRules([]));
                  return;
                }

                if (data !== undefined) {
                  if (data.success) {
                    dispatch(setAlertRules(data.data));
                    dispatch(setFilterAlertRules(data.data));
                  }
                }
              });
              setIsVisible(false);
            }
          }
        }
      );
    } catch (error: any) {
      console.error("Error creating alert rule:", error);
      Swal.fire({
        text: "An error occurred while creating the alert rule",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
      <div className="modal-header">
        <H4 className="modal-title">Create New Alert</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
          disabled={loading}
        ></Button>
      </div>
      <ModalBody>
        <form onSubmit={handleSubmit(addAlertRule)}>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Name *</P>
              <input
                className="form-control"
                type="text"
                {...register("name", { required: true })}
                placeholder="Enter alert rule name"
                disabled={loading}
              />
              {errors.name && (
                <span style={{ color: "red" }}>Alert name is required</span>
              )}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Select Type *</P>
              <Select
                value={type || null}
                style={{ width: "100%", height: 36 }}
                placeholder="Select Alert Type"
                onChange={(value) => {
                  setType(value);
                  setThresholdValue(null); // Reset threshold when type changes
                  setSelectedGeofence(null); // Reset geofence when type changes
                  setAutoCheckedDevices([]); // Reset auto-checked devices
                  setSelectedDevices([]); // Reset selected devices
                }}
                options={[
                  { value: "OVER_SPEEDING", label: "Overspeed (kph)" },
                  { value: "IGNITION_ON", label: "Ignition On" },
                  { value: "IGNITION_OFF", label: "Ignition Off" },
                  { value: "POWER_CUT", label: "Power Cut" },
                  { value: "POWER_RESTORE", label: "Power Restore" },
                  { value: "GEOFENCE_ENTER", label: "Geofence Enter" },
                  { value: "GEOFENCE_EXIT", label: "Geofence Exit" },
                ]}
                disabled={loading}
              />
            </FormGroup>
          </Row>

          {/* Only show threshold input for specific alert types */}
          {shouldShowThreshold() && (
            <Row>
              <FormGroup className="col-md-12 create-group">
                <P>{getThresholdLabel()} *</P>
                <input
                  className="form-control"
                  type="number"
                  step={type === "OVER_SPEEDING" ? "1" : "0.1"}
                  placeholder={getThresholdPlaceholder()}
                  value={thresholdValue || ""}
                  onChange={(e) => setThresholdValue(Number(e.target.value))}
                  disabled={loading}
                  min="0"
                />
              </FormGroup>
            </Row>
          )}

          {/* Show geofence dropdown for geofence alert types */}
          {shouldShowGeofence() && (
            <Row>
              <FormGroup className="col-md-12 create-group">
                <P>Select Geofence *</P>
                <Select
                  value={selectedGeofence?._id || null}
                  style={{ width: "100%", height: 36 }}
                  placeholder="Select a geofence"
                  onChange={(value) => {
                    const geofence = geofencesData.find((g) => g._id === value);
                    setSelectedGeofence(geofence || null);

                    // Auto-check devices that already have this geofence
                    if (geofence) {
                      const matchedDeviceIds = devicesData
                        .filter((device) =>
                          device.geofences?.includes(geofence._id)
                        )
                        .map((device) => device._id);
                      setAutoCheckedDevices(matchedDeviceIds);
                      setSelectedDevices((prev) =>
                        Array.from(new Set([...prev, ...matchedDeviceIds]))
                      );
                    } else {
                      setAutoCheckedDevices([]);
                    }
                  }}
                  options={geofencesData.map((geofence) => ({
                    value: geofence._id,
                    label: `${geofence.title} (${geofence.type})`,
                  }))}
                  disabled={loading}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
                {selectedGeofence && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "6px",
                      border: "1px solid #6dbfb8",
                    }}
                  >
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      <strong>Selected Geofence:</strong>
                    </div>
                    <div style={{ fontSize: "13px", marginTop: "5px" }}>
                      <strong>{selectedGeofence.title}</strong>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        marginTop: "3px",
                      }}
                    >
                      Type: <strong>{selectedGeofence.type}</strong>
                    </div>
                    {selectedGeofence.geofenceGroup && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "3px",
                        }}
                      >
                        Group:{" "}
                        <strong>{selectedGeofence.geofenceGroup.title}</strong>
                      </div>
                    )}
                    {selectedGeofence.geofenceSubGroup && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "3px",
                        }}
                      >
                        Sub-Group:{" "}
                        <strong>
                          {selectedGeofence.geofenceSubGroup.title}
                        </strong>
                      </div>
                    )}
                    {autoCheckedDevices.length > 0 && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#52c41a",
                          marginTop: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        {autoCheckedDevices.length} device(s) already linked to
                        this geofence
                      </div>
                    )}
                  </div>
                )}
              </FormGroup>
            </Row>
          )}

          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Devices *</P>
              <input
                className="form-control"
                type="search"
                placeholder="Search by registration no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedDevices.length === devicesData.length &&
                      devicesData.length > 0
                    }
                    className="custom-checkbox"
                    disabled={loading || devicesData.length === 0}
                  />
                  <span style={{ marginLeft: "5px" }}>Select All</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={handleDeselectAll}
                    checked={selectedDevices.length === autoCheckedDevices.length}
                    className="custom-checkbox"
                    disabled={loading}
                  />
                  <span style={{ marginLeft: "5px" }}>Deselect All</span>
                </div>
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {Object.entries(groupedDevices).map(
                  ([groupId, group]: [string, any]) => {
                    // filter devices inside the group
                    const filteredDevices = group.devices.filter(
                      (device: Device) =>
                        device.registrationNo
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    );

                    // If no devices match, skip this group
                    if (filteredDevices.length === 0) return null;

                    // Chunk filtered devices into groups of 4 for grid layout
                    const deviceChunks = chunkArray(filteredDevices, 4);

                    return (
                      <div key={groupId} style={{ marginBottom: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#f0f0f0",
                            padding: "6px",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleGroupExpansion(groupId)}
                        >
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={isGroupFullyChecked(groupId)}
                            ref={(input) => {
                              if (input)
                                input.indeterminate =
                                  isGroupPartiallyChecked(groupId);
                            }}
                            onChange={(e) =>
                              handleGroupCheckboxClick(
                                groupId,
                                e.target.checked
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            disabled={loading}
                          />
                          <span style={{ marginLeft: "8px", flex: 1 }}>
                            {group.name} ({group.devices.length})
                          </span>
                          {expandedGroups.has(groupId) ? (
                            <MdExpandLess />
                          ) : (
                            <MdExpandMore />
                          )}
                        </div>

                        {expandedGroups.has(groupId) && (
                          <div
                            style={{
                              paddingLeft: "20px",
                              paddingTop: "5px",
                              paddingRight: "10px",
                            }}
                          >
                            {deviceChunks.map((chunk, chunkIndex) => (
                              <div
                                key={chunkIndex}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "8px",
                                  gap: "15px",
                                }}
                              >
                                {chunk.map((device: Device) => (
                                  <div
                                    key={device._id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      flex: "1",
                                      maxWidth: "175px",
                                      minWidth: "175px",
                                      padding: "4px 8px",
                                      // border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                      background: autoCheckedDevices.includes(
                                        device._id
                                      )
                                        ? "#d1f7c4" // Green for already linked
                                        : selectedDevices.includes(device._id)
                                        ? "#e6f7ff" // Blue for newly selected
                                        : "transparent",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      className="custom-checkbox"
                                      checked={selectedDevices.includes(
                                        device._id
                                      )}
                                      onChange={() =>
                                        handleDeviceToggle(device._id)
                                      }
                                      disabled={
                                        loading ||
                                        autoCheckedDevices.includes(device._id)
                                      }
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span
                                      style={{
                                        marginLeft: "0px",
                                        fontSize: "14px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      title={
                                        autoCheckedDevices.includes(device._id)
                                          ? `${device.registrationNo} (Already linked to this geofence)`
                                          : device.registrationNo
                                      }
                                    >
                                      {device.registrationNo}
                                      {autoCheckedDevices.includes(device._id) && (
                                        <span
                                          style={{
                                            marginLeft: "5px",
                                            fontSize: "10px",
                                            color: "#52c41a",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                                {/* Add empty divs to maintain grid layout for last row */}
                                {chunk.length < 4 &&
                                  Array.from({ length: 4 - chunk.length }).map(
                                    (_, index) => (
                                      <div
                                        key={`empty-${index}`}
                                        style={{ flex: "1" }}
                                      />
                                    )
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
              {/* {selectedDevices.length === 0 && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select at least one device
                </span>
              )} */}
            </FormGroup>
          </Row>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Save"}
            </Button>
            <Button disabled={loading} color="secondary" onClick={addToggle}>
              {Cancel}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AlertsModal;
