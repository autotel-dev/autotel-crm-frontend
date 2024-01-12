import { Link, useNavigate } from "react-router-dom";
import { LI, UL } from "../../../AbstractElements";
import { profilesMessage } from "../../../Data/Layout/Header/ProfilesData";
import FeatherIcons from "../../../utils/CommonSvgIcon/FeatherIcons";


const ProfileBox = () => {
  const navigate = useNavigate()
  const handleClick = (name:string)=>{
    if(name === "Log Out"){
      localStorage.removeItem("token")
      navigate(`${process.env.PUBLIC_URL}/login`)
    }
  }
  return (
    <UL className="profile-dropdown onhover-show-div">
      {profilesMessage.map((data,index) => (
        <LI key={index}>
          <Link to={data.link} onClick={()=>handleClick(data.name)}>
            <FeatherIcons iconName={data.icon} />
            <span>{data.name} </span>
          </Link>
        </LI>
      ))}
    </UL>
  );
};

export default ProfileBox;
