// Control Room (redesign, Phase 4): full map of alarms with floating panels.
// Left: the alarm queue (Live / Mine / Team / Closed). Right: the selected alarm with
// SLA timer and response steps. Top: today's figures and the command / pre-info tools.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../../../Utilities/api";
import {
  CR_ALARMS,
  CR_OVERVIEW,
  GET_ALERT_EVENTS_V2,
  GET_ALL_VALID_PRE_INFOS,
} from "../../../../Utilities/api/apiEndpoints";
import { setPreInfoAlerts } from "../../../../ReaduxToolkit/Reducer/AlertsSlice";
import { socketConnection } from "../../../../sockets/socket";
import { getUserRole } from "../../../../Utilities/globals/globals";
import { ROLES } from "../../../../constants/roles";
import SendCommand from "../ControlRoom copy/Analytics/components/SendCommand";
import AddPreAlertInfo from "../ControlRoom copy/Analytics/components/AddPreAlertInfo";
import TotalPreInfoAlerts from "../ControlRoom copy/Analytics/components/TotalPreInfoAlerts";
import VehicleCommandHistory from "../ControlRoom copy/Analytics/components/VehicleCommandHistory";
import AlarmMap from "./AlarmMap";
import AlarmDetail, { DetailMode } from "./AlarmDetail";
import { alarmLatLng, alarmStart, fmtAgo, fmtClock, fmtTime, plateOf, PRIORITY_INFO, typeLabel, useNow } from "./alarmUtils";
import "./controlRoom.scss";

type Tab = "live" | "mine" | "team" | "closed";
const WINDOWS = [
  { h: 1, label: "1 hour" },
  { h: 24, label: "24 hours" },
  { h: 168, label: "7 days" },
  { h: 720, label: "30 days" },
];
const PAGE = 50;

