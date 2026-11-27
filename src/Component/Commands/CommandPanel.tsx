// Commands panel (Live Monitoring, Setup · Devices).
// Lists the commands this user may send to the vehicle's tracker, grouped,
// with plain fields (km/h, seconds, phone numbers). The server builds the
// exact command text (constants/deviceCommands.js in the backend), checks the
// tracker is online, asks again before stopping a moving engine, and allows
// one command at a time. After sending, the panel follows the command until
// the tracker replies and shows the reply in readable form.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axios from "axios";
import { API_BASE_URL } from "../../Utilities/api/apiEndpoints";
import { header } from "../../Utilities/headers/header";
import "./commandPanel.scss";

const URL_BASE = `${API_BASE_URL}/commands`;
const auth = () => ({ headers: { Authorization: header().Authorization } });

type Param = { name: string; label: string; type: string; min?: number; max?: number; default?: any; unit?: string; help?: string; required?: boolean; options?: { value: any; label: string }[] };
type Cmd = { key: string; group: string; label: string; help: string; kind: string; danger: boolean; engine: boolean; confirm: string; params: Param[]; preview: string | null };
type Catalog = {
  vehicle: { _id: string; registrationNo: string; imei: string };
  device: { model: string; modelLabel: string; online: boolean; lastSeen: string | null; speedKmh: number; ignition: boolean | null; hasTraccar: boolean };
  movingLimitKmh: number;
  groups: { key: string; label: string }[];
  commands: Cmd[];
};

const STEPS = ["PENDING", "DISPATCHED", "GATEWAY_ACCEPTED", "EXECUTED"];
const STEP_LABEL: Record<string, string> = { PENDING: "Queued", DISPATCHED: "Sent", GATEWAY_ACCEPTED: "Delivered to tracker", EXECUTED: "Tracker replied", FAILED: "No reply" };
const OPEN = new Set(["PENDING", "DISPATCHED", "GATEWAY_ACCEPTED"]);

const timeAgo = (iso?: string | null) => {
  if (!iso) return "";
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} days ago`;
};

/** Tracker replies made readable: a map link, or "key: value" chips. */
export const ReplyView = ({ text }: { text: string }) => {
  if (!text) return null;
  const link = text.match(/https?:\/\/\S+/)?.[0];
  const coords = text.match(/([NS])\s*(\d+\.\d+)\s*,\s*([EW])\s*(\d+\.\d+)/i);
  const mapUrl = coords
    ? `https://www.google.com/maps?q=${coords[1].toUpperCase() === "S" ? "-" : ""}${coords[2]},${coords[3].toUpperCase() === "W" ? "-" : ""}${coords[4]}`
    : link || null;
  const rest = (link ? text.replace(link, "") : text).trim();
  const pairs = rest
    .split(/[;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const i = p.indexOf(":");
      return i > 0 ? { k: p.slice(0, i).trim(), v: p.slice(i + 1).trim() } : { k: "", v: p };
    });
  return (
    <div className="at-cmd__reply">
      {mapUrl && (
        <a className="at-cmd__maplink" href={mapUrl} target="_blank" rel="noopener noreferrer">
          Open location on map
        </a>
      )}
      {pairs.length > 0 && (
        <ul className="at-cmd__chips">
          {pairs.map((p, i) => (
            <li key={i}>{p.k ? <><span>{p.k}</span> {p.v}</> : p.v}</li>
          ))}
        </ul>
      )}
      <details className="at-cmd__raw">
        <summary>Exact reply</summary>
        <code>{text}</code>
      </details>
    </div>
  );
};

const Progress = ({ cmd }: { cmd: any }) => {
  const failed = cmd.status === "FAILED";
  const at = STEPS.indexOf(cmd.status);
  return (
    <div className={`at-cmd__progress${failed ? " is-failed" : ""}`} role="status" aria-live="polite">
      <ol>
        {STEPS.map((s, i) => (
          <li key={s} className={i <= at ? "is-done" : failed && i === Math.max(at, 0) + 1 ? "is-failed" : ""}>
            {STEP_LABEL[s]}
          </li>
        ))}
      </ol>
      {failed && (
        <p className="at-cmd__note">
          {(cmd.statusHistory || []).slice(-1)[0]?.reason?.startsWith("TIMEOUT")
            ? "The tracker didn't reply within 5 minutes. It may still have done it; check its status before sending again."
            : cmd.failureReason || "The command could not be sent."}
        </p>
      )}
      {cmd.status === "EXECUTED" && <ReplyView text={cmd.commandResult} />}
      {OPEN.has(cmd.status) && <p className="at-cmd__note">Waiting for the tracker… most reply within a minute.</p>}
    </div>
  );
};

interface Props {
  vehicleId: string;
  plate?: string;
  onClose: () => void;
}

