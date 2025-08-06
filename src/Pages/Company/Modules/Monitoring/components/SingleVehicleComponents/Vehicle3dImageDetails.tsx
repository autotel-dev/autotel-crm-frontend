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
// import carIcon from "../../../monitoring-assets/car-icon.png";
// import carIcon from "../../../monitoring-assets/carIcon.png";
import carIcon from "../../../monitoring-assets/car_icon.png";

function Vehicle3dImageDetails() {
  let { selectedSingleDevice } = useSelector((state: any) => state.monitoring);

  function formatNumber(num: any) {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
    if (num >= 100_000) return (num / 1_000).toFixed(0) + "K";
    if (num >= 10_000)
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  }

  const currentEngineTemp = 85; // in °C
  const maxSafeEngineTemp = 100; // Maximum safe engine temperature in °C

  return (
    <Card
      style={{
        borderRadius: "5px",
        minWidth: "100%",
        maxWidth: "100%",
        // backgroundColor: "#21262C",
        backgroundColor: "#21262C",
        border: "1px solid black",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <CardBody
        style={{
          padding: "10px 10px 0px 15px",
          // backgroundColor: "#21262C"
          backgroundColor: "#21262C",
        }}
      >
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
            <div>
              <img
                style={{
                  height: "160px",
                }}
                src={carIcon}
                // src={`${IMAGE_BASE_URL_RENTAL}${selectedSingleDevice?.vehicle?.vehicleIcon?.vehicleImage3D}`}
                alt="Vehicle Image"
                height={160}
                width={260}
              />
            </div>
            <div
              style={{
                // height: "100%",
                marginTop: "10px",
                paddingTop: "20px", // 20% of the first column
                display: "flex",
                gap: "10px",
                color: "black",
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
                      <strong style={{ fontSize: "9px", color: "white" }}>
                        IGNITION
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ fontSize: "9px", color: "white" }}>OFF</h6>
                    </div>{" "}
                  </>
                ) : (
                  <>
                    <div style={{ alignItems: "center", display: "flex" }}>
                      <IoMdWifi color="green" size={18} />
                      <strong style={{ fontSize: "9px", color: "white" }}>
                        IGNITION
                      </strong>
                    </div>
                    <div>
                      <h6 style={{ fontSize: "9px", color: "white" }}>ON</h6>
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
                  <strong style={{ fontSize: "9px", color: "white" }}>
                    GPS
                  </strong>
                </div>
                <div>
                  <h6 style={{ fontSize: "9px", color: "white" }}>ON</h6>
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
                <div style={{ alignItems: "center", display: "flex" }}>
                  <GiBattery100 color="green" size={18} />
                  <strong style={{ fontSize: "9px", color: "white" }}>
                    Battery
                  </strong>
                </div>
                <div>
                  <h6 style={{ fontSize: "9px", color: "white" }}>99%</h6>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              // height: "100%",

              paddingLeft: "20px", // Full height of the second column
            }}
          >
            <div
              style={{
                height: "70px",
                width: "70px",
              }}
            >
              <div style={{ padding: "7px 0px 0px 4px" }}>
                <CircularProgressbarWithChildren
                  value={parseFloat(
                    Number(selectedSingleDevice?.latestPosition?.speed).toFixed(
                      1
                    )
                  )}
                  // styles={{
                  //   background: {
                  //     fill: "fff",
                  //   },
                  // }}

                  styles={{
                    path: { stroke: "#ff9800" }, // Engine temp color
                    trail: { stroke: "#b3b3b3" },
                    text: { fill: "white" },
                  }}
                >
                  <div style={{ fontSize: 7, marginTop: -5, color: "white" }}>
                    <strong>
                      {parseFloat(
                        Number(
                          selectedSingleDevice?.latestPosition?.speed
                        ).toFixed(0)
                      )}
                    </strong>
                    &nbsp;km/h
                  </div>
                  <div style={{ fontSize: 8, color: "white" }}>Speed</div>
                </CircularProgressbarWithChildren>
              </div>
              <div style={{ padding: "7px 0px 0px 4px" }}>
                <CircularProgressbarWithChildren
                  value={parseInt(
                    Number(
                      selectedSingleDevice?.latestPosition?.attributes?.odometer
                    ).toFixed(0)
                  )}
                  // styles={{
                  //   path: {
                  //     stroke: "#ff6347", // Change this to the color you want for the value bar
                  //     strokeLinecap: "round", // Makes the progress path rounded at the ends
                  //     transition: "stroke-dashoffset 0.5s ease 0s", // Smooth transition for the stroke
                  //     // You can also set the width of the progress path here if you want to customize it
                  //     strokeWidth: 8, // Adjust the thickness of the progress path
                  //   },
                  //   trail: {
                  //     stroke: "#e0e0e0", // Color of the remaining circle (background circle)
                  //     strokeWidth: 8, // Set the thickness of the trail if needed
                  //   },
                  //   text: {
                  //     fill: "white", // Text color (you can adjust this as well)
                  //   },
                  // }}

                  // styles={{
                  //   background: {
                  //     fill: "fff",
                  //   },
                  // }}
                  styles={{
                    path: { stroke: "#ff9800" }, // Engine temp color
                    trail: { stroke: "#b3b3b3" },
                    text: { fill: "white" },
                  }}
                >
                  <div style={{ fontSize: 7, marginTop: -5, color: "white" }}>
                    <strong>
                      {formatNumber(
                        parseInt(
                          Number(
                            selectedSingleDevice?.latestPosition?.attributes
                              ?.odometer
                          ).toFixed(4)
                        )
                      )}
                    </strong>
                    &nbsp;km
                  </div>
                  <div style={{ fontSize: 8, color: "white" }}>Odometer</div>
                </CircularProgressbarWithChildren>
              </div>

              <div style={{ padding: "7px 0px 0px 4px" }}>
                <CircularProgressbarWithChildren
                  value={currentEngineTemp}
                  maxValue={maxSafeEngineTemp}
                  styles={{
                    path: { stroke: "#ff9800" }, // Engine temp color
                    trail: { stroke: "#b3b3b3" },
                    text: { fill: "white" },
                  }}
                >
                  <div style={{ fontSize: 7, color: "white" }}>
                    <strong>{currentEngineTemp}°C</strong>
                  </div>
                  <div style={{ fontSize: 8, color: "white" }}>Engine </div>
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
