import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Modal,
  ModalBody,
  Row,
  Table,
} from "reactstrap";
import { H4, UL } from "../../../../../../../../../../AbstractElements";
import { MdFilterList } from "react-icons/md";
import P2 from "../../../../../../../../../../CommonElements/Paragraph/P2Element";
import { useSelector } from "react-redux";
import { formatUnderscoredString } from "../../../../../../../../../../Utilities/globals/globals";
import P3 from "../../../../../../../../../../CommonElements/Paragraph/P3Element";
import { Select } from "antd";

interface ActivityTypesTableProps {
  toggleDropdown: any;
  selectedFilter: any;
  dropdownRef: any;
  isDropdownOpen: any;
  setSelectedFilter: any;
  setFromDate: any;
  fromDate: any;
  toDate: any;
  setToDate: any;
  addToggle: any;
  addModal: any;
  activityType: any;
  setActivityType: any;
}

const ActivityTypesTable: React.FC<ActivityTypesTableProps> = ({
  toggleDropdown,
  selectedFilter,
  dropdownRef,
  isDropdownOpen,
  setSelectedFilter,
  setFromDate,
  fromDate,
  toDate,
  setToDate,
  addToggle,
  addModal,
  activityType,
  setActivityType,
}) => {
  const activitiesHeader = ["Date", "Status", "Type", "User", "Installer"];
  const { operationActivitiesData } = useSelector(
    (state: any) => state.salesDashboard
  );

  const activityTypesList = [
    { label: "Transfer", value: "TRANSFER" },
    { label: "Remove", value: "REMOVE" },
    { label: "Redo", value: "REDO" },
    { label: "Customer Data Update", value: "CUSTOMER_DATA_UPDATE" },
    { label: "Ownership Change", value: "OWNERSHIP_CHANGE" },
    { label: "Temporary Remove", value: "TEMPORARY_REMOVE" },
  ];

  const daysFilter = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "1 Week", value: "1 Week" },
    { label: "1 Month", value: "1 Month" },
    { label: "Custom", value: "Custom" },
  ];

  return (
    <Col xl="6" className="box">
      <Row className="handle1">
        <Col xl="12" lg="12">
          <Card
            className="deal-open"
            style={{ minHeight: "410px", maxHeight: "410px" }}
          >
            <CardHeader className="pb-0">
              <div
                className="header-top"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <H4 className="m-0">
                  {formatUnderscoredString(
                    operationActivitiesData?.activityType
                  )}{" "}
                  Activites
                </H4>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <Select
                    value={activityType !== "" ? activityType : null}
                    // showSearch
                    style={{ width: "200px", height: 36 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").includes(input)
                    }
                    onChange={(e) => {
                      setActivityType(e);
                    }}
                    options={activityTypesList}
                  />
                  <Select
                    value={selectedFilter !== "" ? selectedFilter : null}
                    // showSearch
                    style={{ width: "200px", height: 36 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").includes(input)
                    }
                    onChange={(e) => {
                      // console.log(e);
                      setSelectedFilter(e);
                      if (e == "Yesterday") {
                        const dayBeforeYesterday = new Date();

                        dayBeforeYesterday.setDate(
                          dayBeforeYesterday.getDate() - 2
                        );

                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const startDate = dayBeforeYesterday.toISOString();
                        const endDate = yesterday.toISOString();
                        setFromDate(startDate);
                        setToDate(endDate);
                      }
                      if (e == "Today") {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const startDate = yesterday.toISOString();
                        const endDate = new Date().toISOString();
                        setFromDate(startDate);
                        setToDate(endDate);
                      }
                      if (e == "1 Week") {
                        const oneWeek = new Date();
                        oneWeek.setDate(oneWeek.getDate() - 7);
                        const startDate = oneWeek.toISOString();
                        const endDate = new Date().toISOString();
                        setFromDate(startDate);
                        setToDate(endDate);
                      }
                      if (e == "1 Month") {
                        const oneMonth = new Date();
                        oneMonth.setDate(oneMonth.getDate() - 30);
                        const startDate = oneMonth.toISOString();
                        const endDate = new Date().toISOString();
                        setFromDate(startDate);
                        setToDate(endDate);
                      }
                      if (e == "Custom") {
                        setSelectedFilter("Custom");
                        addToggle();
                      }
                    }}
                    options={daysFilter}
                  />

                  <Modal
                    isOpen={addModal}
                    toggle={addToggle}
                    size="md"
                    centered
                  >
                    <div className="modal-header">
                      <H4 className="modal-title">Custom Filter Date</H4>
                      <Button
                        color="transprant"
                        className="btn-close"
                        onClick={addToggle}
                      ></Button>
                    </div>

                    <ModalBody className="modal-content">
                      <form className="form-bookmark needs-validation">
                        <Row>
                          <FormGroup
                            className="col-md-12 create-group"
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <div>Date From:</div>
                            <Col md={12}>
                              <input
                                className="form-control"
                                type="date"
                                value={fromDate.slice(0, 10)}
                                onChange={(e) => {
                                  setFromDate(
                                    new Date(e.target.value).toISOString()
                                  );
                                  // console.log("e", e.target.value);
                                }}
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup
                            className="col-md-12 create-group"
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <div>Date To:</div>
                            <Col md={12}>
                              <input
                                className="form-control"
                                type="date"
                                value={toDate.slice(0, 10)}
                                onChange={(e) => {
                                  // console.log(e.target.value);
                                  setToDate(
                                    new Date(e.target.value).toISOString()
                                  );
                                }}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "end",
                            marginTop: "-20px",
                          }}
                        >
                          <Button
                            //   disabled={generalloading ? true : false}
                            color="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              addToggle();
                            }}
                          >
                            Cancel
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            color="primary"
                            className="me-1"
                            //   onClick={(e) => {
                            //     e.preventDefault();
                            //     getAll({
                            //       url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${fromDate}&toDate=${toDate}`,
                            //     }).then((data: any) => {
                            //       toggleDropdown(e);
                            //       // console.log("api call --- >", data);
                            //       if (data !== undefined) {
                            //         if (data.success) {
                            //           // // console.log("length --- >", data.data);
                            //           dispatch(
                            //             setOperatorPerformance(
                            //               data.data
                            //             )
                            //           );
                            //           setGeneralLoading(false);
                            //           addToggle();
                            //           // setSelectedFilter("Today");
                            //         }
                            //         if (!data.success) {
                            //           // // // console.log("length --- >", data.data);
                            //           dispatch(
                            //             setOperatorPerformance([])
                            //           );
                            //           setGeneralLoading(false);
                            //           addToggle();
                            //         }
                            //       }
                            //     });
                            //   }}
                          >
                            Set
                            {/* {generalloading ? "Loading ..." : `Set`} */}
                          </Button>
                        </div>
                      </form>
                    </ModalBody>
                  </Modal>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  margin: "15px 0px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "32%",
                    padding: "6px",
                    textAlign: "center",
                    backgroundColor: "rgb(255, 97, 80)",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  <P2>
                    Assigned:&nbsp;
                    {operationActivitiesData?.statuses?.assigned}
                  </P2>
                </div>
                <div
                  style={{
                    width: "32%",
                    padding: "6px",
                    textAlign: "center",
                    backgroundColor: "rgb(51, 191, 191)",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  <P2>
                    Performed: &nbsp;
                    {operationActivitiesData?.statuses?.installed}
                  </P2>
                </div>
                <div
                  style={{
                    width: "32%",
                    padding: "6px",
                    textAlign: "center",
                    backgroundColor: "rgb(81, 187, 37)",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  <P2>
                    Completed:&nbsp;
                    {operationActivitiesData?.statuses?.completed}
                  </P2>
                </div>
              </div>
              <UL
                className="theme-scrollbar"
                style={{
                  overflowY: "scroll",
                  overflowX: "auto",
                  maxHeight: "calc(38vh - 20px)", // Subtract scrollbar width from max height
                  WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                  scrollbarWidth: "thin", // Specify scrollbar width
                  WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
                  MozBorderRadius: "5px", // For Mozilla Firefox
                  borderRadius: "5px", // For other browsers
                  scrollbarColor: "lightgray transparent", // Specify scrollbar color
                }}
              >
                <div
                  className="table-responsive theme-scrollbar recent-wrapper"
                  style={{
                    maxHeight: "50vh",
                    minHeight: "50vh",
                    overflowY: "auto",
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
                    scrollbarWidth: "thin", // Specify scrollbar width
                    WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
                    MozBorderRadius: "5px", // For Mozilla Firefox
                    borderRadius: "5px", // For other browsers
                    scrollbarColor: "lightgray transparent", // Specify scrollbar color
                  }}
                >
                  <Table className="display order-wrapper" id="recent-order">
                    <thead>
                      <tr>
                        {activitiesHeader.map((data, index) => (
                          <th key={index}>{data}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {operationActivitiesData?.activities?.map(
                        (data: any, index: any) => (
                          <tr key={index}>
                            <td
                              style={{
                                minWidth: "140px",
                              }}
                            >
                              {`${data?.createdAt
                                .toString()
                                .slice(0, 10)}, ${new Date(data?.createdAt)
                                .toLocaleString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })
                                .toString()}`}
                            </td>
                            <td>
                              <div
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  padding: "5px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgba(0, 0, 255, 0.3)",
                                  color: "black",
                                }}
                              >
                                {formatUnderscoredString(data.status)}
                              </div>
                            </td>
                            <td>
                              {formatUnderscoredString(data.activityType)}
                            </td>
                            <td>{data.user}</td>
                            <td>{data.installer}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </div>
              </UL>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ActivityTypesTable;

// <div>
// <div
//   style={{
//     width: "200px",
//     overflow: "hidden",
//     height: "30px",
//     // transition: "width 0.5s",
//     color: "white",
//     borderRadius: "5px",
//   }}
//   className="btn-primary"
// >
//   <div
//     style={{
//       padding: "10px",
//       height: "30px",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <div
//       style={{
//         cursor: "pointer",
//         fontSize: "14px",
//         color: "white",
//         paddingRight: "35px",
//         borderRight: "1px solid black",
//       }}
//       onClick={(e: any) => {
//         toggleDropdown(e);
//       }}
//     >
//       Filter : {selectedFilter}
//       {/* Filter : Today */}
//     </div>
//     <div
//       style={{
//         cursor: "pointer",
//       }}
//       onClick={(e: any) => {
//         toggleDropdown(e);
//       }}
//     >
//       <div style={{ fontSize: "30px", color: "white" }}>
//         <MdFilterList style={{ marginTop: "12px" }} />
//       </div>
//     </div>
//   </div>
// </div>
// <div
//   ref={dropdownRef}
//   style={{
//     width: "200px",
//     display: "flex",
//     justifyContent: "end",
//   }}
// >
//   {isDropdownOpen && (
//     <div
//       className="custom-dropdown-analytics"
//       style={{
//         width: "200px",
//         position: "absolute",
//         zIndex: "1",
//       }}
//     >
//       {isDropdownOpen && (
//         <div
//           className="dropdown-options-analytics"
//           style={{
//             width: "200px",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               width: "250px",
//             }}
//             className="dropdown-item"
//             onClick={(e) => {
//               setSelectedFilter("Yesterday");
//               const dayBeforeYesterday = new Date();

//               dayBeforeYesterday.setDate(
//                 dayBeforeYesterday.getDate() - 2
//               );

//               const yesterday = new Date();
//               yesterday.setDate(yesterday.getDate() - 1);
//               const startDate =
//                 dayBeforeYesterday.toISOString();
//               const endDate = yesterday.toISOString();
//               setFromDate(startDate);
//               setToDate(endDate);
//               toggleDropdown(e);
//             }}
//           >
//             Yesterday
//           </div>
//           <div
//             style={{
//               width: "250px",
//             }}
//             className="dropdown-item"
//             onClick={(e) => {
//               setSelectedFilter("Today");
//               const yesterday = new Date();
//               yesterday.setDate(yesterday.getDate() - 1);
//               const startDate = yesterday.toISOString();
//               const endDate = new Date().toISOString();
//               setFromDate(startDate);
//               setToDate(endDate);

//               toggleDropdown(e);
//             }}
//           >
//             Today
//           </div>
//           <div
//             style={{
//               width: "250px",
//             }}
//             className="dropdown-item"
//             onClick={(e) => {
//               setSelectedFilter("1 Week");
//               const oneWeek = new Date();
//               oneWeek.setDate(oneWeek.getDate() - 7);
//               const startDate = oneWeek.toISOString();
//               const endDate = new Date().toISOString();
//               setFromDate(startDate);
//               setToDate(endDate);

//               toggleDropdown(e);
//             }}
//           >
//             1 Week
//           </div>
//           <div
//             style={{
//               width: "250px",
//             }}
//             className="dropdown-item"
//             onClick={(e) => {
//               setSelectedFilter("1 Month");
//               const oneMonth = new Date();
//               oneMonth.setDate(oneMonth.getDate() - 30);
//               const startDate = oneMonth.toISOString();
//               const endDate = new Date().toISOString();
//               setFromDate(startDate);
//               setToDate(endDate);

//               toggleDropdown(e);
//             }}
//           >
//             1 Month
//           </div>

//           <div
//             style={{
//               width: "250px",
//             }}
//             className="dropdown-item"
//             onClick={(e) => {
//               setSelectedFilter("Custom");
//               addToggle();
//               // toggleDropdown(e);
//             }}
//           >
//             Custom
//           </div>
//           <Modal
//             isOpen={addModal}
//             toggle={addToggle}
//             size="md"
//             centered
//           >
//             <div className="modal-header">
//               <H4 className="modal-title">
//                 Custom Filter Date
//               </H4>
//               <Button
//                 color="transprant"
//                 className="btn-close"
//                 onClick={addToggle}
//               ></Button>
//             </div>

//             <ModalBody className="modal-content">
//               <form className="form-bookmark needs-validation">
//                 <Row>
//                   <FormGroup
//                     className="col-md-12 create-group"
//                     style={{
//                       alignItems: "center",
//                     }}
//                   >
//                     <div>Date From:</div>
//                     <Col md={12}>
//                       <input
//                         className="form-control"
//                         type="date"
//                         value={fromDate.slice(0, 10)}
//                         onChange={(e) => {
//                           setFromDate(
//                             new Date(
//                               e.target.value
//                             ).toISOString()
//                           );
//                           // console.log("e", e.target.value);
//                         }}
//                       />
//                     </Col>
//                   </FormGroup>
//                   <FormGroup
//                     className="col-md-12 create-group"
//                     style={{
//                       alignItems: "center",
//                     }}
//                   >
//                     <div>Date To:</div>
//                     <Col md={12}>
//                       <input
//                         className="form-control"
//                         type="date"
//                         value={toDate.slice(0, 10)}
//                         onChange={(e) => {
//                           // console.log(e.target.value);
//                           setToDate(
//                             new Date(
//                               e.target.value
//                             ).toISOString()
//                           );
//                         }}
//                       />
//                     </Col>
//                   </FormGroup>
//                 </Row>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "end",
//                     alignItems: "end",
//                     marginTop: "-20px",
//                   }}
//                 >
//                   <Button
//                     //   disabled={generalloading ? true : false}
//                     color="secondary"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       addToggle();
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   &nbsp;&nbsp;
//                   <Button
//                     color="primary"
//                     className="me-1"
//                     //   onClick={(e) => {
//                     //     e.preventDefault();
//                     //     getAll({
//                     //       url: `${GET_OPERATOR_PERFORMANCE}?fromDate=${fromDate}&toDate=${toDate}`,
//                     //     }).then((data: any) => {
//                     //       toggleDropdown(e);
//                     //       // console.log("api call --- >", data);
//                     //       if (data !== undefined) {
//                     //         if (data.success) {
//                     //           // // console.log("length --- >", data.data);
//                     //           dispatch(
//                     //             setOperatorPerformance(
//                     //               data.data
//                     //             )
//                     //           );
//                     //           setGeneralLoading(false);
//                     //           addToggle();
//                     //           // setSelectedFilter("Today");
//                     //         }
//                     //         if (!data.success) {
//                     //           // // // console.log("length --- >", data.data);
//                     //           dispatch(
//                     //             setOperatorPerformance([])
//                     //           );
//                     //           setGeneralLoading(false);
//                     //           addToggle();
//                     //         }
//                     //       }
//                     //     });
//                     //   }}
//                   >
//                     Set
//                     {/* {generalloading ? "Loading ..." : `Set`} */}
//                   </Button>
//                 </div>
//               </form>
//             </ModalBody>
//           </Modal>
//         </div>
//       )}
//     </div>
//   )}
// </div>
// </div>
