import { Link, useNavigate } from "react-router-dom";
import { LI, UL } from "../../../AbstractElements";
import { profilesMessage } from "../../../Data/Layout/Header/ProfilesData";
import FeatherIcons from "../../../utils/CommonSvgIcon/FeatherIcons";
import { getUserId, getUserRole } from "../../../Api/globals";

const ProfileBox = () => {
  const navigate = useNavigate();
  const handleClick = (name: string) => {
    if (name === "Log Out") {
      if (getUserRole() == "COMPANY") {
        console.log("Company");

        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.setItem("userId", getUserId());
        }, 1500);
        setTimeout(() => {
          navigate(`${process.env.PUBLIC_URL}/login/${getUserId()}`);
        }, 2000);
      } else {
        console.log("SuperAdmin");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.setItem("userId", "");
        }, 1500);
        setTimeout(() => {
          navigate(`${process.env.PUBLIC_URL}/login/:id`);
        }, 1500);
      }
    }
  };
  return (
    <UL className="profile-dropdown onhover-show-div">
      {profilesMessage.map((data, index) => (
        <LI key={index}>
          <Link to={data.link} onClick={() => handleClick(data.name)}>
            <FeatherIcons iconName={data.icon} />
            <span>{data.name} </span>
          </Link>
        </LI>
      ))}
    </UL>
  );
};

export default ProfileBox;
