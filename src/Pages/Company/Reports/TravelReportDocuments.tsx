// Card-style PDF documents for Travel Summary & Daily Travel reports.
// Shared by the View modal (preview) and the PDF download so both render identically.
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { IMAGE_BASE_URL } from "../../../Utilities/api/apiEndpoints";
import BackgroundImage from "../../../assets/Background Image.png";

/**
 * Format an ISO timestamp using its UTC clock components (no client shift) as
 * "DD-MM-YYYY hh:mm:ss AM/PM" — matches the report layout. If the value is not
 * a parseable date (already-formatted strings like "10-07-2026"), it is returned as-is.
 */
export const formatReportDateTime = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return String(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  let hours = d.getUTCHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${pad(hours)}:${pad(
    d.getUTCMinutes()
  )}:${pad(d.getUTCSeconds())} ${ampm}`;
};

/** Build the "start - end (UTC +5)" header range, accepting either a "a - b" string or separate values. */
export const formatReportRange = (range?: string, start?: string, end?: string): string => {
  let s = start;
  let e = end;
  if (range && range.includes(" - ")) {
    const [a, b] = range.split(" - ");
    s = a;
    e = b;
  }
  if (!s && !e) return "";
  return `${formatReportDateTime(s)} - ${formatReportDateTime(e)} (UTC +5)`;
};

const colors = {
  border: "#e5e7eb",
  divider: "#eef0f2",
  text: "#374151",
  muted: "#6b7280",
  accent: "#3b82f6",
  headBg: "#f9fafb",
};

const styles = StyleSheet.create({
  page: { paddingVertical: 22, paddingHorizontal: 24, fontFamily: "Helvetica", fontSize: 9, color: colors.text },
  brandHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  logo: { minWidth: 130, maxWidth: 150, height: 60, objectFit: "contain" },
  brandMeta: { alignItems: "flex-end", maxWidth: 240 },
  brandTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  brandLine: { fontSize: 8, color: colors.muted, marginBottom: 1 },

  card: { border: `1px solid ${colors.border}`, borderRadius: 4, marginBottom: 12 },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottom: `1px solid ${colors.divider}`,
  },
  typeWrap: { flexDirection: "row", alignItems: "center" },
  icon: { width: 8, height: 8, backgroundColor: colors.accent, borderRadius: 1, marginRight: 5 },
  typeText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.text },
  rangeText: { fontSize: 8, color: colors.text, textAlign: "right", maxWidth: 230 },

  deviceRow: { flexDirection: "row", paddingVertical: 9, paddingHorizontal: 12, borderBottom: `1px solid ${colors.divider}` },
  deviceLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: colors.text, width: 70 },
  deviceValue: { fontSize: 9, color: colors.text, marginLeft: 40 },

  grid: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12 },
  gridCol: { flex: 1, paddingRight: 28 },
  fieldRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  fieldLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: colors.text },
  fieldValue: { fontSize: 8.5, color: colors.text, textAlign: "right" },

  table: { paddingHorizontal: 12, paddingBottom: 10 },
  tRowHead: { flexDirection: "row", backgroundColor: colors.headBg, borderBottom: `1px solid ${colors.divider}` },
  tRow: { flexDirection: "row", borderBottom: `1px solid ${colors.divider}` },
  th: { fontSize: 8, fontFamily: "Helvetica-Bold", color: colors.text, paddingVertical: 6, paddingHorizontal: 4 },
  td: { fontSize: 8, color: colors.text, paddingVertical: 6, paddingHorizontal: 4 },
});

const BrandHeader = ({ reportName, userData, userPersonalizationData, range }: any) => (
  <View style={styles.brandHeader}>
    <Image
      src={
        userPersonalizationData !== null && userPersonalizationData?.loginPageLogo?.url
          ? `${IMAGE_BASE_URL}/${userPersonalizationData?.loginPageLogo?.url}`
          : BackgroundImage
      }
      style={styles.logo}
    />
    <View style={styles.brandMeta}>
      <Text style={styles.brandTitle}>{reportName}</Text>
      <Text style={styles.brandLine}>Name: {userData?.fullName || "N/A"}</Text>
      <Text style={styles.brandLine}>
        Generated On: {new Date().toISOString().slice(0, 10)} {new Date().toLocaleTimeString()}
      </Text>
      {range ? <Text style={styles.brandLine}>Period: {range}</Text> : null}
    </View>
  </View>
);

const Field = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <Text style={styles.fieldValue}>{value ?? "N/A"}</Text>
  </View>
);

// ---------------- Travel Summary ----------------
export const TravelSummaryDocument = ({ reportData, reportName, userData, userPersonalizationData }: any) => {
  const rows: any[] = Array.isArray(reportData) ? reportData : [];
  return (
    <Document title={reportName}>
      <Page size="A4" style={styles.page}>
        <BrandHeader reportName={reportName} userData={userData} userPersonalizationData={userPersonalizationData} />
        {rows.map((item, idx) => (
          <View key={idx} style={styles.card} wrap={false}>
            <View style={styles.cardHead}>
              <View style={styles.typeWrap}>
                <View style={styles.icon} />
                <Text style={styles.typeText}>Report type: Travel Summary</Text>
              </View>
              <Text style={styles.rangeText}>{formatReportRange(item.dateRange)}</Text>
            </View>

            <View style={styles.deviceRow}>
              <Text style={styles.deviceLabel}>Device:</Text>
              <Text style={styles.deviceValue}>{item.deviceLabel || item.registrationNo || "N/A"}</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.gridCol}>
                <Field label="Route start" value={formatReportDateTime(item.routeStart)} />
                <Field label="Route end" value={formatReportDateTime(item.routeEnd)} />
                <Field label="Route length" value={item.routeLength} />
                <Field label="Move duration" value={item.moveDuration} />
                <Field label="Stop duration" value={item.stopDuration} />
                <Field label="Top speed" value={item.topSpeed} />
                <Field label="Average speed" value={item.averageSpeed} />
                <Field label="Overspeed count" value={String(item.overspeedCount ?? 0)} />
              </View>
              <View style={styles.gridCol}>
                <Field label="Engine hours" value={item.engineHours} />
                <Field label="Engine work" value={item.engineWork} />
                <Field label="Engine idle" value={item.engineIdle} />
                <Field label="Odometer" value={item.odometer} />
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

// ---------------- Daily Travel ----------------
const dailyCols = [
  { label: "Date", value: "date", width: "12%", raw: true },
  { label: "Travel start time", value: "travelStartTime", width: "19%" },
  { label: "Travel end time", value: "travelEndTime", width: "19%" },
  { label: "Travel time", value: "travelTime", width: "16%", raw: true },
  { label: "Distance travelled", value: "distanceTravelled", width: "18%", raw: true },
  { label: "Move duration", value: "moveDuration", width: "16%", raw: true },
];

// ---------------- Event Agent Response ----------------
const eventStyles = StyleSheet.create({
  tHead: { flexDirection: "row", borderBottom: `1px solid ${colors.border}` },
  th: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: colors.muted, paddingVertical: 7, paddingHorizontal: 5 },
  tRow: { flexDirection: "row", borderBottom: `1px solid ${colors.divider}` },
  tRowAlt: { backgroundColor: "#fafbfc" },
  td: { fontSize: 7.5, color: colors.text, paddingVertical: 7, paddingHorizontal: 5 },
  link: { fontSize: 7.5, color: "#2563eb", textDecoration: "none", paddingVertical: 7, paddingHorizontal: 5 },
  totalsWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  totalRow: { flexDirection: "row", paddingVertical: 2.5 },
  totalLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: colors.text, width: 200 },
  totalValue: { fontSize: 8.5, color: colors.text },
});

const eventCols = [
  { label: "Time", value: "alertGenerationTime", width: "11%", date: true },
  { label: "Event", value: "event", width: "9%" },
  { label: "Position", value: "position", width: "30%", position: true },
  { label: "Description", value: "description", width: "22%" },
  { label: "Operator", value: "operator", width: "7%" },
  { label: "Response Time", value: "responseTime", width: "11%" },
  { label: "Agent Response Time", value: "agentResponseTime", width: "10%" },
];

const positionAddress = (position: any) =>
  position?.address || (typeof position === "string" ? position : "N/A");

/** Group a flat event list into per-device blocks, preserving order. */
const groupEventsByDevice = (rows: any[]) => {
  const map = new Map<string, { registrationNo: string; events: any[] }>();
  rows.forEach((r) => {
    const key = r.vehicleId || r.registrationNo || "unknown";
    if (!map.has(key)) map.set(key, { registrationNo: r.registrationNo || "N/A", events: [] });
    map.get(key)!.events.push(r);
  });
  return Array.from(map.values());
};

/** Count occurrences of each distinct event value within a device's events. */
const eventTotals = (events: any[]) => {
  const m = new Map<string, number>();
  events.forEach((e) => {
    const k = e.event || "N/A";
    m.set(k, (m.get(k) || 0) + 1);
  });
  return Array.from(m.entries());
};

export const EventAgentResponseDocument = ({
  reportData,
  reportName,
  userData,
  userPersonalizationData,
  periodStart,
  periodEnd,
}: any) => {
  const groups = groupEventsByDevice(Array.isArray(reportData) ? reportData : []);
  const range = formatReportRange(undefined, periodStart, periodEnd);
  return (
    <Document title={reportName}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <BrandHeader
          reportName={reportName}
          userData={userData}
          userPersonalizationData={userPersonalizationData}
          range={range}
        />
        {groups.map((group, idx) => (
          <View key={idx} style={[styles.card, { marginBottom: 14 }]}>
            <View style={styles.cardHead}>
              <View style={styles.typeWrap}>
                <View style={styles.icon} />
                <Text style={styles.typeText}>Report type: Events Agent Response</Text>
              </View>
              <Text style={styles.rangeText}>{range}</Text>
            </View>

            <View style={styles.deviceRow}>
              <Text style={styles.deviceLabel}>Device:</Text>
              <Text style={styles.deviceValue}>{group.registrationNo}</Text>
            </View>

            <View style={styles.table}>
              <View style={eventStyles.tHead}>
                {eventCols.map((c) => (
                  <Text key={c.value} style={[eventStyles.th, { width: c.width }]}>
                    {c.label}
                  </Text>
                ))}
              </View>
              {group.events.map((ev, eIdx) => (
                <View key={eIdx} style={[eventStyles.tRow, eIdx % 2 === 1 ? eventStyles.tRowAlt : {}]} wrap={false}>
                  {eventCols.map((c) => {
                    if (c.position) {
                      const addr = positionAddress(ev.position);
                      const url = ev.position?.googleMapsUrl;
                      return url ? (
                        <Link key={c.value} src={url} style={[eventStyles.link, { width: c.width }]}>
                          {addr}
                        </Link>
                      ) : (
                        <Text key={c.value} style={[eventStyles.td, { width: c.width }]}>
                          {addr}
                        </Text>
                      );
                    }
                    const raw = ev[c.value];
                    return (
                      <Text key={c.value} style={[eventStyles.td, { width: c.width }]}>
                        {c.date
                          ? formatReportDateTime(raw)
                          : raw === null || raw === undefined || raw === ""
                          ? "N/A"
                          : String(raw)}
                      </Text>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={eventStyles.totalsWrap}>
              {eventTotals(group.events).map(([name, count], tIdx) => (
                <View key={tIdx} style={eventStyles.totalRow}>
                  <Text style={eventStyles.totalLabel}>Total {name}:</Text>
                  <Text style={eventStyles.totalValue}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

// ---------------- Vehicle History ----------------
const vhStyles = StyleSheet.create({
  table: { marginTop: 10 },
  tHead: {
    flexDirection: "row",
    backgroundColor: colors.headBg,
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
  },
  th: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: colors.text, paddingVertical: 5, paddingHorizontal: 3 },
  tRow: { flexDirection: "row", borderBottom: `1px solid ${colors.divider}` },
  td: { fontSize: 6.5, color: colors.text, paddingVertical: 4, paddingHorizontal: 3 },
});

const vhCols = [
  { label: "Time", value: "timestamp", width: "13%", kind: "date" },
  { label: "Latitude", value: "latitude", width: "11%" },
  { label: "Longitude", value: "longitude", width: "11%" },
  { label: "Address", value: "address", width: "30%" },
  { label: "Altitude", value: "altitude", width: "6%", kind: "alt" },
  { label: "Speed", value: "speed", width: "7%", kind: "speed" },
  { label: "Course", value: "course", width: "6%" },
  { label: "Ignition", value: "ignition", width: "8%", kind: "bool" },
  { label: "Motion", value: "motion", width: "8%", kind: "bool" },
];

const vhCell = (col: any, row: any) => {
  const v = row[col.value];
  switch (col.kind) {
    case "date":
      return formatReportDateTime(v);
    case "alt":
      return `${v ?? 0} m`;
    case "speed":
      return `${Math.round(Number(v) || 0)} kph`;
    case "bool":
      return v ? "on" : "off";
    default:
      return v === null || v === undefined || v === "" ? "N/A" : String(v);
  }
};

export const VehicleHistoryDocument = ({
  reportData,
  reportName,
  userData,
  userPersonalizationData,
  deviceLabel,
  periodStart,
  periodEnd,
}: any) => {
  const rows: any[] = Array.isArray(reportData) ? reportData : [];
  const range = formatReportRange(undefined, periodStart, periodEnd);
  return (
    <Document title={reportName}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <BrandHeader
          reportName={reportName}
          userData={userData}
          userPersonalizationData={userPersonalizationData}
          range={range}
        />
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.typeWrap}>
              <View style={styles.icon} />
              <Text style={styles.typeText}>Report type: Vehicle History</Text>
            </View>
            <Text style={styles.rangeText}>{range}</Text>
          </View>
          <View style={[styles.deviceRow, { borderBottom: "0px" }]}>
            <Text style={styles.deviceLabel}>Device:</Text>
            <Text style={styles.deviceValue}>{deviceLabel || "N/A"}</Text>
          </View>
        </View>

        <View style={vhStyles.table}>
          <View style={vhStyles.tHead} fixed>
            {vhCols.map((c) => (
              <Text key={c.value} style={[vhStyles.th, { width: c.width }]}>
                {c.label}
              </Text>
            ))}
          </View>
          {rows.map((r, i) => (
            <View key={i} style={vhStyles.tRow} wrap={false}>
              {vhCols.map((c) => (
                <Text key={c.value} style={[vhStyles.td, { width: c.width }]}>
                  {vhCell(c, r)}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const DailyTravelDocument = ({
  reportData,
  reportName,
  userData,
  userPersonalizationData,
  periodStart,
  periodEnd,
}: any) => {
  const rows: any[] = Array.isArray(reportData) ? reportData : [];
  const range = formatReportRange(undefined, periodStart, periodEnd);
  return (
    <Document title={reportName}>
      <Page size="A4" style={styles.page}>
        <BrandHeader
          reportName={reportName}
          userData={userData}
          userPersonalizationData={userPersonalizationData}
          range={range}
        />
        {rows.map((vehicle, idx) => (
          <View key={idx} style={styles.card} wrap={false}>
            <View style={styles.cardHead}>
              <View style={styles.typeWrap}>
                <View style={styles.icon} />
                <Text style={styles.typeText}>Report type: Daily Travel Report</Text>
              </View>
              <Text style={styles.rangeText}>{range}</Text>
            </View>

            <View style={styles.deviceRow}>
              <Text style={styles.deviceLabel}>Device:</Text>
              <Text style={styles.deviceValue}>{vehicle.deviceLabel || vehicle.registrationNo || "N/A"}</Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tRowHead}>
                {dailyCols.map((c) => (
                  <Text key={c.value} style={[styles.th, { width: c.width }]}>
                    {c.label}
                  </Text>
                ))}
              </View>
              {(vehicle.dailyData || []).map((day: any, dIdx: number) => (
                <View key={dIdx} style={styles.tRow}>
                  {dailyCols.map((c) => (
                    <Text key={c.value} style={[styles.td, { width: c.width }]}>
                      {c.raw ? day[c.value] ?? "N/A" : formatReportDateTime(day[c.value])}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};
