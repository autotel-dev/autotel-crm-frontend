import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Image, LI, P } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { Admin, HelenWalter } from "../../../utils/Constant";
import ProfileBox from "./ProfileBox";
import { useSelector } from "react-redux";
import { decode } from "jwt-js-decode";
import { jwtDecode } from "jwt-decode";
import Logo from "../../../assets/Logo.png";

const UserProfile = () => {
  const { userData, token } = useSelector((state: any) => state.user);
  // const [name, setName] = useState<string>(userData.fullName);
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);
  function toPascalCase(str: any) {
    // Convert string to lowercase and split into words
    const words = str.toLowerCase().split("_");

    // Capitalize the first letter of each word
    const pascalCaseWords = words.map(
      (word: any) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    // Join the words back together
    return pascalCaseWords.join(" ");
  }

  // The template only opens this menu on mouse hover, so on phones (no hover)
  // there was no way to reach Account / Settings / Log Out. Tap or click
  // toggles it too; it closes on an outside tap, Escape or page change.
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {decodedToken !== null && (
        <div ref={wrapRef} className={`profile-nav onhover-dropdown pe-0 py-0${open ? " is-open" : ""}`}>
          <div
            className="d-flex align-items-center profile-media"
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
            onClick={() => setOpen((o) => !o)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); } }}
          >
            {/* <div
              className="logo-wrapper"
              style={{ height: "50px !important", width: "50px !important", padding: "0px 15px" }}
            >
              <Image className="b-r-25" src={Logo} alt="" />
              
            </div> */}

            <div className="flex-grow-1 user" style={{ margin: "0px 15px" }}>
              <span style={{ fontWeight: "bold" }}>
                {/* {decodedToken.fullName} */}
                {userData !== null ? userData?.fullName : decodedToken.fullName}
              </span>
              <P className="mb-0 font-nunito">
                {toPascalCase(decodedToken.role)} &nbsp;
                <i className="middle fa fa-angle-down"></i>
              </P>
            </div>
          </div>
          <ProfileBox />
        </div>
      )}
    </>
  );
};

export default UserProfile;
