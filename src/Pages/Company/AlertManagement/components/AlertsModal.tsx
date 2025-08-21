import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../../utils/Constant";
import { H4, P } from "../../../../AbstractElements";
import { useState, useMemo, useEffect } from "react";

import { Select } from "antd";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import "./styles.css";

interface AlertsModalProps {
  isVisible: any;
  setIsVisible: any;
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
  } = useForm<any>();
  const { devices } = useSelector((state: any) => state.monitoring);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  // --- GROUPING LOGIC ---
  const groupedDevices = useMemo(() => {
    if (!devices || devices.length === 0) return {};
    return devices.reduce((groups: any, device: any) => {
      const groupName = device.vehicle?.group?.name || "Ungrouped";
      const groupId = device.vehicle?.group?._id || "ungrouped";
      if (!groups[groupId]) {
        groups[groupId] = { name: groupName, devices: [] };
      }
      groups[groupId].devices.push(device);
      return groups;
    }, {});
  }, [devices]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

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
      group.every((d: any) =>
        selectedDevices.includes(d.vehicle.registrationNo)
      )
    );
  };

  const isGroupPartiallyChecked = (groupId: string) => {
    const group = groupedDevices[groupId]?.devices || [];
    const count = group.filter((d: any) =>
      selectedDevices.includes(d.vehicle.registrationNo)
    ).length;
    return count > 0 && count < group.length;
  };

  const handleGroupCheckboxClick = (groupId: string, checked: boolean) => {
    const group = groupedDevices[groupId]?.devices || [];
    const regNos = group.map((d: any) => d.vehicle.registrationNo);
    setSelectedDevices((prev) => {
      if (checked) {
        // add all from group
        return Array.from(new Set([...prev, ...regNos]));
      } else {
        // remove all from group
        return prev.filter((r) => !regNos.includes(r));
      }
    });
  };

  const handleDeviceToggle = (regNo: string) => {
    setSelectedDevices((prev) =>
      prev.includes(regNo) ? prev.filter((d) => d !== regNo) : [...prev, regNo]
    );
  };

  const handleSelectAll = () => {
    const allRegNos = devices.map((d: any) => d.vehicle.registrationNo);
    setSelectedDevices(allRegNos);
  };

  const handleDeselectAll = () => {
    setSelectedDevices([]);
  };

  return (
    <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
      <div className="modal-header">
        <H4 className="modal-title">Create New Alert</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>
      <ModalBody>
        <form>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Name</P>
              <input
                className="form-control"
                type="text"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span style={{ color: "red" }}>Alert name is required</span>
              )}
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Select Type</P>
              <Select
                value={type || null}
                style={{ width: "100%", height: 36 }}
                placeholder="Select Type"
                onChange={(e) => setType(e)}
                options={[
                  { value: "OVERSPEED", label: "Overspeed (kph)" },
                  { value: "ZONE OUT", label: "Zone Out" },
                  { value: "ZONE IN", label: "Zone In" },
                  { value: "IGNITION ON", label: "Ignition On" },
                  { value: "IGNITION OUT", label: "Ignition Out" },
                ]}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-12 create-group">
              <P>Devices</P>
              <input
                className="form-control"
                type="search"
                placeholder="Search by registration no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    checked={selectedDevices.length === devices.length}
                    className="custom-checkbox"
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
                    checked={selectedDevices.length === 0}
                    className="custom-checkbox"
                  />
                  <span style={{ marginLeft: "5px" }}>Deselect All</span>
                </div>
              </div>

              {Object.entries(groupedDevices).map(
                ([groupId, group]: [string, any]) => {
                  // filter devices inside the group
                  const filteredDevices = group.devices.filter((device: any) =>
                    device.vehicle.registrationNo
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );

                  // If no devices match, skip this group
                  if (filteredDevices.length === 0) return null;

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
                            handleGroupCheckboxClick(groupId, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()}
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
                        <div style={{ paddingLeft: "20px", paddingTop: "5px" }}>
                          {filteredDevices.map((device: any) => (
                            <div
                              key={device.vehicle.registrationNo}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "4px",
                              }}
                            >
                              <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={selectedDevices.includes(
                                  device.vehicle.registrationNo
                                )}
                                onChange={() =>
                                  handleDeviceToggle(
                                    device.vehicle.registrationNo
                                  )
                                }
                              />
                              <span style={{ marginLeft: "8px" }}>
                                {device.vehicle.registrationNo}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </FormGroup>
          </Row>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Save`}
          </Button>
          <Button disabled={loading} color="secondary" onClick={addToggle}>
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AlertsModal;
