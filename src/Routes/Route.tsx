import { lazy } from "react";

// Company

import { ROLES } from "../constants/roles";
import { PERMISSION_VALUES } from "../constants/permissions";

// Pages load on demand: each page's code downloads the first time it is opened.
const Support = lazy(() => import("../Pages/Common/Support/Support"));
const VerifyOTP = lazy(() => import("../Pages/Common/VerifyOTP/VerifyOTP"));
const CompanyTasks = lazy(() => import("../Pages/Company/Tasks/Tasks"));
const CompanyUsers = lazy(() => import("../Pages/Company/Users/Users"));
const ControlRoom = lazy(() => import("../Pages/Company/Modules/ControlRoom/ControlRoom"));
const ControlRoomV2 = lazy(() => import("../Pages/Company/Modules/ControlRoom copy/ControlRoomV2"));
const TicketDetails = lazy(() => import("../Pages/Common/Support/TicketDetails"));
const Account = lazy(() => import("../Pages/Common/User/Account/Account"));
const Settings = lazy(() => import("../Pages/Common/User/Settings/Settings"));
const Reports = lazy(() => import("../Pages/Company/Reports/Reports"));
const NotAccessible = lazy(() => import("../Pages/Utilities/NotAccessible/NotAccessible"));
const NoInternetConnection = lazy(() => import("../Pages/Utilities/NoInternetConnection/NoInternetConnection"));
const UnderProductionPage = lazy(() => import("../Pages/Utilities/UnderProductionPage/UnderProductionPage"));
const Dashboard = lazy(() => import("../Pages/DashBoard/Dashboard"));
const ComplainDetails = lazy(() => import("../Pages/Company/Modules/ComplainCenter/ComplainDetails"));
const ComplainCenter = lazy(() => import("../Pages/Company/Modules/ComplainCenter/ComplainCenter"));
const EmailGateway = lazy(() => import("../Pages/Common/EmailGateway/EmailGateway"));
const SMSGateway = lazy(() => import("../Pages/Common/SMSGateway/SMSGateway"));
const WhatsAppGateway = lazy(() => import("../Pages/Common/WhatsAppGateway/WhatsAppGateway"));
const EmailTemplates = lazy(() => import("../Pages/Common/EmailTemplates/EmailTemplates"));
const WhatsAppTemplates = lazy(() => import("../Pages/Common/WhatsAppTemplates/WhatsAppTemplates"));
const Countries = lazy(() => import("../Pages/SuperAdmin/Countries/Countries"));
const Cities = lazy(() => import("../Pages/SuperAdmin/Cities/Cities"));
const Province = lazy(() => import("../Pages/SuperAdmin/Province/Province"));
const Package = lazy(() => import("../Pages/SuperAdmin/Package/Package"));
const CRMModule = lazy(() => import("../Pages/SuperAdmin/CRMModule/CRMModule"));
const ComplainType = lazy(() => import("../Pages/SuperAdmin/ComplainType/ComplainType"));
const Servers = lazy(() => import("../Pages/SuperAdmin/ServerDetails/Servers"));
const CreateServerForm = lazy(() => import("../Pages/SuperAdmin/ServerDetails/CreateServerForm/CreateServerForm"));
const UpdateServerForm = lazy(() => import("../Pages/SuperAdmin/ServerDetails/UpdateServerForm.tsx/UpdateServerForm"));
const ServerManagement = lazy(() => import("../Pages/SuperAdmin/ServerManagement/ServerManagement"));
const RecentLogsFullTable = lazy(() => import("../Pages/SuperAdmin/ServerManagement/RecentOrders/RecentLogsFullTable"));
const Geofence = lazy(() => import("../Pages/SuperAdmin/Geofence/Geofence"));
const Companies = lazy(() => import("../Pages/SuperAdmin/Companies/Companies"));
const UpdateCompanyForm = lazy(() => import("../Pages/SuperAdmin/Companies/UpdateCompanyForm/UpdateCompanyForm"));
const CreateCompanyForm = lazy(() => import("../Pages/SuperAdmin/Companies/CreateCompanyForm/CreateCompanyForm"));
const Departments = lazy(() => import("../Pages/Company/Departments/Departments"));
const Banks = lazy(() => import("../Pages/SuperAdmin/Banks/Banks"));
const Insurances = lazy(() => import("../Pages/SuperAdmin/Insurances/Insurance"));
const VehiclesMake = lazy(() => import("../Pages/SuperAdmin/VehicleMake/VehiclesMake"));
const VehiclesModel = lazy(() => import("../Pages/SuperAdmin/VehicleModel/VehiclesModel"));
const NetworkProviders = lazy(() => import("../Pages/SuperAdmin/NetworkProvider/NetworkProviders"));
const Packages = lazy(() => import("../Pages/Company/Packages/Packages"));
const Groups = lazy(() => import("../Pages/Company/Groups/Groups"));
const Warehouses = lazy(() => import("../Pages/Company/Warehouses/Warehouses"));
const Branches = lazy(() => import("../Pages/Company/Branches/Branches"));
const Currencies = lazy(() => import("../Pages/SuperAdmin/Currencies/Currencies"));
const Languages = lazy(() => import("../Pages/SuperAdmin/Languages/Languages"));
const SAIOCentralLayout = lazy(() => import("../Pages/Company/Modules/SAIO/SAIOCentralLayout"));
const ServicePackages = lazy(() => import("../Pages/Company/Packages/Packages"));
const MonitoringForSingleVehicle = lazy(() => import("../Pages/Company/Modules/MonitoringForSingleVehicle/MonitoringForSingleVehicle"));
const Playback = lazy(() => import("../Pages/Company/Modules/Playback/Playback"));
const AlertManagement = lazy(() => import("../Pages/Company/AlertManagement/AlertManagement"));
const TripReports = lazy(() => import("../Pages/Company/Modules/Monitoring/components/Reports/TripReports"));
const MonitoringLatest = lazy(() => import("../Pages/Company/Modules/MonitoringLatest/MonetoringLatest"));
const LiveVehicleMonitoring = lazy(() => import("../Pages/Company/Modules/MonitoringLatest/components/LiveVehicleMonitoring/LiveVehicleMonitoring"));
const TripManagementLayout = lazy(() => import("../Pages/Company/Modules/TripManagement/TripManagementLayout"));
const CustomersSetup = lazy(() => import("../Pages/Company/Customers/CustomersSetup"));
const DevicesSetup = lazy(() => import("../Pages/Company/Devices/DevicesSetup"));

const routes = [

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
  {
    path: `${process.env.PUBLIC_URL}/company/setup/customers`,
    Component: <CustomersSetup />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Customers",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/setup/devices`,
    Component: <DevicesSetup />,
    allowedUserRoles: [ROLES.COMPANY],
    isProtected: true,
    permissionValue: "Devices",
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
    allowedUserRoles: [ROLES.COMPANY, ROLES.OPERATOR],
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
    allowedUserRoles: [ROLES.COMPANY, ROLES.OPERATOR],
    permissionValue: "Monitoring",
  },
  {
    path: `${process.env.PUBLIC_URL}/company/modules/monitoring/playback`,
    Component: <Playback />,
    isProtected: true,
    allowedUserRoles: [ROLES.COMPANY, ROLES.OPERATOR],
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
    // Same page as the company (the old Monitoring page showed sample alerts).
    // The backend limits operators to their assigned vehicles.
    Component: <MonitoringLatest />,
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
