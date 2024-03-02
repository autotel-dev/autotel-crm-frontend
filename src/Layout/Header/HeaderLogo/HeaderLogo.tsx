import { Link } from "react-router-dom";
import { dynamicImage } from "../../../Service";
import { Image } from "../../../AbstractElements";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setToggleSidebar } from "../../../ReaduxToolkit/Reducer/LayoutSlice";
import Logo from "../../../assets/Logo.png";
import { useSelector } from "react-redux";

const HeaderLogo = () => {
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useAppSelector((state) => state.layout);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  return (
    <>
      <div className="logo-wrapper">
        <Link to={`${process.env.PUBLIC_URL}/dashboards/shoppingplace`}>
          <img
            src={
              userPersonalizationData !== null
                ? `http://124.29.238.127:8080/${userPersonalizationData.logoImage.url}`
                : Logo
            }
            alt=""
            width={60}
            height={40}
          />
          {/* <Image
            className="img-fluid"
            src={dynamicImage("logo/logo.png")}
            alt=""
          /> */}
        </Link>
      </div>
      <SVG
        iconId={"Grid"}
        className={"stroke-icon toggle-sidebar"}
        onClick={() => {
          dispatch(setToggleSidebar(!toggleSidebar));
        }}
      />
    </>
  );
};

export default HeaderLogo;
