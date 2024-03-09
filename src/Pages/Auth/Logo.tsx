import React from "react";
import { Link } from "react-router-dom";
import { Image } from "../../AbstractElements";
import { dynamicImage } from "../../Service";
import Logoo from "../../assets/Logo.png";
import { useSelector } from "react-redux";
interface PropsType {
  alignLogo?: string;
}
const Logo = ({ alignLogo }: PropsType) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  return (
    <div
      className={`logo ${alignLogo ? alignLogo : ""} `}
      // to={`${process.env.PUBLIC_URL}/dashboards/shoppingplace`}
    >
      {/* <Image
        className="img-fluid for-light"
        src={dynamicImage("logo/logo-1.png")}
        alt="looginpage"
      />
      <Image
        className="img-fluid for-dark"
        src={dynamicImage("logo/logo-3.png")}
        alt="looginpage" */}

      {/* /> */}

      <img
        src={
          userPersonalizationData !== null
            ? `http://124.29.238.127:8080/${userPersonalizationData.logoImage.url}`
            : Logoo
        }
        alt=""
        width={65}
        height={50}
      />
    </div>
  );
};

export default Logo;
