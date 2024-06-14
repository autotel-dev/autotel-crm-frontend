// import { Container, Row, Table } from "reactstrap";
// import { Button } from "reactstrap";
// import { recentOrdersBody } from "../../../../Data/Dashboard/ShoppingPlace/RecentOrders";
// import { H2, H3, H4, Image } from "../../../../AbstractElements";
// import { dynamicImage } from "../../../../Service/index";
// import { Link } from "react-router-dom";
// import { Href } from "../../../../utils/Constant";
// import { Card, CardBody, CardHeader, Col } from "reactstrap";
// import { useSelector } from "react-redux";
// import { useEffect, useRef, useState } from "react";
// import { formatUnderscoredString } from "../../../../Utilities/globals/globals";

// const RecentLogsFullTable = () => {
//   const { recentLogs } = useSelector((state: any) => state.serverManagement);
//   const recentLogsHeader = [
//     "ID",
//     "IP Address",
//     "Date & Time",
//     "Activity",
//     "Username",
//     "Role",
//   ];
//   const [dataList, setDataList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const containerRef = useRef(null);
//   const { userPersonalizationData } = useSelector(
//     (state: any) => state.personalization
//   );
//   function hexToRgb(hex: any) {
//     // Remove the hash sign if present
//     hex = hex?.replace(/^#/, "");
//     // Parse the hex values to RGB
//     const bigint = parseInt(hex, 16);
//     const r = (bigint >> 16) & 255;
//     const g = (bigint >> 8) & 255;
//     const b = bigint & 255;
//     return { r, g, b };
//   }

//   // Usage
//   const hexColor = "#ff0000"; // Example hex color
//   const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB

//   useEffect(() => {
//     // Initially display the first 12 elements
//     setDataList(recentLogs.slice(0, 12));
//   }, []);

//   const handleScroll = () => {
//     if (!containerRef.current) return;

//     const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
//     const bottomOffset = scrollHeight - (scrollTop + clientHeight);

//     if (bottomOffset < 50) {
//       // If scrolled to the bottom with a 50px buffer
//       const nextBatch = recentLogs.slice(dataList.length, dataList.length + 6);
//       setDataList((prevData) => [...prevData, ...nextBatch]);
//     }
//   };
//   const [isHovered, setIsHovered] = useState(false);
//   const [idd, setIdd] = useState("");

//   return (
//     <div style={{ marginTop: "170px" }}>
//       <Row className="project-card">
//         <Card className="invoice-card">
//           <CardHeader className="pb-0">
//             <H2>Recent logs</H2>
//           </CardHeader>
//           <CardBody className="transaction-card">
//             <div
//               ref={containerRef}
//               className="table-responsive theme-scrollbar recent-wrapper"
//               style={{
//                 overflowY: "scroll",
//                 maxHeight: "calc(66vh - 20px)", // Subtract scrollbar width from max height
//                 WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
//                 scrollbarWidth: "thin", // Specify scrollbar width
//                 WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
//                 MozBorderRadius: "5px", // For Mozilla Firefox
//                 borderRadius: "5px", // For other browsers
//                 scrollbarColor: "lightgray transparent", // Specify scrollbar color
//               }}
//               onScroll={handleScroll}
//             >
//               <div className="">
//                 <Table className="display order-wrapper" id="recent-order">
//                   <thead>
//                     <tr>
//                       {recentLogsHeader.map((data, index) => (
//                         <th
//                           key={index}
//                           style={{ fontWeight: "bold", width: "15%" }}
//                         >
//                           {data}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {dataList.map((data: any, index: any) => {
//                       return (
//                         <tr
//                           key={index}
//                           onMouseEnter={() => {
//                             setIsHovered(true);
//                             setIdd(index);
//                           }}
//                           onMouseLeave={() => setIsHovered(false)}
//                           style={{
//                             backgroundColor:
//                               isHovered && idd == index
//                                 ? userPersonalizationData == null
//                                   ? "#D6EEEE"
//                                   : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
//                                 : "transparent",
//                             transition: "background-color 0.3s",
//                           }}
//                         >
//                           <td style={{ width: "15%" }}>{data.systemLogID}</td>
//                           <td style={{ width: "15%" }}>
//                             <div className="d-flex">
//                               <div className="flex-grow-1 ms-2">
//                                 <Link to={Href}>
//                                   <H4>{data.IP}</H4>
//                                 </Link>
//                               </div>
//                             </div>
//                           </td>
//                           <td style={{ width: "15%" }}>
//                             {new Date(data.createdAt)
//                               .toLocaleString("en-US", {
//                                 month: "short",
//                                 day: "2-digit",
//                                 year: "numeric",
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                                 second: "2-digit",
//                               })
//                               .toString()}
//                           </td>
//                           <td
//                             style={{ width: "15%" }}
//                             className={`txt-primary`}
//                           >
//                             {formatUnderscoredString(data.activity)}
//                           </td>
//                           <td style={{ width: "15%" }}>
//                             {data.user?.fullName == null
//                               ? "N/A"
//                               : data.user?.fullName}
//                           </td>
//                           <td style={{ width: "15%" }}>
//                             {formatUnderscoredString(data.role)}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </Table>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       </Row>
//     </div>
//   );
// };

