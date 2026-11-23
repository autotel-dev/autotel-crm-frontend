// Control Room: the selected alarm. A live alarm shows a preview and "Take this alarm";
// a taken alarm shows the SLA timer, the response steps, notes and the closing actions.
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { create, getAll } from "../../../../Utilities/api";
import {
  ASSIGN_ALERT_EVENT_TO_ME_V2,
  COMPLETE_AN_ALERT_EVENT,
  CR_LOG_STEP,
  GET_ALERT_EVENT_BY_ID_v2,
} from "../../../../Utilities/api/apiEndpoints";
import {
  alarmLatLng,
  alarmStart,
  cleanMessage,
  fmtAgo,
  fmtClock,
  fmtTime,
  playbookFor,
  plateOf,
  PlaybookStep,
  PRIORITY_INFO,
  ruleName,
  StepLog,
  stepState,
  typeLabel,
  useNow,
} from "./alarmUtils";

export type DetailMode = "live" | "mine" | "team" | "closed";

interface Props {
  alarm: any;
  mode: DetailMode;
  canAct: boolean;
  onClose: () => void;
  onTaken: (alertEvent: any) => void;
  onChanged: () => void;
  onEngineCut: (vehicle: any) => void;
}

const OUTCOMES = [
  { key: "FALSE_ALARM", label: "False alarm", cls: "" },
  { key: "ESCALATED", label: "Escalate", cls: "" },
  { key: "RESOLVED", label: "Resolve", cls: "cr-btn--lime" },
] as const;

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PHONE = "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z";
const PIN = "M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z";
const X = "M18 6 6 18M6 6l12 12";

