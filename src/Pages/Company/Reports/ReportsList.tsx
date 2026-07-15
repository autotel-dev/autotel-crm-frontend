import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Modal,
  ModalBody,
  // Button,
} from "reactstrap";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import "./reportsStyle.css";
import Loader from "../../Utilities/Loader/Loader";
import xlsx from "json-as-xlsx";

import { setReports } from "../../../ReaduxToolkit/Reducer/ReportsSlice";
import "jspdf-autotable";
import { H4, P } from "../../../AbstractElements";
import H7 from "../../../CommonElements/Headings/H7Element";
import { FaFileExcel } from "react-icons/fa6";
import { BiSolidFilePdf } from "react-icons/bi";
import ViewPDFModalForReports from "./ViewPDFModal";
import { formatUnderscoredString } from "../../../Utilities/globals/globals";
import { FaEye } from "react-icons/fa";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { IMAGE_BASE_URL } from "../../../Utilities/api/apiEndpoints";
import BackgroundImage from "../../../assets/Background Image.png";
import {
  TravelSummaryDocument,
  DailyTravelDocument,
  EventAgentResponseDocument,
  VehicleHistoryDocument,
  formatReportDateTime,
} from "./TravelReportDocuments";

// Report types that use a dedicated card layout for View/PDF instead of the generic table
const CARD_REPORT_TYPES = [
  "/get-travel-summary-report",
  "/get-daily-travel-report",
  "/get-event-agent-response-report",
  "/get-vehicle-history-report",
];

const pdfStyles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  text: { fontSize: 8 },
  reportName: { justifyContent: "center", alignItems: "center" },
  titleName: { fontSize: 12 },
  titleText: { fontSize: 16 },
  companyDetails: { fontSize: 8, maxWidth: "200px" },
  detailsRow: { flexDirection: "row", justifyContent: "flex-start", paddingVertical: 1 },
  tableContainer: { width: "100%", height: "auto", border: "2px solid black" },
  tableRowForHeader: { flexDirection: "row", borderBottom: "2px solid black" },
  tableRow: { flexDirection: "row", borderBottom: "1px solid black", borderColor: "gray" },
  tableCell: { paddingVertical: 7, paddingLeft: 7, fontSize: "7.5px", margin: -1, fontWeight: "extrabold" },
  headerCell: { paddingVertical: 10, paddingLeft: 7, margin: -1, fontFamily: "Helvetica-Bold", fontSize: "9.5px" },
  image: { minWidth: "150px", maxWidth: "160px", height: "80px" },
  header: { flexDirection: "row", marginBottom: 10, justifyContent: "space-between" },
});

