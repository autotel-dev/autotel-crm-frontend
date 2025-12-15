import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  // Button,
} from "reactstrap";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./reportsStyle.css";
import Loader from "../../../../../Utilities/Loader/Loader";
import xlsx from "json-as-xlsx";

import { setReports } from "../../../../../../ReaduxToolkit/Reducer/ReportsSlice";
import "jspdf-autotable";
import { H4 } from "../../../../../../AbstractElements";
import H7 from "../../../../../../CommonElements/Headings/H7Element";
import { FaFileExcel } from "react-icons/fa6";
import { BiSolidFilePdf } from "react-icons/bi";
import ViewPDFModalForReports from "./ViewPDFModal";
import { formatUnderscoredString } from "../../../../../../Utilities/globals/globals";
import { FaEye } from "react-icons/fa";
import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { IMAGE_BASE_URL } from "../../../../../../Utilities/api/apiEndpoints";
import BackgroundImage from "../../../../../../assets/Background Image.png";

const ReportsList = () => {
  const { reports } = useSelector((state: any) => state.reports);

  // console.log("Reports in list", reports);

  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  function handleButtonClick(
    e: any,
    settings: any,
    excelData: any,
    index: any
  ) {
    xlsx(excelData, settings);
  }

  const [loading, setLoading] = useState(false);

  const [header, setHeader]: any = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [reportName, setReportName]: any = useState("");

  // Function to convert 24-hour time to 12-hour with AM/PM
  const convertTo12HourFormat = (timeString: any, serverTime: any) => {
    const date = new Date(timeString);
    let hours = serverTime ? date.getHours() - 5 : date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // Hour 0 should be 12
    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
    const secondsFormatted = seconds < 10 ? "0" + seconds : seconds;

    return `${hours}:${minutesFormatted}:${secondsFormatted} ${ampm}`;
  };

  const renderTableRows = () => {
    return reports?.map((row: any, index: any) => (
      <tr key={index}>
        <td style={{ width: "20%" }}>{index + 1}</td>
        <td style={{ width: "20%" }}>{row.data.title}</td>
        <td style={{ width: "15%" }}>{row.data.startDate.slice(0, 10)}</td>
        <td style={{ width: "15%" }}>{row.data.endDate.slice(0, 10)}</td>
        <td>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <div style={{ backgroundColor: "green", borderRadius: "5px" }}> */}
            <button
              style={{
                border: "3px solid green",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "36px",
                width: "36px",
                backgroundColor: "transparent",
              }}
              onClick={(e: any) => {
                // console.log("reports", reports);

                let settings = {
                  fileName: row.data.title, // Name of the resulting spreadsheet
                  extraLength: 3, // A bigger number means that columns will be wider
                  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                  RTL: false, // Display the columns from right-to-left (the default value is false)
                };

                var rowData: any;
                var columns: any;
                if (row.type == "/get-all-alert-events-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    // { label: "Event Id", value: "eventId" },
                    // { label: "Device Id", value: "deviceId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Latitude", value: "latitude" },
                    { label: "Longitude", value: "longitude" },
                    { label: "Speed", value: "speed" },
                    { label: "Type", value: "type" },
                    { label: "Message", value: "message" },
                    { label: "User", value: "user" },
                    {
                      label: "Completion Response",
                      value: "completionResponse",
                    },
                    {
                      label: "Alert Event Close Date",
                      value: "alertEventCloseDate",
                    },
                    { label: "Server Time", value: "serverTime" },
                  ];
                  rowData = row.data.data.reportData.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        alertEventCloseDate: `${
                          item?.alertEventCloseDate == "Not Completed"
                            ? "Not Completed"
                            : item?.alertEventCloseDate.slice(0, 10)
                        }, ${
                          item?.alertEventCloseDate == "Not Completed"
                            ? ""
                            : convertTo12HourFormat(
                                item?.alertEventCloseDate,
                                false
                              )
                        }`,
                        serverTime: `${item?.serverDateAndTime.slice(
                          0,
                          10
                        )}, ${convertTo12HourFormat(
                          item?.serverDateAndTime,
                          true
                        )}`,
                        user:
                          item?.alertEventCloseDate == "Not Completed"
                            ? item?.assignedTo?.fullName
                            : item?.completedByUser?.fullName,
                        latitude: Number(item.latitude).toFixed(7),
                        longitude: Number(item.longitude).toFixed(7),
                      };
                    }
                  );
                } else if (row.type == "/get-operator-performance-report") {
                  columns = [
                    { label: "Name", value: "name" },
                    { label: "Limit", value: "limit" },
                    { label: "Alerts Catered", value: "totalAlertsHandled" },
                    {
                      label: "Average Sec in Alert",
                      value: "averageAlertDifferenceTime",
                    },
                    { label: "Rating", value: "rating" },
                  ];

                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            ...item,
                          };
                        });
                } else if (row.type == "/get-inventory-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Product Name", value: "productName" },
                    { label: "Product Type", value: "productType" },
                    { label: "Serial Number", value: "serialNumber" },
                    { label: "Sku", value: "sku" },
                    { label: "User", value: "user" },
                    { label: "Company", value: "company" },
                    { label: "Branch", value: "branch" },
                    { label: "Warehouse", value: "warehouse" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            productName: item.productName,
                            productType: item.productType,
                            serialNumber: item.serialNumber,
                            sku: item.sku,
                            user: item.user.fullName,
                            company: item.company.fullName,
                            branch: item.branch.name,
                            warehouse: item.warehouse.name,
                          };
                        });
                } else if (row.type == "/get-sale-invoice-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Customer", value: "customerName" },
                    { label: "Address", value: "address" },
                    { label: "Comments", value: "comments" },
                    { label: "Date", value: "date" },
                    { label: "Due Date", value: "dueDate" },
                    { label: "Status", value: "status" },
                    { label: "Net Amount", value: "netAmount" },
                    { label: "Gross Amount", value: "grossAmount" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            customerName: item.customerName,
                            address: item.address,
                            comments: item.comments,
                            date: item.invoiceDate,
                            dueDate: item.invoiceDueDate,
                            status: item.status,
                            netAmount: item.netAmount,
                            grossAmount: item.grossAmount,
                          };
                        });
                } else if (row.type == "/get-purchase-invoice-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Vendor", value: "vendor" },
                    { label: "Branch", value: "branch" },
                    { label: "Warehouse", value: "warehouse" },
                    { label: "Date", value: "date" },
                    { label: "Due Date", value: "dueDate" },
                    { label: "Status", value: "status" },
                    { label: "Shipping Details", value: "shippingCharges" },
                    { label: "Net Amount", value: "netAmount" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            vendor: item.vendor.vendorName,
                            branch: item.branch.name,
                            warehouse: item.warehouse.name,
                            date: item.invoiceDate,
                            dueDate: item.invoiceDueDate,
                            status: item.status,
                            shippingCharges: item.shippingCharges,
                            netAmount: item.netAmount,
                          };
                        });
                } else if (row.type == "/get-inventory-lifecycle-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Type", value: "type" },
                    { label: "Status", value: "status" },
                    { label: "From Vehicle", value: "fromVehicle" },
                    { label: "To Vehicle", value: "toVehicle" },
                    { label: "From Customer", value: "fromCustomer" },
                    { label: "To Customer", value: "toCustomer" },
                    { label: "Installer", value: "installer" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data[0].activities.map(
                          (item: any, index: any) => {
                            return {
                              // _id: item._id,
                              type: formatUnderscoredString(item.activityType),
                              status: formatUnderscoredString(item.status),
                              fromVehicle:
                                item.fromVehicle == null
                                  ? "N/A"
                                  : item?.fromVehicle.registrationNo,
                              toVehicle:
                                item.toVehicle == null
                                  ? "N/A"
                                  : item?.toVehicle.registrationNo,
                              fromCustomer:
                                item.fromCustomer == null
                                  ? "N/A"
                                  : item?.fromCustomer?.fullName,
                              toCustomer:
                                item.toCustomer == null
                                  ? "N/A"
                                  : item?.toCustomer?.fullName,
                              installer:
                                item.installer == null
                                  ? "N/A"
                                  : item?.installer?.fullName,
                            };
                          }
                        );
                } else if (row.type == "/get-activity-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Type", value: "type" },
                    { label: "Status", value: "status" },
                    { label: "From Vehicle", value: "fromVehicle" },
                    { label: "To Vehicle", value: "toVehicle" },
                    { label: "Inventory", value: "inventory" },
                    { label: "Installer", value: "installer" },
                    { label: "Remarks", value: "remarks" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            type: formatUnderscoredString(item.activityType),
                            status: formatUnderscoredString(item.status),
                            fromVehicle:
                              item.fromVehicle == null
                                ? "N/A"
                                : item?.fromVehicle.registrationNo,
                            toVehicle:
                              item.toVehicle == null
                                ? "N/A"
                                : item?.toVehicle.registrationNo,
                            inventory:
                              item?.inventoryItems?.length == 0
                                ? "N/A"
                                : `${item?.inventoryItems.map(
                                    (inv: any, index: any) =>
                                      `${inv.serialNumber} | `
                                  )}`,

                            installer:
                              item.installer == null
                                ? "N/A"
                                : item?.installer?.fullName,
                            remarks: item.remarks == "" ? "N/A" : item?.remarks,
                          };
                        });
                } else if (row.type == "/get-amc-due-report") {
                  columns = [
                    { label: "Customer", value: "customer" },
                    { label: "Registration No", value: "registrationNo" },
                    { label: "Renewal Date", value: "serviceRenewalDate" },
                    {
                      label: "Service Charges",
                      value: "servicePackageCharges",
                    },
                    {
                      label: "Discounted Charges",
                      value: "servicePackageDiscountedCharges",
                    },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      customer: item.customer.fullName,
                      registrationNo: item.registrationNo,
                      serviceRenewalDate: item.serviceRenewalDate.slice(0, 10),
                      servicePackageCharges: item.servicePackageCharges,
                      servicePackageDiscountedCharges:
                        item.servicePackageDiscountedCharges,
                    };
                  });
                } else if (row.type == "/get-complaint-report") {
                  columns = [
                    { label: "Complaint Id", value: "complaintId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Description", value: "description" },
                    { label: "Priorty", value: "priorty" },
                    {
                      label: "Status",
                      value: "status",
                    },
                    {
                      label: "Resolving Date",
                      value: "resolvingDate",
                    },
                    {
                      label: "Created At",
                      value: "createdAt",
                    },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            complaintId: item.complaintId,
                            deviceName: item?.deviceName,
                            description: item?.description,
                            priorty: item?.priorty,
                            status: item?.status,
                            resolvingDate: `${
                              item?.resolvingDate !== null
                                ? item?.resolvingDate.slice(0, 10)
                                : "N/A"
                            }, ${
                              item?.resolvingDate !== null
                                ? convertTo12HourFormat(
                                    item?.resolvingDate,
                                    true
                                  )
                                : ""
                            }`,
                            createdAt: `${item?.createdAt.slice(
                              0,
                              10
                            )}, ${convertTo12HourFormat(
                              item?.createdAt,
                              true
                            )}`,
                          };
                        });
                }

                let data = [
                  {
                    sheet: "Sheet 1",
                    columns: columns.length > 0 ? columns : [],
                    content: rowData.length > 0 ? rowData : [],
                  },
                ];
                handleButtonClick(e, settings, data, index);
              }}
            >
              <FaFileExcel size={18} color="green" />
            </button>
            <button
              style={{
                border: "3px solid blue",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "36px",
                width: "36px",
                marginLeft: "10px",
                backgroundColor: "transparent",
              }}
              onClick={() => {
                // console.log("reports", reports);
                var rowData;
                var columns;
                if (row.type == "/get-all-alert-events-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    // { label: "Event Id", value: "eventId" },
                    // { label: "Device Id", value: "deviceId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Latitude", value: "latitude" },
                    { label: "Longitude", value: "longitude" },
                    { label: "Speed", value: "speed" },
                    { label: "Type", value: "type" },
                    { label: "Message", value: "message" },
                    { label: "User", value: "user" },
                    {
                      label: "Completion Response",
                      value: "completionResponse",
                    },
                    {
                      label: "Alert Event Close Date",
                      value: "alertEventCloseDate",
                    },
                    { label: "Server Time", value: "serverTime" },
                  ];
                  rowData = row.data.data.reportData.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        alertEventCloseDate: `${
                          item?.alertEventCloseDate == "Not Completed"
                            ? "Not Completed"
                            : item?.alertEventCloseDate.slice(0, 10)
                        }, ${
                          item?.alertEventCloseDate == "Not Completed"
                            ? ""
                            : convertTo12HourFormat(
                                item?.alertEventCloseDate,
                                false
                              )
                        }`,
                        serverTime: `${item?.serverDateAndTime.slice(
                          0,
                          10
                        )}, ${convertTo12HourFormat(
                          item?.serverDateAndTime,
                          true
                        )}`,
                        user:
                          item?.alertEventCloseDate == "Not Completed"
                            ? item?.assignedTo?.fullName
                            : item?.completedByUser?.fullName,
                        latitude: Number(item.latitude).toFixed(7),
                        longitude: Number(item.longitude).toFixed(7),
                      };
                    }
                  );
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-operator-performance-report") {
                  columns = [
                    { label: "Name", value: "name" },
                    { label: "Limit", value: "limit" },
                    { label: "Alerts Catered", value: "totalAlertsHandled" },
                    {
                      label: "Average Sec in Alert",
                      value: "averageAlertDifferenceTime",
                    },
                    { label: "Rating", value: "rating" },
                  ];

                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            ...item,
                          };
                        });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-inventory-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Product Name", value: "productName" },
                    { label: "Product Type", value: "productType" },
                    { label: "Serial Number", value: "serialNumber" },
                    { label: "Sku", value: "sku" },
                    { label: "User", value: "user" },
                    { label: "Company", value: "company" },
                    { label: "Branch", value: "branch" },
                    { label: "Warehouse", value: "warehouse" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            productName: item.productName,
                            productType: item.productType,
                            serialNumber: item.serialNumber,
                            sku: item.sku,
                            user: item.user.fullName,
                            company: item.company.fullName,
                            branch: item.branch.name,
                            warehouse: item.warehouse.name,
                          };
                        });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-sale-invoice-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Customer", value: "customerName" },
                    { label: "Address", value: "address" },
                    { label: "Comments", value: "comments" },
                    { label: "Date", value: "date" },
                    { label: "Due Date", value: "dueDate" },
                    { label: "Status", value: "status" },
                    { label: "Net Amount", value: "netAmount" },
                    { label: "Gross Amount", value: "grossAmount" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            customerName: item.customerName,
                            address: item.address,
                            comments: item.comments,
                            date: item.invoiceDate,
                            dueDate: item.invoiceDueDate,
                            status: item.status,
                            netAmount: item.netAmount,
                            grossAmount: item.grossAmount,
                          };
                        });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-purchase-invoice-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Vendor", value: "vendor" },
                    { label: "Branch", value: "branch" },
                    { label: "Warehouse", value: "warehouse" },
                    { label: "Date", value: "date" },
                    { label: "Due Date", value: "dueDate" },
                    { label: "Status", value: "status" },
                    { label: "Shipping Details", value: "shippingCharges" },
                    { label: "Net Amount", value: "netAmount" },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      // _id: item._id,
                      vendor: item.vendor.vendorName,
                      branch: item.branch.name,
                      warehouse: item.warehouse.name,
                      date: item.invoiceDate,
                      dueDate: item.invoiceDueDate,
                      status: item.status,
                      shippingCharges: item.shippingCharges,
                      netAmount: item.netAmount,
                    };
                  });

                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-inventory-lifecycle-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Type", value: "vendor" },
                    { label: "Status", value: "branch" },
                    { label: "From Vehicle", value: "fromVehicle" },
                    { label: "To Vehicle", value: "toVehicle" },
                    { label: "From Customer", value: "fromCustomer" },
                    { label: "To Customer", value: "toCustomer" },
                    { label: "Installer", value: "installer" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data[0].activities.map(
                          (item: any, index: any) => {
                            return {
                              // _id: item._id,
                              type: formatUnderscoredString(item.activityType),
                              status: formatUnderscoredString(item.status),
                              fromVehicle:
                                item.fromVehicle == null
                                  ? "N/A"
                                  : item?.fromVehicle.registrationNo,
                              toVehicle:
                                item.toVehicle == null
                                  ? "N/A"
                                  : item?.toVehicle.registrationNo,
                              fromCustomer:
                                item.fromCustomer == null
                                  ? "N/A"
                                  : item?.fromCustomer?.fullName,
                              toCustomer:
                                item.toCustomer == null
                                  ? "N/A"
                                  : item?.toCustomer?.fullName,
                              installer:
                                item.installer == null
                                  ? "N/A"
                                  : item?.installer?.fullName,
                            };
                          }
                        );
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-activity-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Type", value: "type" },
                    { label: "Status", value: "status" },
                    { label: "From Vehicle", value: "fromVehicle" },
                    { label: "To Vehicle", value: "toVehicle" },
                    { label: "Inventory", value: "inventory" },

                    { label: "Installer", value: "installer" },
                    { label: "Remarks", value: "remarks" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            // _id: item._id,
                            type: formatUnderscoredString(item.activityType),
                            status: formatUnderscoredString(item.status),
                            fromVehicle:
                              item.fromVehicle == null
                                ? "N/A"
                                : item?.fromVehicle.registrationNo,
                            toVehicle:
                              item.toVehicle == null
                                ? "N/A"
                                : item?.toVehicle.registrationNo,
                            inventory:
                              item?.inventoryItems?.length == 0
                                ? "N/A"
                                : `${item?.inventoryItems.map(
                                    (inv: any, index: any) =>
                                      `${inv.serialNumber} | `
                                  )}`,

                            installer:
                              item.installer == null
                                ? "N/A"
                                : item?.installer?.fullName,
                            remarks: item.remarks == "" ? "N/A" : item?.remarks,
                          };
                        });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-amc-due-report") {
                  columns = [
                    { label: "Customer", value: "customer" },
                    { label: "Registration No", value: "registrationNo" },
                    { label: "Renewal Date", value: "serviceRenewalDate" },
                    {
                      label: "Service Charges",
                      value: "servicePackageCharges",
                    },
                    {
                      label: "Discounted Charges",
                      value: "servicePackageDiscountedCharges",
                    },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            customer: item.customer.fullName,
                            registrationNo: item.registrationNo,
                            serviceRenewalDate: item.serviceRenewalDate.slice(
                              0,
                              10
                            ),
                            servicePackageCharges: item.servicePackageCharges,
                            servicePackageDiscountedCharges:
                              item.servicePackageDiscountedCharges,
                          };
                        });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-complaint-report") {
                  columns = [
                    { label: "Complaint Id", value: "complaintId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Description", value: "description" },
                    { label: "Priorty", value: "priorty" },
                    {
                      label: "Status",
                      value: "status",
                    },
                    {
                      label: "Resolving Date",
                      value: "resolvingDate",
                    },
                    {
                      label: "Created At",
                      value: "createdAt",
                    },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            complaintId: item.complaintId,
                            deviceName: item.deviceName,
                            description: item.description,
                            priorty: item.priorty,
                            status: item.status,
                            resolvingDate: `${
                              item?.resolvingDate !== null
                                ? item?.resolvingDate.slice(0, 10)
                                : "N/A"
                            }, ${
                              item?.resolvingDate !== null
                                ? convertTo12HourFormat(
                                    item?.resolvingDate,
                                    true
                                  )
                                : ""
                            }`,
                            createdAt: `${item?.createdAt.slice(
                              0,
                              10
                            )}, ${convertTo12HourFormat(
                              item?.createdAt,
                              true
                            )}`,
                          };
                        });

                  setHeader(columns);
                  setPdfData(rowData);
                }

                setReportName(row.data.title);
                toggleModal();
              }}
            >
              <FaEye size={22} color="blue" />
            </button>
            <button
              style={{
                border: "3px solid red",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "36px",
                width: "36px",
                marginLeft: "10px",
                backgroundColor: "transparent",
                paddingTop: "5px",
              }}
              onClick={() => {
                // console.log("reports", reports);
                var rowData;
                var columns;
                if (row.type == "/get-all-alert-events-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    // { label: "Event Id", value: "eventId" },
                    // { label: "Device Id", value: "deviceId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Latitude", value: "latitude" },
                    { label: "Longitude", value: "longitude" },
                    { label: "Speed", value: "speed" },
                    { label: "Type", value: "type" },
                    { label: "Message", value: "message" },
                    { label: "User", value: "user" },
                    {
                      label: "Completion Response",
                      value: "completionResponse",
                    },
                    {
                      label: "Alert Event Close Date",
                      value: "alertEventCloseDate",
                    },
                    { label: "Server Time", value: "serverTime" },
                  ];
                  rowData = row.data.data.reportData.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        alertEventCloseDate: `${
                          item?.alertEventCloseDate == "Not Completed"
                            ? "Not Completed"
                            : item?.alertEventCloseDate.slice(0, 10)
                        }, ${
                          item?.alertEventCloseDate == "Not Completed"
                            ? ""
                            : convertTo12HourFormat(
                                item?.alertEventCloseDate,
                                false
                              )
                        }`,
                        serverTime: `${item?.serverDateAndTime.slice(
                          0,
                          10
                        )}, ${convertTo12HourFormat(
                          item?.serverDateAndTime,
                          true
                        )}`,
                        user:
                          item?.alertEventCloseDate == "Not Completed"
                            ? item?.assignedTo?.fullName
                            : item?.completedByUser?.fullName,
                        latitude: Number(item.latitude).toFixed(7),
                        longitude: Number(item.longitude).toFixed(7),
                      };
                    }
                  );
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-operator-performance-report") {
                  columns = [
                    { label: "Name", value: "name" },
                    { label: "Limit", value: "limit" },
                    { label: "Alerts Catered", value: "totalAlertsHandled" },
                    {
                      label: "Average Sec in Alert",
                      value: "averageAlertDifferenceTime",
                    },
                    { label: "Rating", value: "rating" },
                  ];

                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      ...item,
                    };
                  });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-inventory-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Product Name", value: "productName" },
                    { label: "Product Type", value: "productType" },
                    { label: "Serial Number", value: "serialNumber" },
                    { label: "Sku", value: "sku" },
                    { label: "User", value: "user" },
                    { label: "Company", value: "company" },
                    { label: "Branch", value: "branch" },
                    { label: "Warehouse", value: "warehouse" },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      // _id: item._id,
                      productName: item.productName,
                      productType: item.productType,
                      serialNumber: item.serialNumber,
                      sku: item.sku,
                      user: item.user.fullName,
                      company: item.company.fullName,
                      branch: item.branch.name,
                      warehouse: item.warehouse.name,
                    };
                  });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-sale-invoice-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Customer", value: "customerName" },
                    { label: "Address", value: "address" },
                    { label: "Comments", value: "comments" },
                    { label: "Date", value: "date" },
                    { label: "Due Date", value: "dueDate" },
                    { label: "Status", value: "status" },
                    { label: "Net Amount", value: "netAmount" },
                    { label: "Gross Amount", value: "grossAmount" },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      // _id: item._id,
                      customerName: item.customerName,
                      address: item.address,
                      comments: item.comments,
                      date: item.invoiceDate,
                      dueDate: item.invoiceDueDate,
                      status: item.status,
                      netAmount: item.netAmount,
                      grossAmount: item.grossAmount,
                    };
                  });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-purchase-invoice-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Vendor", value: "vendor" },
                    { label: "Branch", value: "branch" },
                    { label: "Warehouse", value: "warehouse" },
                    { label: "Date", value: "date" },
                    { label: "Due Date", value: "dueDate" },
                    { label: "Status", value: "status" },
                    { label: "Shipping Details", value: "shippingCharges" },
                    { label: "Net Amount", value: "netAmount" },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      // _id: item._id,
                      vendor: item.vendor.vendorName,
                      branch: item.branch.name,
                      warehouse: item.warehouse.name,
                      date: item.invoiceDate,
                      dueDate: item.invoiceDueDate,
                      status: item.status,
                      shippingCharges: item.shippingCharges,
                      netAmount: item.netAmount,
                    };
                  });

                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-inventory-lifecycle-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Type", value: "vendor" },
                    { label: "Status", value: "branch" },
                    { label: "From Vehicle", value: "fromVehicle" },
                    { label: "To Vehicle", value: "toVehicle" },
                    { label: "From Customer", value: "fromCustomer" },
                    { label: "To Customer", value: "toCustomer" },
                    { label: "Installer", value: "installer" },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data[0].activities.map(
                          (item: any, index: any) => {
                            return {
                              // _id: item._id,
                              type: formatUnderscoredString(item.activityType),
                              status: formatUnderscoredString(item.status),
                              fromVehicle:
                                item.fromVehicle == null
                                  ? "N/A"
                                  : item?.fromVehicle.registrationNo,
                              toVehicle:
                                item.toVehicle == null
                                  ? "N/A"
                                  : item?.toVehicle.registrationNo,
                              fromCustomer:
                                item.fromCustomer == null
                                  ? "N/A"
                                  : item?.fromCustomer?.fullName,
                              toCustomer:
                                item.toCustomer == null
                                  ? "N/A"
                                  : item?.toCustomer?.fullName,
                              installer:
                                item.installer == null
                                  ? "N/A"
                                  : item?.installer?.fullName,
                            };
                          }
                        );

                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-activity-report") {
                  columns = [
                    // { label: "Id", value: "_id" },
                    { label: "Type", value: "type" },
                    { label: "Status", value: "status" },
                    { label: "From Vehicle", value: "fromVehicle" },
                    { label: "To Vehicle", value: "toVehicle" },
                    { label: "Inventory", value: "inventory" },

                    { label: "Installer", value: "installer" },
                    { label: "Remarks", value: "remarks" },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      // _id: item._id,
                      type: formatUnderscoredString(item.activityType),
                      status: formatUnderscoredString(item.status),
                      fromVehicle:
                        item.fromVehicle == null
                          ? "N/A"
                          : item?.fromVehicle.registrationNo,
                      toVehicle:
                        item.toVehicle == null
                          ? "N/A"
                          : item?.toVehicle.registrationNo,
                      inventory:
                        item?.inventoryItems?.length == 0
                          ? "N/A"
                          : `${item?.inventoryItems.map(
                              (inv: any, index: any) => `${inv.serialNumber} | `
                            )}`,

                      installer:
                        item.installer == null
                          ? "N/A"
                          : item?.installer?.fullName,
                      remarks: item.remarks == "" ? "N/A" : item?.remarks,
                    };
                  });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-amc-due-report") {
                  columns = [
                    { label: "Customer", value: "customer" },
                    { label: "Registration No", value: "registrationNo" },
                    { label: "Renewal Date", value: "serviceRenewalDate" },
                    {
                      label: "Service Charges",
                      value: "servicePackageCharges",
                    },
                    {
                      label: "Discounted Charges",
                      value: "servicePackageDiscountedCharges",
                    },
                  ];
                  rowData = row.data.data.map((item: any, index: any) => {
                    return {
                      customer: item.customer.fullName,
                      registrationNo: item.registrationNo,
                      serviceRenewalDate: item.serviceRenewalDate.slice(0, 10),
                      servicePackageCharges: item.servicePackageCharges,
                      servicePackageDiscountedCharges:
                        item.servicePackageDiscountedCharges,
                    };
                  });
                  setHeader(columns);
                  setPdfData(rowData);
                } else if (row.type == "/get-complaint-report") {
                  columns = [
                    { label: "Complaint Id", value: "complaintId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Description", value: "description" },
                    { label: "Priorty", value: "priorty" },
                    {
                      label: "Status",
                      value: "status",
                    },
                    {
                      label: "Resolving Date",
                      value: "resolvingDate",
                    },
                    {
                      label: "Created At",
                      value: "createdAt",
                    },
                  ];
                  rowData =
                    row.data.data.length == 0
                      ? []
                      : row.data.data.map((item: any, index: any) => {
                          return {
                            complaintId: item.complaintId,
                            deviceName: item.deviceName,
                            description: item.description,
                            priorty: item.priorty,
                            status: item.status,
                            resolvingDate: `${
                              item?.resolvingDate !== null
                                ? item?.resolvingDate.slice(0, 10)
                                : "N/A"
                            }, ${
                              item?.resolvingDate !== null
                                ? convertTo12HourFormat(
                                    item?.resolvingDate,
                                    true
                                  )
                                : ""
                            }`,
                            createdAt: `${item?.createdAt.slice(
                              0,
                              10
                            )}, ${convertTo12HourFormat(
                              item?.createdAt,
                              true
                            )}`,
                          };
                        });

                  setHeader(columns);
                  setPdfData(rowData);
                }

                setReportName(row.data.title);
                // downloadPDF();
              }}
            >
              <PDFDownloadLink
                document={<PDFDcoument />} // PDF content to be downloaded
                fileName={`${reportName}.pdf`} // Name of the file to be downloaded
              >
                <BiSolidFilePdf size={22} color="red" />
              </PDFDownloadLink>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    dispatch(setReports([]));
    // toggleModal();
  }, []);

  // Function to calculate the max width of each column or distribute evenly
  const getColumnWidths = () => {
    const totalColumns = header?.length;
    if (pdfData?.length === 0) {
      return Array(totalColumns).fill(100); // If no data, make each column equal width
    }
    const widths = header?.map((headerItem: any) => {
      let maxLength = headerItem.label.length; // Initialize with the label length
      // Check max length from data values for each column
      pdfData?.forEach((item: any) => {
        const itemLength = String(item[headerItem.value] || "").length;
        if (itemLength > maxLength) {
          maxLength = itemLength;
        }
      });
      return maxLength * 7; // Multiply by a factor to ensure enough space for text (7px per character)
    });
    // If there is less data, distribute columns evenly across the page
    const totalWidth = widths?.reduce((sum: any, width: any) => sum + width, 0);
    if (totalWidth < 800) {
      return Array(totalColumns).fill(800 / totalColumns); // Distribute evenly if total width is too small
    }
    return widths;
  };

  const columnWidths = getColumnWidths(); // Get dynamic column widths

  const styles2 = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
    text: {
      fontSize: 8,
    },
    reportName: {
      justifyContent: "center",
      alignItems: "center",
    },
    titleName: {
      fontSize: 12,
    },
    titleText: {
      fontSize: 16,
    },
    companyDetails: {
      fontSize: 12,
      maxWidth: "200px",
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingVertical: 3,
    },
    tableContainer: {
      width: "100%",
      height: "auto",
      border: "2px solid black",
    },
    tableRowForHeader: {
      flexDirection: "row",
      borderBottom: "2px solid black",
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid black",
      borderColor: "gray",
    },
    tableCell: {
      paddingVertical: 7,
      paddingLeft: 7,
      fontSize: "7.5px",
      margin: -1,
      fontWeight: "extrabold",
    },
    headerCell: {
      paddingVertical: 10,
      paddingLeft: 7,
      margin: -1,
      fontFamily: "Helvetica-Bold",
      fontSize: "9.5px",
    },
    image: {
      minWidth: "150px",
      maxWidth: "160px",
      height: "80px",
    },
    header: {
      flexDirection: "row",
      marginBottom: 10,
      justifyContent: "space-between",
    },
  });

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const PDFDcoument = () => (
    <Document>
      <Page size={[842.89, 555.28]} style={styles2.page}>
        <View style={styles2.section}>
          <View style={styles2.header}>
            <Image
              src={
                userPersonalizationData !== null &&
                userPersonalizationData?.loginPageLogo.url !== ""
                  ? `${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`
                  : BackgroundImage
              }
              style={styles2.image}
            />
            <View style={styles2.reportName}>
              <View>
                <Text style={styles2.titleName}>Report Name:</Text>
              </View>
              <View>
                <Text style={styles2.titleText}>{reportName}</Text>
              </View>
            </View>
            <View style={styles2.companyDetails}>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Name: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc@gmail.com
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Email: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc@gmail.com
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Address: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  abc address
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
              <View style={styles2.detailsRow}>
                <Text style={styles2.titleName}> Phone: &nbsp;</Text>
                <Text style={styles2.titleName}>
                  021-36215572
                  {userPersonalizationData?.user?.emailAddress}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles2.text}></Text>
          <br />

          <br />
          <View style={styles2.tableContainer}>
            {/* Table Header */}
            <View style={styles2.tableRowForHeader}>
              {header &&
                Array.isArray(header) &&
                header?.map((item: any, index: any) => (
                  <Text
                    style={[styles2.headerCell, { width: columnWidths[index] }]}
                    key={index}
                  >
                    {item.label}
                  </Text>
                ))}
            </View>

            {/* Table Data */}
            {pdfData?.map((item: any, index: any) => (
              <View style={styles2.tableRow} key={index}>
                {header?.map((headerItem: any, headerIndex: number) => {
                  const value = item[headerItem.value];
                  return (
                    <Text
                      style={[
                        styles2.tableCell,
                        { width: columnWidths[headerIndex] },
                      ]}
                      key={headerIndex}
                    >
                      {value || "N/A"}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <Container fluid>
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0">
              <H4>All Reports</H4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <Loader />
                ) : reports?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <td style={{ width: "20%" }}>Report No</td>
                          <td style={{ width: "20%" }}>Title</td>
                          <td style={{ width: "15%" }}>Start Date</td>
                          <td style={{ width: "15%" }}>End Date</td>

                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <H7>No Reports Found</H7>
                )}
              </div>

              {modal && (
                <ViewPDFModalForReports
                  modal={modal}
                  toggleModal={toggleModal}
                  header={header}
                  data={pdfData}
                  reportName={reportName}
                />
              )}
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default ReportsList;
