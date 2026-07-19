import { Card, CardBody, Col, Container, CardHeader, Spinner } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./reportsStyle.css";
import Loader from "../../Utilities/Loader/Loader";
import xlsx from "json-as-xlsx";

import { setReports } from "../../../ReaduxToolkit/Reducer/ReportsSlice";
import { H4, P } from "../../../AbstractElements";
import H7 from "../../../CommonElements/Headings/H7Element";
import { FaFileExcel } from "react-icons/fa6";
import { BiSolidFilePdf } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { formatUnderscoredString } from "../../../Utilities/globals/globals";
import ReportDataModal from "./ReportDataModal";
import { CARD_REPORT_TYPES, getCardTable, formatReportRange } from "./reportFormatters";
import { generateCardReportPdf, generateTableReportPdf, downloadBlob } from "./reportPdf";

const UNWANTED_KEYS = ["packetId", "isAcknowledged"];

/** "Alert Generation Time" -> "alertGenerationTime" */
const toCamel = (h: string) => h.charAt(0).toLowerCase() + h.slice(1).replace(/ /g, "");

// Convert 24-hour time to 12-hour with AM/PM
const convertTo12HourFormat = (timeString: any, serverTime: any) => {
  const date = new Date(timeString);
  let hours = serverTime ? date.getHours() - 5 : date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
  const secondsFormatted = seconds < 10 ? "0" + seconds : seconds;

  return `${hours}:${minutesFormatted}:${secondsFormatted} ${ampm}`;
};

type GenericTable = { columns: Array<{ label: string; value: string }>; rows: any[] };

/**
 * Single source of truth for the non-card report types. Previously this mapping was
 * duplicated across the Excel, View and PDF handlers (and had drifted between them).
 */
