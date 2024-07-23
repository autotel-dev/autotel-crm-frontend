import React from "react";
import { Link } from "react-router-dom";
import { Image } from "../../AbstractElements";
import { dynamicImage } from "../../Service";
import Logoo from "../../assets/Logo.png";
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL } from "../../Api";
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
            ? `${IMAGE_BASE_URL}/${userPersonalizationData.accountLogo.url}`
            : Logoo
        }
        alt=""
        width={60}
        height={45}
      />
    </div>
  );
};

export default Logo;
