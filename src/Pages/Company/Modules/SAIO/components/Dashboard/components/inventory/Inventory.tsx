import React from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { H4, H5 } from "../../../../../../../../AbstractElements";

const Inventory = () => {
  return (
    <Row
      style={{
        marginRight: "10px",
        marginLeft: "5px",
      }}
    >
      <Card className="widget-sell handle" style={{}}>
        <CardHeader className="pb-0">
          <H4 className="m-0">Inventory</H4>
        </CardHeader>
        <CardBody className="pb-0">
          <Row>
            <Col xl="4" lg="4" sm="3" xs="3">
              <Row>
                <Col xl="12" lg="12" sm="12" className="mb-4">
                  <div
                    className="sale"
                    style={{ minHeight: "80px", maxHeight: "80px" }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <H5>Total Products</H5>
                        <div
                          style={{
                            padding: "6px",
                            width: "45px",
                            height: "45px",
                            borderRadius: "100px",
                            backgroundColor: "black",
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          7
                        </div>
                      </div>

                      {/* <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "90%", // Set the width of the outer container
                          height: "160px", // Set the height of the outer container
                          // backgroundColor: "gray", // Remove the background color
                        }}
                      >
                        <div
                          style={{
                            flex: "1",
                            marginRight: "0px",
                            // backgroundColor: "gray",
                          }}
                        >
                          <Chart
                            width={"100%"}
                            height={"100%"} // Set the height of the chart to fill the outer container
                            chartType={"PieChart"}
                            loader={<div>{"Loading Chart"}</div>}
                            data={[
                              ["Task", "Hours per Day"],
                              [
                                "Active",
                                generalData?.operatorStatistics
                                  ?.totalActiveOperators,
                              ],
                              [
                                "Inctive",
                                generalData?.operatorStatistics
                                  ?.totalInActiveOperators,
                              ],
                            ]}
                            options={{
                              backgroundColor: "transparent", // Set chart background color as transparent
                              chartArea: {
                                backgroundColor: "transparent", // Set chart area background color as transparent
                                top: "5%", // Set padding of the top of chart area to 0
                                left: 25, // Set padding of the left of chart area to 0
                                right: 0,
                              },
                              // pieHole: 0.4,
                              pieSliceText: "value", // Display the exact values of each option
                              colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                              is3D: true, // Set the chart type to 3D
                            }}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl="4" lg="4" sm="3" xs="3">
              <Row>
                <Col xl="12" lg="12" sm="12" className="mb-3">
                  <div
                    className="sale"
                    style={{ minHeight: "80px", maxHeight: "80px" }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <H5>Adjusted Products </H5>
                        <div
                          style={{
                            padding: "6px",
                            width: "45px",
                            height: "45px",
                            borderRadius: "100px",
                            backgroundColor: "black",
                            color: "white",
                            display: "flex",

                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          43
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl="4" lg="4" sm="3" xs="3">
              <Row>
                <Col xl="12" lg="12" sm="12" className="mb-3">
                  <div
                    className="sale"
                    style={{ minHeight: "80px", maxHeight: "80px" }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <H5>Products Repaired </H5>
                        <div
                          style={{
                            padding: "6px",
                            width: "45px",
                            height: "45px",
                            borderRadius: "100px",
                            backgroundColor: "black",
                            color: "white",
                            display: "flex",

                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          15
                        </div>
                      </div>

                      {/* <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "90%", // Set the width of the outer container
                          height: "160px", // Set the height of the outer container
                          // backgroundColor: "gray", // Remove the background color
                        }}
                      >
                        <div
                          style={{
                            flex: "1",
                            marginRight: "0px",
                            // backgroundColor: "gray",
                          }}
                        >
                          <Chart
                            width={"100%"}
                            height={"100%"} // Set the height of the chart to fill the outer container
                            chartType={"PieChart"}
                            loader={<div>{"Loading Chart"}</div>}
                            data={[
                              ["Task", "Hours per Day"],
                              [
                                "Active",
                                generalData?.operatorStatistics
                                  ?.totalActiveOperators,
                              ],
                              [
                                "Inctive",
                                generalData?.operatorStatistics
                                  ?.totalInActiveOperators,
                              ],
                            ]}
                            options={{
                              backgroundColor: "transparent", // Set chart background color as transparent
                              chartArea: {
                                backgroundColor: "transparent", // Set chart area background color as transparent
                                top: "5%", // Set padding of the top of chart area to 0
                                left: 25, // Set padding of the left of chart area to 0
                                right: 0,
                              },
                              // pieHole: 0.4,
                              pieSliceText: "value", // Display the exact values of each option
                              colors: ["#51bb25", "#ff6150"], // Custom colors for Active and Inactive options respectively
                              is3D: true, // Set the chart type to 3D
                            }}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Row>
  );
};

export default Inventory;