const CommandPanel = ({ vehicleId, plate, onClose }: Props) => {
  const [cat, setCat] = useState<Catalog | null>(null);
  const [loadError, setLoadError] = useState("");
  const [group, setGroup] = useState("quick");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [confirming, setConfirming] = useState<null | "danger" | "moving">(null);
  const [movingSpeed, setMovingSpeed] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const poll = useRef<any>(null);

  const loadCatalog = useCallback(() => {
    axios
      .get(`${URL_BASE}/catalog/${encodeURIComponent(vehicleId)}`, auth())
      .then((r) => { setCat(r.data?.data); setLoadError(""); })
      .catch((e) => setLoadError(e?.response?.data?.message || "Couldn't load the commands for this vehicle."));
  }, [vehicleId]);

  const loadHistory = useCallback(() => {
    axios
      .get(`${URL_BASE}?vehicleId=${encodeURIComponent(vehicleId)}&limit=5`, auth())
      .then((r) => setHistory(r.data?.data?.commands || []))
      .catch(() => {});
  }, [vehicleId]);

  useEffect(() => { loadCatalog(); loadHistory(); }, [loadCatalog, loadHistory]);
  useEffect(() => () => clearInterval(poll.current), []);

  // Follow the sent command until it is done
  const follow = (id: string) => {
    clearInterval(poll.current);
    const started = Date.now();
    poll.current = setInterval(() => {
      axios
        .get(`${URL_BASE}/${id}`, auth())
        .then((r) => {
          const c = r.data?.data;
          if (!c) return;
          setCurrent(c);
          if (!OPEN.has(c.status) || Date.now() - started > 7 * 60 * 1000) {
            clearInterval(poll.current);
            loadHistory();
          }
        })
        .catch(() => {});
    }, 2500);
  };

  const groups = cat?.groups || [];
  const shown = useMemo(() => (cat?.commands || []).filter((c) => c.group === group), [cat, group]);
  const selected = (cat?.commands || []).find((c) => c.key === openKey) || null;
  const busy = !!current && OPEN.has(current.status);

  const choose = (c: Cmd) => {
    setError("");
    setConfirming(null);
    if (openKey === c.key) { setOpenKey(null); return; }
    setOpenKey(c.key);
    const v: Record<string, any> = {};
    c.params.forEach((p) => { v[p.name] = p.default ?? ""; });
    setValues(v);
  };

  const send = async (c: Cmd, confirmMoving = false) => {
    setSending(true);
    setError("");
    try {
      const r = await axios.post(URL_BASE, { vehicleId, commandKey: c.key, params: values, confirmMoving }, auth());
      const cmd = r.data?.data;
      setConfirming(null);
      setOpenKey(null);
      setCurrent(cmd);
      if (cmd?._id) follow(cmd._id);
    } catch (e: any) {
      const d = e?.response?.data || {};
      if (d.code === "MOVING") { setMovingSpeed(d.speedKmh || 0); setConfirming("moving"); }
      else { setError(d.message || "The command wasn't sent. Try again."); setConfirming(null); }
      if (d.code === "OFFLINE") loadCatalog();
    } finally {
      setSending(false);
    }
  };

  const submit = (c: Cmd) => {
    if (c.danger && confirming !== "danger") { setConfirming("danger"); return; }
    send(c);
  };

  const dev = cat?.device;
  const title = plate || cat?.vehicle.registrationNo || "Vehicle";

  return (
    <Modal isOpen toggle={onClose} size="lg" centered className="at-modal at-cmd" scrollable>
      <ModalHeader toggle={onClose}>
        Commands · {title}
      </ModalHeader>
      <ModalBody>
        {loadError && <p className="at-cmd__error" role="alert">{loadError}</p>}
        {!cat && !loadError && <p className="at-cmd__note">Loading commands…</p>}
        {cat && dev && (
          <>
            <div className="at-cmd__state">
              <span className="at-cmd__pill">{dev.modelLabel}</span>
              <span className={`at-cmd__pill ${dev.online ? "is-good" : "is-bad"}`}>
                {dev.online ? "Online" : `Offline${dev.lastSeen ? ` · last seen ${timeAgo(dev.lastSeen)}` : ""}`}
              </span>
              {dev.online && <span className="at-cmd__pill">{dev.speedKmh > 0 ? `${dev.speedKmh} km/h` : "Parked"}{dev.ignition === null ? "" : dev.ignition ? " · ignition on" : " · ignition off"}</span>}
            </div>
            {!dev.online && (
              <p className="at-cmd__warn">The tracker is offline, so commands can't be sent now. They aren't queued, so nothing runs by surprise later.</p>
            )}
            {current && (
              <section className="at-cmd__current" aria-label="Last command">
                <div className="at-cmd__current-head">
                  <strong>{current.label || current.customData || current.commandType}</strong>
                  {current.customData && <code>{current.customData}</code>}
                </div>
                <Progress cmd={current} />
              </section>
            )}
            <div className="at-cmd__layout">
              {groups.length > 1 && (
                <nav className="at-cmd__groups" aria-label="Command groups">
                  {groups.map((g) => (
                    <button key={g.key} type="button" className={g.key === group ? "is-active" : ""} aria-pressed={g.key === group} onClick={() => { setGroup(g.key); setOpenKey(null); setError(""); }}>
                      {g.label}
                    </button>
                  ))}
                </nav>
              )}
              <ul className="at-cmd__list">
                {shown.map((c) => {
                  const isOpen = openKey === c.key;
                  return (
                    <li key={c.key} className={`at-cmd__item${isOpen ? " is-open" : ""}${c.danger ? " is-danger" : ""}`}>
                      <button type="button" className="at-cmd__row" aria-expanded={isOpen} onClick={() => choose(c)} disabled={!dev.online}>
                        <span className="at-cmd__label">{c.label}</span>
                        <span className="at-cmd__kind">{c.kind === "query" ? "Ask" : c.kind === "set" ? "Change" : "Action"}</span>
                      </button>
                      {isOpen && selected && (
                        <form className="at-cmd__form" onSubmit={(e) => { e.preventDefault(); submit(selected); }}>
                          {selected.help && <p className="at-cmd__help">{selected.help}</p>}
                          {selected.params.map((p) => (
                            <label key={p.name} className="at-cmd__field">
                              <span>{p.label}{p.required === false ? " (optional)" : ""}</span>
                              {p.type === "select" ? (
                                <select className="form-select" value={String(values[p.name] ?? "")} onChange={(e) => setValues({ ...values, [p.name]: e.target.value })}>
                                  {(p.options || []).map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
                                </select>
                              ) : (
                                <span className="at-cmd__input">
                                  <input
                                    className="form-control"
                                    type={p.type === "number" ? "number" : p.type === "phone" ? "tel" : "text"}
                                    inputMode={p.type === "number" || p.type === "phone" ? "numeric" : undefined}
                                    min={p.min}
                                    max={p.max}
                                    step={p.type === "number" ? 1 : undefined}
                                    required={p.required !== false && p.type !== "number"}
                                    placeholder={p.type === "phone" ? "923001234567" : undefined}
                                    value={values[p.name] ?? ""}
                                    onChange={(e) => setValues({ ...values, [p.name]: e.target.value })}
                                  />
                                  {p.unit && <em>{p.unit}</em>}
                                </span>
                              )}
                              {(p.help || (p.type === "number" && p.min !== undefined)) && (
                                <small>{p.help || `${p.min}–${p.max}${p.unit ? ` ${p.unit}` : ""}`}</small>
                              )}
                            </label>
                          ))}
                          {selected.preview && <p className="at-cmd__preview">Sends <code>{selected.preview}</code></p>}
                          {confirming === "danger" && <p className="at-cmd__confirm" role="alert">{selected.confirm || "Are you sure?"}</p>}
                          {confirming === "moving" && (
                            <p className="at-cmd__confirm" role="alert">
                              The vehicle is moving at {movingSpeed} km/h. Cutting the engine now can stop it in traffic.
                            </p>
                          )}
                          {error && <p className="at-cmd__error" role="alert">{error}</p>}
                          <div className="at-cmd__actions">
                            {confirming === "moving" ? (
                              <button type="button" className="btn btn-danger" disabled={sending} onClick={() => send(selected, true)}>
                                {sending ? "Sending…" : "Stop it anyway"}
                              </button>
                            ) : (
                              <button type="submit" className={`btn ${selected.danger ? "btn-danger" : "btn-primary"}`} disabled={sending || busy}>
                                {sending ? "Sending…" : confirming === "danger" ? `Yes, ${selected.label.toLowerCase()}` : selected.kind === "query" ? "Ask the tracker" : "Send"}
                              </button>
                            )}
                            <button type="button" className="btn btn-secondary" onClick={() => { setOpenKey(null); setConfirming(null); setError(""); }}>
                              Cancel
                            </button>
                            {busy && <span className="at-cmd__note">Waiting for the previous reply first.</span>}
                          </div>
                        </form>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <section className="at-cmd__history" aria-label="Recent commands">
              <h3>Recent commands</h3>
              {!history.length ? (
                <p className="at-cmd__note">No commands sent to this vehicle yet.</p>
              ) : (
                <ul>
                  {history.map((h) => (
                    <li key={h._id}>
                      <div className="at-cmd__hist-head">
                        <strong>{h.label || (h.commandType === "custom" ? h.customData : h.commandType)}</strong>
                        <span className={`at-cmd__status s-${h.status}`}>{STEP_LABEL[h.status] || h.status}</span>
                        <span className="at-cmd__when">{timeAgo(h.createdAt)}</span>
                      </div>
                      {h.status === "EXECUTED" && h.commandResult && <ReplyView text={h.commandResult} />}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default CommandPanel;
