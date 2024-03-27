import { useEffect, useState } from "react";
import { H5, UL } from "../../../AbstractElements";
import Bookmark from "../Bookmark/Bookmark";
import Cart from "../Cart/Cart";
import DarkMode from "../DarkMode/DarkMode";
import Language from "../Language/Language";
import Message from "../Message/Message";
import Notifications from "../Notifications/Notifications";
import SearchInput from "../SearchInput/SearchInput";
import UserProfile from "../UserProfile/UserProfile";
import { useSelector } from "react-redux";

const RightHeader = () => {
  const { userData } = useSelector((state: any) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const displaytimeZone = (timezone: string) => {
    const options = { timeZone: timezone };
    return currentTime.toLocaleString("en-US", options);
  };
  return (
    <div className="nav-right col-auto pull-right right-header p-0 ms-auto">
      <UL className="nav-menus flex-row simple-list">
        {/* <SearchInput /> */}
        <div
          style={{ paddingRight: "10px", borderRight: "1px solid lightGray" }}
        >
          <H5>{displaytimeZone(userData?.timezone)}</H5>
        </div>
        <Notifications />
        {/* <Bookmark /> */}
        {/* <Message /> */}
        {/* <Cart /> */}
        {/* <DarkMode /> */}
        {/* <Language /> */}

        <UserProfile />
      </UL>
    </div>
  );
};

export default RightHeader;