function buildGenericTable(row: any): GenericTable {
  const type = row.type;
  const d = row.data?.data;
  const raw = d?.reportData || d;
  const arr: any[] = Array.isArray(raw) ? raw : [];

  const headerDriven = (): GenericTable => {
    if (d?.reportTableHeaders) {
      const columns = d.reportTableHeaders
        .filter((h: string) => !UNWANTED_KEYS.includes(toCamel(h)))
        .map((h: string) => ({ label: h, value: toCamel(h) }));
      const rows = (d.reportData || []).map((item: any) => {
        const n = { ...item };
        if (n.metadata && typeof n.metadata === "object") n.metadata = JSON.stringify(n.metadata);
        UNWANTED_KEYS.forEach((k) => delete n[k]);
        return n;
      });
      return { columns, rows };
    }
    const base = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const columns = Object.keys(base[0] || {})
      .filter((k) => !UNWANTED_KEYS.includes(k))
      .map((k) => ({ label: formatUnderscoredString(k), value: k }));
    const rows = base.map((item: any) => {
      const n = { ...item };
      UNWANTED_KEYS.forEach((k) => delete n[k]);
      return n;
    });
    return { columns, rows };
  };

  switch (type) {
    case "/get-all-alert-events-report":
      return {
        columns: [
          { label: "Device Name", value: "deviceName" },
          { label: "Latitude", value: "latitude" },
          { label: "Longitude", value: "longitude" },
          { label: "Speed", value: "speed" },
          { label: "Type", value: "type" },
          { label: "Message", value: "message" },
          { label: "User", value: "user" },
          { label: "Completion Response", value: "completionResponse" },
          { label: "Alert Event Close Date", value: "alertEventCloseDate" },
          { label: "Server Time", value: "serverTime" },
        ],
        rows: arr.map((item: any) => ({
          ...item,
          alertEventCloseDate: `${
            item?.alertEventCloseDate == "Not Completed" ? "Not Completed" : item?.alertEventCloseDate.slice(0, 10)
          }, ${item?.alertEventCloseDate == "Not Completed" ? "" : convertTo12HourFormat(item?.alertEventCloseDate, false)}`,
          serverTime: `${item?.serverDateAndTime.slice(0, 10)}, ${convertTo12HourFormat(item?.serverDateAndTime, true)}`,
          user:
            item?.alertEventCloseDate == "Not Completed" ? item?.assignedTo?.fullName : item?.completedByUser?.fullName,
          latitude: Number(item.latitude).toFixed(7),
          longitude: Number(item.longitude).toFixed(7),
        })),
      };

    case "/get-operator-performance-report":
      return {
        columns: [
          { label: "Name", value: "name" },
          { label: "Limit", value: "limit" },
          { label: "Alerts Catered", value: "totalAlertsHandled" },
          { label: "Average Sec in Alert", value: "averageAlertDifferenceTime" },
          { label: "Rating", value: "rating" },
        ],
        rows: arr.map((item: any) => ({ ...item })),
      };

    case "/get-inventory-report":
      return {
        columns: [
          { label: "Product Name", value: "productName" },
          { label: "Product Type", value: "productType" },
          { label: "Serial Number", value: "serialNumber" },
          { label: "Sku", value: "sku" },
          { label: "User", value: "user" },
          { label: "Company", value: "company" },
          { label: "Branch", value: "branch" },
          { label: "Warehouse", value: "warehouse" },
        ],
        rows: arr.map((item: any) => ({
          productName: item.productName,
          productType: item.productType,
          serialNumber: item.serialNumber,
          sku: item.sku,
          user: item.user?.fullName,
          company: item.company?.fullName,
          branch: item.branch?.name,
          warehouse: item.warehouse?.name,
        })),
      };

    case "/get-sale-invoice-report":
      return {
        columns: [
          { label: "Customer", value: "customerName" },
          { label: "Address", value: "address" },
          { label: "Comments", value: "comments" },
          { label: "Date", value: "date" },
          { label: "Due Date", value: "dueDate" },
          { label: "Status", value: "status" },
          { label: "Net Amount", value: "netAmount" },
          { label: "Gross Amount", value: "grossAmount" },
        ],
        rows: arr.map((item: any) => ({
          customerName: item.customerName,
          address: item.address,
          comments: item.comments,
          date: item.invoiceDate,
          dueDate: item.invoiceDueDate,
          status: item.status,
          netAmount: item.netAmount,
          grossAmount: item.grossAmount,
        })),
      };

    case "/get-purchase-invoice-report":
      return {
        columns: [
          { label: "Vendor", value: "vendor" },
          { label: "Branch", value: "branch" },
          { label: "Warehouse", value: "warehouse" },
          { label: "Date", value: "date" },
          { label: "Due Date", value: "dueDate" },
          { label: "Status", value: "status" },
          { label: "Shipping Details", value: "shippingCharges" },
          { label: "Net Amount", value: "netAmount" },
        ],
        rows: arr.map((item: any) => ({
          vendor: item.vendor?.vendorName,
          branch: item.branch?.name,
          warehouse: item.warehouse?.name,
          date: item.invoiceDate,
          dueDate: item.invoiceDueDate,
          status: item.status,
          shippingCharges: item.shippingCharges,
          netAmount: item.netAmount,
        })),
      };

    case "/get-inventory-lifecycle-report":
      return {
        columns: [
          { label: "Type", value: "type" },
          { label: "Status", value: "status" },
          { label: "From Vehicle", value: "fromVehicle" },
          { label: "To Vehicle", value: "toVehicle" },
          { label: "From Customer", value: "fromCustomer" },
          { label: "To Customer", value: "toCustomer" },
          { label: "Installer", value: "installer" },
        ],
        rows: (arr.length === 0 ? [] : arr[0]?.activities || []).map((item: any) => ({
          type: formatUnderscoredString(item.activityType),
          status: formatUnderscoredString(item.status),
          fromVehicle: item.fromVehicle == null ? "N/A" : item?.fromVehicle.registrationNo,
          toVehicle: item.toVehicle == null ? "N/A" : item?.toVehicle.registrationNo,
          fromCustomer: item.fromCustomer == null ? "N/A" : item?.fromCustomer?.fullName,
          toCustomer: item.toCustomer == null ? "N/A" : item?.toCustomer?.fullName,
          installer: item.installer == null ? "N/A" : item?.installer?.fullName,
        })),
      };

    case "/get-activity-report":
      return {
        columns: [
          { label: "Type", value: "type" },
          { label: "Status", value: "status" },
          { label: "From Vehicle", value: "fromVehicle" },
          { label: "To Vehicle", value: "toVehicle" },
          { label: "Inventory", value: "inventory" },
          { label: "Installer", value: "installer" },
          { label: "Remarks", value: "remarks" },
        ],
        rows: arr.map((item: any) => ({
          type: formatUnderscoredString(item.activityType),
          status: formatUnderscoredString(item.status),
          fromVehicle: item.fromVehicle == null ? "N/A" : item?.fromVehicle.registrationNo,
          toVehicle: item.toVehicle == null ? "N/A" : item?.toVehicle.registrationNo,
          inventory:
            item?.inventoryItems?.length === 0
              ? "N/A"
              : `${item?.inventoryItems?.map((inv: any) => `${inv.serialNumber} | `)}`,
          installer: item.installer == null ? "N/A" : item?.installer?.fullName,
          remarks: item.remarks === "" ? "N/A" : item?.remarks,
        })),
      };

    case "/get-amc-due-report":
      return {
        columns: [
          { label: "Customer", value: "customer" },
          { label: "Registration No", value: "registrationNo" },
          { label: "Renewal Date", value: "serviceRenewalDate" },
          { label: "Service Charges", value: "servicePackageCharges" },
          { label: "Discounted Charges", value: "servicePackageDiscountedCharges" },
        ],
        rows: arr.map((item: any) => ({
          customer: item.customer?.fullName,
          registrationNo: item.registrationNo,
          serviceRenewalDate: item.serviceRenewalDate?.slice(0, 10),
          servicePackageCharges: item.servicePackageCharges,
          servicePackageDiscountedCharges: item.servicePackageDiscountedCharges,
        })),
      };

    case "/get-trip-detail-report":
      return {
        columns: [
          { label: "Seq", value: "sequence" },
          { label: "Location", value: "location" },
          { label: "Stop Type", value: "stopType" },
          { label: "Sched. Arrival", value: "scheduledArrival" },
          { label: "Actual Arrival", value: "actualArrival" },
          { label: "Arrival Status", value: "arrivalStatus" },
          { label: "Stay (Min)", value: "stayDurationMin" },
        ],
        rows: (d?.stops || []).map((s: any) => ({
          ...s,
          scheduledArrival: s.scheduledArrival?.slice(0, 16),
          actualArrival: s.actualArrival?.slice(0, 16),
        })),
      };

    case "/get-complaint-report":
      return {
        columns: [
          { label: "Complaint Id", value: "complaintId" },
          { label: "Device Name", value: "deviceName" },
          { label: "Description", value: "description" },
          { label: "Priorty", value: "priorty" },
          { label: "Status", value: "status" },
          { label: "Resolving Date", value: "resolvingDate" },
          { label: "Created At", value: "createdAt" },
        ],
        rows: arr.map((item: any) => ({
          complaintId: item.complaintId,
          deviceName: item?.deviceName,
          description: item?.description,
          priorty: item?.priorty,
          status: item?.status,
          resolvingDate: `${item?.resolvingDate !== null ? item?.resolvingDate.slice(0, 10) : "N/A"}, ${
            item?.resolvingDate !== null ? convertTo12HourFormat(item?.resolvingDate, true) : ""
          }`,
          createdAt: `${item?.createdAt.slice(0, 10)}, ${convertTo12HourFormat(item?.createdAt, true)}`,
        })),
      };

    case "/get-live-alert-report":
    case "/get-live-alerts-report":
    default:
      return headerDriven();
  }
}

