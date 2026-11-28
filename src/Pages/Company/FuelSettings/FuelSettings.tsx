// Setup · Fuel. Company settings for the estimated fuel feature
// (backend utils/fuelEstimate.js): fuel prices with the date they apply from,
// typical consumption per fuel type, and an optional summer extra for AC.
// A vehicle's own figures (Devices → edit vehicle) override these defaults.
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAll, patch } from "../../../Utilities/api";
import { FUEL_SETTINGS } from "../../../Utilities/api/apiEndpoints";
import { FUEL_TYPE_LABEL } from "../../../Utilities/fuelEstimate";
import "./fuelSettings.scss";

type Rates = { cityKmPerL?: number; highwayKmPerL?: number; idleLPerHour?: number };
type Price = { fuelType: string; pricePerLitre: number; from: string };
type Settings = {
  prices: Price[];
  defaults: Record<string, Rates>;
  summerExtraPercent: number;
  summerFrom: string;
  summerTo: string;
  builtInDefaults: Record<string, Rates>;
  fuelTypes: string[];
};

const RATE_FIELDS: { key: keyof Rates; label: string; unit: string }[] = [
  { key: "cityKmPerL", label: "City", unit: "km/L" },
  { key: "highwayKmPerL", label: "Highway", unit: "km/L" },
  { key: "idleLPerHour", label: "Idling", unit: "L/hour" },
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const today = () => new Date(Date.now() + 5 * 3600000).toISOString().slice(0, 10); // Pakistan date
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const mdLabel = (md: string) => {
  const [m, d] = (md || "").split("-").map(Number);
  return m && d ? `${d} ${MONTHS[m - 1]}` : md;
};
const toast = (text: string, icon: "success" | "error") => Swal.fire({ text, icon, timer: 1800, showConfirmButton: false });

const FuelSettings = () => {
  const [s, setS] = useState<Settings | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [newPrice, setNewPrice] = useState({ fuelType: "PETROL", pricePerLitre: "", from: today() });
  const [rates, setRates] = useState<Record<string, Record<string, string>>>({});
  const [summer, setSummer] = useState({ pct: "0", from: "05-01", to: "09-30" });

  const load = (data: Settings) => {
    setS(data);
    const r: Record<string, Record<string, string>> = {};
    data.fuelTypes.forEach((t) => {
      r[t] = {};
      RATE_FIELDS.forEach(({ key }) => (r[t][key] = data.defaults?.[t]?.[key] ? String(data.defaults[t][key]) : ""));
    });
    setRates(r);
    setSummer({ pct: String(data.summerExtraPercent || 0), from: data.summerFrom, to: data.summerTo });
  };

  useEffect(() => {
    getAll({ url: FUEL_SETTINGS }).then((res: any) => {
      if (res?.success) load(res.data);
      else setError(res?.message || "Could not load fuel settings");
    });
  }, []);

  const save = async (body: any, done: string) => {
    setBusy(true);
    const res: any = await patch(body, { url: FUEL_SETTINGS });
    setBusy(false);
    if (res?.success) {
      load(res.data);
      toast(done, "success");
      return true;
    }
    toast(res?.message || "Could not save", "error");
    return false;
  };

  const addPrice = async () => {
    const price = Number(newPrice.pricePerLitre);
    if (!price || price <= 0) return toast("Enter the price per litre", "error");
    const ok = await save({ addPrice: { fuelType: newPrice.fuelType, pricePerLitre: price, from: `${newPrice.from}T00:00:00+05:00` } }, "Price saved");
    if (ok) setNewPrice({ ...newPrice, pricePerLitre: "" });
  };
  const removePrice = (p: Price) => save({ removePrice: { fuelType: p.fuelType, from: p.from } }, "Price removed");
  const saveRates = () => save({ defaults: rates }, "Consumption saved");
  const saveSummer = () => save({ summerExtraPercent: Number(summer.pct) || 0, summerFrom: summer.from, summerTo: summer.to }, "Summer extra saved");

  if (error) return <div className="fs-card"><p className="fs-muted">{error}</p></div>;
  if (!s) return <div className="fs-card"><p className="fs-muted">Loading…</p></div>;

  const now = Date.now();
  const current = (t: string) => s.prices.filter((p) => p.fuelType === t && new Date(p.from).getTime() <= now).sort((a, b) => +new Date(b.from) - +new Date(a.from))[0];
  const monthDaySelect = (value: string, onChange: (v: string) => void, label: string) => {
    const [m, d] = value.split("-");
    return (
      <span className="fs-md">
        <select aria-label={`${label} day`} value={d} onChange={(e) => onChange(`${m}-${e.target.value}`)}>
          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((x) => <option key={x} value={x}>{Number(x)}</option>)}
        </select>
        <select aria-label={`${label} month`} value={m} onChange={(e) => onChange(`${e.target.value}-${d}`)}>
          {MONTHS.map((name, i) => <option key={name} value={String(i + 1).padStart(2, "0")}>{name}</option>)}
        </select>
      </span>
    );
  };

  return (
    <div className="fs-page">
      <p className="fs-intro">
        Our trackers don't read the fuel tank, so fuel is <b>estimated</b> from distance, driving speed and engine-on idle time.
        It shows in reports, Playback and Live Monitoring. Set prices here; set a vehicle's own consumption in Devices → Edit.
      </p>

      <section className="fs-card" aria-labelledby="fs-prices">
        <div className="fs-card__head">
          <h2 id="fs-prices">Fuel prices</h2>
          <span className="fs-muted">Add a new price whenever it changes; older days keep the price they had.</span>
        </div>
        <div className="fs-now">
          {s.fuelTypes.map((t) => {
            const c = current(t);
            return (
              <div key={t} className="fs-now__item">
                <span>{FUEL_TYPE_LABEL[t] || t}</span>
                <strong>{c ? `PKR ${c.pricePerLitre.toLocaleString("en-US")}` : "Not set"}</strong>
                <small>{c ? `per litre since ${fmtDate(c.from)}` : "costs stay empty until set"}</small>
              </div>
            );
          })}
        </div>
        <div className="fs-add">
          <label>Fuel
            <select value={newPrice.fuelType} onChange={(e) => setNewPrice({ ...newPrice, fuelType: e.target.value })}>
              {s.fuelTypes.map((t) => <option key={t} value={t}>{FUEL_TYPE_LABEL[t] || t}</option>)}
            </select>
          </label>
          <label>Price per litre (PKR)
            <input type="number" min="1" step="0.01" inputMode="decimal" value={newPrice.pricePerLitre} onChange={(e) => setNewPrice({ ...newPrice, pricePerLitre: e.target.value })} placeholder="e.g. 265.50" />
          </label>
          <label>From
            <input type="date" value={newPrice.from} onChange={(e) => setNewPrice({ ...newPrice, from: e.target.value })} />
          </label>
          <button type="button" className="fs-btn fs-btn--primary" disabled={busy} onClick={addPrice}>Add price</button>
        </div>
        {s.prices.length > 0 && (
          <table className="fs-table">
            <thead><tr><th>From</th><th>Fuel</th><th>PKR / litre</th><th aria-label="Actions"></th></tr></thead>
            <tbody>
              {[...s.prices].sort((a, b) => +new Date(b.from) - +new Date(a.from)).map((p) => (
                <tr key={`${p.fuelType}-${p.from}`}>
                  <td>{fmtDate(p.from)}</td>
                  <td>{FUEL_TYPE_LABEL[p.fuelType] || p.fuelType}</td>
                  <td>{p.pricePerLitre.toLocaleString("en-US")}</td>
                  <td><button type="button" className="fs-btn fs-btn--ghost" disabled={busy} onClick={() => removePrice(p)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="fs-card" aria-labelledby="fs-rates">
        <div className="fs-card__head">
          <h2 id="fs-rates">Typical consumption</h2>
          <span className="fs-muted">Used for every vehicle that has no figures of its own. Empty = the grey default.</span>
        </div>
        <table className="fs-table fs-table--rates">
          <thead>
            <tr><th>Fuel</th>{RATE_FIELDS.map((f) => <th key={f.key}>{f.label} <small>{f.unit}</small></th>)}</tr>
          </thead>
          <tbody>
            {s.fuelTypes.map((t) => (
              <tr key={t}>
                <td>{FUEL_TYPE_LABEL[t] || t}</td>
                {RATE_FIELDS.map((f) => (
                  <td key={f.key}>
                    <input
                      type="number" min="0" step="0.1" inputMode="decimal"
                      aria-label={`${FUEL_TYPE_LABEL[t] || t} ${f.label} ${f.unit}`}
                      placeholder={String(s.builtInDefaults?.[t]?.[f.key] ?? "")}
                      value={rates[t]?.[f.key] ?? ""}
                      onChange={(e) => setRates({ ...rates, [t]: { ...rates[t], [f.key]: e.target.value } })}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="fs-muted fs-note">City applies at an average of 36 km/h or slower, highway at 80 km/h or faster, blended in between. Idling = engine on while standing.</p>
        <div className="fs-actions"><button type="button" className="fs-btn fs-btn--primary" disabled={busy} onClick={saveRates}>Save consumption</button></div>
      </section>

      <section className="fs-card" aria-labelledby="fs-summer">
        <div className="fs-card__head">
          <h2 id="fs-summer">Summer AC extra</h2>
          <span className="fs-muted">Air-conditioning raises fuel use; add a percentage for the hot months.</span>
        </div>
        <div className="fs-add">
          <label>Extra (%)
            <input type="number" min="0" max="50" step="1" value={summer.pct} onChange={(e) => setSummer({ ...summer, pct: e.target.value })} />
          </label>
          <div className="fs-field"><span>From</span>{monthDaySelect(summer.from, (v) => setSummer({ ...summer, from: v }), "Summer start")}</div>
          <div className="fs-field"><span>To</span>{monthDaySelect(summer.to, (v) => setSummer({ ...summer, to: v }), "Summer end")}</div>
          <button type="button" className="fs-btn fs-btn--primary" disabled={busy} onClick={saveSummer}>Save</button>
        </div>
        <p className="fs-muted fs-note">{Number(summer.pct) > 0 ? `+${summer.pct}% from ${mdLabel(summer.from)} to ${mdLabel(summer.to)}.` : "Off."}</p>
      </section>
    </div>
  );
};

export default FuelSettings;
