import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { Select } from "antd";
import Swal from "sweetalert2";
import { H3, H5, P } from "../../../../AbstractElements";

import { SendCommandType } from "../ControlRoom/Analytics/components/Type/SendCommandType";
import DevicesDropdown from "../ControlRoom/Analytics/components/DevicesDropdown/DevicesDropdown";
import CreateComplainModal from "./CreateComplainModal";
import { serverCredentials } from "../../../../Utilities/headers/header";
import { create, getAll } from "../../../../Utilities/api";
import { setCreateComplainModalData } from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import {
  GET_DEVICE_DATA,
  GET_NR_DEVICES,
} from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";
import SelectFilterHoursTypes from "./components/SelectFilterHoursTypes";
import DataTable from "react-data-table-component";
import { FaRegFileExcel } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa6";
import { setNRReport } from "../../../../ReaduxToolkit/Reducer/NRSlice";
import { formatUnderscoredString } from "../../../../Utilities/globals/globals";
import xlsx from "json-as-xlsx";
// import TotalAlertsForSpecificDevices from "./TotalAlertsForSpecificDevices";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  selectedDevices: any;
  prevItem: any;
  serverID: any;
}

const SelectFilterNRDevicesModal: React.FC<PropsTypes> = ({
  addModal,
  setAddModal = () => {},
  selectedDevices,
  prevItem,
  serverID,
}) => {
  // console.log("selectedDevices for NR", selectedDevices);

  const { report } = useSelector((state: any) => state.nrReport);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendCommandType>();

  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      selectedHour("");
      // console.log("selectedDevices", selectedDevices);
      // setData([]);
    }
  };
  const [selectedItems, setSelectedItems]: any = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [basicTab, setBasicTab] = useState("1");
  const [hour, selectedHour] = useState("");

  // const parseCustomDate = (dateString: string) => {
  //   // console.log("dateString", dateString);

  //   const [date, time, period] = dateString.split(" "); // Split date, time, and AM/PM
  //   const [day, month, year] = date.split("-"); // Split DD-MM-YYYY
  //   const [hours, minutes, seconds] = time.split(":"); // Split hh:mm:ss

  //   let hoursIn24Format = parseInt(hours);
  //   if (period === "PM" && hoursIn24Format < 12) hoursIn24Format += 12; // Convert to 24-hour format if PM
  //   if (period === "AM" && hoursIn24Format === 12) hoursIn24Format = 0; // Midnight correction

  //   return new Date(
  //     parseInt(year),
  //     parseInt(month) - 1, // JavaScript months are 0-indexed
  //     parseInt(day),
  //     hoursIn24Format,
  //     parseInt(minutes),
  //     parseInt(seconds)
  //   );
  // };

  // const transformData = () => {
  //   const now = new Date(); // Get the current time
  //   const hourInMilliseconds = Number(hour) * 3600000; // Convert selected hours to milliseconds

  //   const allItems = selectedDevices.flatMap((device: any) => device.items);

  //   // Filter out items where time is "Expired" or "Not connected"
  //   const filteredItems = allItems.filter(
  //     (item: any) => item?.time !== "Expired" && item?.time !== "Not connected"
  //   );

  //   const data = filteredItems
  //     .filter((item: any) => {
  //       const itemTime = parseCustomDate(item?.time); // Parse "DD-MM-YYYY hh:mm:ss AM/PM"
  //       const timeDifference = now.getTime() - itemTime.getTime(); // Difference in milliseconds

  //       // Only include items that are older than the selected hours
  //       const isOutsideSelectedHour = timeDifference > hourInMilliseconds;

  //       // console.log("isOutsideSelectedHour:", isOutsideSelectedHour);
  //       return isOutsideSelectedHour;
  //     })
  //     .map((item: any, index: any) => ({
  //       ...item,
  //       index: index + 1,
  //       status: "NEW",
  //     }));

  //   return data;
  // };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  function handleButtonClick(e: any, settings: any, excelData: any) {
    xlsx(excelData, settings);
  }

  const getNRData = () => {
    dispatch(setNRReport([]));
    setLoading(true);

    const fromDate = new Date(); // Current date and time
    var toDate = new Date().setHours(fromDate.getHours() - Number(hour));

    // const toDate = new Date(fromDate);
    // toDate.setHours(fromDate.getHours() - Number(hour));

    const formattedFromDate = fromDate.toISOString();
    // const formattedToDate = toDate;

    create(
      {},
      {
        url: `${GET_NR_DEVICES}?fromDate=${formattedFromDate}&toDate=${toDate}`,
      }
    ).then((data: any) => {
      if (data !== undefined) {
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
        if (data.success) {
          console.log("nr-data", data.data);
          dispatch(setNRReport(data.data.allDevices));
          setLoading(false);
        }
      }
    });
  };

  return (
    <Modal
      isOpen={addModal}
      size="xl"
      toggle={addToggle}
      centered
      style={{
        minWidth: "90%",
        maxWidth: "90%",
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">NR Devices</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>

      <ModalBody
        style={{
          minHeight: "70vh",
          maxHeight: "85vh",
        }}
      >
        <form
          className="form-bookmark needs-validation"
          //   onSubmit={handleSubmit(deviceAlerts)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <div>
                <P>Select Hour</P>
                <div
                  style={{
                    display: "flex",
                    // justifyContent: ""
                  }}
                >
                  <SelectFilterHoursTypes
                    placeholder="Select Hour"
                    hour={hour}
                    selectedHour={selectedHour}
                  />
                  <Button
                    style={{
                      marginLeft: "10px",
                      marginTop: "0px",
                      height: "36px",
                    }}
                    color="primary"
                    disabled={loading || report.length > 0}
                    onClick={() => {
                      if (hour !== "") {
                        getNRData();
                        // dispatch(setNRReport(transformData()));
                        // setData(transformData());
                      }
                    }}
                  >
                    {loading ? "Loading..." : "Done"}
                  </Button>

                  {report.length > 0 && (
                    <div
                      style={{
                        padding: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "5px",
                        color: "white",
                        backgroundColor: "green",
                        fontSize: "18px",
                        height: "36px",
                        marginRight: "10px",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                      onClick={(e: any) => {
                        let settings = {
                          fileName: `NR Report list (${new Date()})`, // Name of the resulting spreadsheet
                          extraLength: 3, // A bigger number means that columns will be wider
                          writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                          writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                          RTL: false, // Display the columns from right-to-left (the default value is false)
                        };
                        const rowData = report.map((item: any, index: any) => {
                          return {
                            id: item.id,
                            vehicleName: item.name,
                            imei: item.imei,
                            customerName: item.customerInfo.name,
                            customerMobile1: item.customerInfo.mobile_1,
                            customerMobile2: item.customerInfo.mobile_1,
                            objectOwner: item.object_owner,
                            simNumber: item.sim_number,
                            lastPacket: item.time,
                            latestComplaintMessage:
                              item?.latestComplaint !== null
                                ? item?.latestComplaint?.description
                                : "N/A",
                            status: item.hasComplaint ? "Forwarded" : "Pending",
                          };
                        });

                        const blankRow = {
                          id: "",
                          vehicleName: "",
                          imei: "",
                          customerName: "",
                          customerMobile1: "",
                          customerMobile2: "",
                          objectOwner: "",
                          simNumber: "",
                          lastPacket: "",
                          latestComplaintMessage: "",
                          status: "",
                        };
                        let data = [
                          {
                            sheet: "NR Rport List",

                            columns: [
                              {
                                label: "Id",
                                value: "id",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Vehicle",
                                value: "vehicleName",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Imei",
                                value: "imei",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Customer Name",
                                value: "customerName",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Customer Mobile 1",
                                value: "customerMobile1",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Customer Mobile 2",
                                value: "customerMobile2",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Object Owner",
                                value: "objectOwner",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Sim Number",
                                value: "simNumber",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Last Packet",
                                value: "lastPacket",
                                style: { fontWeight: "bold" },
                              },

                              {
                                label: "Last Complaint Message",
                                value: "latestComplaintMessage",
                                style: { fontWeight: "bold" },
                              },
                              {
                                label: "Status",
                                value: "status",
                                style: { fontWeight: "bold" },
                              },
                            ],
                            content: [blankRow, ...rowData],
                          },
                        ];
                        handleButtonClick(e, settings, data);
                      }}
                    >
                      <FaRegFileExcel />
                    </div>
                  )}

                  {/* {report.length > 0 && <div style={{
                                        padding: "5px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "5px",
                                        color: "white",
                                        backgroundColor: "red",
                                        fontSize: "18px",
                                        height: "36px",
                                        cursor: "pointer"
                                    }}
                                        onClick={() => {

                                        }}
                                    >
                                        <FaRegFilePdf />
                                    </div>} */}
                </div>
              </div>

              {report.length > 0 && (
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  <Col md="4" sm="12">
                    Total&nbsp;: &nbsp;{report.length}
                  </Col>
                  <Col md="4" sm="12">
                    New&nbsp;: &nbsp;{report.length}
                  </Col>
                  {/* <Col md="3" sm="6">
                    In Progress &nbsp;: &nbsp;
                    {
                      report.filter(
                        (item: any) => item.status === "IN PROGRESS"
                      )?.length
                    }
                  </Col> */}
                  <Col md="4" sm="12">
                    Forward &nbsp;: &nbsp;
                    {
                      report.filter(
                        (item: any) => item?.hasComplaint === "FORWARD"
                      )?.length
                    }
                  </Col>
                </Row>
              )}

              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col sm={12}>
                  <input
                    style={{
                      width: "100%",
                      marginLeft: "0px",
                    }}
                    className="global-search-field"
                    type="text"
                    placeholder="Type to Search.."
                    value={searchValue}
                    onChange={handleSearch}
                  />
                </Col>
              </Row>

              <div
                style={{
                  height: "50vh",
                  overflow: "auto",
                }}
              >
                <DataTable
                  columns={[
                    {
                      name: "Vehicle Name",
                      selector: (row: any) => row?.name,
                      sortable: true,
                      width: "14%",
                      center: true,
                    },
                    {
                      name: "Customer Name",
                      selector: (row: any) =>
                        `${
                          row?.customerInfo?.name !== ""
                            ? row?.customerInfo?.name
                            : "N/A"
                        }`,
                      sortable: true,
                      width: "13%",
                      center: true,
                    },

                    {
                      name: "Imei",
                      selector: (row: any) =>
                        `${row?.imei !== "" ? row?.imei : "N/A"}`,
                      sortable: true,
                      width: "12%",
                      center: true,
                    },
                    {
                      name: "Last Packet",
                      selector: (row: any) =>
                        `${row?.time?.slice(0, 10)} , ${row?.time?.slice(11)}`,
                      sortable: true,
                      width: "20%",
                      center: true,
                    },
                    {
                      name: "Last Complaint",
                      selector: (row: any) =>
                        `${
                          row?.latestComplaint !== null
                            ? row?.latestComplaint?.description
                            : row?.complaintMessage !== undefined
                            ? row?.complaintMessage
                            : "N/A"
                        }`,
                      sortable: true,
                      width: "15%",
                      center: true,
                    },

                    {
                      name: "Status",
                      selector: (row: any) =>
                        `${formatUnderscoredString(
                          row?.hasComplaint ? "Forwarded" : "Forward"
                        )}`,
                      sortable: true,
                      width: "10%",
                      center: true,
                      cell: (row: any) => (
                        <div
                          style={{
                            // width: "100px",
                            textAlign: "center",
                            padding: "2px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: `${
                              row?.hasComplaint
                                ? "rgba(0,128,0)"
                                : "rgba(255, 0, 0)"
                            }`,
                          }}
                        >
                          {formatUnderscoredString(
                            row?.hasComplaint ? "Forwarded" : "Pending"
                          )}
                        </div>
                      ),
                    },
                    {
                      name: "Actions",
                      selector: (row: any) => row["actions"],
                      sortable: true,
                      center: true,
                      width: "20%", // Set the width for this column
                      cell: (row: any) => (
                        <div
                          style={{
                            // width: "100px",
                            textAlign: "center",
                            padding: "2px",
                            borderRadius: "5px",
                            color: "black",
                            display: "flex",
                            gap: "3px",
                          }}
                        >
                          <Button
                            color="primary"
                            style={{
                              padding: "5px 20px",
                              margin: "0px",
                            }}
                            disabled={row?.hasComplaint}
                            onClick={async (e) => {
                              e.preventDefault();
                              setSelectedItems([row]);
                              setBasicTab("5");

                              setIsUpdateModalOpen(true);

                              const serverInfo = serverCredentials(
                                row.server._id
                              );

                              const sendData = {
                                serverId: serverInfo?.serverId,
                                serverHashKey: serverInfo?.serverHashKey,
                                deviceId: row.id,
                              };

                              try {
                                await create(sendData, {
                                  url: GET_DEVICE_DATA,
                                }).then((data: any) => {
                                  if (
                                    !data.success &&
                                    data.message === ERROR_MESSAGE
                                  ) {
                                  }
                                  if (!data.success) {
                                    Swal.fire({
                                      text: `${data.message}`,
                                      icon: "error",
                                      timer: 2000,
                                      showConfirmButton: false,
                                    });
                                    setIsUpdateModalOpen(false);
                                  }
                                  if (data.success) {
                                    dispatch(
                                      setCreateComplainModalData(data.data)
                                    );
                                  }
                                });
                                // Handle successful post creation (e.g., show a success message, redirect, etc.)
                              } catch (error: any) {
                                // Handle error (e.g., show an error message)
                                dispatch(setCreateComplainModalData(undefined));
                              }
                            }}
                          >
                            {row?.hasComplaint ? "Forwarded" : "Forward"}
                          </Button>
                          <Button
                            color="primary"
                            style={{
                              padding: "5px 20px",
                              margin: "0px",
                            }}
                            // disabled={row?.hasComplaint}
                            onClick={async (e) => {
                              e.preventDefault();
                              setSelectedItems([row]);
                              setBasicTab("4");

                              setIsUpdateModalOpen(true);

                              const serverInfo = serverCredentials(
                                row.server._id
                              );

                              const sendData = {
                                serverId: serverInfo?.serverId,
                                serverHashKey: serverInfo?.serverHashKey,
                                deviceId: row.id,
                              };

                              try {
                                await create(sendData, {
                                  url: GET_DEVICE_DATA,
                                }).then((data: any) => {
                                  if (
                                    !data.success &&
                                    data.message === ERROR_MESSAGE
                                  ) {
                                  }
                                  if (!data.success) {
                                    Swal.fire({
                                      text: `${data.message}`,
                                      icon: "error",
                                      timer: 2000,
                                      showConfirmButton: false,
                                    });
                                    setIsUpdateModalOpen(false);
                                  }
                                  if (data.success) {
                                    dispatch(
                                      setCreateComplainModalData(data.data)
                                    );
                                  }
                                });
                                // Handle successful post creation (e.g., show a success message, redirect, etc.)
                              } catch (error: any) {
                                // Handle error (e.g., show an error message)
                                dispatch(setCreateComplainModalData(undefined));
                              }
                            }}
                          >
                            History
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  data={report}
                  pagination
                  paginationPerPage={6} // Set pagination to display 6 items per page
                  paginationRowsPerPageOptions={[6, 10, 20, 30]} // Set options for rows per page
                  style={{ cursor: "pointer" }}
                  className="custom-data-table"
                  customStyles={{
                    rows: {
                      style: {
                        cursor: "pointer",
                        transition: "background-color 0.2s", // Smooth transition for background color change
                        // backgroundColor: `${
                        //   row?.hasComplaint
                        //     ? "rgba(0,128,0,0.2)"
                        //     : "rgba(0,128,0,0.2)"
                        // }`,
                        // "&:hover": {
                        //   // Define hover style
                        //   backgroundColor: `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`,
                        // },
                      },
                    },
                    head: {
                      style: {
                        fontWeight: "bold",
                        fontSize: "13px",
                      },
                    },
                  }}
                />
              </div>
            </FormGroup>
          </Row>
          {/*  */}
        </form>
      </ModalBody>
      {isUpdateModalOpen && (
        <CreateComplainModal
          isVisible={isUpdateModalOpen}
          setIsVisible={setIsUpdateModalOpen}
          isDeviceSelectedModalVisible={addModal}
          setIsDeviceSelectedModalVisible={setAddModal}
          selectedItems={selectedItems}
          tab={basicTab}
        />
      )}
    </Modal>
  );
};

export default SelectFilterNRDevicesModal;

// <div
//                         style={{
//                             position: "absolute",
//                             bottom: "0",
//                             right: "0",
//                             width: "100%",
//                             backgroundColor: "white",
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             padding: "20px",
//                         }}
//                     >
//                         <Button
//                             disabled={loading ? true : false}
//                             color="secondary"
//                             onClick={addToggle}
//                         >
//                             Cancel
//                         </Button>
//                         &nbsp;&nbsp;
//                         <Button
//                             color="primary"
//                             className="me-1"
//                             type="submit"
//                             disabled={selectedItems.length == 0}
//                             onClick={async (e) => {
//                                 e.preventDefault();
//                                 setBasicTab("1");
//                                 setIsUpdateModalOpen(true);
//                                 const serverInfo = serverCredentials(selectedItems[0].server._id);

//                                 const sendData = {
//                                     serverId: serverInfo?.serverId,
//                                     serverHashKey: serverInfo?.serverHashKey,
//                                     deviceId: selectedItems[0].id,
//                                 };

//                                 try {
//                                     await create(sendData, {
//                                         url: GET_DEVICE_DATA,
//                                     }).then((data: any) => {
//                                         // dispatch(setCreateComplainModalData(data.data));
//                                         // console.log(data);

//                                         if (
//                                             !data.success &&
//                                             data.message === ERROR_MESSAGE
//                                         ) {
//                                         }
//                                         if (!data.success) {
//                                             Swal.fire({
//                                                 text: `${data.message}`,
//                                                 icon: "error",
//                                                 timer: 2000,
//                                                 showConfirmButton: false,
//                                             });
//                                             setIsUpdateModalOpen(false);
//                                         }
//                                         if (data.success) {
//                                             dispatch(setCreateComplainModalData(data.data));
//                                             // console.log("createComplainModalData", createComplainModalData);

//                                         }
//                                     });
//                                     // Handle successful post creation (e.g., show a success message, redirect, etc.)
//                                 } catch (error: any) {
//                                     // Handle error (e.g., show an error message)
//                                     dispatch(setCreateComplainModalData(undefined));
//                                 }

//                             }}
//                         >
//                             {loading ? "Loading ..." : `Open`}
//                         </Button>
//                     </div>