const PDFDocumentContent = ({ header, pdfData, reportName, columnWidths, userPersonalizationData, userData, fromDate, toDate, registrationNo }: any) => {
  const chunkSize = 200; // Optimization: Chunk data to avoid browser freeze
  const chunks = [];
  if (pdfData && pdfData.length > 0) {
    for (let i = 0; i < pdfData.length; i += chunkSize) {
      chunks.push(pdfData.slice(i, i + chunkSize));
    }
  } else {
    chunks.push([]);
  }

  return (
    <Document>
      {chunks.map((chunk, chunkIndex) => (
        <Page key={chunkIndex} size={[842.89, 555.28]} style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            {chunkIndex === 0 && (
              <View style={pdfStyles.header}>
                <Image
                  src={
                    userPersonalizationData !== null && userPersonalizationData?.loginPageLogo.url !== ""
                      ? `${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo.url}`
                      : BackgroundImage
                  }
                  style={pdfStyles.image}
                />
                <View style={pdfStyles.reportName}>
                  <View><Text style={pdfStyles.titleName}>Report Name:</Text></View>
                  <View><Text style={pdfStyles.titleText}>{reportName}</Text></View>
                </View>
                <View style={pdfStyles.companyDetails}>
                  <View style={pdfStyles.detailsRow}>
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Name: &nbsp;</Text>
                    <Text style={{ fontSize: 8 }}>{userData?.fullName || "N/A"}</Text>
                  </View>
                  <View style={pdfStyles.detailsRow}>
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Generated On: &nbsp;</Text>
                    <Text style={{ fontSize: 8 }}>{new Date().toISOString().slice(0, 10)} {new Date().toLocaleTimeString()}</Text>
                  </View>
                  {registrationNo && (
                    <View style={pdfStyles.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Registration No: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{registrationNo}</Text>
                    </View>
                  )}
                  <View style={pdfStyles.detailsRow}>
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Email: &nbsp;</Text>
                    <Text style={{ fontSize: 8 }}>{userData?.emailAddress || "N/A"}</Text>
                  </View>
                  <View style={pdfStyles.detailsRow}>
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}> Phone: &nbsp;</Text>
                    <Text style={{ fontSize: 8 }}>{userData?.phoneNo || "N/A"}</Text>
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <View style={pdfStyles.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>From: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{fromDate || "N/A"}</Text>
                    </View>
                    <View style={pdfStyles.detailsRow}>
                      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>To: &nbsp;</Text>
                      <Text style={{ fontSize: 8 }}>{toDate || "N/A"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={pdfStyles.tableContainer}>
              <View style={pdfStyles.tableRowForHeader} fixed>
                {header?.map((item: any, index: any) => (
                  <Text style={[pdfStyles.headerCell, { width: columnWidths[index] }]} key={index}>
                    {item.label}
                  </Text>
                ))}
              </View>
              {chunk.map((item: any, index: any) => (
                <View style={pdfStyles.tableRow} key={index}>
                  {header?.map((headerItem: any, headerIndex: number) => (
                    <Text style={[pdfStyles.tableCell, { width: columnWidths[headerIndex] }]} key={headerIndex}>
                      {item[headerItem.value] ?? "N/A"}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

const ReportsList = () => {
  const { reports } = useSelector((state: any) => state.reports);
  const { userData } = useSelector((state: any) => state.user);

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
  const [header, setHeader] = useState<any[]>([]);
  const [pdfData, setPdfData] = useState<any[]>([]);
  const [reportName, setReportName] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [registrationNo, setRegistrationNo] = useState<string>("");
  const [generatingPdfId, setGeneratingPdfId] = useState<number | null>(null);
  const [isPreparingView, setIsPreparingView] = useState<number | null>(null);

  // Travel Summary / Daily Travel use a dedicated card layout instead of the generic table
  const [travelReportType, setTravelReportType] = useState<string>("");
  const [travelData, setTravelData] = useState<any[]>([]);
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");

  const { userPersonalizationData } = useSelector((state: any) => state.personalization);

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

  // Improved chunkedTransform with more frequent yielding to keep the UI responsive
  const chunkedTransform = async (data: any[], transformFn: (item: any, index: number) => any, chunkSize = 150) => {
    const result = [];
    if (!data || !Array.isArray(data)) return [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      result.push(...chunk.map((item, index) => transformFn(item, i + index)));
      // Yield to the main thread more frequently
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return result;
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
                        alertEventCloseDate: `${item?.alertEventCloseDate == "Not Completed"
                          ? "Not Completed"
                          : item?.alertEventCloseDate.slice(0, 10)
                          }, ${item?.alertEventCloseDate == "Not Completed"
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
                } else if (row.type == "/get-live-alert-report" || row.type == "/get-live-alerts-report") {
                  const unwantedKeys = ["packetId", "isAcknowledged"];
                  if (row.data.data.reportTableHeaders) {
                    columns = row.data.data.reportTableHeaders
                      .filter((h: string) => !unwantedKeys.includes(h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "")))
                      .map((h: string) => ({
                        label: h,
                        value: h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "")
                      }));
                    rowData = row.data.data.reportData?.map((item: any) => {
                      const newItem = { ...item };
                      if (newItem.metadata && typeof newItem.metadata === 'object') {
                        newItem.metadata = JSON.stringify(newItem.metadata);
                      }
                      unwantedKeys.forEach(key => delete newItem[key]);
                      return newItem;
                    }) || [];
                  } else {
                    const tempRawData = Array.isArray(row.data.data) ? row.data.data : [row.data.data.reportData || row.data.data];
                    columns = Object.keys(tempRawData[0] || {})
                      .filter(k => !unwantedKeys.includes(k))
                      .map(k => ({ label: formatUnderscoredString(k), value: k }));
                    rowData = tempRawData.map((item: any) => {
                      const newItem = { ...item };
                      unwantedKeys.forEach(key => delete newItem[key]);
                      return newItem;
                    });
                  }
                } else if (row.type == "/get-trip-detail-report") {
                  const { tripInfo, metrics, stops } = row.data.data;
                  const data = [
                    {
                      sheet: "Trip Summary",
                      columns: [
                        { label: "Title", value: "title" },
                        { label: "Driver", value: "driver" },
                        { label: "Status", value: "status" },
                        { label: "Start", value: "start" },
                        { label: "End", value: "end" },
                        { label: "Total Duration (Min)", value: "totalDurationMin" },
                        { label: "Total Delay (Min)", value: "totalDelayMin" },
                      ],
                      content: [{ ...tripInfo, ...metrics }]
                    },
                    {
                      sheet: "Stops",
                      columns: [
                        { label: "Seq", value: "sequence" },
                        { label: "Location", value: "location" },
                        { label: "Stop Type", value: "stopType" },
                        { label: "Sched. Arrival", value: "scheduledArrival" },
                        { label: "Actual Arrival", value: "actualArrival" },
                        { label: "Arrival Status", value: "arrivalStatus" },
                        { label: "Stay Duration (Min)", value: "stayDurationMin" },
                      ],
                      content: stops
                    }
                  ];
                  return handleButtonClick(e, settings, data, index);
                } else if (row.type == "/get-complaint-report") {
                  columns = [
                    { label: "Complaint Id", value: "complaintId" },
                    { label: "Device Name", value: "deviceName" },
                    { label: "Description", value: "description" },
                    { label: "Priorty", value: "priorty" },
                    { label: "Status", value: "status" },
                    { label: "Resolving Date", value: "resolvingDate" },
                    { label: "Created At", value: "createdAt" },
                  ];
                  rowData = row.data.data.length == 0 ? [] : row.data.data.map((item: any) => ({
                    complaintId: item.complaintId,
                    deviceName: item?.deviceName,
                    description: item?.description,
                    priorty: item?.priorty,
                    status: item?.status,
                    resolvingDate: `${item?.resolvingDate !== null ? item?.resolvingDate.slice(0, 10) : "N/A"}, ${item?.resolvingDate !== null ? convertTo12HourFormat(item?.resolvingDate, true) : ""}`,
                    createdAt: `${item?.createdAt.slice(0, 10)}, ${convertTo12HourFormat(item?.createdAt, true)}`,
                  }));
                } else if (row.type == "/get-vehicle-history-report") {
                  columns = [
                    { label: "Time", value: "timestamp" },
                    { label: "Latitude", value: "latitude" },
                    { label: "Longitude", value: "longitude" },
                    { label: "Address", value: "address" },
                    { label: "Altitude", value: "altitude" },
                    { label: "Speed", value: "speed" },
                    { label: "Course", value: "course" },
                    { label: "Ignition", value: "ignition" },
                    { label: "Motion", value: "motion" },
                  ];
                  rowData = (row.data.data?.reportData || []).map((item: any) => ({
                    timestamp: formatReportDateTime(item.timestamp),
                    latitude: item.latitude,
                    longitude: item.longitude,
                    address: item.address,
                    altitude: `${item.altitude ?? 0} m`,
                    speed: `${Math.round(Number(item.speed) || 0)} kph`,
                    course: item.course,
                    ignition: item.ignition ? "on" : "off",
                    motion: item.motion ? "on" : "off",
                  }));
                } else if (row.type == "/get-event-agent-response-report") {
                  columns = [
                    { label: "Registration No", value: "registrationNo" },
                    { label: "Alert Generation Time", value: "alertGenerationTime" },
                    { label: "Assigned Time", value: "assignedTime" },
                    { label: "Creation to Assignment Duration", value: "creationToAssignDuration" },
                    { label: "Response Time", value: "responseTime" },
                    { label: "Agent Response Time", value: "agentResponseTime" },
                    { label: "Event", value: "event" },
                    { label: "Position", value: "position" },
                    { label: "Description", value: "description" },
                    { label: "Operator", value: "operator" },
                  ];
                  rowData = (row.data.data?.reportData || []).map((item: any) => ({
                    ...item,
                    // alertGenerationTime is ISO (UTC); assignedTime/responseTime are already
                    // pre-formatted strings from the API, so leave them raw to avoid tz shifts.
                    alertGenerationTime: formatReportDateTime(item.alertGenerationTime),
                    position:
                      item.position?.address ||
                      (typeof item.position === "string" ? item.position : "N/A"),
                  }));
                } else if (row.type == "/get-travel-summary-report") {
                  columns = [
                    { label: "Device", value: "deviceLabel" },
                    { label: "Route Start", value: "routeStart" },
                    { label: "Route End", value: "routeEnd" },
                    { label: "Route Length", value: "routeLength" },
                    { label: "Move Duration", value: "moveDuration" },
                    { label: "Stop Duration", value: "stopDuration" },
                    { label: "Top Speed", value: "topSpeed" },
                    { label: "Average Speed", value: "averageSpeed" },
                    { label: "Overspeed Count", value: "overspeedCount" },
                    { label: "Engine Hours", value: "engineHours" },
                    { label: "Engine Work", value: "engineWork" },
                    { label: "Engine Idle", value: "engineIdle" },
                    { label: "Odometer", value: "odometer" },
                  ];
                  rowData = (row.data.data?.reportData || []).map((item: any) => ({
                    ...item,
                    routeStart: formatReportDateTime(item.routeStart),
                    routeEnd: formatReportDateTime(item.routeEnd),
                  }));
                } else if (row.type == "/get-daily-travel-report") {
                  columns = [
                    { label: "Device", value: "device" },
                    { label: "Date", value: "date" },
                    { label: "Travel start time", value: "travelStartTime" },
                    { label: "Travel end time", value: "travelEndTime" },
                    { label: "Travel time", value: "travelTime" },
                    { label: "Distance travelled", value: "distanceTravelled" },
                    { label: "Move duration", value: "moveDuration" },
                  ];
                  rowData = (row.data.data?.reportData || []).flatMap((v: any) =>
                    (v.dailyData || []).map((d: any) => ({
                      device: v.deviceLabel || v.registrationNo,
                      date: d.date,
                      travelStartTime: formatReportDateTime(d.travelStartTime),
                      travelEndTime: formatReportDateTime(d.travelEndTime),
                      travelTime: d.travelTime,
                      distanceTravelled: d.distanceTravelled,
                      moveDuration: d.moveDuration,
                    }))
                  );
                } else {
                  // Generic fallback (e.g. other unmapped report types)
                  const rawData = row.data.data?.reportData || row.data.data;
                  rowData = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
                  columns = rowData.length > 0
                    ? Object.keys(rowData[0] || {}).map((k) => ({ label: formatUnderscoredString(k), value: k }))
                    : [];
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
              onClick={async () => {
                if (isPreparingView !== null) return;

                // Travel Summary / Daily Travel -> dedicated card layout (no table build needed)
                if (CARD_REPORT_TYPES.includes(row.type)) {
                  setTravelReportType(row.type);
                  setTravelData(row.data.data?.reportData || []);
                  setReportName(row.data.title);
                  setRegistrationNo(row.data.registrationNo || ""); // vehicle history device label
                  setPeriodStart(row.data.startDate);
                  setPeriodEnd(row.data.endDate);
                  toggleModal();
                  return;
                }

                setIsPreparingView(index);
                // Allow UI to render the spinner before heavy work
                await new Promise((resolve) => setTimeout(resolve, 100));

                try {
                  setTravelReportType(""); // ensure table layout for non-travel reports
                  const unwantedKeys = ["packetId", "isAcknowledged"];
                  let rd: any[] = [];
                  let columns: any[] = [];
                  const rawData = row.data.data.reportData || row.data.data;

                  if (row.type == "/get-all-alert-events-report") {
                    columns = [{ label: "Device Name", value: "deviceName" }, { label: "Latitude", value: "latitude" }, { label: "Longitude", value: "longitude" }, { label: "Speed", value: "speed" }, { label: "Type", value: "type" }, { label: "Message", value: "message" }, { label: "User", value: "user" }, { label: "Completion Response", value: "completionResponse" }, { label: "Alert Event Close Date", value: "alertEventCloseDate" }, { label: "Server Time", value: "serverTime" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({
                      ...item,
                      alertEventCloseDate: `${item?.alertEventCloseDate == "Not Completed" ? "Not Completed" : item?.alertEventCloseDate.slice(0, 10)}, ${item?.alertEventCloseDate == "Not Completed" ? "" : convertTo12HourFormat(item?.alertEventCloseDate, false)}`,
                      serverTime: `${item?.serverDateAndTime.slice(0, 10)}, ${convertTo12HourFormat(item?.serverDateAndTime, true)}`,
                      user: item?.alertEventCloseDate == "Not Completed" ? item?.assignedTo?.fullName : item?.completedByUser?.fullName,
                      latitude: Number(item.latitude).toFixed(7),
                      longitude: Number(item.longitude).toFixed(7)
                    }));
                  } else if (row.type == "/get-operator-performance-report") {
                    columns = [{ label: "Name", value: "name" }, { label: "Limit", value: "limit" }, { label: "Alerts Catered", value: "totalAlertsHandled" }, { label: "Average Sec in Alert", value: "averageAlertDifferenceTime" }, { label: "Rating", value: "rating" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ ...item }));
                  } else if (row.type == "/get-inventory-report") {
                    columns = [{ label: "Product Name", value: "productName" }, { label: "Product Type", value: "productType" }, { label: "Serial Number", value: "serialNumber" }, { label: "Sku", value: "sku" }, { label: "User", value: "user" }, { label: "Company", value: "company" }, { label: "Branch", value: "branch" }, { label: "Warehouse", value: "warehouse" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ productName: item.productName, productType: item.productType, serialNumber: item.serialNumber, sku: item.sku, user: item.user.fullName, company: item.company.fullName, branch: item.branch.name, warehouse: item.warehouse.name }));
                  } else if (row.type == "/get-sale-invoice-report") {
                    columns = [{ label: "Customer", value: "customerName" }, { label: "Address", value: "address" }, { label: "Comments", value: "comments" }, { label: "Date", value: "date" }, { label: "Due Date", value: "dueDate" }, { label: "Status", value: "status" }, { label: "Net Amount", value: "netAmount" }, { label: "Gross Amount", value: "grossAmount" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ customerName: item.customerName, address: item.address, comments: item.comments, date: item.invoiceDate, dueDate: item.invoiceDueDate, status: item.status, netAmount: item.netAmount, grossAmount: item.grossAmount }));
                  } else if (row.type == "/get-purchase-invoice-report") {
                    columns = [{ label: "Vendor", value: "vendor" }, { label: "Branch", value: "branch" }, { label: "Warehouse", value: "warehouse" }, { label: "Date", value: "date" }, { label: "Due Date", value: "dueDate" }, { label: "Status", value: "status" }, { label: "Shipping Details", value: "shippingCharges" }, { label: "Net Amount", value: "netAmount" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ vendor: item.vendor.vendorName, branch: item.branch.name, warehouse: item.warehouse.name, date: item.invoiceDate, dueDate: item.invoiceDueDate, status: item.status, shippingCharges: item.shippingCharges, netAmount: item.netAmount }));
                  } else if (row.type == "/get-amc-due-report") {
                    columns = [{ label: "Customer", value: "customer" }, { label: "Registration No", value: "registrationNo" }, { label: "Renewal Date", value: "serviceRenewalDate" }, { label: "Service Charges", value: "servicePackageCharges" }, { label: "Discounted Charges", value: "servicePackageDiscountedCharges" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ customer: item.customer.fullName, registrationNo: item.registrationNo, serviceRenewalDate: item.serviceRenewalDate.slice(0, 10), servicePackageCharges: item.servicePackageCharges, servicePackageDiscountedCharges: item.servicePackageDiscountedCharges }));
                  } else if (row.type == "/get-trip-detail-report") {
                    columns = [{ label: "Seq", value: "sequence" }, { label: "Location", value: "location" }, { label: "Stop Type", value: "stopType" }, { label: "Sched. Arrival", value: "scheduledArrival" }, { label: "Actual Arrival", value: "actualArrival" }, { label: "Arrival Status", value: "arrivalStatus" }, { label: "Stay (Min)", value: "stayDurationMin" }];
                    rd = await chunkedTransform(row.data.data.stops, (s: any) => ({ ...s, scheduledArrival: s.scheduledArrival?.slice(0, 16), actualArrival: s.actualArrival?.slice(0, 16) }));
                  } else if (row.type == "/get-live-alert-report" || row.type == "/get-live-alerts-report") {
                    if (row.data.data.reportTableHeaders) {
                      columns = row.data.data.reportTableHeaders
                        .filter((h: string) => !unwantedKeys.includes(h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "")))
                        .map((h: string) => ({ label: h, value: h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "") }));
                      rd = await chunkedTransform(rawData, (item: any) => {
                        const newItem = {
                          ...item,
                          metadata: item.metadata && typeof item.metadata === 'object' ? JSON.stringify(item.metadata) : item.metadata
                        };
                        unwantedKeys.forEach(key => delete newItem[key]);
                        return newItem;
                      });
                    } else {
                      const baseData = Array.isArray(rawData) ? rawData : [rawData];
                      columns = Object.keys(baseData[0] || {})
                        .filter(k => !unwantedKeys.includes(k))
                        .map(k => ({ label: formatUnderscoredString(k), value: k }));
                      rd = await chunkedTransform(baseData, (item: any) => {
                        const newItem = { ...item };
                        unwantedKeys.forEach(key => delete newItem[key]);
                        return newItem;
                      });
                    }
                  } else if (row.type == "/get-complaint-report") {
                    columns = [{ label: "Complaint Id", value: "complaintId" }, { label: "Device Name", value: "deviceName" }, { label: "Description", value: "description" }, { label: "Priorty", value: "priorty" }, { label: "Status", value: "status" }, { label: "Resolving Date", value: "resolvingDate" }, { label: "Created At", value: "createdAt" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ complaintId: item.complaintId, deviceName: item.deviceName, description: item.description, priorty: item.priorty, status: item.status, resolvingDate: `${item?.resolvingDate !== null ? item?.resolvingDate.slice(0, 10) : "N/A"}, ${item?.resolvingDate !== null ? convertTo12HourFormat(item?.resolvingDate, true) : ""}`, createdAt: `${item?.createdAt.slice(0, 10)}, ${convertTo12HourFormat(item?.createdAt, true)}` }));
                  } else {
                    const baseData = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
                    columns = baseData.length > 0 ? Object.keys(baseData[0] || {}).map(k => ({ label: formatUnderscoredString(k), value: k })) : [];
                    rd = await chunkedTransform(baseData, (item: any) => ({ ...item }));
                  }

                  setHeader(columns);
                  setPdfData(rd);
                  setReportName(row.data.title);
                  setFromDate(row.data.startDate.slice(0, 10));
                  setToDate(row.data.endDate.slice(0, 10));
                  setRegistrationNo(row.data.registrationNo || "");
                  toggleModal();
                } catch (error) {
                  console.error("View PDF Error", error);
                } finally {
                  setIsPreparingView(null);
                }
              }}
            >
              {isPreparingView === index ? (
                <Spinner size="sm" color="primary" />
              ) : (
                <FaEye size={22} color="blue" />
              )}
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
              onClick={async () => {
                if (generatingPdfId !== null) return;
                setGeneratingPdfId(index);
                // Allow UI to render the spinner before heavy work
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Travel Summary / Daily Travel -> dedicated card PDF
                if (CARD_REPORT_TYPES.includes(row.type)) {
                  try {
                    const travelDoc =
                      row.type === "/get-travel-summary-report" ? (
                        <TravelSummaryDocument
                          reportData={row.data.data?.reportData || []}
                          reportName={row.data.title}
                          userData={userData}
                          userPersonalizationData={userPersonalizationData}
                        />
                      ) : row.type === "/get-event-agent-response-report" ? (
                        <EventAgentResponseDocument
                          reportData={row.data.data?.reportData || []}
                          reportName={row.data.title}
                          userData={userData}
                          userPersonalizationData={userPersonalizationData}
                          periodStart={row.data.startDate}
                          periodEnd={row.data.endDate}
                        />
                      ) : row.type === "/get-vehicle-history-report" ? (
                        <VehicleHistoryDocument
                          reportData={row.data.data?.reportData || []}
                          reportName={row.data.title}
                          userData={userData}
                          userPersonalizationData={userPersonalizationData}
                          deviceLabel={row.data.registrationNo}
                          periodStart={row.data.startDate}
                          periodEnd={row.data.endDate}
                        />
                      ) : (
                        <DailyTravelDocument
                          reportData={row.data.data?.reportData || []}
                          reportName={row.data.title}
                          userData={userData}
                          userPersonalizationData={userPersonalizationData}
                          periodStart={row.data.startDate}
                          periodEnd={row.data.endDate}
                        />
                      );
                    const blob = await pdf(travelDoc).toBlob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${row.data.title}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("PDF Generate Fail", err);
                  } finally {
                    setGeneratingPdfId(null);
                  }
                  return;
                }

                try {
                  const unwantedKeys = ["packetId", "isAcknowledged"];
                  let columns: any[] = [];
                  let rd: any[] = [];
                  const rawData = row.data.data.reportData || row.data.data;

                  // Reusing chunked transformation logic
                  if (row.type == "/get-all-alert-events-report") {
                    columns = [{ label: "Device Name", value: "deviceName" }, { label: "Latitude", value: "latitude" }, { label: "Longitude", value: "longitude" }, { label: "Speed", value: "speed" }, { label: "Type", value: "type" }, { label: "Message", value: "message" }, { label: "User", value: "user" }, { label: "Completion Response", value: "completionResponse" }, { label: "Alert Event Close Date", value: "alertEventCloseDate" }, { label: "Server Time", value: "serverTime" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ ...item, alertEventCloseDate: `${item?.alertEventCloseDate == "Not Completed" ? "Not Completed" : item?.alertEventCloseDate.slice(0, 10)}, ${item?.alertEventCloseDate == "Not Completed" ? "" : convertTo12HourFormat(item?.alertEventCloseDate, false)}`, serverTime: `${item?.serverDateAndTime.slice(0, 10)}, ${convertTo12HourFormat(item?.serverDateAndTime, true)}`, user: item?.alertEventCloseDate == "Not Completed" ? item?.assignedTo?.fullName : item?.completedByUser?.fullName, latitude: Number(item.latitude).toFixed(7), longitude: Number(item.longitude).toFixed(7) }));
                  } else if (row.type == "/get-operator-performance-report") {
                    columns = [{ label: "Name", value: "name" }, { label: "Limit", value: "limit" }, { label: "Alerts Catered", value: "totalAlertsHandled" }, { label: "Average Sec in Alert", value: "averageAlertDifferenceTime" }, { label: "Rating", value: "rating" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ ...item }));
                  } else if (row.type == "/get-inventory-report") {
                    columns = [{ label: "Product Name", value: "productName" }, { label: "Product Type", value: "productType" }, { label: "Serial Number", value: "serialNumber" }, { label: "Sku", value: "sku" }, { label: "User", value: "user" }, { label: "Company", value: "company" }, { label: "Branch", value: "branch" }, { label: "Warehouse", value: "warehouse" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ productName: item.productName, productType: item.productType, serialNumber: item.serialNumber, sku: item.sku, user: item.user.fullName, company: item.company.fullName, branch: item.branch.name, warehouse: item.warehouse.name }));
                  } else if (row.type == "/get-sale-invoice-report") {
                    columns = [{ label: "Customer", value: "customerName" }, { label: "Address", value: "address" }, { label: "Comments", value: "comments" }, { label: "Date", value: "date" }, { label: "Due Date", value: "dueDate" }, { label: "Status", value: "status" }, { label: "Net Amount", value: "netAmount" }, { label: "Gross Amount", value: "grossAmount" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ customerName: item.customerName, address: item.address, comments: item.comments, date: item.invoiceDate, dueDate: item.invoiceDueDate, status: item.status, netAmount: item.netAmount, grossAmount: item.grossAmount }));
                  } else if (row.type == "/get-purchase-invoice-report") {
                    columns = [{ label: "Vendor", value: "vendor" }, { label: "Branch", value: "branch" }, { label: "Warehouse", value: "warehouse" }, { label: "Date", value: "date" }, { label: "Due Date", value: "dueDate" }, { label: "Status", value: "status" }, { label: "Shipping Details", value: "shippingCharges" }, { label: "Net Amount", value: "netAmount" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ vendor: item.vendor.vendorName, branch: item.branch.name, warehouse: item.warehouse.name, date: item.invoiceDate, dueDate: item.invoiceDueDate, status: item.status, shippingCharges: item.shippingCharges, netAmount: item.netAmount }));
                  } else if (row.type == "/get-amc-due-report") {
                    columns = [{ label: "Customer", value: "customer" }, { label: "Registration No", value: "registrationNo" }, { label: "Renewal Date", value: "serviceRenewalDate" }, { label: "Service Charges", value: "servicePackageCharges" }, { label: "Discounted Charges", value: "servicePackageDiscountedCharges" }];
                    rd = await chunkedTransform(rawData, (item: any) => ({ customer: item.customer.fullName, registrationNo: item.registrationNo, serviceRenewalDate: item.serviceRenewalDate.slice(0, 10), servicePackageCharges: item.servicePackageCharges, servicePackageDiscountedCharges: item.servicePackageDiscountedCharges }));
                  } else if (row.type == "/get-live-alert-report" || row.type == "/get-live-alerts-report") {
                    if (row.data.data.reportTableHeaders) {
                      columns = row.data.data.reportTableHeaders
                        .filter((h: string) => !unwantedKeys.includes(h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "")))
                        .map((h: string) => ({ label: h, value: h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "") }));
                      rd = await chunkedTransform(rawData, (item: any) => {
                        const newItem = {
                          ...item,
                          metadata: item.metadata && typeof item.metadata === 'object' ? JSON.stringify(item.metadata) : item.metadata
                        };
                        unwantedKeys.forEach(key => delete newItem[key]);
                        return newItem;
                      });
                    } else {
                      const baseData = Array.isArray(rawData) ? rawData : [rawData];
                      columns = Object.keys(baseData[0] || {})
                        .filter(k => !unwantedKeys.includes(k))
                        .map(k => ({ label: formatUnderscoredString(k), value: k }));
                      rd = await chunkedTransform(baseData, (item: any) => {
                        const newItem = { ...item };
                        unwantedKeys.forEach(key => delete newItem[key]);
                        return newItem;
                      });
                    }
                  } else {
                    const baseData = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
                    rd = await chunkedTransform(baseData, (item: any) => ({ ...item }));
                    columns = rd.length > 0 ? Object.keys(rd[0] || {}).map(k => ({ label: formatUnderscoredString(k), value: k })) : [];
                  }

                  const blob = await pdf(
                    <PDFDocumentContent
                      header={columns}
                      pdfData={rd}
                      reportName={row.data.title}
                      fromDate={row.data.startDate.slice(0, 10)}
                      toDate={row.data.endDate.slice(0, 10)}
                      registrationNo={row.data.registrationNo || ""}
                      columnWidths={columns.map(() => 100)}
                      userPersonalizationData={userPersonalizationData}
                      userData={userData}
                    />
                  ).toBlob();

                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${row.data.title}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error("PDF Generate Fail", err);
                } finally {
                  setGeneratingPdfId(null);
                }
              }}
            >
              {generatingPdfId === index ? (
                <Spinner size="sm" color="danger" />
              ) : (
                <BiSolidFilePdf size={22} color="red" />
              )}
            </button>
          </div>
        </td>
      </tr >
    ));
  };
  useEffect(() => {
    dispatch(setReports([]));
  }, []);

  const columnWidths = useMemo(() => {
    const totalColumns = header?.length;
    if (!header || !pdfData || pdfData.length === 0) {
      return Array(totalColumns || 0).fill(100);
    }
    // Optimization: Sample only up to first 200 rows for width calculation
    const sampledData = pdfData.slice(0, 200);
    const widths = header.map((headerItem: any) => {
      let maxLength = headerItem.label.length;
      sampledData.forEach((item: any) => {
        const itemLength = String(item[headerItem.value] || "").length;
        if (itemLength > maxLength) maxLength = itemLength;
      });
      return Math.min(maxLength * 7, 300);
    });
    const totalWidth = widths.reduce((sum: any, w: any) => sum + w, 0);
    if (totalWidth < 800 && totalColumns) return Array(totalColumns).fill(800 / totalColumns);
    return widths;
  }, [header, pdfData]);


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

              {/* Lightweight Processing Overlay instead of Reactstrap Modal to avoid heavy portal logic during processing */}
              {(isPreparingView !== null || generatingPdfId !== null) && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: 9999,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  color: 'white',
                  borderRadius: '0px'
                }}>
                  <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                    <Loader />

                    <P style={{ color: '#666', marginTop: '10px' }}>Please wait while we prepare your report...</P>
                  </div>
                </div>
              )}

              {modal && (
                <ViewPDFModalForReports
                  modal={modal}
                  toggleModal={toggleModal}
                  header={header}
                  data={pdfData}
                  reportName={reportName}
                  fromDate={fromDate}
                  toDate={toDate}
                  registrationNo={registrationNo}
                  reportType={travelReportType}
                  travelData={travelData}
                  periodStart={periodStart}
                  periodEnd={periodEnd}
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
