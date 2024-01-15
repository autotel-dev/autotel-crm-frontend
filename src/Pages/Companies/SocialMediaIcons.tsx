import { Link } from "react-router-dom";
import { LI, UL } from "../../AbstractElements";
import { tourProfileData } from "../../Data/Apps/User/UsersProfileData";
import { SocialMediaIconsPropsTypes } from "../../Types/Apps/User/UserProfile";
import { socialMediaIconsData } from "./Data/SocialMediaIconsData";

const SocialMediaIcons = ({ listClassName }: SocialMediaIconsPropsTypes) => {
  return (
    <UL
      className={`justify-content-center ${
        listClassName ? listClassName : ""
      } simple-list flex-row`}
      style={{ marginTop: "5px" }}
    >
      {socialMediaIconsData.map((data, index) => (
        <LI key={index}>
          <Link to={data.link}>
            <i
              className={`${data.icon} me-0`}
              style={{ fontSize: "20px", marginBottom: "0px" }}
            ></i>
          </Link>
        </LI>
      ))}
    </UL>
  );
};

export default SocialMediaIcons;
