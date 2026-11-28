// Fast PDF generation for reports using jsPDF + autoTable.
// Replaces @react-pdf/renderer, which had to lay out every cell through a JS flexbox
// engine (~9 nodes/row) and took minutes on 100k+ row reports. autoTable places text
// directly and paginates natively, so large reports render in seconds.
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IMAGE_BASE_URL } from "../../../Utilities/api/apiEndpoints";
import BackgroundImage from "../../../assets/Background Image.png";
import {
  REPORT_TYPE_TITLES,
  formatReportDateTime,
  formatReportRange,
  groupEventsByDevice,
  eventTotals,
  EVENT_PDF_COLS,
  DAILY_TRAVEL_PDF_COLS,
  VEHICLE_HISTORY_PDF_COLS,
  ReportCol,
} from "./reportFormatters";

const M = 24; // page margin (pt)
const TEXT: [number, number, number] = [55, 65, 81];
const MUTED: [number, number, number] = [107, 114, 128];
const BORDER: [number, number, number] = [229, 231, 235];
const ACCENT: [number, number, number] = [59, 130, 246];
const HEAD_BG: [number, number, number] = [249, 250, 251];
const ALT_BG: [number, number, number] = [250, 251, 252];

const pageW = (doc: jsPDF) => doc.internal.pageSize.getWidth();
const pageH = (doc: jsPDF) => doc.internal.pageSize.getHeight();
const finalY = (doc: jsPDF) => (doc as any).lastAutoTable?.finalY ?? M;

/** Load the company logo as a data URL (cached). Returns null if it can't be fetched. */
const logoCache = new Map<string, string | null>();
async function loadLogoDataUrl(userPersonalizationData: any): Promise<string | null> {
  const src = userPersonalizationData?.loginPageLogo?.url
    ? `${IMAGE_BASE_URL}/${userPersonalizationData.loginPageLogo.url}`
    : BackgroundImage;
  if (logoCache.has(src)) return logoCache.get(src) ?? null;
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("no canvas context"));
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("logo load failed"));
      img.src = src;
    });
    logoCache.set(src, dataUrl);
    return dataUrl;
  } catch {
    logoCache.set(src, null); // don't retry a broken/CORS-blocked logo
    return null;
  }
}

