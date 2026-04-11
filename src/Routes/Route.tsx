import ShoppingPlace from "../Pages/DashBoard/ShoppingPlace/ShoppingPlace";
import CRMDashboard from "../Pages/DashBoard/CRMDashboard/CRMDashboard";
import Support from "../Pages/Common/Support/Support";
import VerifyOTP from "../Pages/Common/VerifyOTP/VerifyOTP";

// Company

import CompanyTasks from "../Pages/Company/Tasks/Tasks";
import CompanyUsers from "../Pages/Company/Users/Users";
import Monitoring from "../Pages/Company/Modules/Monitoring/Monitoring";
import ControlRoom from "../Pages/Company/Modules/ControlRoom/ControlRoom";
import ControlRoomV2 from "../Pages/Company/Modules/ControlRoom copy/ControlRoomV2";
import TicketDetails from "../Pages/Common/Support/TicketDetails";
import Account from "../Pages/Common/User/Account/Account";
import Settings from "../Pages/Common/User/Settings/Settings";
import Reports from "../Pages/Company/Reports/Reports";
import NotAccessible from "../Pages/Utilities/NotAccessible/NotAccessible";
import { ROLES } from "../constants/roles";
import { PERMISSION_VALUES } from "../constants/permissions";
import NoInternetConnection from "../Pages/Utilities/NoInternetConnection/NoInternetConnection";
import UnderProductionPage from "../Pages/Utilities/UnderProductionPage/UnderProductionPage";
import Dashboard from "../Pages/DashBoard/Dashboard";
import ComplainDetails from "../Pages/Company/Modules/ComplainCenter/ComplainDetails";
import ComplainCenter from "../Pages/Company/Modules/ComplainCenter/ComplainCenter";
import EmailGateway from "../Pages/Common/EmailGateway/EmailGateway";
import SMSGateway from "../Pages/Common/SMSGateway/SMSGateway";
import WhatsAppGateway from "../Pages/Common/WhatsAppGateway/WhatsAppGateway";
import EmailTemplates from "../Pages/Common/EmailTemplates/EmailTemplates";
import WhatsAppTemplates from "../Pages/Common/WhatsAppTemplates/WhatsAppTemplates";
import Countries from "../Pages/SuperAdmin/Countries/Countries";
import Cities from "../Pages/SuperAdmin/Cities/Cities";
import Province from "../Pages/SuperAdmin/Province/Province";
import Package from "../Pages/SuperAdmin/Package/Package";
import CRMModule from "../Pages/SuperAdmin/CRMModule/CRMModule";
import ComplainType from "../Pages/SuperAdmin/ComplainType/ComplainType";
import Servers from "../Pages/SuperAdmin/ServerDetails/Servers";
import CreateServerForm from "../Pages/SuperAdmin/ServerDetails/CreateServerForm/CreateServerForm";
import UpdateServerForm from "../Pages/SuperAdmin/ServerDetails/UpdateServerForm.tsx/UpdateServerForm";
import ServerManagement from "../Pages/SuperAdmin/ServerManagement/ServerManagement";
import RecentLogsFullTable from "../Pages/SuperAdmin/ServerManagement/RecentOrders/RecentLogsFullTable";
import Geofence from "../Pages/SuperAdmin/Geofence/Geofence";
import Companies from "../Pages/SuperAdmin/Companies/Companies";
import UpdateCompanyForm from "../Pages/SuperAdmin/Companies/UpdateCompanyForm/UpdateCompanyForm";
import CreateCompanyForm from "../Pages/SuperAdmin/Companies/CreateCompanyForm/CreateCompanyForm";
import Departments from "../Pages/Company/Departments/Departments";
import Banks from "../Pages/SuperAdmin/Banks/Banks";
import Insurances from "../Pages/SuperAdmin/Insurances/Insurance";
import VehiclesMake from "../Pages/SuperAdmin/VehicleMake/VehiclesMake";
import VehiclesModel from "../Pages/SuperAdmin/VehicleModel/VehiclesModel";
import NetworkProviders from "../Pages/SuperAdmin/NetworkProvider/NetworkProviders";
import Packages from "../Pages/Company/Packages/Packages";
import Groups from "../Pages/Company/Groups/Groups";
import Warehouses from "../Pages/Company/Warehouses/Warehouses";
import Branches from "../Pages/Company/Branches/Branches";
import Currencies from "../Pages/SuperAdmin/Currencies/Currencies";
import Languages from "../Pages/SuperAdmin/Languages/Languages";
import SAIOCentralLayout from "../Pages/Company/Modules/SAIO/SAIOCentralLayout";
import ServicePackages from "../Pages/Company/Packages/Packages";
import MonitoringForSingleVehicle from "../Pages/Company/Modules/MonitoringForSingleVehicle/MonitoringForSingleVehicle";
import Playback from "../Pages/Company/Modules/Playback/Playback";
import AlertManagement from "../Pages/Company/AlertManagement/AlertManagement";
import TripReports from "../Pages/Company/Modules/Monitoring/components/Reports/TripReports";
import MonitoringLatest from "../Pages/Company/Modules/MonitoringLatest/MonetoringLatest";
import LiveVehicleMonitoring from "../Pages/Company/Modules/MonitoringLatest/components/LiveVehicleMonitoring/LiveVehicleMonitoring";
import TripManagementLayout from "../Pages/Company/Modules/TripManagement/TripManagementLayout";