const AlarmDetail = ({ alarm, mode, canAct, onClose, onTaken, onChanged, onEngineCut }: Props) => {
  const now = useNow(1000);
  const [detail, setDetail] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [steps, setSteps] = useState<StepLog[]>(alarm?.steps || []);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [busy, setBusy] = useState("");
  const [tab, setTab] = useState<"steps" | "customer" | "vehicle" | "history">("steps");
  const [showCodes, setShowCodes] = useState(false);
  const [address, setAddress] = useState("");

  const isEvent = mode !== "live";
  const id = alarm?._id;

  // Full details (customer, vehicle, history) for a taken alarm.
  useEffect(() => {
    setDetail(null);
    setHistory([]);
    setSteps(alarm?.steps || []);
    setNote("");
    setNoteError("");
    setShowCodes(false);
    setTab("steps");
    if (!isEvent || !id) return;
    let alive = true;
    getAll({ url: `${GET_ALERT_EVENT_BY_ID_v2}/${id}` }).then((res: any) => {
      if (!alive || !res?.success) return;
      setDetail(res.data.alertEvent);
      setHistory(res.data.previousAlerts || []);
      if (Array.isArray(res.data.alertEvent?.steps)) setSteps(res.data.alertEvent.steps);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEvent]);

  // Street address for the alarm position (one lookup per selected alarm).
  const pos = alarmLatLng(alarm);
  useEffect(() => {
    setAddress("");
    const g = (window as any).google;
    if (!pos || !g?.maps?.Geocoder) return;
    let alive = true;
    new g.maps.Geocoder().geocode({ location: pos }, (results: any, status: string) => {
      if (alive && status === "OK" && results?.[0]) setAddress(results[0].formatted_address);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pos?.lat, pos?.lng]);

  const vehicle = detail?.vehicle || alarm?.vehicle || {};
  const customer = vehicle?.customer || {};
  const type = alarm?.type || alarm?.alertType;
  const priority = (alarm?.priority || 4) as 1 | 2 | 3 | 4;
  const sla = Number(alarm?.slaSeconds) || 900;
  const started = alarmStart(alarm);
  const endAt = alarm?.alertEventCloseDate ? new Date(alarm.alertEventCloseDate).getTime() : now;
  const elapsed = (endAt - started) / 1000;
  const over = elapsed > sla;
  const playbook = playbookFor(type);
  const state = useMemo(() => stepState(steps), [steps]);
  const current = playbook.find((s) => !state[s.key]);
  const doneCount = playbook.filter((s) => state[s.key]).length;
  const notes = steps.filter((s) => s.status === "NOTE");
  const mapsLink = pos ? `https://www.google.com/maps?q=${pos.lat},${pos.lng}` : "";
  const editable = mode === "mine" || (mode === "team" && canAct);

  const take = async () => {
    setBusy("take");
    const res: any = await create({ liveAlertEventId: id }, { url: ASSIGN_ALERT_EVENT_TO_ME_V2 }).catch(() => null);
    setBusy("");
    if (res?.success) onTaken(res.data);
    else {
      Swal.fire({ text: res?.message || "Could not take this alarm.", icon: "error", timer: 2500, showConfirmButton: false });
      onChanged();
    }
  };

  const logStep = async (s: PlaybookStep | { key: string; label: string }, status: "DONE" | "SKIPPED" | "NOTE", text = "") => {
    setBusy(`${s.key}:${status}`);
    const res: any = await create(
      { alertEventId: id, key: s.key, label: s.label, status, note: text },
      { url: CR_LOG_STEP }
    ).catch(() => null);
    setBusy("");
    if (res?.success) {
      setSteps(res.data.steps);
      return true;
    }
    Swal.fire({ text: res?.message || "Could not save the step.", icon: "error", timer: 2500, showConfirmButton: false });
    return false;
  };

  const addNote = async () => {
    if (!note.trim()) {
      setNoteError("Write a note first.");
      return;
    }
    if (await logStep({ key: "note", label: "Note" }, "NOTE", note.trim())) {
      setNote("");
      setNoteError("");
    }
  };

  const closeAlarm = async (outcome: string) => {
    if (!note.trim()) {
      setNoteError("Write what happened before closing the alarm.");
      document.getElementById("cr-note")?.focus();
      return;
    }
    setBusy(outcome);
    const res: any = await create(
      { alertEventId: id, completionResponse: note.trim(), outcome, alertEventCloseDate: new Date().toISOString() },
      { url: COMPLETE_AN_ALERT_EVENT }
    ).catch(() => null);
    setBusy("");
    if (res?.success) {
      setNote("");
      onChanged();
      onClose();
    } else Swal.fire({ text: res?.message || "Could not close the alarm.", icon: "error", timer: 2500, showConfirmButton: false });
  };

  const runAction = (s: PlaybookStep) => {
    if (s.action === "share_location" && mapsLink) {
      navigator.clipboard?.writeText(mapsLink).catch(() => undefined);
      Swal.fire({ text: "Location link copied.", icon: "success", timer: 1400, showConfirmButton: false });
    }
    if (s.action === "engine_cut") onEngineCut(vehicle);
  };

  const phoneFor = (s: PlaybookStep) =>
    s.action === "call_customer" ? customer.phoneNo : s.action === "call_emergency" ? customer.additionalContactNo : "";

  if (!alarm) return null;

  return (
    <article className="cr-panel cr-detail" aria-label="Selected alarm">
      <header className="cr-detail__head">
        <div className="cr-detail__title">
          <span className={`cr-kicker cr-kicker--p${priority}`}>
            {PRIORITY_INFO[priority].label} · {typeLabel(type)}
          </span>
          <h2>{plateOf(alarm)}</h2>
          <p className="cr-muted">
            {[customer.fullName, vehicle?.make?.name && `${vehicle.make.name} ${vehicle?.model?.name || ""}`.trim()].filter(Boolean).join(" · ") ||
              "No customer on file"}
          </p>
        </div>
        <div className={`cr-sla${over ? " is-over" : ""}${mode === "closed" ? " is-closed" : ""}`} aria-label={`Elapsed ${fmtClock(elapsed)}, SLA ${fmtClock(sla)}`}>
          <strong>{fmtClock(elapsed)}</strong>
          <small>{mode === "closed" ? "to close" : `SLA ${fmtClock(sla)}`}</small>
        </div>
        <button type="button" className="cr-icon-btn" aria-label="Close panel" onClick={onClose}>
          <Icon d={X} />
        </button>
      </header>

      <div className="cr-detail__body">
        <div className="cr-facts">
          <div>
            <span className="cr-muted">Alert</span>
            <b>{cleanMessage(alarm.message) || typeLabel(type)}</b>
            {ruleName(alarm.message) && <span className="cr-muted">Rule: {ruleName(alarm.message)}</span>}
          </div>
          <div>
            <span className="cr-muted">Came in</span>
            <b>
              {fmtTime(started)} · {fmtAgo(now - started)} ago
            </b>
          </div>
          <div>
            <span className="cr-muted">Where</span>
            <b>{address || (pos ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : "No position")}</b>
            {mapsLink && (
              <a className="cr-link" href={mapsLink} target="_blank" rel="noreferrer">
                <Icon d={PIN} /> Open in Google Maps
              </a>
            )}
          </div>
          {alarm.assignedTo?.fullName && mode !== "mine" && (
            <div>
              <span className="cr-muted">Handled by</span>
              <b>{alarm.assignedTo.fullName}</b>
            </div>
          )}
        </div>

        {alarm.preInfo && (
          <div className="cr-preinfo" role="note">
            <b>Pre-informed</b> by {alarm.preInfo.addedByUser?.fullName || "the company"}: {alarm.preInfo.preInfoMessage}
            <span className="cr-muted">
              {" "}
              ({fmtTime(alarm.preInfo.from)} – {fmtTime(alarm.preInfo.to)})
            </span>
          </div>
        )}

        {mode === "live" ? (
          <div className="cr-take">
            <p>Nobody has taken this alarm yet. Take it to start the response steps.</p>
            <button type="button" className="cr-btn cr-btn--pri" disabled={!!busy} onClick={take}>
              {busy === "take" ? "Taking…" : "Take this alarm"}
            </button>
            {customer.phoneNo && (
              <a className="cr-btn" href={`tel:${customer.phoneNo}`}>
                <Icon d={PHONE} /> Call {customer.fullName || "customer"}
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="cr-progress" aria-label={`Response progress: ${doneCount} of ${playbook.length} steps`}>
              {playbook.map((s) => (
                <i key={s.key} className={state[s.key] ? (state[s.key].status === "SKIPPED" ? "is-skip" : "is-done") : s === current ? "is-now" : ""} />
              ))}
            </div>

            <div className="cr-tabs" role="tablist">
              {(["steps", "customer", "vehicle", "history"] as const).map((t) => (
                <button key={t} role="tab" type="button" aria-selected={tab === t} className={tab === t ? "is-on" : ""} onClick={() => setTab(t)}>
                  {t === "steps" ? "Response" : t === "customer" ? "Customer" : t === "vehicle" ? "Vehicle" : `History${history.length ? ` (${history.length})` : ""}`}
                </button>
              ))}
            </div>

            {tab === "steps" && (
              <>
                {current && editable && (
                  <div className="cr-now">
                    <span className="cr-now__kicker">
                      Step {playbook.indexOf(current) + 1} of {playbook.length}
                    </span>
                    <b>{current.label}</b>
                    {current.hint && <span className="cr-muted">{current.hint}</span>}
                    <div className="cr-row">
                      {phoneFor(current) ? (
                        <a className="cr-btn cr-btn--pri" href={`tel:${phoneFor(current)}`}>
                          <Icon d={PHONE} /> Call {phoneFor(current)}
                        </a>
                      ) : current.action === "share_location" ? (
                        <button type="button" className="cr-btn cr-btn--pri" onClick={() => runAction(current)}>
                          Copy location link
                        </button>
                      ) : null}
                      <button type="button" className="cr-btn cr-btn--lime" disabled={!!busy} onClick={() => logStep(current, "DONE")}>
                        Done
                      </button>
                      <button type="button" className="cr-btn" disabled={!!busy} onClick={() => logStep(current, "SKIPPED", current.action?.startsWith("call") ? "No answer" : "")}>
                        {current.action?.startsWith("call") ? "No answer → next" : "Skip"}
                      </button>
                    </div>
                  </div>
                )}
                {!current && mode !== "closed" && editable && (
                  <div className="cr-now cr-now--done">
                    <b>All steps done.</b>
                    <span className="cr-muted">Write what happened and close the alarm.</span>
                  </div>
                )}

                <ol className="cr-steps">
                  {steps
                    .filter((s) => s.key === "ack")
                    .map((s, i) => (
                      <li key={`ack${i}`} className="is-done">
                        <span>Acknowledged</span>
                        <small>
                          {s.byName} · {fmtTime(s.at)}
                        </small>
                      </li>
                    ))}
                  {playbook.map((s) => {
                    const st = state[s.key];
                    return (
                      <li key={s.key} className={st ? (st.status === "SKIPPED" ? "is-skip" : "is-done") : s === current ? "is-now" : ""}>
                        <span>{s.label}</span>
                        {st && (
                          <small>
                            {st.status === "SKIPPED" ? `Skipped${st.note ? ` (${st.note})` : ""}` : "Done"} · {st.byName} · {fmtTime(st.at)}
                          </small>
                        )}
                      </li>
                    );
                  })}
                  {steps
                    .filter((s) => s.key === "close")
                    .map((s, i) => (
                      <li key={`close${i}`} className="is-done">
                        <span>{s.label}</span>
                        <small>
                          {s.byName} · {fmtTime(s.at)}
                        </small>
                      </li>
                    ))}
                </ol>

                {notes.length > 0 && (
                  <ul className="cr-notes" aria-label="Notes">
                    {notes.map((n, i) => (
                      <li key={i}>
                        <p>{n.note}</p>
                        <small>
                          {n.byName} · {fmtTime(n.at)}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}

                {mode === "closed" && alarm.completionResponse && (
                  <div className="cr-closed-note">
                    <span className="cr-muted">Closing note</span>
                    <p>{alarm.completionResponse}</p>
                  </div>
                )}
              </>
            )}

            {tab === "customer" && (
              <dl className="cr-dl">
                <dt>Name</dt>
                <dd>{customer.fullName || "—"}</dd>
                <dt>Phone</dt>
                <dd>{customer.phoneNo ? <a href={`tel:${customer.phoneNo}`}>{customer.phoneNo}</a> : "—"}</dd>
                <dt>Emergency contact</dt>
                <dd>{customer.additionalContactNo ? <a href={`tel:${customer.additionalContactNo}`}>{customer.additionalContactNo}</a> : "—"}</dd>
                <dt>Email</dt>
                <dd>{customer.emailAddress || "—"}</dd>
                <dt>CNIC</dt>
                <dd>{customer.cnic || "—"}</dd>
                <dt>Mother's name</dt>
                <dd>{customer.motherName || "—"}</dd>
                <dt>Safety codes</dt>
                <dd>
                  {customer.normalPassword || customer.emergencyPassword ? (
                    <>
                      {showCodes ? `Normal: ${customer.normalPassword || "—"} · Emergency: ${customer.emergencyPassword || "—"}` : "••••  ••••"}{" "}
                      <button type="button" className="cr-link" onClick={() => setShowCodes(!showCodes)}>
                        {showCodes ? "Hide" : "Show"}
                      </button>
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
                {vehicle?.instructions && (
                  <>
                    <dt>Instructions</dt>
                    <dd>{vehicle.instructions}</dd>
                  </>
                )}
                {!detail && <dd className="cr-muted">Loading…</dd>}
              </dl>
            )}

            {tab === "vehicle" && (
              <dl className="cr-dl">
                <dt>Plate</dt>
                <dd>{vehicle.registrationNo || vehicle.vrn || "—"}</dd>
                <dt>Make / model</dt>
                <dd>{[vehicle?.make?.name, vehicle?.model?.name, vehicle?.year].filter(Boolean).join(" ") || "—"}</dd>
                <dt>Colour</dt>
                <dd>{vehicle.color || "—"}</dd>
                <dt>Engine / chassis</dt>
                <dd>{[vehicle.engineNo, vehicle.chasisNo].filter(Boolean).join(" / ") || "—"}</dd>
                <dt>IMEI</dt>
                <dd>{vehicle.imei || "—"}</dd>
                <dt>Group</dt>
                <dd>{vehicle?.group?.name || "—"}</dd>
                <dt>Insurance / bank</dt>
                <dd>{[vehicle?.insurance?.name, vehicle?.bank?.name].filter(Boolean).join(" / ") || "—"}</dd>
                <dt>Speed at alert</dt>
                <dd>{Number.isFinite(Number(alarm.speed)) ? `${Math.round(Number(alarm.speed))} km/h` : "—"}</dd>
              </dl>
            )}

            {tab === "history" && (
              <ul className="cr-history">
                {history.length === 0 && <li className="cr-muted">No earlier alarms for this vehicle.</li>}
                {history.map((h) => (
                  <li key={h._id}>
                    <span className={`cr-dot cr-dot--p${h.priority || 4}`} aria-hidden="true" />
                    <div>
                      <b>{typeLabel(h.type)}</b>
                      <small className="cr-muted">
                        {fmtTime(h.alertTime || h.createdAt)} · {h.isCompleted ? h.completionResponse || "Closed" : "Open"}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {editable && (
        <footer className="cr-detail__foot">
          <label htmlFor="cr-note" className="cr-label">
            Note
          </label>
          <textarea
            id="cr-note"
            rows={2}
            value={note}
            placeholder="What did you do? What did the customer say?"
            onChange={(e) => {
              setNote(e.target.value);
              if (noteError) setNoteError("");
            }}
          />
          {noteError && <span className="cr-error">{noteError}</span>}
          <div className="cr-row">
            <button type="button" className="cr-btn" disabled={!!busy} onClick={addNote}>
              Add note
            </button>
            <button type="button" className="cr-btn cr-btn--red" disabled={!vehicle?._id} onClick={() => onEngineCut(vehicle)}>
              Engine cut
            </button>
            <span className="cr-spacer" />
            {OUTCOMES.map((o) => (
              <button key={o.key} type="button" className={`cr-btn ${o.cls}`} disabled={!!busy} onClick={() => closeAlarm(o.key)}>
                {busy === o.key ? "Closing…" : o.label}
              </button>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
};

export default AlarmDetail;
