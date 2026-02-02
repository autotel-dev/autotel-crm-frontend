import React, { useRef } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { H4 } from "../../../../../../../../../../AbstractElements";
import Chart from "react-google-charts";
import { useSelector } from "react-redux";

const ActivityTypes = () => {
  const { operationStatisticsData } = useSelector(
    (state: any) => state.salesDashboard,
  );

  // Create a ref to hold the chart instance
  const chartRef = useRef<Chart | null>(null);

  // Handler function to handle chart slice click event
  const handleChartSelect = () => {
    if (chartRef.current) {
      const chart = chartRef.current; // Access the chart instance

      // Ensure the chart instance is valid
      if (chart) {
        // console.log("chart", chart);
      }
    }
  };

  return (
    <Col xl="3">
      <Card
        className="widget-sell handle"
        style={{ minHeight: "410px", maxHeight: "410px" }}
      >
        <CardBody className="pb-0">
          <Row>
            <Col xl="12" lg="12" sm="12" className="mb-3">
              <div
                className="sale"
                style={{ minHeight: "370px", maxHeight: "370px" }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <H4>Activity Types</H4>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "90%",
                      height: "250px",
                      marginTop: "20%",
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
                        ref={chartRef} // Attach the ref to the chart component
                        width={"100%"} // Make it take the full width of the parent container
                        height={250} // Set a fixed height
                        chartType={"PieChart"}
                        loader={<div>{"Loading Chart"}</div>}
                        data={[
                          ["Task", "Hours per Day"],
                          [
                            "Transfer",
                            operationStatisticsData?.totalTransferActivities,
                          ],
                          [
                            "Remove",
                            operationStatisticsData?.totalRemoveActivities,
                          ],
                          [
                            "Redo",
                            operationStatisticsData?.totalRedoActivities,
                          ],
                          [
                            "Ownership Change",
                            operationStatisticsData?.totalOwnershipChangeActivities,
                          ],
                          [
                            "Temporary Remove",
                            operationStatisticsData?.totalTemporaryRemoveActivities,
                          ],
                          [
                            "Customer Data Update",
                            operationStatisticsData?.totalCustomerDataUpdateActivities,
                          ],
                        ]}
                        options={{
                          backgroundColor: "transparent",
                          chartArea: {
                            backgroundColor: "transparent",
                            top: "5%",
                            left: 25,
                            right: 0,
                            botton: 0,
                          },
                          pieSliceText: "value",
                          colors: [
                            "#51bb25",
                            "#ff6150",
                            "#51bb25",
                            "#ff6150",
                            "#51bb25",
                            "#ff6150",
                          ], // Custom colors for Active and Inactive options respectively
                        }}
                        // Attach the select event listener directly in the Chart component
                        chartEvents={[
                          {
                            eventName: "select",
                            callback: handleChartSelect, // Call the handler when a slice is clicked
                          },
                        ]}
                        rootProps={{
                          "data-testid": "2",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ActivityTypes;