/** Branded header block at the top of the first page. Returns the next free Y. */
function drawBrandHeader(
  doc: jsPDF,
  logo: string | null,
  reportName: string,
  userData: any,
  range: string
): number {
  const y = M;
  if (logo) {
    try {
      doc.addImage(logo, "PNG", M, y, 110, 45);
    } catch {
      /* ignore broken logo */
    }
  }
  const right = pageW(doc) - M;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...TEXT);
  doc.text(String(reportName || ""), right, y + 12, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Name: ${userData?.fullName || "N/A"}`, right, y + 26, { align: "right" });
  doc.text(
    `Generated On: ${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString()}`,
    right,
    y + 36,
    { align: "right" }
  );
  if (range) doc.text(`Period: ${range}`, right, y + 46, { align: "right" });
  return y + 62;
}

/** Card header strip: "Report type: X" + range, then the Device row. Returns the next free Y. */
function drawCardTop(doc: jsPDF, y: number, title: string, range: string, device?: string): number {
  const w = pageW(doc) - M * 2;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);

  doc.setFillColor(...ACCENT);
  doc.rect(M + 10, y + 7, 6, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  doc.text(`Report type: ${title}`, M + 21, y + 13);

  if (range) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(range, M + w - 10, y + 13, { align: "right" });
  }
  doc.line(M, y + 21, M + w, y + 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT);
  doc.text("Device:", M + 10, y + 35);
  doc.setFont("helvetica", "normal");
  doc.text(String(device || "N/A"), M + 110, y + 35);
  doc.line(M, y + 44, M + w, y + 44);
  return y + 44;
}

/** Distribute the column pixel widths proportionally across the printable width. */
function columnStyles(cols: ReportCol[], available: number) {
  const total = cols.reduce((s, c) => s + c.width, 0) || 1;
  const styles: Record<number, any> = {};
  cols.forEach((c, i) => {
    styles[i] = { cellWidth: (c.width / total) * available };
  });
  return styles;
}

/** Shared autoTable config. `overflow: ellipsize` keeps rows single-line = fast + uniform. */
function tableOptions(doc: jsPDF, cols: ReportCol[], body: string[][], startY: number): any {
  return {
    startY,
    head: [cols.map((c) => c.label)],
    body,
    margin: { left: M, right: M, top: M, bottom: M },
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      overflow: "ellipsize",
      textColor: TEXT,
      lineColor: BORDER,
      lineWidth: 0.3,
      valign: "middle",
    },
    headStyles: { fillColor: HEAD_BG, textColor: TEXT, fontStyle: "bold", fontSize: 9 },
    alternateRowStyles: { fillColor: ALT_BG },
    columnStyles: columnStyles(cols, pageW(doc) - M * 2),
  };
}

const bodyFor = (cols: ReportCol[], rows: any[]): string[][] =>
  rows.map((r) => cols.map((c) => c.get(r)));

// ---------------------------------------------------------------- card reports

function drawTravelSummary(doc: jsPDF, reportData: any[], y: number) {
  reportData.forEach((item) => {
    if (y + 170 > pageH(doc) - M) {
      doc.addPage();
      y = M;
    }
    y = drawCardTop(
      doc,
      y,
      "Travel Summary",
      formatReportRange(item.dateRange),
      item.deviceLabel || item.registrationNo
    );

    const left: Array<[string, any]> = [
      ["Route start", formatReportDateTime(item.routeStart)],
      ["Route end", formatReportDateTime(item.routeEnd)],
      ["Route length", item.routeLength],
      ["Move duration", item.moveDuration],
      ["Stop duration", item.stopDuration],
      ["Top speed", item.topSpeed],
      ["Average speed", item.averageSpeed],
      ["Overspeed count", String(item.overspeedCount ?? 0)],
    ];
    const right: Array<[string, any]> = [
      ["Engine hours", item.engineHours],
      ["Engine work", item.engineWork],
      ["Engine idle", item.engineIdle],
      ["Odometer", item.odometer],
      ["Fuel (estimated)", item.fuelLitres ?? "N/A"],
      ["Idle fuel", item.fuelIdleLitres ?? "N/A"],
      ["Fuel cost", item.fuelCost ?? "N/A"],
      ["Fuel economy", item.fuelKmPerLitre ?? "N/A"],
    ];
    const body = left.map((l, i) => [
      `${l[0]}:`,
      l[1] ?? "N/A",
      right[i] ? `${right[i][0]}:` : "",
      right[i] ? right[i][1] ?? "N/A" : "",
    ]);

    autoTable(doc, {
      startY: y + 6,
      body,
      theme: "plain",
      margin: { left: M + 10, right: M + 10 },
      styles: { fontSize: 9.5, cellPadding: 2.5, textColor: TEXT },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 110 },
        1: { cellWidth: 250 },
        2: { fontStyle: "bold", cellWidth: 110 },
        3: { cellWidth: 200 },
      },
    } as any);
    y = finalY(doc) + 20;
  });
}

function drawPerDeviceTables(
  doc: jsPDF,
  groups: Array<{ registrationNo: string; rows: any[] }>,
  cols: ReportCol[],
  title: string,
  range: string,
  y: number,
  withTotals: boolean
) {
  groups.forEach((g) => {
    if (y + 120 > pageH(doc) - M) {
      doc.addPage();
      y = M;
    }
    y = drawCardTop(doc, y, title, range, g.registrationNo);
    autoTable(doc, tableOptions(doc, cols, bodyFor(cols, g.rows), y + 6));
    let ty = finalY(doc) + 16;

    if (withTotals) {
      eventTotals(g.rows).forEach(([name, count]) => {
        if (ty > pageH(doc) - M - 12) {
          doc.addPage();
          ty = M;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...TEXT);
        doc.text(`Total ${name}:`, M + 16, ty);
        doc.setFont("helvetica", "normal");
        doc.text(String(count), M + 230, ty);
        ty += 12;
      });
      ty += 6;
    }
    y = ty + 12;
  });
}

/** Generate a card-style report PDF (Travel Summary / Daily Travel / Event Agent / Vehicle History). */
export async function generateCardReportPdf(
  type: string,
  reportRow: any,
  userData: any,
  userPersonalizationData: any
): Promise<Blob> {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const logo = await loadLogoDataUrl(userPersonalizationData);
  const data = reportRow?.data?.data;
  const reportData: any[] = Array.isArray(data?.reportData) ? data.reportData : [];
  const range = formatReportRange(undefined, reportRow?.data?.startDate, reportRow?.data?.endDate);
  const title = REPORT_TYPE_TITLES[type] || reportRow?.data?.title;

  let y = drawBrandHeader(doc, logo, reportRow?.data?.title, userData, range);

  switch (type) {
    case "/get-travel-summary-report":
      drawTravelSummary(doc, reportData, y);
      break;

    case "/get-daily-travel-report":
      drawPerDeviceTables(
        doc,
        reportData.map((v) => ({
          registrationNo: v.deviceLabel || v.registrationNo || "N/A",
          rows: v.dailyData || [],
        })),
        DAILY_TRAVEL_PDF_COLS,
        title,
        range,
        y,
        false
      );
      break;

    case "/get-event-agent-response-report":
      drawPerDeviceTables(
        doc,
        groupEventsByDevice(reportData).map((g) => ({
          registrationNo: g.registrationNo,
          rows: g.events,
        })),
        EVENT_PDF_COLS,
        title,
        range,
        y,
        true
      );
      break;

    case "/get-vehicle-history-report": {
      y = drawCardTop(doc, y, title, range, reportRow?.data?.registrationNo);
      autoTable(
        doc,
        tableOptions(doc, VEHICLE_HISTORY_PDF_COLS, bodyFor(VEHICLE_HISTORY_PDF_COLS, reportData), y + 6)
      );
      break;
    }
    default:
      break;
  }

  return doc.output("blob");
}

// ------------------------------------------------------------- generic reports

/** Generate a plain table PDF for the non-card report types. */
export async function generateTableReportPdf(opts: {
  columns: Array<{ label: string; value: string }>;
  rows: any[];
  reportName: string;
  userData: any;
  userPersonalizationData: any;
  fromDate?: string;
  toDate?: string;
  registrationNo?: string;
}): Promise<Blob> {
  const { columns, rows, reportName, userData, userPersonalizationData, fromDate, toDate, registrationNo } = opts;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const logo = await loadLogoDataUrl(userPersonalizationData);
  const range = fromDate || toDate ? `${fromDate || "N/A"} - ${toDate || "N/A"}` : "";

  let y = drawBrandHeader(doc, logo, reportName, userData, range);
  if (registrationNo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT);
    doc.text("Device:", M, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(registrationNo), M + 50, y);
    y += 12;
  }

  autoTable(doc, {
    startY: y + 4,
    head: [columns.map((c) => c.label)],
    body: rows.map((r) => columns.map((c) => (r[c.value] === null || r[c.value] === undefined ? "N/A" : String(r[c.value])))),
    margin: { left: M, right: M, top: M, bottom: M },
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      overflow: "ellipsize",
      textColor: TEXT,
      lineColor: BORDER,
      lineWidth: 0.3,
      valign: "middle",
    },
    headStyles: { fillColor: HEAD_BG, textColor: TEXT, fontStyle: "bold", fontSize: 9 },
    alternateRowStyles: { fillColor: ALT_BG },
  } as any);

  return doc.output("blob");
}

/** Trigger a browser download for a generated blob. */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