const ControlRoomV3 = () => {
  const dispatch = useDispatch();
  const now = useNow(1000);
  const { userData } = useSelector((s: any) => s.user || {});

  const isCompany = getUserRole() === ROLES.COMPANY;

  const [tab, setTab] = useState<Tab>("live");
  const [priorities, setPriorities] = useState<number[]>([1, 2, 3]);
  const [sinceHours, setSinceHours] = useState(24);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [live, setLive] = useState<any[]>([]);
  const [livePage, setLivePage] = useState(1);
  const [liveTotal, setLiveTotal] = useState(0);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [liveLoading, setLiveLoading] = useState(true);
  const [mine, setMine] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [closed, setClosed] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  const [selected, setSelected] = useState<{ mode: DetailMode; id: string } | null>(null);
  const [modal, setModal] = useState<null | "command" | "preinfo" | "preinfos" | "history" | "immobilised">(null);
  const [commandItem, setCommandItem] = useState<any>("");

  // Debounced plate search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const liveUrl = useCallback(
    (page: number) =>
      `${GET_ALERT_EVENTS_V2}?page=${page}&limit=${PAGE}&priorities=${priorities.join(",")}&sinceHours=${sinceHours}` +
      (search ? `&search=${encodeURIComponent(search)}` : ""),
    [priorities, sinceHours, search]
  );

  const loadLive = useCallback(
    async (pages = 1) => {
      const res: any = await getAll({ url: liveUrl(1) }).catch(() => null);
      if (!res) {
        setFailed(true);
        setLiveLoading(false);
        return;
      }
      setFailed(false);
      let rows: any[] = res?.data?.rows || [];
      // keep any extra pages the operator already loaded
      for (let p = 2; p <= pages; p++) {
        const more: any = await getAll({ url: liveUrl(p) }).catch(() => null);
        rows = rows.concat(more?.data?.rows || []);
      }
      setLive(rows);
      setLiveTotal(res?.data?.pagination?.totalCount || 0);
      setSummary(res?.data?.summary?.byPriority || {});
      setLiveLoading(false);
    },
    [liveUrl]
  );

  const loadList = useCallback(async (scope: "open" | "team" | "closed") => {
    const res: any = await getAll({ url: `${CR_ALARMS}?scope=${scope}` }).catch(() => null);
    const rows = res?.success ? res.data : [];
    if (scope === "open") setMine(rows);
    if (scope === "team") setTeam(rows);
    if (scope === "closed") setClosed(rows);
  }, []);

  const loadOverview = useCallback(async () => {
    const res: any = await getAll({ url: CR_OVERVIEW }).catch(() => null);
    if (res?.success) setOverview(res.data);
  }, []);

  // Panels start below the top bar, whose height depends on how it wraps.
  const topRef = useRef<HTMLElement>(null);
  const [topH, setTopH] = useState(68);
  useEffect(() => {
    const el = topRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setTopH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Escape closes the engine-cut sheet, then the alarm panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector(".modal.show")) return;
      if (modal === "immobilised") setModal(null);
      else if (selected) setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, selected]);

  const pagesRef = useRef(1);
  pagesRef.current = livePage;

  // Live queue: reload on filter change, then every 15 s (and on a pushed alert)
  useEffect(() => {
    setLiveLoading(true);
    setLivePage(1);
    loadLive(1);
    const id = setInterval(() => loadLive(pagesRef.current), 15000);
    let last = 0;
    const onAlert = () => {
      if (Date.now() - last < 3000) return;
      last = Date.now();
      loadLive(pagesRef.current);
    };
    socketConnection.on("new_alert_event", onAlert);
    return () => {
      clearInterval(id);
      socketConnection.off("new_alert_event", onAlert);
    };
  }, [loadLive]);

  // My / team alarms and figures
  const refreshAll = useCallback(() => {
    loadList("open");
    loadList("team");
    loadOverview();
  }, [loadList, loadOverview]);

  useEffect(() => {
    refreshAll();
    const id = setInterval(refreshAll, 20000);
    return () => clearInterval(id);
  }, [refreshAll]);

  useEffect(() => {
    if (tab === "closed") loadList("closed");
  }, [tab, loadList]);

  const loadMore = async () => {
    const next = livePage + 1;
    const res: any = await getAll({ url: liveUrl(next) }).catch(() => null);
    setLive((l) => l.concat(res?.data?.rows || []));
    setLivePage(next);
  };

  const lists: Record<Tab, any[]> = { live, mine, team, closed };
  const rows = lists[tab];
  const modeFor = (t: Tab): DetailMode => (t === "mine" ? "mine" : t);

  const selectedAlarm = useMemo(() => {
    if (!selected) return null;
    const pool = selected.mode === "live" ? live : selected.mode === "mine" ? mine : selected.mode === "team" ? team : closed;
    return pool.find((a) => a._id === selected.id) || null;
  }, [selected, live, mine, team, closed]);

  // Keep the panel open while a just-taken alarm appears in "Mine"
  const [pendingTaken, setPendingTaken] = useState<any>(null);
  const shownAlarm = selectedAlarm || (pendingTaken && selected?.id === pendingTaken._id ? pendingTaken : null);

  const mapItems = useMemo(
    () =>
      rows
        .map((a) => {
          const p = alarmLatLng(a);
          if (!p) return null;
          const over = tab !== "closed" && (now - alarmStart(a)) / 1000 > (Number(a.slaSeconds) || 900);
          return { id: a._id, lat: p.lat, lng: p.lng, priority: a.priority || 4, over, label: `${typeLabel(a.alertType || a.type)} · ${plateOf(a)}` };
        })
        .filter(Boolean) as any[],
    // `now` changes every second; recompute over-SLA only every 10 s
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, tab, Math.floor(now / 10000)]
  );

  const openCommand = (vehicle?: any) => {
    setCommandItem(
      vehicle?._id ? { ...vehicle, id: vehicle.traccarDeviceId, value: vehicle._id, name: vehicle.registrationNo } : ""
    );
    setModal("command");
  };

  const openPreInfos = async () => {
    const res: any = await getAll({ url: GET_ALL_VALID_PRE_INFOS }).catch(() => null);
    dispatch(setPreInfoAlerts(res?.success ? res.data : []));
    setModal("preinfos");
  };

  const togglePriority = (p: number) =>
    setPriorities((cur) => (cur.includes(p) ? (cur.length > 1 ? cur.filter((x) => x !== p) : cur) : [...cur, p].sort()));

  const a = overview?.alarms;
  const immobilised: any[] = overview?.immobilised || [];
  const tabCount: Record<Tab, number | string> = {
    live: liveTotal,
    mine: mine.length,
    team: team.length,
    closed: closed.length || "",
  };

  return (
    <div className={`cr-root${shownAlarm && selected ? " has-detail" : ""}`} style={{ ["--cr-top" as any]: `${topH + 24}px` }}>
      <div className="cr-mapbox">
        <AlarmMap items={mapItems} selectedId={shownAlarm?._id || null} onSelect={(id: string) => setSelected({ mode: modeFor(tab), id })} fitKey={`${tab}|${priorities}|${sinceHours}|${search}|${rows.length > 0}`} />
      </div>

      {/* Top bar: figures + tools */}
      <header className="cr-panel cr-top" ref={topRef}>
        <h1 className="cr-hidden">Control Room</h1>
        <div className="cr-stats">
          <button type="button" className="cr-stat" onClick={() => setTab("team")}>
            <strong>{a?.open ?? "–"}</strong>
            <span>Open</span>
          </button>
          <button type="button" className={`cr-stat${a?.overSla ? " is-red" : ""}`} onClick={() => setTab("team")}>
            <strong>{a?.overSla ?? "–"}</strong>
            <span>Over SLA</span>
          </button>
          <div className="cr-stat">
            <strong>{a?.closedToday ?? "–"}</strong>
            <span>Closed today</span>
          </div>
          <div className="cr-stat">
            <strong>{a?.avgResolveSeconds != null ? fmtClock(a.avgResolveSeconds) : "–"}</strong>
            <span>Avg to close</span>
          </div>
          <button type="button" className={`cr-stat${immobilised.length ? " is-amber" : ""}`} onClick={() => setModal("immobilised")}>
            <strong>{overview ? immobilised.length : "–"}</strong>
            <span>Engine cut</span>
          </button>
          <button type="button" className="cr-stat" onClick={openPreInfos}>
            <strong>{overview?.activePreInfos ?? "–"}</strong>
            <span>Pre-informed</span>
          </button>
        </div>
        <div className="cr-tools">
          <button type="button" className="cr-btn cr-btn--pri" onClick={() => openCommand()}>
            Send command
          </button>
          <button type="button" className="cr-btn" onClick={() => setModal("preinfo")}>
            Add pre-info
          </button>
          <button type="button" className="cr-btn" onClick={() => setModal("history")}>
            Command history
          </button>
        </div>
      </header>

      {/* Alarm queue */}
      <section className="cr-panel cr-queue" aria-label="Alarm queue">
        <div className="cr-tabs cr-tabs--queue" role="tablist">
          {(["live", "mine", "team", "closed"] as Tab[]).map((t) => (
            <button key={t} role="tab" type="button" aria-selected={tab === t} className={tab === t ? "is-on" : ""} onClick={() => setTab(t)}>
              {t === "live" ? "Live" : t === "mine" ? "Mine" : t === "team" ? "Team" : "Closed"}
              {tabCount[t] !== "" && <em>{tabCount[t]}</em>}
            </button>
          ))}
        </div>

        {tab === "live" && (
          <div className="cr-filters">
            <div className="cr-chips" role="group" aria-label="Priority">
              {[1, 2, 3, 4].map((p) => (
                <button key={p} type="button" aria-pressed={priorities.includes(p)} className={`cr-chip cr-chip--p${p}${priorities.includes(p) ? " is-on" : ""}`} onClick={() => togglePriority(p)}>
                  {PRIORITY_INFO[p as 1].short} <span>{summary[p] ?? 0}</span>
                </button>
              ))}
            </div>
            <div className="cr-row">
              <label className="cr-hidden" htmlFor="cr-search">
                Search plate
              </label>
              <input id="cr-search" className="cr-input" placeholder="Search plate" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <label className="cr-hidden" htmlFor="cr-window">
                Time window
              </label>
              <select id="cr-window" className="cr-input cr-select" value={sinceHours} onChange={(e) => setSinceHours(Number(e.target.value))}>
                {WINDOWS.map((w) => (
                  <option key={w.h} value={w.h}>
                    Last {w.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <ul className="cr-list">
          {failed && tab === "live" && <li className="cr-empty">Can't reach the server. Retrying…</li>}
          {tab === "live" && liveLoading && !failed && live.length === 0 && <li className="cr-empty">Loading alarms…</li>}
          {!liveLoading && rows.length === 0 && !failed && (
            <li className="cr-empty">
              {tab === "live"
                ? `No untaken alarms in the last ${WINDOWS.find((w) => w.h === sinceHours)?.label}.`
                : tab === "mine"
                ? "You have no open alarms. Take one from Live."
                : tab === "team"
                ? "No open alarms in the team."
                : "You haven't closed any alarms yet."}
            </li>
          )}
          {rows.map((r) => {
            const type = r.alertType || r.type;
            const p = (r.priority || 4) as 1;
            const start = alarmStart(r);
            const sla = Number(r.slaSeconds) || 900;
            const el = (now - start) / 1000;
            const over = tab !== "closed" && el > sla;
            const steps = (r.steps || []).filter((s: any) => s.status !== "NOTE" && s.key !== "ack").length;
            const isSel = shownAlarm?._id === r._id;
            return (
              <li key={r._id}>
                <button type="button" className={`cr-item${isSel ? " is-selected" : ""}${over ? " is-over" : ""}`} onClick={() => setSelected({ mode: modeFor(tab), id: r._id })}>
                  <span className={`cr-sev cr-sev--p${p}`}>{PRIORITY_INFO[p].short}</span>
                  <span className="cr-item__main">
                    <b>{typeLabel(type)}</b>
                    <small>
                      {plateOf(r)}
                      {tab === "team" && r.assignedTo?.fullName ? ` · ${r.assignedTo.fullName}` : ""}
                      {tab === "closed" && r.outcome ? ` · ${r.outcome === "FALSE_ALARM" ? "False alarm" : r.outcome === "ESCALATED" ? "Escalated" : "Resolved"}` : ""}
                      {(tab === "mine" || tab === "team") && steps ? ` · ${steps} step${steps > 1 ? "s" : ""}` : ""}
                    </small>
                    {r.preInfo && <small className="cr-tag">Pre-informed</small>}
                  </span>
                  <span className="cr-item__time">
                    {tab === "closed" ? (
                      <small>{fmtTime(r.alertEventCloseDate)}</small>
                    ) : (
                      <>
                        <b>{fmtAgo(now - start)}</b>
                        <i className="cr-meter" aria-hidden="true">
                          <i style={{ width: `${Math.min(100, (el / sla) * 100)}%` }} />
                        </i>
                      </>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
          {tab === "live" && live.length < liveTotal && (
            <li>
              <button type="button" className="cr-more" onClick={loadMore}>
                Load more ({liveTotal - live.length} left)
              </button>
            </li>
          )}
        </ul>
      </section>

      {shownAlarm && selected && (
        <AlarmDetail
          key={`${selected.mode}:${shownAlarm._id}`}
          alarm={shownAlarm}
          mode={selected.mode}
          canAct={isCompany || String(shownAlarm.assignedTo?._id || shownAlarm.assignedTo) === String(userData?._id)}
          onClose={() => {
            setSelected(null);
            setPendingTaken(null);
          }}
          onTaken={(ev) => {
            setLive((l) => l.filter((x) => x._id !== selected.id));
            setPendingTaken({ ...ev, vehicle: shownAlarm.vehicle, preInfo: shownAlarm.preInfo });
            setSelected({ mode: "mine", id: ev._id });
            setTab("mine");
            refreshAll();
          }}
          onChanged={() => {
            refreshAll();
            loadLive(pagesRef.current);
            if (tab === "closed") loadList("closed");
          }}
          onEngineCut={(v) => openCommand(v)}
        />
      )}

      {modal === "command" && <SendCommand addModal setAddModal={() => { setModal(null); loadOverview(); }} prevItem={commandItem} />}
      {modal === "preinfo" && (
        <AddPreAlertInfo
          addModal
          setAddModal={() => {
            setModal(null);
            loadOverview();
            loadLive(pagesRef.current);
          }}
          dropDownDevices={[]}
          fromDate={new Date(Date.now() - 86400000).toISOString()}
          toDate={new Date().toISOString()}
        />
      )}
      {modal === "preinfos" && <TotalPreInfoAlerts isVisible setIsVisible={() => setModal(null)} />}
      {modal === "history" && <VehicleCommandHistory isVisible setIsVisible={() => setModal(null)} />}
      {modal === "immobilised" && (
        <div className="cr-sheet" role="dialog" aria-modal="true" aria-labelledby="cr-imm-title" onClick={() => setModal(null)}>
          <div className="cr-panel cr-sheet__box" onClick={(e) => e.stopPropagation()}>
            <header className="cr-sheet__head">
              <h2 id="cr-imm-title">Engine cut ({immobilised.length})</h2>
              <button type="button" className="cr-icon-btn" aria-label="Close" onClick={() => setModal(null)}>
                ✕
              </button>
            </header>
            <p className="cr-muted">Vehicles whose latest engine command is "engine stop". Release sends "engine resume".</p>
            <ul className="cr-imm">
              {immobilised.length === 0 && <li className="cr-empty">No vehicles have their engine cut.</li>}
              {immobilised.map((v) => (
                <li key={v.vehicleId}>
                  <div>
                    <b>{v.registrationNo || "Unknown vehicle"}</b>
                    <small className="cr-muted">
                      {fmtTime(v.at)} · {v.byName || "—"} · {v.status === "EXECUTED" ? "Confirmed by device" : v.status.toLowerCase().replace(/_/g, " ")}
                    </small>
                  </div>
                  <button type="button" className="cr-btn" onClick={() => openCommand({ _id: v.vehicleId, traccarDeviceId: v.traccarDeviceId, registrationNo: v.registrationNo })}>
                    Release
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlRoomV3;
