import { LI, UL } from "../../AbstractElements";
import { Href } from "../../utils/Constant";
import SimpleBar from "simplebar-react";
import SidebarBack from "./SidebarBack";
import MenuList from "./MenuList";
import { Link } from "react-router-dom";
import SVG from "../../utils/CommonSvgIcon/SVG";
import DashboardIcon from "../../assets/dashboard (1).png";
import SetupIcon from "../../assets/management-service.png";
import ModuleIcon from "../../assets/cube.png";
import CompaniesIcon from "../../assets/enterprise.png";
import SupportIcon from "../../assets/headphones.png";
import CountryIcon from "../../assets/countries.png";
import ProvinceIcon from "../../assets/map.png";
import CityIcon from "../../assets/cityscape.png";
import PackageIcon from "../../assets/box.png";
import CrmmoduleIcon from "../../assets/crm.png";
import ServerdetailsIcon from "../../assets/database-storage.png";
import ServermangementIcon from "../../assets/cloud-computing.png";
import EmailgatewayIcon from "../../assets/inbox.png";
import WhatsappGatewayIcon from "../../assets/whatsapp.png";
import EmailtemplateIcon from "../../assets/email.png";
import WhatsapptemplateIcon from "../../assets/message.png";
import ComplaintypeIcon from "../../assets/compliance.png";
import ComplaincenterIcon from "../../assets/center.png";
import UserIcon from "../../assets/user.png";
import ReportsIcon from "../../assets/report.png";
import DepartmentIcon from "../../assets/department.png";
import MonitorIcon from "../../assets/gps.png";
import ControlroomIcon from "../../assets/security-room.png";
import GeofenceIcon from "../../assets/route.png";
import SalesIcon from "../../assets/sales.png";
import BankIcon from "../../assets/bank.png";
import InsuranceIcon from "../../assets/insurance.png";
import VehicleMakeIcon from "../../assets/car.png";
import VehicleModelIcon from "../../assets/vehicle-inspection.png";
import NetworkProviderIcon from "../../assets/cloud.png";
import PackIcon from "../../assets/boxes.png";
import GrouppIcon from "../../assets/group (2).png";
import WarehouseIcon from "../../assets/warehouse.png";
import BranchIcon from "../../assets/network.png";
import CurrencyIcon from "../../assets/cash.png";
import LanguageIcon from "../../assets/language.png";

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
import { getUserRole } from "../../Utilities/globals/globals";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { ROLES } from "../../constants/roles";
import RightHeader from "../Header/RightHeader/RightHeader";
import { Row } from "reactstrap";
import Header from "../Header";
import { Flex } from "antd";

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
      // svgIcon: "home",
      svgIcon: `${DashboardIcon}`,
      link: `${process.env.PUBLIC_URL}/dashboard`,
    },
    {
      title: "Setup",
      // svgIcon: "home",
      svgIcon: `${SetupIcon}`,
      subMenu: [
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${CountryIcon}`,
          title: "Country",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/countries`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${ProvinceIcon}`,
          title: "Province",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/province`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${CityIcon}`,
          title: "City",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/cities`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${PackageIcon}`,
          title: "Package",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/package`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${CrmmoduleIcon}`,
          title: "CRM Modules",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/crm-module`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${BankIcon}`,
          title: "Banks",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/banks`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${CurrencyIcon}`,
          title: "Currencies",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/currencies`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${LanguageIcon}`,
          title: "Languages",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/languages`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${InsuranceIcon}`,
          title: "Insurance",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/insurance`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${VehicleMakeIcon}`,
          title: "Vehicle Make",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/vehicle-make`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${VehicleModelIcon}`,
          title: "Vehicle Model",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/vehicle-model`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${NetworkProviderIcon}`,
          title: "Network Provider",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/network-provider`,
        },

        {
          // svgIcon: "bonus-kit",
          svgIcon: `${ComplaintypeIcon}`,
          title: "Complain Types",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/complain-types`,
        },

        {
          // svgIcon: "bonus-kit",
          svgIcon: `${ServerdetailsIcon}`,
          title: "Server Details",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/server-details`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${ServermangementIcon}`,
          title: "Server Management",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/server-management`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${EmailgatewayIcon}`,
          title: "Email Gateway",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/email-gateway`,
        },
        // {
        //   svgIcon: "bonus-kit",
        //   title: "SMS Gateway",
        //   link: `${process.env.PUBLIC_URL}/super-admin/setup/sms-gateway`,
        // },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${WhatsappGatewayIcon}`,
          title: "WhatsApp Gateway",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/whatsapp-gateway`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${EmailtemplateIcon}`,
          title: "Email Templates",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/email-template`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${WhatsapptemplateIcon}`,
          title: "WhatsApp Templates",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/whatsapp-template`,
        },
        {
          svgIcon: `${GeofenceIcon}`,
          title: "Geofence",
          link: `${process.env.PUBLIC_URL}/super-admin/setup/geofence`,
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
      // svgIcon: "home",
      svgIcon: `${ModuleIcon}`,

      subMenu: crmActiveModules.map((item: any, index: any) => {
        return {
          // svgIcon: "bonus-kit",
          svgIcon: `${
            item.route === "/control-room"
              ? ControlroomIcon
              : item.route === "/monitoring"
              ? MonitorIcon
              : item.route === "/complaint-center"
              ? ComplaincenterIcon
              : SalesIcon
          }`, // Replace DefaultIcon with the default icon you want to use
          title: `${item.name}`,
          link: `${process.env.PUBLIC_URL}/dashboard`,
        };
      }),
    },

    {
      title: "Companies",
      // svgIcon: "home",
      svgIcon: `${CompaniesIcon}`,
      link: `${process.env.PUBLIC_URL}/super-admin/companies`,
    },
    {
      title: "Support",
      // svgIcon: "home",
      svgIcon: `${SupportIcon}`,
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
      // svgIcon: "home",
      svgIcon: `${DashboardIcon}`,
      link: `${process.env.PUBLIC_URL}/dashboard`,
    },
    {
      title: "Setup",
      // svgIcon: "home",
      svgIcon: `${SetupIcon}`,
      subMenu: [
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${DepartmentIcon}`,
          title: "Departments",
          link: `${process.env.PUBLIC_URL}/company/setup/deparments`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${PackIcon}`,
          title: "Packages",
          link: `${process.env.PUBLIC_URL}/company/setup/packages`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${GrouppIcon}`,
          title: "Groups",
          link: `${process.env.PUBLIC_URL}/company/setup/groups`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${WarehouseIcon}`,
          title: "Warehouses",
          link: `${process.env.PUBLIC_URL}/company/setup/warehouses`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${BranchIcon}`,
          title: "Branches",
          link: `${process.env.PUBLIC_URL}/company/setup/branches`,
        },

        {
          // svgIcon: "bonus-kit",
          svgIcon: `${WarehouseIcon}`,
          title: "Alert Management",
          link: `${process.env.PUBLIC_URL}/company/setup/alert-management`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${ComplaintypeIcon}`,
          title: "Complain Types",
          link: `${process.env.PUBLIC_URL}/company/setup/complain-types`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${VehicleMakeIcon}`,
          title: "Vehicle Make",
          link: `${process.env.PUBLIC_URL}/company/setup/vehicle-make`,
        },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${VehicleModelIcon}`,
          title: "Vehicle Model",
          link: `${process.env.PUBLIC_URL}/company/setup/vehicle-model`,
        },
        {
          // svgIcon: "bonus-kit",
          title: "Email Gateway",
          svgIcon: `${EmailgatewayIcon}`,
          link: `${process.env.PUBLIC_URL}/company/setup/email-gateway`,
        },
        // {
        //   // svgIcon: "bonus-kit",
        //   svgIcon: `${WhatsappGatewayIcon}`,
        //   title: "WhatsApp Gateway",
        //   link: `${process.env.PUBLIC_URL}/company/setup/whatsApp-gateway`,
        // },
        {
          // svgIcon: "bonus-kit",
          svgIcon: `${EmailtemplateIcon}`,
          title: "Email Templates",
          link: `${process.env.PUBLIC_URL}/company/setup/email-template`,
        },

        // {
        //   // svgIcon: "bonus-kit",
        //   svgIcon: `${WhatsapptemplateIcon}`,
        //   title: "WhatsApp Templates",
        //   link: `${process.env.PUBLIC_URL}/company/setup/whatsapp-template`,
        // },
        {
          svgIcon: `${GeofenceIcon}`,
          title: "Geofence",
          link: `${process.env.PUBLIC_URL}/company/setup/geofence`,
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
      // svgIcon: "home",
      svgIcon: `${ModuleIcon}`,
      subMenu: crmActiveModules.map((item: any, index: any) => {
        // return {
        //   // svgIcon: "bonus-kit",
        //   svgIcon: `${ControlroomIcon}`,
        //   title: `${item.name}`,
        //   link: `${process.env.PUBLIC_URL}/company/modules${item.route}`,
        // };
        return {
          svgIcon: `${
            item.route === "/control-room"
              ? ControlroomIcon
              : item.route === "/monitoring"
              ? MonitorIcon
              : item.route === "/complaint-center"
              ? ComplaincenterIcon
              : SalesIcon
          }`, // Replace DefaultIcon with the default icon you want to use
          title: `${item.name}`,
          link: `${process.env.PUBLIC_URL}/company/modules${item.route}`,
        };
      }),
    },

    {
      title: "User",
      svgIcon: `${UserIcon}`,
      // svgIcon: "home",
      link: `${process.env.PUBLIC_URL}/company/users`,
    },
    {
      title: "Support",
      // svgIcon: "home",
      svgIcon: `${SupportIcon}`,
      link: `${process.env.PUBLIC_URL}/support`,
    },
    // {
    //   title: "Tasks",
    //   svgIcon: "task",
    //   link: `${process.env.PUBLIC_URL}/company/tasks`,
    // },
    {
      title: "Reports",
      // svgIcon: "home",
      svgIcon: `${ReportsIcon}`,
      link: `${process.env.PUBLIC_URL}/company/reports`,
    },
  ];

  const OperatorSidebarMenuComponent: SidebarMenuTypes[] = [
    {
      title: "Dashboard",
      svgIcon: `${DashboardIcon}`,
      link: `${process.env.PUBLIC_URL}/dashboard`,
    },

    {
      title: "Modules",
      // svgIcon: "home",
      svgIcon: `${ModuleIcon}`,
      subMenu: crmActiveModules.map((item: any, index: any) => {
        return {
          // svgIcon: "bonus-kit",
          svgIcon: `${
            item.route === "/control-room"
              ? ControlroomIcon
              : item.route === "/monitoring"
              ? MonitorIcon
              : item.route === "/complaint-center"
              ? ComplaincenterIcon
              : SalesIcon
          }`, // Replace DefaultIcon with the default icon you want to use
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
      svgIcon: `${SupportIcon}`,
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
  const { sidebarIconType } = useSelector(
    (state: any) => state.themeCustomizer
  );
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
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.secondaryColor !== null
                ? userPersonalizationData?.secondaryColor
                : ""
            }`,
            // backgroundColor: "#99A6A7",
          }}
        >
          <UL className="sidebar-links simple-list" id="simple-bar">
            <SimpleBar
              className="w-100 simplebar-scrollable-y h-100"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <>
                <SidebarBack />
                {decodedToken.role === "SUPER_ADMIN"
                  ? SidebarMenuComponent.map((data, index) => (
                      <LI className={`sidebar-list`} key={index}>
                        <Link
                          className={`sidebar-link sidebar-title ${
                            sideMenu === data.title ? "active" : ""
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
                          {/* <SVG
                          className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType === "fill" ? "fill-" : ""}${data.svgIcon}`}
                       
                        /> */}
                          <span
                            style={{
                              height: "20px",
                              width: "20px",
                              marginRight: "8px",
                            }}
                          >
                            <img
                              src={data.svgIcon}
                              style={{
                                height: "100%",
                                width: "100%",
                              }}
                              alt=""
                            />
                          </span>
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
                                display: `${
                                  data.title === sideMenu && !data.link
                                    ? "block"
                                    : "block"
                                }`,
                                marginTop: "-70px",
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
                  : decodedToken.role === ROLES.OPERATOR
                  ? filteredOperatorMenu !== undefined &&
                    filteredOperatorMenu?.map((data: any, index: any) => (
                      <LI className={`sidebar-list`} key={index}>
                        <Link
                          className={`sidebar-link sidebar-title ${
                            sideMenu === data.title ? "active" : ""
                          }`}
                          to={data.link ? data.link : "#"}
                          onClick={() => handleClick(data)}
                        >
                          <div>
                            <span
                              style={{
                                height: "20px",
                                width: "20px",
                                marginRight: "8px",
                              }}
                            >
                              <img
                                src={data.svgIcon}
                                style={{
                                  height: "100%",
                                  width: "100%",
                                }}
                                alt=""
                              />
                            </span>
                            <span style={{ fontSize: "13px" }}>
                              {t(data.title)}
                            </span>
                          </div>
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
                                marginTop: "-70px",
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
                          className={`sidebar-link sidebar-title ${
                            sideMenu === data.title ? "active" : ""
                          }`}
                          to={data.link ? data.link : "#"}
                          onClick={() => handleClick(data)}
                        >
                          {/* <SVG
                            className={`${sidebarIconType}-icon`}
                            iconId={`${
                              sidebarIconType === "fill" ? "fill-" : ""
                            }${data.svgIcon}`}
                          /> */}
                          <span
                            style={{
                              height: "20px",
                              width: "20px",
                              marginRight: "8px",
                            }}
                          >
                            <img
                              src={data.svgIcon}
                              style={{
                                height: "100%",
                                width: "100%",
                              }}
                              alt=""
                            />
                          </span>
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
                                display: `${
                                  data.title === sideMenu && !data.link
                                    ? "block"
                                    : "block"
                                }`,
                                marginTop: "-70px",
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
              </>

              <div
                className={`page-header d-block`}
                style={{
                  backgroundColor: `transparent`,
                  width: "45%",
                  // display:"flex",
                  // justifyContent:"flex-end",
                  right: "0",
                }}
              >
                <Header />
              </div>
            </SimpleBar>
          </UL>
        </div>
      )}
    </nav>
  );
};

export default SidebarMain;
