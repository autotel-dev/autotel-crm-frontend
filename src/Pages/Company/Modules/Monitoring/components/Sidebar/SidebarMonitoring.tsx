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
  setSelectedSingleDevice,
  // setSelectedSingleDevice,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { IoKeyOutline, IoKey } from "react-icons/io5";
// import carIcon from "../../../monitoring-assets/car-icon.png";
import carIcon from "../../../monitoring-assets/carIcon.png";

function SidebarMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMutual, setisMutual] = useState(true);
  const { devices } = useSelector((state: any) => state.monitoring);
  const dispatch = useDispatch();

  // Handle checkbox click
  const handleCheckboxClick = (e: any, item: any) => {
    e.stopPropagation();

    const updatedDevices = devices.map((d: any) =>
      d._id === item._id ? { ...d, checked: e.target.checked } : d
    );

    console.log("Updated devices:", updatedDevices);
    dispatch(setDevices(updatedDevices || []));
  };

  const handleDeviceClick = (device: any) => {
    dispatch(setSelectedSingleDevice(device));
  };

  return (
    <Card style={{ borderRadius: "5px", backgroundColor: "#99A6A7" }}>
      <CardHeader style={{ padding: "0px 8px", backgroundColor: "#99A6A7" }}>
        <h4
          style={{
            margin: "10px 0px",
            fontWeight: "bold",
            fontSize: "17px",
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
          maxHeight: "64.2vh",
          minHeight: "64.2vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          margin: "0px",
          padding: "0px 8px",
        }}
      >
        {devices && devices.length > 0 ? (
          devices.map(
            (item: any) =>
              (item.vehicleInfo?.model?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                item.vehicleInfo?.model == null) && (
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
                      (e.currentTarget.style.backgroundColor = "lightGray")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => handleDeviceClick(item)}
                  >
                    {/* <img
                      className="img-30 rounded-circle m-r-15"
                      style={{ display: "flex", alignItems: "center" }}
                      src={`${IMAGE_BASE_URL_RENTAL}${item?.vehicle?.vehicleIcon?.vehicleImage3D}`}
                      alt="Vehicle"
                    /> */}

                    <Media body>
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
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <img
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "20px",
                              height: "20px",
                            }}
                            src={carIcon}
                            alt="Vehicle"
                          />
                          <div>
                            <span
                              style={{ fontSize: "14px", fontWeight: "bols" }}
                              className="f-w-700 d-block"
                            >
                              {item?.vehicleInfo?.registrationNo || "N/A"}
                            </span>
                            <div
                              className="d-block"
                              style={{ fontSize: "9px" }}
                            >
                              {item?.vehicleInfo?.model?.name || "N/A"}
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
                            <div style={{ fontSize: "11.5px" }}>
                              {item?.speed > 0
                                ? Number(item?.speed).toFixed(2)
                                : item?.speed}
                            </div>
                            <div style={{ fontSize: "9px" }}>km/h</div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            {item?.basicInfo?.ignition === true ? (
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