const routes = [
  // dashboard routes
  {
    path: `${process.env.PUBLIC_URL}/dashboards/shoppingplace`,
    Component: <ShoppingPlace />,
  },
  {
    path: `${process.env.PUBLIC_URL}/dashboards/crmdashboard`,
    Component: <CRMDashboard />,
  },

  // --------------------------------------------------

  // Verify OTP

  // {
  //   path: `${process.env.PUBLIC_URL}/verifyOTP`,
  //   Component: <VerifyOTP />,
  // },

  // Profile
  {
    path: `${process.env.PUBLIC_URL}/users/settings`,
    Component: <Settings />,
    isProtected: true,
    allowedUserRoles: [
      ROLES.COMPANY,
      ROLES.CUSTOMER,
      ROLES.SUPER_ADMIN,
      ROLES.OPERATOR,
    ],
    permissionValue: "Settings",
  },
  {
    path: `${process.env.PUBLIC_URL}/users/account`,
    Component: <Account />,
    isProtected: true,
    allowedUserRoles: [
      ROLES.COMPANY,
      ROLES.CUSTOMER,
      ROLES.SUPER_ADMIN,
      ROLES.OPERATOR,
    ],
    permissionValue: PERMISSION_VALUES.PROFILE,
  },

  // superAdmin

  // Dashboard
  {
    path: `${process.env.PUBLIC_URL}/dashboard`,
    Component: <Dashboard />,
    isProtected: true,
    allowedUserRoles: [ROLES.SUPER_ADMIN, ROLES.COMPANY, ROLES.OPERATOR],
    permissionValue: PERMISSION_VALUES.DASHBOARD,
  },

  // Setup

  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/countries`,
    Component: <Countries />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Countries",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/cities`,
    Component: <Cities />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Cities",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/province`,
    Component: <Province />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Provinces",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/package`,
    Component: <Package />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Packages",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/crm-module`,
    Component: <CRMModule />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "CRMModules",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/banks`,
    Component: <Banks />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Banks",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/currencies`,
    Component: <Currencies />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "currencies",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/languages`,
    Component: <Languages />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "languages",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/insurance`,
    Component: <Insurances />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Insurances",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/vehicle-make`,
    Component: <VehiclesMake />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "VehiclesMake",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/vehicle-model`,
    Component: <VehiclesModel />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "VehiclesModel",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/network-provider`,
    Component: <NetworkProviders />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "NetworkProviders",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/complain-types`,
    Component: <ComplainType />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "ComplainTypes",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/server-details`,
    Component: <Servers />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "ServerDetails",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/server-details/create-new-Server`,
    Component: <CreateServerForm />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "CreateNewServer",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/server-details/update-server`,
    Component: <UpdateServerForm />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "UpdateServer",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/server-management`,
    Component: <ServerManagement />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "ServerManagement",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/server_management/AllLogs`,
    Component: <RecentLogsFullTable />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "AllLogs",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/email-template`,
    Component: <EmailTemplates />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "EmailTemplates",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/whatsapp-template`,
    Component: <WhatsAppTemplates />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "WhatsAppTemplates",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/email-gateway`,
    Component: <EmailGateway />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "EmailGateway",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/sms-gateway`,
    Component: <SMSGateway />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "SMSGateway",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/whatsApp-gateway`,
    Component: <WhatsAppGateway />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "WhatsAppGateway",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/geofence`,
    Component: <Geofence />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Geofence",
  },

  // Support
  {
    path: `${process.env.PUBLIC_URL}/support`,
    Component: <Support />,
    allowedUserRoles: [ROLES.SUPER_ADMIN, ROLES.COMPANY, ROLES.OPERATOR],
    isProtected: true,
    permissionValue: "Support",
  },
  {
    path: `${process.env.PUBLIC_URL}/support/ticketDetails/:ticketId`,
    Component: <TicketDetails />,
  },
  // Tasks
  // {
  //   path: `${process.env.PUBLIC_URL}/super-admin/tasks`,
  //   Component: <Tasks />,
  //   allowedUserRoles: [ROLES.SUPER_ADMIN],
  //   isProtected: true,
  //   permissionValue: "Tasks",

  // },
  // Companies
  {
    path: `${process.env.PUBLIC_URL}/super-admin/companies`,
    Component: <Companies />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "Companies",
  },
  {
    path: `${process.env.PUBLIC_URL}/super-admin/setup/company/update-company/:companyId`,
    Component: <UpdateCompanyForm />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "UpdateCompany",
  },

  {
    path: `${process.env.PUBLIC_URL}/super-admin/companies/createComapany`,
    Component: <CreateCompanyForm />,
    allowedUserRoles: [ROLES.SUPER_ADMIN],
    isProtected: true,
    permissionValue: "CreateCompany",
  },
  {
    path: `${process.env.PUBLIC_URL}/verifyOTP`,
    Component: <VerifyOTP />,
  },

  // Company Routes

  // Dashboard
  {
    path: `${process.env.PUBLIC_URL}/dashboard`,
    Component: <Dashboard />,
    isProtected: true,
    allowedUserRoles: [ROLES.SUPER_ADMIN, ROLES.COMPANY, ROLES.OPERATOR],
    permissionValue: PERMISSION_VALUES.DASHBOARD,
  },

  // Setup

  {
    path: `${process.env.PUBLIC_URL}/company/setup/deparments`,
    Component: <Departments />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Roles",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/packages`,
    Component: <ServicePackages />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Packages",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/groups`,
    Component: <Groups />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Groups",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/warehouses`,
    Component: <Warehouses />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Warehouses",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/branches`,
    Component: <Branches />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Branches",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/alert-management`,
    Component: <AlertManagement />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "AlertManagement",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/complain-types`,
    Component: <ComplainType />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "ComplainTypes",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/vehicle-make`,
    Component: <VehiclesMake />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "VehiclesMake",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/vehicle-model`,
    Component: <VehiclesModel />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "VehiclesModel",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/email-gateway`,
    Component: <EmailGateway />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "EmailGateway",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/whatsApp-gateway`,
    Component: <WhatsAppGateway />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "WhatsAppGateway",
  },

  {
    path: `${process.env.PUBLIC_URL}/company/setup/email-template`,
    Component: <EmailTemplates />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "EmailTemplates",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/whatsapp-template`,
    Component: <WhatsAppTemplates />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "WhatsAppTemplates",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/geofence`,
    Component: <Geofence />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Geofence",
  },

  // Modules

  // {
  //   path: `${process.env.PUBLIC_URL}/company/modules/monitoring`,
  //   Component: <Monitoring />,
  //   isProtected: true,
  //   allowedUserRoles: [ROLES.COMPANY],
  //   permissionValue: "Monitoring",
  // },

  {
    path: `${process.env.PUBLIC_URL}/company/modules/monitoring`,
    Component: <MonitoringLatest />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Monitoring",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/modules/live-monitoring/:registration`,
    Component: <LiveVehicleMonitoring />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Monitoring",
  },

  {
    path: `${process.env.PUBLIC_URL}/company/modules/trip-management`,
    Component: <TripManagementLayout />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Monitoring",
    isLayout: true,
  },

  {
    path: `${process.env.PUBLIC_URL}/company/modules/monitoring-for-single-vehicle/:vehicleId`,
    Component: <MonitoringForSingleVehicle />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Monitoring",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/modules/monitoring/playback`,
    Component: <Playback />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Monitoring",
  },
  // {
  //   path: `${process.env.PUBLIC_URL}/company/modules/control-room`,
  //   Component: <ControlRoom />,
  //   isProtected: true,
  //   allowedUserRoles: [ROLES.COMPANY],
  //   permissionValue: "Control Room",
  // },

  {
    path: `${process.env.PUBLIC_URL}/company/modules/control-room`,
    Component: <ControlRoomV2 />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Control Room",
  },

  {
    path: `${process.env.PUBLIC_URL}/company/modules/complaint-center`,
    Component: <ComplainCenter />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Complain Center",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/modules/complain-center/complainDetails/:complaintId`,
    Component: <ComplainDetails />,
  },

  {
    path: `${process.env.PUBLIC_URL}/company/modules/saio-central`,
    // Component: <SAIOCentral />,
    Component: <SAIOCentralLayout />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "SAIO Central",
    isLayout: true,
  },

  // Users
  {
    path: `${process.env.PUBLIC_URL}/company/users`,
    Component: <CompanyUsers />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: PERMISSION_VALUES.USER,
  },

  // Support
  // {
  //   path: `${process.env.PUBLIC_URL}/support`,
  //   Component: <Support />,
  //   isProtected: true,
  //   allowedUserRoles: [ROLES.COMPANY],
  //   permissionValue: PERMISSION_VALUES.SUPPORT,
  // },
  // Tasks
  // {
  //   path: `${process.env.PUBLIC_URL}/company/tasks`,
  //   Component: <CompanyTasks />,
  //   isProtected: true,
  //   allowedUserRoles: [ROLES.COMPANY],
  //   permissionValue: "Tasks",
  // },

  {
    path: `${process.env.PUBLIC_URL}/company/reports`,
    Component: <Reports />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "Reports",
  },

  {
    path: `${process.env.PUBLIC_URL}/company/trip-reports`,
    Component: <TripReports />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY],
    permissionValue: "TripReports",
  },
  // Operator Routes

  // Dashboard
  {
    path: `${process.env.PUBLIC_URL}/dashboard`,
    Component: <Dashboard />,
    isProtected: true,
    allowedUserRoles: [ROLES.SUPER_ADMIN, ROLES.COMPANY, ROLES.OPERATOR],
    permissionValue: PERMISSION_VALUES.DASHBOARD,
  },
  {
    path: `${process.env.PUBLIC_URL}/operator/modules/monitoring`,
    Component: <Monitoring />,
    isProtected: true,
    allowedUserRoles: [ROLES.OPERATOR],
    permissionValue: "Monitoring",
  },
  // {
  //   path: `${process.env.PUBLIC_URL}/operator/modules/control-room`,
  //   Component: <ControlRoom />,
  //   isProtected: true,
  //   allowedUserRoles: [ROLES.OPERATOR],
  //   permissionValue: "Control Room",
  // },

  {
    path: `${process.env.PUBLIC_URL}/operator/modules/control-room`,
    Component: <ControlRoomV2 />,
    isProtected: true,
    allowedUserRoles: [ROLES.OPERATOR],
    permissionValue: "Control Room",
  },
  {
    path: `${process.env.PUBLIC_URL}/operator/modules/complaint-center`,
    Component: <ComplainCenter />,
    isProtected: true,
    allowedUserRoles: [ROLES.OPERATOR],
    permissionValue: "Complain Center",
  },
  {
    path: `${process.env.PUBLIC_URL}/operator/modules/complain-center/complainDetails/:complaintId`,
    Component: <ComplainDetails />,
  },
  {
    path: `${process.env.PUBLIC_URL}/operator/modules/saio-central`,
    Component: <SAIOCentralLayout />,
    isProtected: true,
    allowedUserRoles: [ROLES.OPERATOR],
    permissionValue: "SAIO Central",
    isLayout: true,
  },

  {
    path: `${process.env.PUBLIC_URL}/not-accessible`,
    Component: <NotAccessible />,
  },
  {
    path: `${process.env.PUBLIC_URL}/not-conneceted`,
    Component: <NoInternetConnection />,
  },
];

export default routes;
