import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Media,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import "./SidebarMonitoring.css";

// import { TbKeyFilled } from "react-icons/tb";
import { IoMdWifi } from "react-icons/io";
import {
  setDevices,
  setSelectedSingleDevice,
  // setSelectedSingleDevice,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { IoKeyOutline, IoKey } from "react-icons/io5";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
// import carIcon from "../../../monitoring-assets/car-icon.png";
// import carIcon from "../../../monitoring-assets/carIcon.png";
import carIcon from "../../../monitoring-assets/deviceLocationArrow.png";

function SidebarMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();

  // Group devices by their group
  const groupedDevices = useMemo(() => {
    if (!devices || devices.length === 0) return {};

    const filtered = devices.filter(
      (item: any) =>
        item.vehicle?.model?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.vehicle?.model == null ||
        item.vehicle?.registrationNo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

    return filtered.reduce((groups: any, device: any) => {
      const groupName = device.vehicle?.group?.name || "Ungrouped";
      const groupId = device.vehicle?.group?._id || "ungrouped";

      if (!groups[groupId]) {
        groups[groupId] = {
          name: groupName,
          devices: [],
        };
      }

      groups[groupId].devices.push(device);
      return groups;
    }, {});
  }, [devices, searchTerm]);

  // Handle individual vehicle checkbox click
  const handleCheckboxClick = (e: any, item: any) => {
    e.stopPropagation();

    const updatedDevices = devices.map((d: any) =>
      d._id === item._id ? { ...d, checked: e.target.checked } : d,
    );

    // console.log("Updated devices:", updatedDevices);
    dispatch(setDevices(updatedDevices || []));
  };

  // Handle group checkbox click
  const handleGroupCheckboxClick = (e: any, groupId: string) => {
    e.stopPropagation();
    const isChecked = e.target.checked;

    const updatedDevices = devices.map((d: any) => {
      const deviceGroupId = d.vehicle?.group?._id || "ungrouped";
      if (deviceGroupId === groupId) {
        return { ...d, checked: isChecked };
      }
      return d;
    });

    // console.log("Updated devices (group):", updatedDevices);
    dispatch(setDevices(updatedDevices || []));
  };

  // Check if all vehicles in a group are checked
  const isGroupFullyChecked = (groupId: string) => {
    const groupDevices = groupedDevices[groupId]?.devices || [];
    return (
      groupDevices.length > 0 &&
      groupDevices.every((device: any) => device.checked)
    );
  };

  // Check if some (but not all) vehicles in a group are checked
  const isGroupPartiallyChecked = (groupId: string) => {
    const groupDevices = groupedDevices[groupId]?.devices || [];
    const checkedCount = groupDevices.filter(
      (device: any) => device.checked,
    ).length;
    return checkedCount > 0 && checkedCount < groupDevices.length;
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const handleDeviceClick = (device: any) => {
    dispatch(setSelectedSingleDevice(device));
  };

  // Initialize all groups as expanded on first render
  useEffect(() => {
    const allGroupIds = Object.keys(groupedDevices);
    setExpandedGroups(new Set(allGroupIds));
  }, [Object.keys(groupedDevices).length]);

  return (
    <Card
      style={{
        borderRadius: "5px",
        backgroundColor: "#21262C",
        border: "1px solid black",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <CardHeader style={{ padding: "0px 8px", backgroundColor: "#21262C" }}>
        <h4
          style={{
            margin: "10px 0px",
            fontWeight: "bold",
            fontSize: "17px",
            color: "white",
          }}
        >
          Vehicles
        </h4>
        <Form>
          <FormGroup>
            <Input
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                height: "40px",
                backgroundColor: "#21262C",
                border: "1px solid black",
                boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.5)", // INNER shadow
                color: "white",
              }}
              className="form-control-plaintext white-placeholder"
              type="search"
              placeholder="Search Vehicles.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
        </Form>
      </CardHeader>
      <CardBody
        className="social-status filter-cards-view"
        style={{
          maxHeight: "58.2vh",
          minHeight: "58.2vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          margin: "0px",
          padding: "0px 8px",
        }}
      >
        {Object.keys(groupedDevices).length > 0 ? (
          Object.entries(groupedDevices).map(
            ([groupId, group]: [string, any]) => (
              <div key={groupId} style={{ marginBottom: "10px" }}>
                {/* Group Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#2a2f35",
                    padding: "8px",
                    borderRadius: "4px",
                    marginBottom: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleGroupExpansion(groupId)}
                >
                  <input
                    type="checkbox"
                    style={{
                      marginRight: "10px",
                      height: "16px",
                      width: "16px",
                      padding: "0px",
                    }}
                    checked={isGroupFullyChecked(groupId)}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isGroupPartiallyChecked(groupId);
                      }
                    }}
                    onChange={(e) => handleGroupCheckboxClick(e, groupId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                      flex: 1,
                    }}
                  >
                    {group.name} ({group.devices.length})
                  </span>
                  {expandedGroups.has(groupId) ? (
                    <MdExpandLess color="white" size={20} />
                  ) : (
                    <MdExpandMore color="white" size={20} />
                  )}
                </div>

                {/* Group Vehicles */}
                {expandedGroups.has(groupId) && (
                  <div style={{ paddingLeft: "10px" }}>
                    {group.devices.map((item: any) => (
                      <div
                        key={item._id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          style={{
                            marginRight: "10px",
                            height: "15px",
                            width: "15px",
                            padding: "0px",
                          }}
                          checked={item.checked || false}
                          onChange={(e) => handleCheckboxClick(e, item)}
                        />
                        <Media
                          style={{
                            margin: "2px 0px",
                            padding: "0px",
                            width: "100%",
                            borderBottom: "solid gray 1px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handleDeviceClick(item)}
                        >
                          <Media>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "12px",
                                    height: "20px",
                                  }}
                                  src={carIcon}
                                  alt="Vehicle"
                                />
                                <div>
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      // fontWeight: "semibold",
                                      color: "white",
                                    }}
                                    className="f-w-700 d-block"
                                  >
                                    {item?.vehicle?.registrationNo || "N/A"}
                                  </span>
                                  <div
                                    className="d-block"
                                    style={{ fontSize: "9px", color: "white" }}
                                  >
                                    {item?.vehicle?.model?.name || "N/A"}
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "11.5px",
                                      color: "white",
                                    }}
                                  >
                                    {item?.latestPosition?.speed > 0
                                      ? Number(
                                          item?.latestPosition?.speed,
                                        ).toFixed(2)
                                      : item?.latestPosition?.speed}
                                  </div>
                                  <div
                                    style={{ fontSize: "9px", color: "white" }}
                                  >
                                    km/h
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  {item?.latestPosition?.attributes
                                    ?.ignition === true ? (
                                    <IoKey color="green" size={16} />
                                  ) : (
                                    <IoKey color="red" size={16} />
                                  )}

                                  <div style={{ fontSize: "9px" }}>IGN</div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <IoMdWifi color="red" size={16} />
                                  <div style={{ fontSize: "9px" }}>GPS</div>
                                </div>
                              </div>
                            </div>
                          </Media>
                        </Media>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ),
          )
        ) : (
          <p style={{ color: "white" }}>No devices found.</p>
        )}
      </CardBody>
    </Card>
  );
}

export default SidebarMonitoring;