// export default RecentLogsFullTable;



import { Container, Row, Table, Button, Card, CardBody, CardHeader, Col } from "reactstrap";
import { recentOrdersBody } from "../../../../Data/Dashboard/ShoppingPlace/RecentOrders";
import { H2, H3, H4, Image } from "../../../../AbstractElements";
import { dynamicImage } from "../../../../Service/index";
import { Link } from "react-router-dom";
import { Href } from "../../../../utils/Constant";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { formatUnderscoredString } from "../../../../Utilities/globals/globals";

const RecentLogsFullTable = () => {
  const { recentLogs } = useSelector((state: any) => state.serverManagement);
  const recentLogsHeader = [
    "ID",
    "IP Address",
    "Date & Time",
    "Activity",
    "Username",
    "Role",
  ];
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  
  function hexToRgb(hex: any) {
    hex = hex?.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  const hexColor = "#ff0000"; // Example hex color
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB

  useEffect(() => {
    setDataList(recentLogs.slice(0, 12));
  }, [recentLogs]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const bottomOffset = scrollHeight - (scrollTop + clientHeight);

    if (bottomOffset < 50) {
      const nextBatch = recentLogs.slice(dataList.length, dataList.length + 6);
      setDataList((prevData) => [...prevData, ...nextBatch]);
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  return (
    <div style={{ marginTop: "170px" }}>
      <Row className="project-card">
        <Card className="invoice-card">
          <CardHeader className="pb-0">
            <H2>Recent logs</H2>
          </CardHeader>
          <CardBody className="transaction-card">
            <Table className="display order-wrapper" id="recent-order">
              <thead>
                <tr>
                  {recentLogsHeader.map((data, index) => (
                    <th
                      key={index}
                      style={{ fontWeight: "bold", width: "15%" }}
                    >
                      {data}
                    </th>
                  ))}
                </tr>
              </thead>
            </Table>
            <div
              ref={containerRef}
              className="table-responsive theme-scrollbar recent-wrapper"
              style={{
                overflowY: "scroll",
                maxHeight: "calc(66vh - 20px)",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                WebkitBorderRadius: "5px",
                MozBorderRadius: "5px",
                borderRadius: "5px",
                scrollbarColor: "lightgray transparent",
              }}
              onScroll={handleScroll}
            >
              <Table className="display order-wrapper" id="recent-order">
                <tbody>
                  {dataList.map((data: any, index: any) => (
                    <tr
                      key={index}
                      onMouseEnter={() => {
                        setIsHovered(true);
                        setIdd(index);
                      }}
                      onMouseLeave={() => setIsHovered(false)}
                      style={{
                        backgroundColor:
                          isHovered && idd == index
                            ? userPersonalizationData == null
                              ? "#D6EEEE"
                              : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
                            : "transparent",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <td style={{ width: "15%" }}>{data.systemLogID}</td>
                      <td style={{ width: "15%" }}>
                        <div className="d-flex">
                          <div className="flex-grow-1 ms-2">
                            <Link to={Href}>
                              <H4>{data.IP}</H4>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "15%" }}>
                        {new Date(data.createdAt)
                          .toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          .toString()}
                      </td>
                      <td
                        style={{ width: "15%" }}
                        className={`txt-primary`}
                      >
                        {formatUnderscoredString(data.activity)}
                      </td>
                      <td style={{ width: "15%" }}>
                        {data.user?.fullName == null
                          ? "N/A"
                          : data.user?.fullName}
                      </td>
                      <td style={{ width: "15%" }}>
                        {formatUnderscoredString(data.role)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Row>
    </div>
  );
};

export default RecentLogsFullTable;
