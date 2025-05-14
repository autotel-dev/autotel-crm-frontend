import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { BsLightningChargeFill } from "react-icons/bs";
// import { TbKeyFilled } from "react-icons/tb";
import "react-circular-progressbar/dist/styles.css";
import { IoMdWifi } from "react-icons/io";
import { GiBattery100 } from "react-icons/gi";
// import Image3d from "../../1736337440638h80h8djp.webp";
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL_RENTAL } from "../../../../../../Utilities/api/apiEndpoints";

function Vehicle3dImageDetails() {
  let { selectedSingleDevice } = useSelector((state: any) => state.monitoring);

  // console.log("selectedSingleDevice in 3d image", selectedSingleDevice);
  const speed = selectedSingleDevice?.device?.speed | 0;
  const odometer = selectedSingleDevice?.device?.basicInfo.odometer | 0;
  const currentEngineTemp = 85; // in °C
  const maxSafeEngineTemp = 100; // Maximum safe engine temperature in °C

  return (
    <Card style={{ borderRadius: "5px", marginTop: "-35px", height: "273px" }}>
      <CardBody style={{ margin: "0px", padding: "0px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "70% 30%", // Two columns: 70% and 30% width
            gridTemplateRows: "80% 20%", // First row 80%, second row 20%
            // Add space between grid items if needed
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "80% 20%", // Split the first column into two rows
              height: "100%", // Full height of the first column
            }}
          >
            <div
              style={{
                height: "100%", // 80% of the first column
              }}
            >
              <img
                //  src={Image3d}
                src={`${IMAGE_BASE_URL_RENTAL}${selectedSingleDevice?.vehicle?.vehicleIcon?.vehicleImage3D}`}
                alt="Vehicle Image"
                height={250}
                width={250}
              />
            </div>
            <div
              style={{
                height: "100%",
                paddingTop: "20px", // 20% of the first column
                display: "flex",
                gap: "10px",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {selectedSingleDevice?.device?.basicInfo?.ignition === false ? (
                  <>
                    <div style={{ alignItems: "center", display: "flex" }}>
                      <IoMdWifi color="red" size={18} />
                      <strong style={{ color: "white", fontSize: "9px" }}>
                        IGNITION
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ color: "white", fontSize: "9px" }}>OFF</h6>
                    </div>{" "}
                  </>
                ) : (
                  <>
                    <div style={{ alignItems: "center", display: "flex" }}>
                      <IoMdWifi color="green" size={18} />
                      <strong style={{ color: "white", fontSize: "9px" }}>
                        IGNITION
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ color: "white", fontSize: "9px" }}>ON</h6>
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ alignItems: "center", display: "flex" }}>
                  <IoMdWifi color="yellow" size={18} />
                  <strong style={{ color: "white", fontSize: "9px" }}>
                    GPS
                  </strong>
                </div>
                <div>
                  <h6 style={{ color: "white", fontSize: "9px" }}>ON</h6>
                </div>
              </div>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {selectedSingleDevice?.device?.basicInfo?.ignition &&
                selectedSingleDevice?.device?.speed === 0 ? (
                  <>
                    <div style={{ alignItems: "center", display: "flex" }}>
                      <BsLightningChargeFill color="red" size={18} />
                      <strong style={{ color: "white", fontSize: "9px" }}>
                        Power
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ color: "white", fontSize: "9px" }}>Idle</h6>
                    </div>
                  </>
                ) : !selectedSingleDevice?.device?.basicInfo?.ignition &&
                  selectedSingleDevice?.device?.speed === 0 ? (
                  <>
                    <div style={{ alignItems: "center", display: "flex" }}>
                      <BsLightningChargeFill color="gray" size={18} />
                      <strong style={{ color: "white", fontSize: "9px" }}>
                        Power
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ color: "white", fontSize: "9px" }}>Off</h6>
                    </div>
                  </>
                ) : selectedSingleDevice?.device?.basicInfo?.ignition &&
                  selectedSingleDevice?.device?.speed > 0 ? (
                  <>
                    <div style={{ alignItems: "center", display: "flex" }}>
                      <BsLightningChargeFill color="green" size={18} />
                      <strong style={{ color: "white", fontSize: "9px" }}>
                        Power
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ color: "white", fontSize: "9px" }}>On</h6>
                    </div>
                  </>
                ) : null}
              </div>

              <div
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "gray",
                  margin: "10px 0px",
                }}
              ></div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ alignItems: "center", display: "flex" }}>
                  <GiBattery100 color="green" size={18} />
                  <strong style={{ color: "white", fontSize: "9px" }}>
                    Battery
                  </strong>
                </div>
                <div>
                  <h6 style={{ color: "white", fontSize: "9px" }}>99%</h6>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              height: "100%",
              paddingLeft: "20px", // Full height of the second column
            }}
          >
            <div
              style={{
                height: "80px",
                width: "80px",
                // display: "flex",
                // justifyContent: "center",
                // flexDirection:"row",
              }}
            >
              <div style={{ padding: "8px 0px 0px 15px" }}>
                <CircularProgressbarWithChildren
                  value={speed}
                  styles={{
                    background: {
                      fill: "fff",
                    },
                  }}
                >
                  <div style={{ fontSize: 12, marginTop: -5, color: "white" }}>
                    <strong>{speed}</strong>km
                  </div>
                  <div style={{ fontSize: 10, color: "white" }}>Speed</div>
                </CircularProgressbarWithChildren>
              </div>
              <div style={{ padding: "8px 0px 0px 15px" }}>
                <CircularProgressbarWithChildren
                  value={odometer}
                  styles={{
                    path: {
                      stroke: "#ff6347", // Change this to the color you want for the value bar
                      strokeLinecap: "round", // Makes the progress path rounded at the ends
                      transition: "stroke-dashoffset 0.5s ease 0s", // Smooth transition for the stroke
                      // You can also set the width of the progress path here if you want to customize it
                      strokeWidth: 8, // Adjust the thickness of the progress path
                    },
                    trail: {
                      stroke: "#e0e0e0", // Color of the remaining circle (background circle)
                      strokeWidth: 8, // Set the thickness of the trail if needed
                    },
                    text: {
                      fill: "white", // Text color (you can adjust this as well)
                    },
                  }}
                >
                  <div style={{ fontSize: 10, marginTop: -5, color: "white" }}>
                    <strong>{odometer}</strong>km
                  </div>
                  <div style={{ fontSize: 9, color: "white" }}>odometer</div>
                </CircularProgressbarWithChildren>
              </div>
              {/* Engine Temperature Progress Bar */}
              <div
                style={{
                  padding: "8px 0px 0px 15px",
                }}
              >
                <CircularProgressbarWithChildren
                  value={currentEngineTemp}
                  maxValue={maxSafeEngineTemp}
                  styles={{
                    path: { stroke: "#ff9800" }, // Engine temp color
                    trail: { stroke: "#e0e0e0" },
                    text: { fill: "white" },
                  }}
                >
                  <div style={{ fontSize: 12, color: "white" }}>
                    <strong>{currentEngineTemp}°C</strong>
                  </div>
                  <div style={{ fontSize: 10, color: "white" }}>Engine </div>
                </CircularProgressbarWithChildren>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default Vehicle3dImageDetails;
