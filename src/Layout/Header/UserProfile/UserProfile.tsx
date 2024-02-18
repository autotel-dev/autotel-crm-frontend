import { useEffect, useState } from "react";
import { Image, LI, P } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { Admin, HelenWalter } from "../../../utils/Constant";
import ProfileBox from "./ProfileBox";
import { useSelector } from "react-redux";
import { decode } from "jwt-js-decode";
import { jwtDecode } from "jwt-decode";
import { decryptData } from "../../../Api/encryption";

const UserProfile = () => {
  const { token } = useSelector((state: any) => state.user);
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      console.log(decodedToken);
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

  return (
    <>
      {decodedToken !== null && (
        <LI className="profile-nav onhover-dropdown pe-0 py-0">
          <div className="d-flex align-items-center profile-media">
            <Image
              className="b-r-25"
              src={dynamicImage("dashboard/profile.png")}
              alt=""
            />
            <div className="flex-grow-1 user">
              <span>{decodedToken.fullName}</span>
              <P className="mb-0 font-nunito">
                {toPascalCase(decodedToken.role)} &nbsp;
                <i className="middle fa fa-angle-down"></i>
              </P>
            </div>
          </div>
          <ProfileBox />
        </LI>
      )}
    </>
  );
};

export default UserProfile;
