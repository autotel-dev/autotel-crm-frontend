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
import BankSlice from "./Reducer/BankSlice";
import InsuranceSlice from "./Reducer/InsuranceSlice";
import NetworkProviderSlice from "./Reducer/NetworkProviderSlice";
import WarehouseSlice from "./Reducer/WarehouseSlice";
import GroupSlice from "./Reducer/GroupSlice";
import BranchSlice from "./Reducer/BranchSlice";
import VehicleMakeSlice from "./Reducer/VehicleMakeSlice";
import VehicleModelSlice from "./Reducer/VehicleModelSlice";
import CurrencySlice from "./Reducer/CurrencySlice";
import LanguageSlice from "./Reducer/LanguageSlice";
import SalesSlice from "./Reducer/SalesSlice";
import PurchaseInvoiceSlice from "./Reducer/PurchaseInvoiceSlice";
import ExpenseAccountsSlice from "./Reducer/ExpenseAccountsSlice";
import BankAccountSlice from "./Reducer/BankAccountSlice";
import ExpensesSlice from "./Reducer/ExpensesSlice";
import InventoryProductSlice from "./Reducer/InventoryProductSlice";
import VendorSlice from "./Reducer/VendorSlice";
import TaxSlice from "./Reducer/TaxSlice";
import StockAdjustmentTypeSlice from "./Reducer/StockAdjustmentTypeSlice";
import StockMovementSlice from "./Reducer/StockMovementSlice";
import StockAdjustementSlice from "./Reducer/StockAdjustementSlice";
import OperationActivitySlice from "./Reducer/OperationActivitySlice";
import AccountSlice from "./Reducer/AccountSlice";
import SaleInvoiceSlice from "./Reducer/SaleInvoiceSlice";
import NRSlice from "./Reducer/NRSlice";
import SalesDashboardSlice from "./Reducer/SalesDashboardSlice";
import CompanyServicePackageSlice from "./Reducer/CompanyServicePackageSlice";
import MakePaymentSlice from "./Reducer/MakePaymentSlice";
import ReceiveMoneySlice from "./Reducer/ReceiveMoneySlice";
import CustomerLedgerSlice from "./Reducer/CustomerLedgerSlice";
import VendorLedgerSlice from "./Reducer/VendorLedgerSlice";
import CompanyLedgerSlice from "./Reducer/CompanyLedgerSlice";
import AlertRuleSlice from "./Reducer/AlertRuleSlice";

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
    geofence: GeofenceSlice,
    banks: BankSlice,
    insurance: InsuranceSlice,
    networkProvider: NetworkProviderSlice,
    warehouse: WarehouseSlice,
    group: GroupSlice,
    branch: BranchSlice,
    vehicleMake: VehicleMakeSlice,
    vehicleModel: VehicleModelSlice,
    currencies: CurrencySlice,
    languages: LanguageSlice,
    sales: SalesSlice,
    purchaseInvoice: PurchaseInvoiceSlice,
    expenseAccounts: ExpenseAccountsSlice,
    bankAccounts: BankAccountSlice,
    expenses: ExpensesSlice,
    inventoryProduct: InventoryProductSlice,
    vendor: VendorSlice,
    taxes: TaxSlice,
    stockAdjustmentTypes: StockAdjustmentTypeSlice,
    stockMovement: StockMovementSlice,
    stockAdjustment: StockAdjustementSlice,
    activities: OperationActivitySlice,
    account: AccountSlice,
    saleInvoice: SaleInvoiceSlice,
    nrReport: NRSlice,
    salesDashboard: SalesDashboardSlice,
    companyServicePackages: CompanyServicePackageSlice,
    makePayments: MakePaymentSlice,
    receiveMoneys: ReceiveMoneySlice,
    customerLedgers: CustomerLedgerSlice,
    vendorLedgers: VendorLedgerSlice,
    companyLedgers: CompanyLedgerSlice,
    alertRules: AlertRuleSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