const ReportsList = () => {
  const { reports } = useSelector((state: any) => state.reports);
  const { userData } = useSelector((state: any) => state.user);
  const { userPersonalizationData } = useSelector((state: any) => state.personalization);
  const dispatch = useDispatch();

  const [loading] = useState(false);
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [generatingPdfId, setGeneratingPdfId] = useState<number | null>(null);

  // View modal state
  const [viewReportType, setViewReportType] = useState("");
  const [viewTitle, setViewTitle] = useState("");
  const [viewDevice, setViewDevice] = useState("");
  const [viewRange, setViewRange] = useState("");
  const [viewCardData, setViewCardData] = useState<any>(null);
  const [viewGenericColumns, setViewGenericColumns] = useState<Array<{ label: string; value: string }>>([]);
  const [viewGenericRows, setViewGenericRows] = useState<any[]>([]);

  useEffect(() => {
    dispatch(setReports([]));
  }, []);

  /** Open the report in the card viewer. Synchronous - no PDF rendering involved. */
  const handleView = (row: any) => {
    setViewReportType(row.type);
    setViewTitle(row.data.title);
    setViewRange(formatReportRange(undefined, row.data.startDate, row.data.endDate));
    if (CARD_REPORT_TYPES.includes(row.type)) {
      setViewCardData(row.data.data);
      setViewDevice(row.type === "/get-vehicle-history-report" ? row.data.registrationNo || "" : "");
      setViewGenericColumns([]);
      setViewGenericRows([]);
    } else {
      const { columns, rows } = buildGenericTable(row);
      setViewCardData(null);
      setViewGenericColumns(columns);
      setViewGenericRows(rows);
      setViewDevice(row.data.registrationNo || "");
    }
    setModal(true);
  };

  const handlePdf = async (row: any, index: number) => {
    if (generatingPdfId !== null) return;
    setGeneratingPdfId(index);
    // let the spinner paint before the (now much cheaper) synchronous work
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const blob = CARD_REPORT_TYPES.includes(row.type)
        ? await generateCardReportPdf(row.type, row, userData, userPersonalizationData)
        : await (async () => {
            const { columns, rows } = buildGenericTable(row);
            return generateTableReportPdf({
              columns,
              rows,
              reportName: row.data.title,
              userData,
              userPersonalizationData,
              fromDate: row.data.startDate?.slice(0, 10),
              toDate: row.data.endDate?.slice(0, 10),
              registrationNo: row.data.registrationNo,
            });
          })();
      downloadBlob(blob, `${row.data.title}.pdf`);
    } catch (err) {
      console.error("PDF Generate Fail", err);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const handleExcel = (row: any) => {
    const settings = {
      fileName: row.data.title,
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };

    // Trip detail exports two sheets
    if (row.type === "/get-trip-detail-report") {
      const { tripInfo, metrics, stops } = row.data.data;
      xlsx(
        [
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
            content: [{ ...tripInfo, ...metrics }],
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
            content: stops,
          },
        ] as any,
        settings as any
      );
      return;
    }

    let columns: any[];
    let content: any[];
    if (CARD_REPORT_TYPES.includes(row.type)) {
      const { columns: cols, rows } = getCardTable(row.type, row.data.data);
      columns = cols.map((c, i) => ({ label: c.label, value: `c${i}` }));
      content = rows.map((r) => {
        const o: any = {};
        cols.forEach((c, i) => {
          o[`c${i}`] = c.get(r);
        });
        return o;
      });
    } else {
      const t = buildGenericTable(row);
      columns = t.columns;
      content = t.rows;
    }

    xlsx([{ sheet: "Sheet 1", columns, content }] as any, settings as any);
  };

  const actionBtn = {
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "36px",
    width: "36px",
    backgroundColor: "transparent",
  } as const;

  const renderTableRows = () =>
    reports?.map((row: any, index: any) => (
      <tr key={index}>
        <td style={{ width: "20%" }}>{index + 1}</td>
        <td style={{ width: "20%" }}>{row.data.title}</td>
        <td style={{ width: "15%" }}>{row.data.startDate.slice(0, 10)}</td>
        <td style={{ width: "15%" }}>{row.data.endDate.slice(0, 10)}</td>
        <td>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button style={{ ...actionBtn, border: "3px solid green" }} onClick={() => handleExcel(row)}>
              <FaFileExcel size={18} color="green" />
            </button>
            <button
              style={{ ...actionBtn, border: "3px solid blue", marginLeft: "10px" }}
              onClick={() => handleView(row)}
            >
              <FaEye size={22} color="blue" />
            </button>
            <button
              style={{ ...actionBtn, border: "3px solid red", marginLeft: "10px", paddingTop: "5px" }}
              onClick={() => handlePdf(row, index)}
            >
              {generatingPdfId === index ? <Spinner size="sm" color="danger" /> : <BiSolidFilePdf size={22} color="red" />}
            </button>
          </div>
        </td>
      </tr>
    ));

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
                ) : reports?.length > 0 ? (
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

              {generatingPdfId !== null && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "40px",
                      borderRadius: "8px",
                      textAlign: "center",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Loader />
                    <P style={{ color: "#666", marginTop: "10px" }}>Please wait while we prepare your report...</P>
                  </div>
                </div>
              )}

              {modal && (
                <ReportDataModal
                  modal={modal}
                  toggleModal={toggleModal}
                  reportType={viewReportType}
                  title={viewTitle}
                  device={viewDevice}
                  range={viewRange}
                  cardData={viewCardData}
                  genericColumns={viewGenericColumns}
                  genericRows={viewGenericRows}
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
