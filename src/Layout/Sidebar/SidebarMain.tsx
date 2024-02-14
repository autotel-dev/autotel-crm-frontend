import { LI, UL } from "../../AbstractElements";
import { Href } from "../../utils/Constant";
import SimpleBar from "simplebar-react";
import SidebarBack from "./SidebarBack";
import MenuList from "./MenuList";
import { Link } from "react-router-dom";
import SVG from "../../utils/CommonSvgIcon/SVG";
import {
  SidebarMenu,
  CompanySidebarMenu,
} from "../../Data/Layout/Sidebar/Menu";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarMenuTypes } from "../../Data/Layout/Sidebar/SidebarTypes";
import { useAppSelector } from "../../ReaduxToolkit/Hooks";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
export interface PropsTypes {
  setOpen: (item: boolean) => void;
  open?: boolean;
}
const SidebarMain = ({ setOpen, open }: PropsTypes) => {
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<string[]>([]);
  const [sideMenu, setSideMenu] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isClose, setIsClose] = useState(false);
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const handleClick = (item: SidebarMenuTypes) => {
    if (layout === "material-icon") {
      let menu: string = sideMenu;
      menu = sideMenu !== item.title ? item.title : "";
      let clas: string = isActive;
      // clas = sideMenu !== item.title ? "active" : "";
      // setIsActive("active");
      setSideMenu(menu);
      setOpen(menu !== "" ? true : false);
      // setIsClose(false);
    }
  };

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
  return (
    <nav className="sidebar-main">
      {decodedToken !== null && (
        <div id="sidebar-menu">
          <UL className="sidebar-links simple-list" id="simple-bar">
            <SimpleBar className="w-100 simplebar-scrollable-y h-100">
              <SidebarBack />
              {decodedToken.role == "SUPER_ADMIN"
                ? SidebarMenu.map((data, index) => (
                    <LI className={`sidebar-list`} key={index}>
                      <Link
                        className={`sidebar-link sidebar-title ${
                          sideMenu === data.title ? "active" : ""
                        }`}
                        to={data.link ? data.link : "#"}
                        onClick={() => handleClick(data)}
                      >
                        <SVG
                          className={`${sidebarIconType}-icon`}
                          iconId={`${
                            sidebarIconType === "fill" ? "fill-" : ""
                          }${data.svgIcon}`}
                        />
                        <span>{t(data.title)}</span>
                      </Link>
                      {data.link ? (
                        <div></div>
                      ) : (
                        !isClose && (
                          <UL
                            className="sidebar-submenu custom-scrollbar simple-list"
                            // style={{
                            //   display: `${
                            //     layout === "material-icon"
                            //       ? data.title === sideMenu && !data.link
                            //         ? "none"
                            //         : "none"
                            //       : ""
                            //   }`,
                            // }}

                            style={{
                              display: `${
                                data.title === sideMenu && !data.link
                                  ? "none"
                                  : "none"
                              }`,
                            }}
                          >
                            {!data.link && (
                              <MenuList
                                subMenuData={data}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                level={0}
                                isClose={isClose}
                                setIsClose={setIsClose}
                              />
                            )}
                          </UL>
                        )
                      )}
                    </LI>
                  ))
                : CompanySidebarMenu.map((data, index) => (
                    <LI className={`sidebar-list`} key={index}>
                      <Link
                        className={`sidebar-link sidebar-title ${
                          sideMenu === data.title ? "active" : ""
                        }`}
                        to={data.link ? data.link : "#"}
                        onClick={() => handleClick(data)}
                      >
                        <SVG
                          className={`${sidebarIconType}-icon`}
                          iconId={`${
                            sidebarIconType === "fill" ? "fill-" : ""
                          }${data.svgIcon}`}
                        />
                        <span>{t(data.title)}</span>
                      </Link>
                      {data.link ? (
                        <div></div>
                      ) : (
                        !isClose && (
                          <UL
                            className="sidebar-submenu custom-scrollbar simple-list"
                            style={{
                              display: `${
                                data.title === sideMenu && !data.link
                                  ? "block"
                                  : "block"
                              }`,
                            }}
                          >
                            {!data.link && (
                              <MenuList
                                subMenuData={data}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                level={0}
                                isClose={isClose}
                                setIsClose={setIsClose}
                              />
                            )}
                          </UL>
                        )
                      )}
                    </LI>
                  ))}
            </SimpleBar>
          </UL>
        </div>
      )}
    </nav>
  );
};

export default SidebarMain;
