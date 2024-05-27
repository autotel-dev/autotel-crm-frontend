import { configureStore } from "@reduxjs/toolkit";
import LayoutSlice from "./Reducer/LayoutSlice";
import BookmarkTabSlice from "./Reducer/BookmarkTabSlice";
import ThemeCustomizerSlice from "./Reducer/ThemeCustomizerSlice";
import FilterSlice from "./Reducer/FilterSlice";
import ProductSlice from "./Reducer/ProductSlice";
import CartSlice from "./Reducer/CartSlice";
import ProjectSlice from "./Reducer/ProjectSlice";
import TasksSlice from "./Reducer/TasksSlice";
import ChatSlice from "./Reducer/ChatSlice";
import ContactSlice from "./Reducer/ContactSlice";
import BookmarkSlice from "./Reducer/BookmarkSlice";
import ToDoSlice from "./Reducer/ToDoSlice";
import CitiesSlice from "./Reducer/CitiesSlice";
import ProvinceSlice from "./Reducer/ProvinceSlice";
import PackageSlice from "./Reducer/PackageSlice";
import CountrySlice from "./Reducer/CountrySlice";
import CRMModuleSlice from "./Reducer/CRMModuleSlice";
import NoDataFoundSlice from "./Reducer/NoDataFoundSlice";
import CompanySlice from "./Reducer/CompanySlice";
import ServerManagementSlice from "./Reducer/ServerManagementSlice";
import ServerDetailsSlice from "./Reducer/ServerDetailsSlice";
import UserSlice from "./Reducer/UserSlice";
import MonitoringSlice from "./Reducer/MonitoringSlice";
import OperatorSlice from "./Reducer/OperatorSlice";
import AlertsSlice from "./Reducer/AlertsSlice";
import SupportSlice from "./Reducer/SupportSlice";
import RolesSlice from "./Reducer/RolesSlice";
import PersonalizationSlice from "./Reducer/PersonalizationSlice";
import ReportsSlice from "./Reducer/ReportsSlice";
import PermissionSlice from "./Reducer/PermissionSlice";
import DashboardSlice from "./Reducer/DashboardSlice";
import ComplainsTypeSlice from "./Reducer/ComplainsTypeSlice";
import ComplainCenterSlice from "./Reducer/ComplainCenterSlice";
import EmailGatewaySlice from "./Reducer/EmailGatewaySlice";
import WhatsAppGatewaySlice from "./Reducer/WhatsAppGatewaySlice";
import EmailTemplateSlice from "./Reducer/EmailTemplateSlice";
import WhatsAppTemplateSlice from "./Reducer/WhatsAppTemplateSlice";
import GeofenceSlice from "./Reducer/GeofenceSlice";

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    bookmarkTab: BookmarkTabSlice,
    themeCustomizer: ThemeCustomizerSlice,
    filterData: FilterSlice,
    product: ProductSlice,
    cartData: CartSlice,
    todo: ToDoSlice,
    project: ProjectSlice,
    tasks: TasksSlice,
    chatData: ChatSlice,
    contact: ContactSlice,
    bookmark: BookmarkSlice,
    cities: CitiesSlice,
    provinces: ProvinceSlice,
    packages: PackageSlice,
    countries: CountrySlice,
    crmModules: CRMModuleSlice,
    noDataFound: NoDataFoundSlice,
    companies: CompanySlice,
    serverManagement: ServerManagementSlice,
    serverDetails: ServerDetailsSlice,
    user: UserSlice,
    monitoring: MonitoringSlice,
    operators: OperatorSlice,
    alerts: AlertsSlice,
    support: SupportSlice,
    roles: RolesSlice,
    personalization: PersonalizationSlice,
    reports: ReportsSlice,
    userPermissions: PermissionSlice,
    dashboard: DashboardSlice,
    complainTypes: ComplainsTypeSlice,
    complainCenter: ComplainCenterSlice,
    emailGateway: EmailGatewaySlice,
    whatsAppGateway: WhatsAppGatewaySlice,
    emailTemplate: EmailTemplateSlice,
    whatsAppTemplate: WhatsAppTemplateSlice,
    geofence: GeofenceSlice
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
