// Report viewer that mirrors the PDF card layout in HTML.
// Grouped reports (Travel Summary / Daily Travel / Event Agent) render as full cards.
// Vehicle History (single device, can be 100k+ rows) uses a windowed table so it stays
// instant - only the rows on screen are in the DOM.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { IoClose } from "react-icons/io5";
import { H3 } from "../../../AbstractElements";
import {
  CARD_REPORT_TYPES,
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

const ROW_H = 38;
const VIEWPORT_H = 640;
const OVERSCAN = 8;

interface Props {
  modal: boolean;
  toggleModal: () => void;
  reportType: string;
  title: string;
  range?: string;
  device?: string;
  cardData?: any; // row.data.data for card report types
  genericColumns?: Array<{ label: string; value: string }>;
  genericRows?: any[];
}

const tableMinWidth = (cols: ReportCol[]) => cols.reduce((s, c) => s + c.width, 0);

/** Windowed table - renders only visible rows. Used for large single tables. */
const VirtualTable: React.FC<{ cols: ReportCol[]; rows: any[] }> = ({ cols, rows }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setScrollTop(0);
    if (ref.current) ref.current.scrollTop = 0;
  }, [rows]);

  const total = rows.length;
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const end = Math.min(total, Math.ceil((scrollTop + VIEWPORT_H) / ROW_H) + OVERSCAN);
  const visible = rows.slice(start, end);
  const minWidth = useMemo(() => tableMinWidth(cols), [cols]);
  const height = Math.min(VIEWPORT_H, Math.max(ROW_H, total * ROW_H));

  return (
    <>
      <div className="rpt-cap">{total.toLocaleString()} records</div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth }}>
          <div className="rpt-head">
            {cols.map((c) => (
              <div key={c.label} className="rpt-cell" style={{ width: c.width }}>
                {c.label}
              </div>
            ))}
          </div>
          <div ref={ref} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} style={{ height, overflowY: "auto" }}>
            <div style={{ height: start * ROW_H }} />
            {visible.map((r, i) => {
              const idx = start + i;
              return (
                <div key={idx} className="rpt-row" style={{ height: ROW_H, background: idx % 2 ? "#fafbfc" : "#fff" }}>
                  {cols.map((c) => {
                    const v = c.get(r);
                    return (
                      <div key={c.label} className="rpt-cell rpt-val" style={{ width: c.width }} title={String(v ?? "")}>
                        {v}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div style={{ height: (total - end) * ROW_H }} />
          </div>
        </div>
      </div>
    </>
  );
};

/** Fully-rendered table for small/grouped card sections; supports the Position link column. */
const PlainTable: React.FC<{ cols: ReportCol[]; rows: any[] }> = ({ cols, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <div style={{ minWidth: tableMinWidth(cols) }}>
      <div className="rpt-head">
        {cols.map((c) => (
          <div key={c.label} className="rpt-cell" style={{ width: c.width }}>
            {c.label}
          </div>
        ))}
      </div>
      {rows.map((r, idx) => (
        <div key={idx} className="rpt-row" style={{ background: idx % 2 ? "#fafbfc" : "#fff" }}>
          {cols.map((c) => {
            const v = c.get(r);
            const url = c.label === "Position" ? r?.position?.googleMapsUrl : undefined;
            return (
              <div key={c.label} className="rpt-cell rpt-val" style={{ width: c.width }} title={String(v ?? "")}>
                {url ? (
                  <a className="rpt-link" href={url} target="_blank" rel="noreferrer">
                    {v}
                  </a>
                ) : (
                  v
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

const CardShell: React.FC<{ title: string; range?: string; device?: string; children: React.ReactNode }> = ({
  title,
  range,
  device,
  children,
}) => (
  <div className="rpt-card">
    <div className="rpt-card-head">
      <div className="rpt-type">
        <span className="rpt-icon" />
        Report type: {title}
      </div>
      {range ? <div className="rpt-range">{range}</div> : null}
    </div>
    {device !== undefined ? (
      <div className="rpt-device">
        <span className="rpt-device-label">Device:</span>
        <span>{device || "N/A"}</span>
      </div>
    ) : null}
    {children}
  </div>
);

const TravelSummaryFields: React.FC<{ item: any }> = ({ item }) => {
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
  const col = (fields: Array<[string, any]>) => (
    <div className="rpt-fcol">
      {fields.map(([l, v]) => (
        <div key={l} className="rpt-frow">
          <span className="rpt-flabel">{l}:</span>
          <span className="rpt-fvalue">{v ?? "N/A"}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="rpt-fields">
      {col(left)}
      {col(right)}
    </div>
  );
};

const ReportDataModal: React.FC<Props> = ({
  modal,
  toggleModal,
  reportType,
  title,
  range,
  device,
  cardData,
  genericColumns = [],
  genericRows = [],
}) => {
  const renderBody = () => {
    // Non-card reports: single windowed table inside a simple card
    if (!CARD_REPORT_TYPES.includes(reportType)) {
      const cols: ReportCol[] = genericColumns.map((c) => ({
        label: c.label,
        width: 170,
        get: (r: any) => (r[c.value] === null || r[c.value] === undefined ? "N/A" : String(r[c.value])),
      }));
      if (genericRows.length === 0) return <div className="text-center text-muted py-5">No records found</div>;
      return (
        <CardShell title={title} range={range} device={device || undefined}>
          <VirtualTable cols={cols} rows={genericRows} />
        </CardShell>
      );
    }

    const reportData: any[] = Array.isArray(cardData?.reportData) ? cardData.reportData : [];
    const label = REPORT_TYPE_TITLES[reportType] || title;
    if (reportData.length === 0) return <div className="text-center text-muted py-5">No records found</div>;

    switch (reportType) {
      case "/get-travel-summary-report":
        return reportData.map((item, i) => (
          <CardShell
            key={i}
            title="Travel Summary"
            range={formatReportRange(item.dateRange)}
            device={item.deviceLabel || item.registrationNo}
          >
            <TravelSummaryFields item={item} />
          </CardShell>
        ));

      case "/get-daily-travel-report":
        return reportData.map((v, i) => (
          <CardShell key={i} title={label} range={range} device={v.deviceLabel || v.registrationNo}>
            <PlainTable cols={DAILY_TRAVEL_PDF_COLS} rows={v.dailyData || []} />
          </CardShell>
        ));

      case "/get-event-agent-response-report":
        return groupEventsByDevice(reportData).map((g, i) => (
          <CardShell key={i} title={label} range={range} device={g.registrationNo}>
            <PlainTable cols={EVENT_PDF_COLS} rows={g.events} />
            <div className="rpt-totals">
              {eventTotals(g.events).map(([name, count]) => (
                <div key={name} className="rpt-trow">
                  <span className="rpt-tlabel">Total {name}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </CardShell>
        ));

      case "/get-vehicle-history-report":
        return (
          <CardShell title={label} range={range} device={device}>
            <VirtualTable cols={VEHICLE_HISTORY_PDF_COLS} rows={reportData} />
          </CardShell>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggleModal} centered className="report-data-modal">
        <div className="modal-header d-flex justify-content-between align-items-center">
          <H3 className="mb-0">{title}</H3>
          <button
            onClick={toggleModal}
            style={{ background: "transparent", border: "none", fontSize: "1.7rem", cursor: "pointer", lineHeight: 1 }}
          >
            <IoClose />
          </button>
        </div>
        <ModalBody style={{ maxHeight: "86vh", overflowY: "auto", background: "#fff" }}>{renderBody()}</ModalBody>
      </Modal>
      <style>{`
        .report-data-modal.modal-dialog { max-width: 1000px !important; width: 92vw; margin: 20px auto; }
        .report-data-modal .modal-content { border-radius: 6px; }
        .rpt-card { border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 16px; background: #fff; }
        .rpt-card-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 12px; border-bottom: 1px solid #eef0f2; }
        .rpt-type { display: flex; align-items: center; font-weight: 700; font-size: 14px; color: #374151; }
        .rpt-icon { width: 10px; height: 10px; background: #3b82f6; border-radius: 2px; margin-right: 6px; display: inline-block; }
        .rpt-range { font-size: 12px; color: #374151; text-align: right; }
        .rpt-device { padding: 9px 12px; border-bottom: 1px solid #eef0f2; font-size: 13.5px; color: #374151; }
        .rpt-device-label { font-weight: 700; margin-right: 40px; }
        .rpt-head { display: flex; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
        .rpt-row { display: flex; align-items: center; border-bottom: 1px solid #f3f4f6; }
        .rpt-cell { flex: 0 0 auto; padding: 8px 8px; font-size: 13.5px; font-weight: 600; color: #374151; }
        .rpt-val { font-weight: 400; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rpt-fields { display: flex; padding: 12px 16px; gap: 40px; }
        .rpt-fcol { flex: 1; }
        .rpt-frow { display: flex; justify-content: space-between; padding: 4px 0; }
        .rpt-flabel { font-weight: 700; font-size: 13px; color: #374151; }
        .rpt-fvalue { font-size: 13px; color: #374151; text-align: right; }
        .rpt-totals { padding: 12px 16px; }
        .rpt-trow { display: flex; padding: 3px 0; }
        .rpt-tlabel { font-weight: 700; font-size: 13px; width: 240px; color: #374151; }
        .rpt-cap { font-size: 11px; color: #6b7280; padding: 6px 12px 0; }
        .rpt-link { color: #2563eb; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default ReportDataModal;
