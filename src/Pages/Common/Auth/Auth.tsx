// Login page (redesign): live fleet map on the left, sign-in panel on the right.
// On phones the map becomes a banner above the form. Sign-in logic lives in Form.tsx (unchanged).
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonForm from "./Form";
import LoginMap, { ALERTS } from "./loginMap/LoginMap";
import { getAll } from "../../../Utilities/api";
import { setUserPersonalizationData } from "../../../ReaduxToolkit/Reducer/PersonalizationSlice";
import {
  GET_COMPANY_PERSONALIZATION,
  GET_SUPERADMIN_PERSONALIZATION,
  IMAGE_BASE_URL,
} from "../../../Utilities/api/apiEndpoints";
import "./login.css";

const DEFAULT_HEADER = "Welcome to Autotel";
const DEFAULT_SUB = "The best tracking platform in the tracking industry";
const ICON: Record<string, string> = { over: "!", border: "↗", geo: "◎", idle: "Ⅱ" };

const LoginForm = () => {
  const dispatch = useDispatch();
  const { userPersonalizationData: p } = useSelector((state: any) => state.personalization);
  const [loading, setLoading] = useState(true);
  const [alertIdx, setAlertIdx] = useState(0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(true);

  // Company (white-label) or super-admin personalization: logo and texts.
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getAll({
      url: userId == null ? GET_SUPERADMIN_PERSONALIZATION : `${GET_COMPANY_PERSONALIZATION}/${userId}`,
    })
      .then((res: any) => {
        dispatch(setUserPersonalizationData(res?.success ? res.data : null));
      })
      .catch(() => dispatch(setUserPersonalizationData(null)))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const header = p?.headerText || DEFAULT_HEADER;
  const sub = p?.subHeaderText || DEFAULT_SUB;
  const logo = p?.accountLogo?.url ? `${IMAGE_BASE_URL}/${p.accountLogo.url}` : "";

  // Typing effect for the sub-header (types, pauses, erases to 3 letters, repeats).
  useEffect(() => {
    if (loading) return;
    const id = setTimeout(
      () => {
        if (typing) {
          if (text.length < sub.length) setText(sub.slice(0, text.length + 1));
          else setTyping(false);
        } else if (text.length > 3) setText(text.slice(0, -1));
        else setTyping(true);
      },
      typing && text.length === sub.length ? 2200 : typing ? 55 : 25
    );
    return () => clearTimeout(id);
  }, [text, typing, sub, loading]);

  const feed = [0, 1, 2].map((k) => (alertIdx - k + ALERTS.length) % ALERTS.length);

  return (
    <div className="al-page">
      <section className="al-hero">
        <LoginMap onAlert={setAlertIdx} />
        <div className="al-hero__top">
          <span className="al-live">
            <i /> LIVE
          </span>
          <span className="al-chip">13 vehicles · 5 countries · tracking on</span>
        </div>
        <div className="al-feed" aria-hidden="true">
          {feed.map((ai, k) => {
            const a = ALERTS[ai];
            return (
              <div key={`${ai}-${k === 0 ? alertIdx : "old"}`} className={`al-card al-card--${a.st}${k === 0 ? " is-new" : ""}`}>
                <span className="al-card__icon">{ICON[a.st]}</span>
                <span className="al-card__text">
                  <strong>{a.title}</strong>
                  <small>{a.sub}</small>
                </span>
                {k === 0 && <em>now</em>}
              </div>
            );
          })}
        </div>
      </section>

      <main className="al-side">
        <div className="al-side__inner">
          <div className="al-brand">
            {logo ? <img src={logo} alt="" className="al-brand__logo" /> : <span className="al-brand__mark">A</span>}
            {!logo && <span className="al-brand__name">Autotel</span>}
          </div>
          <h1 className={`al-title${loading ? " is-loading" : ""}`}>{loading ? " " : header}</h1>
          <p className="al-sub" aria-label={sub}>
            {text}
            <span className="al-caret" />
          </p>
          <CommonForm />
          <p className="al-foot">© {new Date().getFullYear()} Autotel · Live vehicle tracking</p>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;
