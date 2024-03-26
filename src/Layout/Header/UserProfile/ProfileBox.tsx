import { Link, useNavigate } from "react-router-dom";
import { LI, UL } from "../../../AbstractElements";
import { profilesMessage } from "../../../Data/Layout/Header/ProfilesData";
import FeatherIcons from "../../../utils/CommonSvgIcon/FeatherIcons";
import { getUserId, getUserRole } from "../../../Api/globals";
import { useSelector } from "react-redux";
import { ROLES } from "../../../constants/roles";

const ProfileBox = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var profile = userPermissions.find((item: any) => item.title === "Profile");
  var profileMenu = profilesMessage.filter((item, index) => {
    if (profile == undefined && index == 0 && getUserRole() !== ROLES.SUPER_ADMIN) {
      return false;
    } else if (profile !== undefined && item.name === "Account") {
      return profile.read;
    } else if (item.name == "Settings") {
      return getUserRole() == "OPERATOR" ? false : true;
    } else {
      return true;
    }
  });

  // // console.log("profile", profile);
  const navigate = useNavigate();
  const handleClick = (name: string) => {
    if (name === "Log Out") {
      if (getUserRole() == "SUPER_ADMIN") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate(`${process.env.PUBLIC_URL}/login`);
      } else {
        localStorage.removeItem("token");
        navigate(
          `${process.env.PUBLIC_URL}/login/${localStorage.getItem("userId")}`
        );
      }
      // if (getUserRole() == "COMPANY") {
      //   // // console.log("Company");

      //   setTimeout(() => {
      //     localStorage.removeItem("token");
      //     localStorage.setItem("userId", getUserId());
      //   }, 1500);
      //   setTimeout(() => {
      //     navigate(`${process.env.PUBLIC_URL}/login/${getUserId()}`);
      //   }, 2000);
      // } else {
      //   // // console.log("SuperAdmin");
      //   setTimeout(() => {
      //     localStorage.removeItem("token");
      //     localStorage.setItem("userId", "");
      //   }, 1500);
      //   setTimeout(() => {
      //     navigate(`${process.env.PUBLIC_URL}/login/:id`);
      //   }, 1500);
      // }
    }
  };
  return (
    <UL className="profile-dropdown onhover-show-div">
      {profileMenu.map((data, index) => (
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
