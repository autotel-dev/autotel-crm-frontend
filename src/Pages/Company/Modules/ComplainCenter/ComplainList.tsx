import { Card, CardBody, Col, Progress, Row } from "reactstrap";
import { H3, H5, H6, LI, P, UL, Image } from "../../../../AbstractElements";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import SVG from "../../../../utils/CommonSvgIcon/SVG";
import "./ComplainList.css";
import Chart from "react-google-charts";
import UserProfile from "../../../../assets/companyProfile.png";

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
  return (
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
                  fontSize: "26px",
                  color: "#1f2f3e",
                  marginBottom: "20px",
                }}
              >
                {data.count}
              </h5>
              <P className="d-flex">
                <span className={`bg-light-${data.color} me-2`}>
                  <SVG iconId={data.svgIcon} />
                </span>
                <span className={`font-${data.color}`}>{data.percentage}</span>
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
                      colors: ["#51bb25", "#ff6150", "blue", "orange"], // Custom colors for Active and Inactive options respectively
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
      <Row>
        <div
          style={{
            display: "flex",
            margin: "20px 0px",
            overflow: "scroll",
            scrollbarWidth: "none" /* Firefox */,
          }}
        >
          {topCountriesData.map((data, index) => (
            <li
              style={{
                backgroundColor: "lightblue",
                borderRadius: "8px",
                padding: "8px",
                marginRight: "8px",
                listStyle: "none",
                display: "flex",
                alignItems: "center",
              }}
              key={index}
            >
              <img
                width={30}
                height={30}
                src={UserProfile}
                className="img-fluid"
                style={{
                  borderRadius: "100px",
                }}
                alt="user"
              />
              <div
                className="Countries"
                style={{
                  marginLeft: "10px",
                  width: "150px",
                }}
              >
                <H5>{data.country}</H5>
                {/* <H6 className="mt-1 mb-0">{data.percentage}</H6> */}
              </div>
            </li>
          ))}
        </div>
      </Row>
      {/* <Card className="widget-sell">
        <CardBody className="pb-0">
          
        </CardBody>
      </Card> */}
    </Col>
    // <Row
    //   style={{
    //     marginTop: "5px",
    //   }}
    // >
    //   {supportStatistics?.map((item: any, index: any) => {
    //     if (index < 4) {
    //       return (

    // <Col sm={12} xs={12} md={6} lg={3} xl={3} key={index}>
    //   <div
    //     style={{
    //       margin: "5px",
    //       boxShadow: "5px 5px 10px lightgray",
    //       borderRadius: "15px",
    //     }}
    //   >
    //     <Card className="ecommerce-widget">
    //       <CardBody className="support-ticket-font">
    //         <Row>
    //           <Col xs={12}>
    //             <H3 className="total-num counter">
    //               <CountUp
    //                 end={item.value}
    //                 style={{
    //                   color: "black",
    //                   fontSize: "22px",
    //                   fontWeight: "bold",
    //                 }}
    //               />
    //             </H3>

    //             <span
    //               style={{
    //                 color: "gray",
    //                 fontSize: "18px",
    //                 fontWeight: "bold",
    //               }}
    //             >
    //               {item.key}
    //             </span>
    //           </Col>
    //         </Row>
    //         <Progress
    //           className="sm-progress-bar mt-4"
    //           color={
    //             item.key === "Pending Complains"
    //               ? "danger"
    //               : item.key === "New Complains"
    //               ? "seconadry"
    //               : item.key === "Resolved Complains"
    //               ? "primary"
    //               : "warning"
    //           }
    //           value={(item.value / supportStatistics[4].value) * 100}
    //         />
    //         <div
    //           style={{
    //             display: "flex",
    //             justifyContent: "end",
    //             marginTop: "10px",
    //           }}
    //         >
    //           <span
    //             style={{
    //               color: `${
    //                 item.key === "Pending Tickets"
    //                   ? "info"
    //                   : item.key === "New Tickets"
    //                   ? "seconadry"
    //                   : item.key === "Resolved Tickets"
    //                   ? "primary"
    //                   : "warning"
    //               }`,
    //               fontSize: "20px",
    //               fontWeight: "bold",
    //             }}
    //           >
    //             {((item.value / supportStatistics[4].value) * 100)
    //               .toFixed(1)
    //               .toString() !== "NaN"
    //               ? ((item.value / supportStatistics[4].value) * 100)
    //                   .toFixed(1)
    //                   .toString()
    //               : 0}
    //             %
    //           </span>
    //         </div>
    //       </CardBody>
    //     </Card>
    //   </div>
    // </Col>
    //         );
    //       }
    //     })}
    //   </Row>
  );
};

export default ComplainList;
