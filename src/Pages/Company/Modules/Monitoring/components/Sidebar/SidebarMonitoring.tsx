import React, { useEffect, useState } from "react";
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

// import { TbKeyFilled } from "react-icons/tb";
import { IoMdWifi } from "react-icons/io";
import {
  setDevices,
  // setSelectedSingleDevice,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { IMAGE_BASE_URL_RENTAL } from "../../../../../../Utilities/api/apiEndpoints";

function SidebarMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMutual, setisMutual] = useState(true);
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();

  // Handle checkbox click
  const handleCheckboxClick = (e: any, item: any) => {
    e.stopPropagation();

    const updatedDevices = devices.map((d: any) =>
      d.device._id === item.device._id ? { ...d, checked: e.target.checked } : d
    );

    console.log("Updated devices:", updatedDevices);
    dispatch(setDevices(updatedDevices || []));
  };

  const handleDeviceClick = (device: any) => {
    // dispatch(setSelectedSingleDevice(device));
  };

  return (
    <Card style={{ borderRadius: "5px", marginTop: "-35px" }}>
      <CardHeader style={{ padding: "0px 8px" }}>
        <h4
          style={{
            margin: "10px 0px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Vehicles List
        </h4>
        <Form>
          <FormGroup>
            <Input
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                border: "1px solid gray",
              }}
              className="form-control-plaintext"
              type="search"
              placeholder="Search Contacts.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
        </Form>
      </CardHeader>
      <CardBody
        className="social-status filter-cards-view"
        style={{
          maxHeight: "66.6vh",
          minHeight: "63vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          margin: "0px",
          padding: "0px 8px",
        }}
      >
        {devices.length > 0 ? (
          devices.map(
            (item: any) =>
              item.vehicle?.vehicleModel.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) && (
                <div
                  key={item.id}
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
                    checked={item.checked}
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3949ab")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => handleDeviceClick(item)}
                  >
                    <img
                      className="img-30 rounded-circle m-r-15"
                      style={{ display: "flex", alignItems: "center" }}
                      src={`${IMAGE_BASE_URL_RENTAL}${item?.vehicle?.vehicleIcon?.vehicleImage3D}`}
                      alt="Vehicle"
                    />
                    <Media body>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <span
                            style={{ fontSize: "11px" }}
                            className="f-w-700 d-block"
                          >
                            {item.vehicle?.vehicleModel.name || "N/A"}
                          </span>
                          <div className="d-block" style={{ fontSize: "8px" }}>
                            {item.vehicle?.deviceName || "N/A"}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ fontSize: "11.5px" }}>
                              {item.device.speed}
                            </div>
                            <div style={{ fontSize: "8.5px" }}>km/h</div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            {item.device.basicInfo.ignition === true ? (
                              <IoMdWifi color="green" size={15} />
                            ) : (
                              <IoMdWifi color="red" size={15} />
                            )}

                            <div style={{ fontSize: "8.5px" }}>IGN</div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <IoMdWifi color="yellow" size={15} />
                            <div style={{ fontSize: "8.5px" }}>GPS</div>
                          </div>
                        </div>
                      </div>
                    </Media>
                  </Media>
                </div>
              )
          )
        ) : (
          <p>No devices found.</p>
        )}
      </CardBody>
    </Card>
  );
}

export default SidebarMonitoring;
