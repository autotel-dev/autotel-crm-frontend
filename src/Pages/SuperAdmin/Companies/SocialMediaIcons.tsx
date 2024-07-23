import { Link } from "react-router-dom";
import { LI, UL } from "../../../AbstractElements";
import { tourProfileData } from "../../../Data/Apps/User/UsersProfileData";
import { SocialMediaIconsPropsTypes } from "../../../Types/Apps/User/UserProfile";
import { socialMediaIconsData } from "./Data/SocialMediaIconsData";
import { CardType } from "./DataType/CompaniesDataType";
import { MdOutlineEmail } from "react-icons/md";
import { useSelector } from "react-redux";

const SocialMediaIcons = ({ item }: any) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const redirectToWhatsAppWeb = (whatsAppNumber: any) => {
    const initialMessage = "Hello Dear";

    // Construct the WhatsApp Web URL with the phone number and initial message
    const whatsappWebUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
      initialMessage
    )}`;

    // Open WhatsApp Web in a new tab or window
    window.open(whatsappWebUrl, "_blank");
  };
  const redirectToPhoneCall = (phoneNumber: any) => {
    // Construct the WhatsApp Web URL with the phone number and initial message
    window.location.href = `tel:${phoneNumber}`;
  };
  const redirectTomailWeb = (emailAddress: any) => {
    const initialMessage = "Hello Dear";

    // Construct the mailto URL with the email address and initial message
    const mailtoUrl = `mailto:${emailAddress}?subject=Subject&body=${encodeURIComponent(
      initialMessage
    )}`;

    // Open the email client in a new tab or window
    window.open(mailtoUrl, "_blank");
  };
  return (
    <UL
      className={`justify-content-center ${
        "card-social" ? "card-social" : ""
      } simple-list flex-row`}
      style={{ marginTop: "5px" }}
    >
      <li
        onClick={() => redirectToWhatsAppWeb(item.phoneNo)}
        style={{ cursor: "pointer" }}
      >
        <i
          className="fa fa-whatsapp me-0 txt-primary"
          // className={`fa fa-whatsapp me-0 ${
          //   userPersonalizationData &&
          //   userPersonalizationData?.primaryColor !== null
          //     ? ""
          //     : "txt-primary"
          // }`}
          style={{
            fontSize: "22px",
            marginBottom: "0px",
            // color: `${
            //   userPersonalizationData && userPersonalizationData?.primaryColor
            //     ? userPersonalizationData?.primaryColor
            //     : "#35bfbf"
            // }`,
          }}
        ></i>
      </li>

      <li
        onClick={() => redirectTomailWeb(item.emailAddress)}
        style={{ cursor: "pointer" }}
      >
        <MdOutlineEmail
          className="me-0 txt-primary"
          // className={`me-0 ${
          //   userPersonalizationData &&
          //   userPersonalizationData?.primaryColor !== null
          //     ? ""
          //     : "txt-primary"
          // }`}
          style={{
            fontSize: "25px",
            marginBottom: "0px",
            // color: `${
            //   userPersonalizationData && userPersonalizationData?.primaryColor
            //     ? userPersonalizationData?.primaryColor
            //     : "#35bfbf"
            // }`,
          }}
        />
      </li>
      <li
        onClick={() => redirectToPhoneCall(item.phoneNo)}
        style={{ cursor: "pointer" }}
      >
        <i
          className="fa fa-mobile me-0 txt-primary"
          // className={`fa fa-mobile me-0 ${
          //   userPersonalizationData &&
          //   userPersonalizationData?.primaryColor !== null
          //     ? ""
          //     : "txt-primary"
          // }`}
          style={{
            fontSize: "22px",
            marginBottom: "0px",
            // color: `${
            //   userPersonalizationData && userPersonalizationData?.primaryColor
            //     ? userPersonalizationData?.primaryColor
            //     : "#35bfbf"
            // }`,
          }}
        ></i>
      </li>
    </UL>
  );
};

export default SocialMediaIcons;
