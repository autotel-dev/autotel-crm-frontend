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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarMenuTypes } from "../../Data/Layout/Sidebar/SidebarTypes";
import { useAppSelector } from "../../ReaduxToolkit/Hooks";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getUserRole } from "../../Api/globals";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";


export interface PropsTypes {
  setOpen: (item: boolean) => void;
  open?: boolean;
}
const SidebarMain = ({ setOpen, open }: PropsTypes) => {
  const { crmActiveModules } = useSelector((state: any) => state.crmModules);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var user = userPermissions.find((item: any) => item.title === "User");
  // console.log("user", user);
  var support = userPermissions.find((item: any) => item.title === "Support");
  // console.log("support", support);

  // console.log("userPermissions:", userPermissions);
  // // // console.log("getUserRole()", getUserRole());

  // // // console.log("crmActiveModules", crmActiveModules);

  const SidebarMenuComponent: SidebarMenuTypes[] = [
    {
      title: "Dashboard",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/dashboard`,
    },
    {
      title: "Setup",
      svgIcon: "home",
      subMenu: [
        {
          svgIcon: "bonus-kit",
          title: "Country",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/countries`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Province",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/province`,
        },
        {
          svgIcon: "bonus-kit",
          title: "City",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/cities`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Package",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/package`,
        },
        {
          svgIcon: "bonus-kit",
          title: "CRM Modules",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/crm-module`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Complain types",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/complain-types`,
        },

        {
          svgIcon: "bonus-kit",
          title: "Email Templates",
          link: `${process.env.PUBLIC_URL}/dashboards/crmdashboard`,
        },
        {
          svgIcon: "bonus-kit",
          title: "WhatsApp templates",
          link: `${process.env.PUBLIC_URL}/dashboards/crmdashboard`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Server Details",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/server-details`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Server Management",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/server-management`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Email Gateway",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/email-gateway`,
        },
        // {
        //   svgIcon: "bonus-kit",
        //   title: "SMS Gateway",
        //   link: `${process.env.PUBLIC_URL}/super-admin/setup/sms-gateway`,
        // },
        {
          svgIcon: "bonus-kit",
          title: "WhatsApp Gateway",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/whatsapp-gateway`,
        },
      ],
    },
    // {
    //   title: "Modules",
    //   svgIcon: "home",
    //   subMenu: [
    //     {
    //       svgIcon: "bonus-kit",
    //       title: "Monitoring",
    //       link: `${process.env.PUBLIC_URL}/dashboards/shoppingplace`,
    //     },
    //     {
    //       svgIcon: "bonus-kit",
    //       title: "Control Room",
    //       link: `${process.env.PUBLIC_URL}/dashboards/shoppingplace`,
    //     },
    //   ],
    // },
    {
      title: "Modules",
      svgIcon: "home",
      subMenu: crmActiveModules.map((item: any, index: any) => {
        return {
          svgIcon: "bonus-kit",
          title: `${item.name}`,
          link: `${process.env.PUBLIC_URL}/dashboard`,
        };
      }),
    },

    {
      title: "Companies",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/super-admin/companies`,
    },
    {
      title: "Support",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/support`,
    },
    // {
    //   title: "Tasks",
    //   svgIcon: "home",
    //   link: `${process.env.PUBLIC_URL}/super-admin/tasks`,
    // },
  ];

  const CompanySidebarMenuComponent: SidebarMenuTypes[] = [
    {
      title: "Dashboard",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/dashboard`,
    },
    {
      title: "Setup",
      svgIcon: "home",
      subMenu: [
        {
          svgIcon: "bonus-kit",
          title: "Roles",
          link: `${process.env.PUBLIC_URL}/company/setup/roles`,
        },
        {
          svgIcon: "bonus-kit",
          title: "Email Templates",
          link: `${process.env.PUBLIC_URL}/company/setup/emailTemplates`,
        },
        {
          svgIcon: "bonus-kit",
          title: "WhatsApp templates",
          link: `${process.env.PUBLIC_URL}/company/setup/whatsappTemplates`,
        },
      ],
    },
    // {
    //   title: "Modules",
    //   svgIcon: "home",
    //   subMenu: [
    //     {
    //       svgIcon: "bonus-kit",
    //       title: "Monitoring",
    //       link: `${process.env.PUBLIC_URL}/company/modules/monitoring`,
    //     },
    //     {
    //       svgIcon: "bonus-kit",
    //       title: "Control Room",
    //       link: `${process.env.PUBLIC_URL}/company/modules/controlRoom`,
    //     },
    //   ],
    // },

    {
      title: "Modules",
      svgIcon: "home",
      subMenu: crmActiveModules.map((item: any, index: any) => {
        return {
          svgIcon: "bonus-kit",
          title: `${item.name}`,
          link: `${process.env.PUBLIC_URL}/company/modules${item.route}`,
        };
      }),
    },

    {
      title: "User",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/company/users`,
    },
    {
      title: "Support",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/support`,
    },
    // {
    //   title: "Tasks",
    //   svgIcon: "task",
    //   link: `${process.env.PUBLIC_URL}/company/tasks`,
    // },
    {
      title: "Reports",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/company/reports`,
    },
  ];

  const OperatorSidebarMenuComponent: SidebarMenuTypes[] = [
    {
      title: "Dashboard",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/dashboard`,
    },

    {
      title: "Modules",
      svgIcon: "home",
      subMenu: crmActiveModules.map((item: any, index: any) => {
        return {
          svgIcon: "bonus-kit",
          title: `${item.name}`,
          link: `${process.env.PUBLIC_URL}/operator/modules${item.route}`,
        };
      }),
    },

    // {
    //   title: "Users",
    //   svgIcon: "user",
    //   link: `${process.env.PUBLIC_URL}/company/users`,
    // },
    {
      title: "Support",
      svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/support`,
    },
  ];

  var filteredCompanyMenu = CompanySidebarMenuComponent.filter(
    (item, index) => {
      if (user == undefined && index === 3) {
        return false;
      } else if (support == undefined && index === 4) {
        return false;
      } else if (user !== undefined && item.title === user.title) {
        return user.read;
      } else if (support !== undefined && item.title === support.title) {
        return support.read;
      } else {
        return true;
      }
    }
  );
  var filteredOperatorMenu = OperatorSidebarMenuComponent.filter(
    (item, index) => {
      if (support == undefined && index === 2) {
        return false;
      } else if (user !== undefined && item.title === user.title) {
        return user.read;
      } else if (support !== undefined && item.title === support.title) {
        return support.read;
      } else {
        return true;
      }
    }
  );
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<string[]>([]);
  const [sideMenu, setSideMenu] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isClose, setIsClose] = useState(false);
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
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
      // // // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  return (
    <nav className="sidebar-main">
      {decodedToken !== null && (
        <div
          id="sidebar-menu"
          style={{
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData?.secondaryColor !== null
              ? userPersonalizationData?.secondaryColor
              : ""
              }`,
          }}
        >
          <UL className="sidebar-links simple-list" id="simple-bar">
            <SimpleBar className="w-100 simplebar-scrollable-y h-100">
              <SidebarBack />
              {decodedToken.role === "SUPER_ADMIN"
                ? SidebarMenuComponent.map((data, index) => (
                  <LI className={`sidebar-list`} key={index}>
                    <Link
                      className={`sidebar-link sidebar-title ${sideMenu === data.title ? "active" : ""
                        }`}
                      // style={{
                      //   color: `${
                      //     userPersonalizationData !== null &&
                      //     userPersonalizationData?.buttonsAndBarsColor !== null &&
                      //     sideMenu === data.title &&
                      //     userPersonalizationData?.buttonsAndBarsColor
                      //   }`,
                      // }}
                      to={data.link ? data.link : "#"}
                      onClick={() => handleClick(data)}
                    >
                      <SVG
                        className={`${sidebarIconType}-icon`}
                        iconId={`${sidebarIconType === "fill" ? "fill-" : ""
                          }${data.svgIcon}`}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                        }}
                      >
                        {t(data.title)}
                      </span>
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
                            display: `${data.title === sideMenu && !data.link
                              ? "block"
                              : "block"
                              }`,
                          }}
                        >
                          {!data.link && (
                            <div>
                              <MenuList
                                subMenuData={data}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                level={0}
                                isClose={isClose}
                                setIsClose={setIsClose}
                                menuRef={menuRef}
                                showArrow={showArrow}
                                setShowArrow={setShowArrow}
                              />
                              {/* {
                                (data.title == "Setup" && getUserRole() == "SUPER_ADMIN") && !showArrow ? <IoMdArrowDropdown style={{
                                  marginBottom: "-8px",
                                  marginTop: "5px",
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "100%",
                                  fontSize: "20px",
                                  height: "20px"
                                }} /> : data.title == "Setup" && getUserRole() == "SUPER_ADMIN" && <IoMdArrowDropup style={{
                                  marginBottom: "-8px",
                                  marginTop: "5px",
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "100%",
                                  fontSize: "20px",
                                  height: "20px"
                                }} />
                              } */}
                            </div>
                          )}
                        </UL>
                      )
                    )}
                  </LI>
                ))
                : decodedToken.role === "OPERATOR"
                  ? filteredOperatorMenu !== undefined &&
                  filteredOperatorMenu?.map((data: any, index: any) => (
                    <LI className={`sidebar-list`} key={index}>
                      <Link
                        className={`sidebar-link sidebar-title ${sideMenu === data.title ? "active" : ""
                          }`}
                        to={data.link ? data.link : "#"}
                        onClick={() => handleClick(data)}
                      >
                        <SVG
                          className={`${sidebarIconType}-icon`}
                          iconId={`${sidebarIconType === "fill" ? "fill-" : ""
                            }${data.svgIcon}`}
                        />
                        <span style={{ fontSize: "13px" }}>
                          {t(data.title)}
                        </span>
                      </Link>
                      {data.link ? (
                        <div></div>
                      ) : (
                        !isClose && (
                          <UL
                            className="sidebar-submenu custom-scrollbar simple-list"
                            style={{
                              display: `${data.title === sideMenu && !data.link
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
                  ))
                  : filteredCompanyMenu !== undefined &&
                  filteredCompanyMenu.map((data: any, index: any) => (
                    <LI className={`sidebar-list`} key={index}>
                      <Link
                        className={`sidebar-link sidebar-title ${sideMenu === data.title ? "active" : ""
                          }`}
                        to={data.link ? data.link : "#"}
                        onClick={() => handleClick(data)}
                      >
                        <SVG
                          className={`${sidebarIconType}-icon`}
                          iconId={`${sidebarIconType === "fill" ? "fill-" : ""
                            }${data.svgIcon}`}
                        />
                        <span style={{ fontSize: "13px" }}>
                          {t(data.title)}
                        </span>
                      </Link>
                      {data.link ? (
                        <div></div>
                      ) : (
                        !isClose && (
                          <UL
                            className="sidebar-submenu custom-scrollbar simple-list"
                            style={{
                              display: `${data.title === sideMenu && !data.link
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
