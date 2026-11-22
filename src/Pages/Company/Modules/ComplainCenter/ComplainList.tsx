import { Card, CardBody, Col, Progress, Row } from "reactstrap";
import { H3, H5, H6, LI, P, UL, Image, H4 } from "../../../../AbstractElements";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import SVG from "../../../../utils/CommonSvgIcon/SVG";
import "./ComplainList.css";
import Chart from "react-google-charts";
import UserProfile from "../../../../assets/companyProfile.png";
import { MdFilterList } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { setFilteredRole } from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";

// Complaint status tiles: label, colour and icon per status key from the API.
const ccIcon = (d: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const CC_STAT_META: Record<string, { label: string; color: string; soft: string; icon: JSX.Element }> = {
  InternalComplaints: { label: "Total", color: "var(--at-primary)", soft: "var(--at-primary-soft)", icon: ccIcon("M4 6h16M4 12h16M4 18h10") },
  New: { label: "New", color: "#2563EB", soft: "rgba(37,99,235,.14)", icon: ccIcon("M12 5v14M5 12h14") },
  InProgress: { label: "In progress", color: "#D97706", soft: "rgba(217,119,6,.15)", icon: ccIcon("M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z") },
  Pending: { label: "Pending", color: "#DC2626", soft: "rgba(220,38,38,.13)", icon: ccIcon("M10 8v8M14 8v8M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z") },
  Resolved: { label: "Resolved", color: "#65A30D", soft: "rgba(101,163,13,.15)", icon: ccIcon("M8 12.5l2.5 2.5L16 9.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z") },
};

const ComplainList = () => {


  const { complainCenterStatistics, complainCenterRoles, filteredRole } = useSelector((state: any) => state.complainCenter);
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
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
              }`,
            borderRadius: "5px",
          }}
          className={`${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
            }`}
        >
          <div
            style={{
              // padding: "10px",
              // height: "30px",
              // display: "flex",
              // justifyContent: "space-between",
              // alignItems: "center",
              width: "100%",
              height: "30px",
              display: "grid",
              gridTemplateColumns: "35% 45% 20%",
              alignItems: "center",
            }}
          >
            <div
              onClick={toggleContainerWidth}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                display: "grid",
                gridAutoColumns: "max-content",
                color: "white",
                paddingLeft: "15px",
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
                  paddingLeft: "35px",
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
                <div style={{ fontSize: "24px", color: "white", display: "flex", justifyContent: "center" }}><MdFilterList /></div>
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
                  //     url: `${CONTROLROOM_DASHBOARD_STATISTICS}?fromDate=${startDate}&toDate=${endDate}`,
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
                  //     url: `${CONTROLROOM_DASHBOARD_STATISTICS}?fromDate=${startDate}&toDate=${endDate}`,
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
                  //     url: `${CONTROLROOM_DASHBOARD_STATISTICS}?fromDate=${startDate}&toDate=${endDate}`,
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
              <Row>
                <Col xl="10"
                //  className="widget-sell"
                >
                  {/* Status tiles (redesign): icon badge + number + label; wraps on small screens */}
                  <div className="cc-stats">
                    {complainCenterStatistics.map((data: any, index: any) => {
                      const meta = CC_STAT_META[data.key] || CC_STAT_META.InternalComplaints;
                      return (
                        <div className="cc-stat" key={index}>
                          <span className="cc-stat__icon" style={{ background: meta.soft, color: meta.color }} aria-hidden="true">
                            {meta.icon}
                          </span>
                          <span className="cc-stat__text">
                            <strong className="cc-stat__num">{data.value}</strong>
                            <span className="cc-stat__label">{meta.label}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <Row>
                    <div
                      style={{
                        position: "relative",
                        // padding:"0px 12px"
                      }}
                    >
                      {/* Left angle bracket */}
                      <div>
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "15px",
                            transform: "translate(-50%, -50%)",
                            zIndex: "1",
                            cursor: "pointer",
                            fontSize: "13px",
                            backgroundColor: "lightgray",
                            padding: "10px 10px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "10px", // Margin added
                            marginLeft: "10px",
                          }}
                          onClick={scrollLeft}
                        >
                          <FaArrowLeft />
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
                        <li
                          style={{
                            backgroundColor: `${filteredRole == "All" ? "black" : "white"}`,

                            // boxShadow: "0px 3.5px 7px rgba(0, 0, 0, 0.2)",
                            border: "2px solid lightgray",
                            borderRadius: "8px",
                            padding: "0px 10px",
                            height: "40px",
                            marginRight: "8px",
                            listStyle: "none",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            marginBottom: "4.5px",
                            marginTop: "3.5px"
                          }}

                          onClick={() => {
                            dispatch(setFilteredRole("All"))
                          }}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
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

                              // width: "180px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <H5>
                              <span style={{
                                color: `${filteredRole == "All" ? "white" : "black"}`,
                              }}>
                                All
                              </span>
                            </H5>
                            <div
                              style={{
                                padding: "6px",
                                width: "22px",
                                height: "22px",
                                borderRadius: "100px",
                                backgroundColor: `${filteredRole == "All" ? "white" : "black"}`,
                                color: `${filteredRole == "All" ? "black" : "white"}`,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: "20px",
                                fontSize: "12px",
                                // fontFamily: "Sedan, serif",
                                // fontWeight: "400",
                                // fontStyle: "normal",
                              }}
                            >
                              {complainCenterStatistics[0]?.value}
                            </div>
                            {/* <H6 className="mt-1 mb-0">{data.percentage}</H6> */}
                          </div>
                        </li>
                        {complainCenterRoles.map((data: any, index: any) => (
                          <li
                            style={{
                              backgroundColor: `${filteredRole == data.name ? "black" : "white"}`,
                              // boxShadow: "0px 3.5px 7px rgba(0, 0, 0, 0.2)",
                              border: "2px solid lightgray",
                              borderRadius: "8px",
                              padding: "0px 10px",
                              height: "40px",
                              marginRight: "8px",
                              listStyle: "none",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              marginBottom: "4.5px",
                              marginTop: "3.5px",

                              // width: "auto", // Remove or keep it as auto

                            }}
                            key={index}
                            onClick={() => {
                              dispatch(setFilteredRole(data.name));
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "100px",
                                flexShrink: 0, // Prevent shrinking
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
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {/* Remove or increase the maxWidth and minWidth properties */}
                              <div style={{ minWidth: data.name.length < 10 ? "80px" : data.name.length < 10 ? "100px" : data.name.length < 14 ? "120px" : data.name.length < 20 ? "170px" : "180px", flexShrink: 0 }}>
                                <H5>
                                  <span style={{
                                    color: `${filteredRole == data.name ? "white" : "black"}`,
                                  }}>
                                    {data.name}
                                  </span>
                                </H5>
                              </div>

                              <div
                                style={{
                                  padding: "6px",
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "100px",
                                  backgroundColor: `${filteredRole == data.name ? "white" : "black"}`,
                                  color: `${filteredRole == data.name ? "black" : "white"}`,
                                  display: "flex",
                                  fontSize: "12px",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: "20px",
                                  flexShrink: 0, // Prevent shrinking
                                }}
                              >
                                {data.count}
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
                          right: "-15px",
                          transform: "translate(-50%, -50%)",
                          zIndex: "1",
                          cursor: "pointer",
                          fontSize: "13px",
                          backgroundColor: "lightgray",
                          padding: "10px 10px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          // marginRight: "10px", // Margin added
                          marginLeft: "5px",
                        }}
                        onClick={scrollRight}
                      >
                        <FaArrowRight />
                      </div>
                    </div>
                  </Row>
                </Col>
                <Col xl="2" lg="2" md="4" sm="12">
                  <div className="sale"

                    style={{
                      backgroundColor: "white", // Remove the background color
                      paddingTop: "0px"
                    }}>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%", // Set the width of the outer container
                          height: "200px", // Set the height of the outer container
                          backgroundColor: "white", // Remove the background color
                          marginTop: "15px",
                          marginBottom: "-30px"
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
                              ["New", complainCenterStatistics[1]?.value],
                              ["In Progress", complainCenterStatistics[2]?.value],
                              ["Pending", complainCenterStatistics[3]?.value],
                              ["Resolved", complainCenterStatistics[4]?.value],
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
                                "blue",
                                "orange",
                                "#ff6150",
                                "#51bb25",
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

            </div>
          </CardBody >
        </Card >
      </div >
    </>
  );
};

export default ComplainList;
