import { Card, CardBody, Col, Progress, Row } from "reactstrap";
import { H3, H5, H6, LI, P, UL, Image } from "../../../../AbstractElements";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import SVG from "../../../../utils/CommonSvgIcon/SVG";
import "./ComplainList.css";
import Chart from "react-google-charts";
import UserProfile from "../../../../assets/companyProfile.png";
import { useEffect, useRef, useState } from "react";

const ComplainList = () => {
  const saleRevenueData = [
    {
      title: "Sale",
      count: "654",
      svgIcon: "arrow-down",
      percentage: "- 36.28%",
      time: "Then last week",
      color: "secondary",
    },
    {
      title: "Revenue",
      count: "$45,680",
      svgIcon: "arrow-top",
      percentage: "+14.28%",
      time: "Since last month",
      color: "primary",
    },
    {
      title: "Conversion",
      count: "34%",
      svgIcon: "arrow-down",
      percentage: "- 36.28%",
      time: "Then last week",
      color: "secondary",
    },
    {
      title: "Leads",
      count: "654",
      svgIcon: "arrow-top",
      percentage: "+20.28%",
      time: "Since last 6 month",
      color: "primary",
    },
    {
      title: "Conversion",
      count: "34%",
      svgIcon: "arrow-down",
      percentage: "- 36.28%",
      time: "Then last week",
      color: "secondary",
    },
  ];
  const topCountriesData = [
    {
      color: "primary",
      img: "04",
      country: "Uniter States",
      percentage: "60%",
      countrybadge: "primary",
    },
    {
      color: "secondary",
      img: "05",
      country: "Germany",
      percentage: "51%",
      countrybadge: "secondary",
    },
    {
      color: "dark",
      img: "06",
      country: "New Zealand",
      percentage: "52%",
      countrybadge: "dark",
    },
    {
      color: "warning",
      img: "07",
      country: "Australia",
      percentage: "62%",
      countrybadge: "warning",
    },
    {
      color: "primary",
      img: "04",
      country: "Uniter States",
      percentage: "60%",
      countrybadge: "primary",
    },
    {
      color: "secondary",
      img: "05",
      country: "Germany",
      percentage: "51%",
      countrybadge: "secondary",
    },
    {
      color: "dark",
      img: "06",
      country: "New Zealand",
      percentage: "52%",
      countrybadge: "dark",
    },
    {
      color: "warning",
      img: "07",
      country: "Australia",
      percentage: "62%",
      countrybadge: "warning",
    },
    {
      color: "primary",
      img: "04",
      country: "Uniter States",
      percentage: "60%",
      countrybadge: "primary",
    },
    {
      color: "secondary",
      img: "05",
      country: "Germany",
      percentage: "51%",
      countrybadge: "secondary",
    },
    {
      color: "dark",
      img: "06",
      country: "New Zealand",
      percentage: "52%",
      countrybadge: "dark",
    },
    {
      color: "warning",
      img: "07",
      country: "Australia",
      percentage: "62%",
      countrybadge: "warning",
    },
    {
      color: "primary",
      img: "04",
      country: "Uniter States",
      percentage: "60%",
      countrybadge: "primary",
    },
    {
      color: "secondary",
      img: "05",
      country: "Germany",
      percentage: "51%",
      countrybadge: "secondary",
    },
    {
      color: "dark",
      img: "06",
      country: "New Zealand",
      percentage: "52%",
      countrybadge: "dark",
    },
    {
      color: "warning",
      img: "07",
      country: "Australia",
      percentage: "62%",
      countrybadge: "warning",
    },
  ];
  const { supportStatistics } = useSelector((state: any) => state.support);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecetedServersDropdownOpen, setIsConnecetedServersDropdownOpen] =
    useState(false);
  const [containerWidth, setContainerWidth] = useState("350px");
  const [serverID, setServerID] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null); // Add type assertion here

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      // Add type assertion here
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleDropdown = (e: any) => {
    e.stopPropagation(); // Stop event propagation
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleContainerWidth = () => {
    if (containerWidth === "350px") {
      setContainerWidth("170px");
      if (isDropdownOpen) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    } else {
      setContainerWidth("350px");
    }
  };

  const dispatch = useDispatch();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = yesterday.toISOString();
  const endDate = new Date().toISOString();

  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);

  const [isHovered, setIsHovered] = useState(false);
  const [id, setId] = useState("");

  const [scrollPosition, setScrollPosition] = useState(0);

  // Function to handle scrolling left
  const scrollLeft = () => {
    const container = document.getElementById("scrollContainer");
    if (container) {
      container.scrollLeft -= 100; // Adjust the scrolling amount as needed
      setScrollPosition(container.scrollLeft);
    }
  };

  // Function to handle scrolling right
  const scrollRight = () => {
    const container = document.getElementById("scrollContainer");
    if (container) {
      container.scrollLeft += 100; // Adjust the scrolling amount as needed
      setScrollPosition(container.scrollLeft);
    }
  };
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <div
          style={{
            width: containerWidth === "350px" ? "350px" : "170px",
            overflow: "hidden",
            height: "30px",
            transition: "width 0.5s",
            color: "white",
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.customColor2
            }`,
            borderRadius: "5px",
          }}
          className={`${
            userPersonalizationData?.customColor2 == null ? "btn-primary" : ""
          }`}
        >
          <div
            style={{
              padding: "10px",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              onClick={toggleContainerWidth}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: "white",
                paddingRight: "10px",
                borderRight:
                  containerWidth === "350px" ? "1px solid black" : "0px",
              }}
            >
              {containerWidth === "350px" ? "Hide Analytics" : "Show Analytics"}
            </div>

            {containerWidth === "350px" && (
              <div
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "white",
                  paddingRight: "45px",
                  borderRight: "1px solid black",
                }}
                onClick={(e: any) => {
                  toggleDropdown(e);
                }}
              >
                Filter : {selectedFilter}
              </div>
            )}
            {/*  */}
            {containerWidth === "350px" && (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={(e: any) => {
                  toggleDropdown(e);
                }}
                // onMouseOver={toggleDropdown}
                // onMouseOut={toggleDropdown}
              >
                <div style={{ fontSize: "24px", color: "white" }}>&#9776;</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div
          ref={dropdownRef}
          style={{ width: "100%", display: "flex", justifyContent: "end" }}
        >
          {isDropdownOpen && (
            <div
              className="custom-dropdown-analytics"
              style={{ width: "350px", position: "absolute", zIndex: "1" }}
            >
              {isDropdownOpen && (
                <div className="dropdown-options-analytics">
                  <div
                    className="dropdown-item"
                    // onClick={(e) => {
                    //   setSelectedFilter("Today");
                    //   const yesterday = new Date();
                    //   yesterday.setDate(yesterday.getDate() - 1);
                    //   const startDate = yesterday.toISOString();
                    //   const endDate = new Date().toISOString();
                    //   setFromDate(startDate);
                    //   setToDate(endDate);

                    //   getAll({
                    //     url: `control-room/dashboard/statistics?fromDate=${startDate}&toDate=${endDate}`,
                    //   }).then((data: any) => {
                    //     // // // console.log("api call --- >", data);

                    //     if (data !== undefined) {
                    //       if (data.success) {
                    //         // // // // console.log("length --- >", data.data);
                    //         dispatch(setDashboardStatistics(data.data));
                    //         toggleDropdown(e);
                    //       }
                    //     }
                    //   });
                    // }}
                  >
                    Today
                  </div>
                  <div
                    className="dropdown-item"
                    // onClick={(e) => {
                    //   setSelectedFilter("1 Week");
                    //   const oneWeek = new Date();
                    //   oneWeek.setDate(oneWeek.getDate() - 7);
                    //   const startDate = oneWeek.toISOString();
                    //   const endDate = new Date().toISOString();
                    //   setFromDate(startDate);
                    //   setToDate(endDate);

                    //   getAll({
                    //     url: `control-room/dashboard/statistics?fromDate=${startDate}&toDate=${endDate}`,
                    //   }).then((data: any) => {
                    //     // // // console.log("api call --- >", data);

                    //     if (data !== undefined) {
                    //       if (data.success) {
                    //         // // // // console.log("length --- >", data.data);

                    //         dispatch(setDashboardStatistics(data.data));
                    //         toggleDropdown(e);
                    //       }
                    //     }
                    //   });
                    // }}
                  >
                    1 Week
                  </div>
                  <div
                    className="dropdown-item"
                    // onClick={(e) => {
                    //   setSelectedFilter("1 Month");
                    //   const oneMonth = new Date();
                    //   oneMonth.setDate(oneMonth.getDate() - 30);
                    //   const startDate = oneMonth.toISOString();
                    //   const endDate = new Date().toISOString();
                    //   setFromDate(startDate);
                    //   setToDate(endDate);

                    //   getAll({
                    //     url: `control-room/dashboard/statistics?fromDate=${startDate}&toDate=${endDate}`,
                    //   }).then((data: any) => {
                    //     // // // console.log("api call --- >", data);

                    //     if (data !== undefined) {
                    //       if (data.success) {
                    //         // // // // console.log("length --- >", data.data);
                    //         dispatch(setDashboardStatistics(data.data));
                    //         toggleDropdown(e);
                    //       }
                    //     }
                    //   });
                    // }}
                  >
                    1 Month
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Card
          style={{
            height: containerWidth === "350px" ? "100%" : "0",
            overflow: "hidden",
            transition: "height 0.5s",
            marginTop: "20px",
          }}
        >
          <CardBody>
            <div>
              <Col xl="12" className="widget-sell">
                <Row>
                  {saleRevenueData.map((data: any, index: any) => (
                    <Col
                      xl="2"
                      lg="2"
                      md="4"
                      sm="12"
                      key={index}
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      <div className="sale">
                        <H3>{data.title}</H3>
                        <h5
                          style={{
                            fontWeight: "bold",
                            fontSize: "24px",
                            color: "#1f2f3e",
                            marginBottom: "15px",
                          }}
                        >
                          {data.count}
                        </h5>
                        <P className="d-flex">
                          <span className={`bg-light-${data.color} me-2`}>
                            <SVG iconId={data.svgIcon} />
                          </span>
                          <span className={`font-${data.color}`}>
                            {data.percentage}
                          </span>
                        </P>
                        <span className="sale-title">{data.time}</span>
                      </div>
                    </Col>
                  ))}
                  <Col xl="2" lg="2" md="4" sm="12">
                    <div className="sale">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%", // Set the width of the outer container
                            height: "200px", // Set the height of the outer container
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
                                ["Complains", "Hours per Day"],
                                ["Pending", 2],
                                ["New", 3],
                                ["In Progress", 5],
                                ["Resolved", 4],
                              ]}
                              options={{
                                backgroundColor: "transparent", // Set chart background color as transparent
                                chartArea: {
                                  backgroundColor: "transparent", // Set chart area background color as transparent
                                  top: "5%", // Set padding of the top of chart area to 0
                                  left: "3%", // Set padding of the left of chart area to 0
                                  right: 0,
                                },
                                pieSliceText: "value", // Display the exact values of each option
                                colors: [
                                  "#51bb25",
                                  "#ff6150",
                                  "blue",
                                  "orange",
                                ], // Custom colors for Active and Inactive options respectively
                                is3D: true, // Set the chart type to 3D
                                legend: { position: "none" }, // Remove legend
                              }}
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
                {/* <Row>
                  <div
                    style={{
                      display: "flex",
                      margin: "20px 0px",
                      overflow: "scroll",
                      scrollbarWidth: "none",
                    }}
                  >
                    {topCountriesData.map((data, index) => (
                      <li
                        style={{
                          backgroundColor: "#f5f6f9",
                          borderRadius: "8px",
                          padding: "8px",
                          marginRight: "8px",
                          listStyle: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                        key={index}
                      >
                        <div
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "100px",
                          }}
                        >
                          <img
                            height="100%"
                            width="100%"
                            src={UserProfile}
                            alt="user"
                            style={{
                              borderRadius: "100px",
                            }}
                          />
                        </div>
                        <div
                          className="Countries"
                          style={{
                            marginLeft: "10px",
                            width: "180px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <H5>{data.country}</H5>
                          <div
                            style={{
                              padding: "6px",
                              width: "30px",
                              height: "30px",
                              borderRadius: "100px",
                              backgroundColor: "black",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // fontFamily: "Sedan, serif",
                              // fontWeight: "400",
                              // fontStyle: "normal",
                            }}
                          >
                            5
                          </div>
                        </div>
                      </li>
                    ))}
                  </div>
                </Row> */}
                <Row>
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    {/* Left angle bracket */}
                    <div>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "20px",
                          transform: "translate(-50%, -50%)",
                          zIndex: "1",
                          cursor: "pointer",
                          fontSize: "24px",
                          backgroundColor: "lightgray",
                          padding: "10px 20px",
                          borderRadius: "50%",
                          marginRight: "10px", // Margin added
                          marginLeft: "10px",
                        }}
                        onClick={scrollLeft}
                      >
                        &lt;
                      </div>
                    </div>

                    {/* Code block with scroll */}
                    <div
                      id="scrollContainer"
                      style={{
                        display: "flex",
                        margin: "20px 50px",
                        overflowX: "scroll",
                        scrollbarWidth: "none" /* Firefox */,
                        width:
                          "calc(100% - 100px)" /* Adjust width to accommodate brackets */,
                        paddingLeft:
                          "24px" /* Add left padding to make space for left bracket */,
                        paddingRight:
                          "24px" /* Add right padding to make space for right bracket */,
                      }}
                      // onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
                    >
                      {topCountriesData.map((data, index) => (
                        <li
                          style={{
                            backgroundColor: "#f5f6f9",
                            borderRadius: "8px",
                            padding: "8px",
                            marginRight: "8px",
                            listStyle: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                          key={index}
                        >
                          <div
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "100px",
                            }}
                          >
                            <img
                              height="100%"
                              width="100%"
                              src={UserProfile}
                              alt="user"
                              style={{
                                borderRadius: "100px",
                              }}
                            />
                          </div>
                          <div
                            className="Countries"
                            style={{
                              marginLeft: "10px",
                              width: "180px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <H5>{data.country}</H5>
                            <div
                              style={{
                                padding: "6px",
                                width: "30px",
                                height: "30px",
                                borderRadius: "100px",
                                backgroundColor: "black",
                                color: "white",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // fontFamily: "Sedan, serif",
                                // fontWeight: "400",
                                // fontStyle: "normal",
                              }}
                            >
                              5
                            </div>
                            {/* <H6 className="mt-1 mb-0">{data.percentage}</H6> */}
                          </div>
                        </li>
                      ))}
                    </div>

                    {/* Right angle bracket */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-20px",
                        transform: "translate(-50%, -50%)",
                        zIndex: "1",
                        cursor: "pointer",
                        fontSize: "24px",
                        backgroundColor: "lightgray",
                        padding: "10px 20px",
                        borderRadius: "50%",
                        // marginRight: "10px", // Margin added
                        marginLeft: "5px",
                      }}
                      onClick={scrollRight}
                    >
                      &gt;
                    </div>
                  </div>
                </Row>
              </Col>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default ComplainList;
