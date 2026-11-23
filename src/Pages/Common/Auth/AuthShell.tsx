// Shared frame for the sign-in flow pages (forgot password, OTP code, new
// password): same live map + side panel as the login page, with the
// light/dark toggle. Each page passes its own form as children.
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoginMap from "./loginMap/LoginMap";
import { getAll } from "../../../Utilities/api";
import { setUserPersonalizationData } from "../../../ReaduxToolkit/Reducer/PersonalizationSlice";
import {
  GET_COMPANY_PERSONALIZATION,
  GET_SUPERADMIN_PERSONALIZATION,
  IMAGE_BASE_URL,
} from "../../../Utilities/api/apiEndpoints";
import { useAtTheme } from "../../../Layout/Rail/useAtTheme";
import "./login.css";

type Props = {
  step?: string; // e.g. "Step 1 of 3"
  children: ReactNode;
};

// Brand colour from personalization (white-label), used by the forms.
export const useBrandColor = (): string | undefined => {
  const { userPersonalizationData: p } = useSelector((state: any) => state.personalization);
  const c = p?.buttonsAndBarsColor;
  return c && String(c).trim() !== "" ? String(c).trim() : undefined;
};

const AuthShell = ({ step, children }: Props) => {
  const { theme, toggle } = useAtTheme();
  const dispatch = useDispatch();
  const { userPersonalizationData: p } = useSelector((state: any) => state.personalization);

  // Same personalization source as the login page (logo / brand colour).
  useEffect(() => {
    if (p) return;
    const userId = localStorage.getItem("userId");
    getAll({ url: userId == null ? GET_SUPERADMIN_PERSONALIZATION : `${GET_COMPANY_PERSONALIZATION}/${userId}` })
      .then((res: any) => dispatch(setUserPersonalizationData(res?.success ? res.data : null)))
      .catch(() => dispatch(setUserPersonalizationData(null)));
  }, [dispatch, p]);

  const logoUrl = p?.accountLogo?.url ? `${IMAGE_BASE_URL}/${p.accountLogo.url}` : "";
  // Fall back to the Autotel mark if the uploaded logo is missing or broken.
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = logoUrl && !logoFailed ? logoUrl : "";

  return (
    <div className="al-page">
      <section className="al-hero">
        <LoginMap theme={theme} />
        <div className="al-hero__top">
          <span className="al-live">
            <i /> LIVE
          </span>
        </div>
      </section>

      <main className="al-side">
        <button
          type="button"
          className="al-theme"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          )}
        </button>
        <div className="al-side__inner">
          <div className="al-brand">
            {logo ? <img src={logo} alt="" className="al-brand__logo" onError={() => setLogoFailed(true)} /> : <span className="al-brand__mark">A</span>}
            {!logo && <span className="al-brand__name">Autotel</span>}
          </div>
          {step && <p className="al-step">{step}</p>}
          {children}
          <p className="al-back">
            <Link className="al-link" to={`${process.env.PUBLIC_URL}/login`}>
              ← Back to sign in
            </Link>
          </p>
          <p className="al-foot">© {new Date().getFullYear()} Autotel · Live vehicle tracking</p>
        </div>
      </main>
    </div>
  );
};

export default AuthShell;
