export const API_BASE_URL = "http://124.29.238.127:8080/api/v1";
export const IMAGE_BASE_URL = "http://124.29.238.127:8080";
// export const API_BASE_URL = "https://crmapi.autotel.pk/api/v1";
// export const IMAGE_BASE_URL = "https://crmapi.autotel.pk";

// Miscellaneous
export const TEST_SERVER_CONNECTION = `${API_BASE_URL}/company/server-credentials/test-connection`;
export const UPDATE_SERVER_CREDENTIALS = `${API_BASE_URL}/company/update-server-credentials`;
export const GET_COMPANY_GIVEN_PERMISSION = `${API_BASE_URL}/company/permissions`;
export const GET_ALL_PERMISSIONS = `${API_BASE_URL}/permissions/get-all-permissions`;
export const GET_ALL_TIMEZONES = `${API_BASE_URL}/timezone/get-all-timezones`;
export const LEGAL_DOCUMENT_FILE = `${API_BASE_URL}/uploads/legal-documents`;

// Common - Authentication
export const LOGIN = `${API_BASE_URL}/auth/user/login`;
export const OTP_VERIFICATION = `${API_BASE_URL}/auth/user/security/verify-security-code`;
export const CHANGE_LOGIN_STATUS = `${API_BASE_URL}/user/security/change-login-security-status`;
export const RESENT_SECURITY_CODE = `${API_BASE_URL}/auth/user/security/resend-security-code`;

// Common - Email Gateway
export const CREATE_EMAIL_GATEWAY = `${API_BASE_URL}/gateway/email-gateway/create-gateway`;
export const UPDATE_EMAIL_GATEWAY = `${API_BASE_URL}/gateway/email-gateway/update-gateway`;
export const GET_EMAIL_GATEWAY = `${API_BASE_URL}/gateway/email-gateway/get-gateway`;
export const UPDATE_EMAIL_GATEWAY_ACTIVATION_STATUS = `${API_BASE_URL}/gateway/email-gateway/change-gateway-activation-status`;
export const TEST_SMTP_EMAIL_GATEWAY_CREDENTIALS = `${API_BASE_URL}/gateway/email-gateway/verify-gateway`;
export const SEND_TEST_EMAIL = `${API_BASE_URL}/gateway/email-gateway/send-test-email`;

// Common - WhatsApp Gateway
export const CREATE_WHATSAPP_GATEWAY = `${API_BASE_URL}/gateway/whatsapp-gateway/create-gateway`;
export const SEND_TEST_WHATSAPP_MESSAGE = `${API_BASE_URL}/gateway/whatsapp-gateway/send-test-whatsapp-message`;
export const UPDATE_WHATSAPP_GATEWAY = `${API_BASE_URL}/gateway/whatsapp-gateway/update-gateway`;
export const GET_WHATSAPP_GATEWAY = `${API_BASE_URL}/gateway/whatsapp-gateway/get-gateway`;
export const UPDATE_WHATSAPP_GATEWAY_ACTIVATION_STATUS = `${API_BASE_URL}/gateway/whatsapp-gateway/change-gateway-activation-status`;

// Common - Email Templates
export const CREATE_EMAIL_TEMPLATE = `${API_BASE_URL}/template/email-template/create-template`;
export const UPDATE_EMAIL_TEMPLATE = `${API_BASE_URL}/template/email-template/update-template`;
export const GET_EMAIL_TEMPLATES = `${API_BASE_URL}/template/email-template/get-all-templates`;

// Common - WhatsApp Templates
export const CREATE_WHATSAPP_TEMPLATE = `${API_BASE_URL}/template/whatsapp-template/create-template`;
export const UPDATE_WHATSAPP_TEMPLATE = `${API_BASE_URL}/template/whatsapp-template/update-template`;
export const GET_WHATSAPP_TEMPLATES = `${API_BASE_URL}/template/whatsapp-template/get-all-templates`;

// Support
export const REPORT_NEW_BUG = `${API_BASE_URL}/support/bug-report/report-new-bug`;
export const UPDATE_STATUS = `${API_BASE_URL}/support/bug-report/update-status`;
export const UPDATE_PRIORITY_STATUS = `${API_BASE_URL}/support/bug-report/update-priorty-status`;
export const GET_ALL_BUG_REPORTS = `${API_BASE_URL}/support/bug-report/get-all-bug-reports`;
export const GET_ALL_COMPANY_BUG_REPORTS = `${API_BASE_URL}/company/get-all-bug-reports`;
export const GET_ALL_OPERATOR_BUG_REPORTS = `${API_BASE_URL}/operator/get-all-bug-reports`;
export const GET_BUG_REPORT_STATISTICS = `${API_BASE_URL}/support/bug-report/get-statistics`;
export const SEND_BUG_REPORT_MESSAGE = `${API_BASE_URL}/support/bug-report`;
export const GET_BUG_REPORT_STATUS_TYPES = `${API_BASE_URL}/support/bug-report/get-status-types`;
export const GET_BUG_REPORT_PRIORITY_STATUS_TYPES = `${API_BASE_URL}/support/bug-report/get-priorty-status-types`;
export const GET_BUG_REPORT_BY_ID = `${API_BASE_URL}/support/bug-report/get-bug-report`;

// Account -> User
export const GET_USER_BY_ID = `${API_BASE_URL}/user/get-user`;
export const GET_ALLOWED_PERMISSIONS = `${API_BASE_URL}/user/get-permissions`;
export const GET_ALLOWED_MODULES = `${API_BASE_URL}/user/get-allowed-modules`;
export const UPDATE_SUPERADMIN_BY_OWN = `${API_BASE_URL}/super-admin/update-super-admin`;
export const UPDATE_COMPANY_BY_OWN = `${API_BASE_URL}/company/update-company`;
export const UPDATE_OPERATOR_BY_OWN = `${API_BASE_URL}/operator/update-operator`;

// Settings -> Personalization -> User
export const CREATE_PERSONALIZATION = `${API_BASE_URL}/personalization/create-personalization`;
export const GET_ALL_ACTIVE_PERSONALIZATION = `${API_BASE_URL}/personalization/get-all-active-personalizations`;
export const GET_ALL_PERSONALIZATION = `${API_BASE_URL}/personalization/get-all-personalizations`;
export const UPDATE_PERSONALIZATION = `${API_BASE_URL}/personalization/update-personalization`;
export const GET_SUPERADMIN_PERSONALIZATION = `${API_BASE_URL}/super-admin/get-personalization`;
export const GET_COMPANY_PERSONALIZATION = `${API_BASE_URL}/company/get-personalization`;

// SuperAdmin -> City..
export const CREATE_CITY = `${API_BASE_URL}/city/create-city`;
export const GET_ALL_CITIES = `${API_BASE_URL}/city/get-all-cities`;
export const GET_ALL_ACTIVE_CITIES = `${API_BASE_URL}/city/get-all-active-cities`;
export const UPDATE_CITY = `${API_BASE_URL}/city/update-city`;
export const DELETE_CITY = `${API_BASE_URL}/city/delete-city`;

// SuperAdmin -> Country..
export const CREATE_COUNTRY = `${API_BASE_URL}/country/create-country`;
export const GET_ALL_COUNTRIES = `${API_BASE_URL}/country/get-all-countries`;
export const GET_ALL_ACTIVE_COUNTRIES = `${API_BASE_URL}/country/get-all-active-countries`;
export const UPDATE_COUNTRY = `${API_BASE_URL}/country/update-country`;
export const DELETE_COUNTRY = `${API_BASE_URL}/country/delete-country`;

// SuperAdmin -> Package..
export const CREATE_PACKAGE = `${API_BASE_URL}/package/create-package`;
export const GET_ALL_PACKAGES = `${API_BASE_URL}/package/get-all-packages`;
export const GET_ALL_ACTIVE_PACKAGES = `${API_BASE_URL}/package/get-all-active-packages`;
export const UPDATE_PACKAGE = `${API_BASE_URL}/package/update-package`;
export const DELETE_PACKAGE = `${API_BASE_URL}/package/delete-package`;
export const GET_ALL_PACKAGE_DURATION_TYPES = `${API_BASE_URL}/package/get-package-duration-types`;

// SuperAdmin -> Province..
export const CREATE_PROVINCE = `${API_BASE_URL}/province/create-province`;
export const GET_ALL_PROVINCES = `${API_BASE_URL}/province/get-all-provinces`;
export const GET_ALL_ACTIVE_PROVINCES = `${API_BASE_URL}/province/get-all-active-provinces`;
export const UPDATE_PROVINCE = `${API_BASE_URL}/province/update-province`;
export const DELETE_PROVINCE = `${API_BASE_URL}/province/delete-province`;

// SuperAdmin -> Complaint Types..
export const CREATE_TYPE = `${API_BASE_URL}/complaint-center/internal-complaint-type/create-type`;
export const GET_ALL_TYPES = `${API_BASE_URL}/complaint-center/internal-complaint-type/get-all-types`;
export const GET_ALL_ACTIVE_TYPES = `${API_BASE_URL}/complaint-center/internal-complaint-type/get-all-active-types`;
export const UPDATE_TYPE = `${API_BASE_URL}/complaint-center/internal-complaint-type/update-type`;
export const DELETE_TYPE = `${API_BASE_URL}/complaint-center/internal-complaint-type/delete-type`;

// SuperAdmin -> CRM Module..
export const CREATE_CRM_MODULE = `${API_BASE_URL}/crm-module/create-module`;
export const GET_ALL_CRM_MODULES = `${API_BASE_URL}/crm-module/get-all-modules`;
export const GET_ALL_ACTIVE_CRM_MODULES = `${API_BASE_URL}/crm-module/get-all-active-modules`;
export const UPDATE_CRM_MODULE = `${API_BASE_URL}/crm-module/update-module`;
export const DELETE_CRM_MODULE = `${API_BASE_URL}/crm-module/delete-module`;

// SuperAdmin -> Banks..
export const CREATE_BANK = `${API_BASE_URL}/setup/bank/create-bank`;
export const GET_ALL_BANKS = `${API_BASE_URL}/setup/bank/get-all-banks`;
export const UPDATE_BANK = `${API_BASE_URL}/setup/bank/update-bank`;
export const DELETE_BANK = `${API_BASE_URL}/setup/bank/delete-bank`;

// SuperAdmin -> Currencies..
export const CREATE_CURRENCY = `${API_BASE_URL}/setup/currency/create-currency`;
export const GET_ALL_CURRENCIES = `${API_BASE_URL}/setup/currency/get-all-currencies`;
export const GET_ALL_ACTIVE_CURRENCIES = `${API_BASE_URL}/setup/currency/get-all-active-currencies`;
export const CHANGE_CURRENCY_ACTIVATION_STATUS = `${API_BASE_URL}/setup/currency/change-activation-status`;
export const UPDATE_CURRENCY = `${API_BASE_URL}/setup/currency/update-currency`;
export const DELETE_CURRENCY = `${API_BASE_URL}/setup/currency/delete-currency`;

// SuperAdmin -> Languages..
export const CREATE_LANGUAGE = `${API_BASE_URL}/setup/language/create-language`;
export const GET_ALL_LANGUAGES = `${API_BASE_URL}/setup/language/get-all-languages`;
export const GET_ALL_ACTIVE_LANGUAGES = `${API_BASE_URL}/setup/language/get-all-active-languages`;
export const CHANGE_LANGUAGE_ACTIVATION_STATUS = `${API_BASE_URL}/setup/language/change-activation-status`;
export const UPDATE_LANGUAGE = `${API_BASE_URL}/setup/language/update-language`;
export const DELETE_LANGUAGE = `${API_BASE_URL}/setup/language/delete-language`;

// SuperAdmin -> Insurance..
export const CREATE_INSURANCE = `${API_BASE_URL}/setup/insurance/create-insurance`;
export const GET_ALL_INSURANCES = `${API_BASE_URL}/setup/insurance/get-all-insurance`;
export const UPDATE_INSURANCE = `${API_BASE_URL}/setup/insurance/update-insurance`;
export const DELETE_INSURANCE = `${API_BASE_URL}/setup/insurance/delete-insurance`;

// SuperAdmin -> Vehicle Make..
export const CREATE_VEHICLE_MAKE = `${API_BASE_URL}/setup/vehicle-make/create-vehicle-make`;
export const GET_ALL_VEHICLES_MAKE = `${API_BASE_URL}/setup/vehicle-make/get-all-vehicle-make`;
export const UPDATE_VEHICLE_MAKE = `${API_BASE_URL}/setup/vehicle-make/update-vehicle-make`;
export const DELETE_VEHICLE_MAKE = `${API_BASE_URL}/setup/vehicle-make/delete-vehicle-make`;

// SuperAdmin -> Vehicle Model..
export const CREATE_VEHICLE_MODEL = `${API_BASE_URL}/setup/vehicle-model/create-vehicle-model`;
export const GET_ALL_VEHICLES_MODEL = `${API_BASE_URL}/setup/vehicle-model/get-all-vehicle-models`;
export const UPDATE_VEHICLE_MODEL = `${API_BASE_URL}/setup/vehicle-model/update-vehicle-model`;
export const DELETE_VEHICLE_MODEL = `${API_BASE_URL}/setup/vehicle-model/delete-vehicle-model`;

// SuperAdmin -> Network Provider..
export const CREATE_NETWORK_PROVIDER = `${API_BASE_URL}/setup/network-provider/create-network-provider`;
export const GET_ALL_NETWORK_PROVIDERS = `${API_BASE_URL}/setup/network-provider/get-all-network-provider`;
export const UPDATE_NETWORK_PROVIDER = `${API_BASE_URL}/setup/network-provider/update-network-provider`;
export const DELETE_NETWORK_PROVIDER = `${API_BASE_URL}/setup/network-provider/delete-network-provider`;

// SuperAdmin -> Server Details..
export const CREATE_SERVER = `${API_BASE_URL}/server-management/create-server`;
export const GET_ALL_SERVERS = `${API_BASE_URL}/server-management/get-all-servers`;
export const GET_ALL_ACTIVE_SERVERS = `${API_BASE_URL}/server-management/get-all-active-servers`;
export const UPDATE_SERVER = `${API_BASE_URL}/server-management/update-server`;
export const DELETE_SERVER = `${API_BASE_URL}/server-management/delete-server`;
export const CHANGE_SERVER_PASSWORD = `${API_BASE_URL}/server-management/change-server-password`;
export const SEND_OTP_FOR_CHANGE_SERVER_PASSWORD = `${API_BASE_URL}/server-management/send-otp`;
export const VERIFY_OTP_FOR_CHANGE_SERVER_PASSWORD = `${API_BASE_URL}/server-management/verify-otp`;

// SuperAdmin -> Server Management...
export const GET_SERVER_HEALTH_STATISTICS = `${API_BASE_URL}/server-management/get-server-health-statistics`;
export const GET_ALL_SYSTEM_LOG = `${API_BASE_URL}/system-logs/get-all-system-logs`;
export const GET_ALL_CURRENT_DAY_SYSTEM_LOG = `${API_BASE_URL}/system-logs/get-current-day-system-logs`;

// SuperAdmin -> Companies...
export const CREATE_COMPANY = `${API_BASE_URL}/super-admin/create-company`;
export const GET_ALL_COMPANIES = `${API_BASE_URL}/super-admin/get-all-companies`;
export const GET_COMPANY_BY_ID = `${API_BASE_URL}/super-admin/get-company`;
export const UPDATE_COMPANY = `${API_BASE_URL}/super-admin/update-company`;
export const DELETE_COMPANY = `${API_BASE_URL}/super-admin/delete-company`;
export const EXTEND_COMPANY_PACKAGE = `${API_BASE_URL}/super-admin/extend-company-package`;

// SuperAdmin -> Geofence
export const CREATE_GEOFENCE = `${API_BASE_URL}/monitoring/geofence/create-geofence`;
export const GET_ALL_GEOFENCES = `${API_BASE_URL}/monitoring/geofence/get-all-geofences`;
export const UPDATE_GEOFENCE = `${API_BASE_URL}/monitoring/geofence/update-geofence`;
export const UPDATE_GEOFENCE_ACTIVATION_STATUS = `${API_BASE_URL}/monitoring/geofence/update-geofence-activation-status`;
export const CREATE_GROUP = `${API_BASE_URL}/monitoring/geofence-group/create-group`;
export const GET_ALL_GROUPS = `${API_BASE_URL}/monitoring/geofence-group/get-all-groups`;
export const UPDATE_GROUP = `${API_BASE_URL}/monitoring/geofence-group/update-group`;
export const UPDATE_GROUP_ACTIVATION_STATUS = `${API_BASE_URL}/monitoring/geofence-group/update-group-activation-status`;
export const GET_ALL_SUBGROUPS = `${API_BASE_URL}/monitoring/geofence-sub-group/get-all-geofence-subgroup`;
export const CREATE_SUBGROUP = `${API_BASE_URL}/monitoring/geofence-sub-group/create-geofence-sub-group`;
export const GET_ALL_SUBGROUPS_BY_GROUP_ID = `${API_BASE_URL}/monitoring/geofence-sub-group/get-all-subgroups-by-group`;
export const GET_ALL_GEOFENCES_BY_GROUP_ID = `${API_BASE_URL}/monitoring/geofence/get-all-geofences-by-group`;
export const UPDATE_SUBGROUP = `${API_BASE_URL}/monitoring/geofence-sub-group/update-subgroup`;
export const GET_ALL_GEOFENCES_BY_SUBGROUP = `${API_BASE_URL}/monitoring/geofence-sub-group/get-all-geofences-by-subgroup`;
export const DELETE_SUBGROUP = `${API_BASE_URL}/monitoring/geofence-sub-group/delete-geofence-subgroup`;
export const DELETE_GROUP = `${API_BASE_URL}/monitoring/geofence-group/delete-group`;
export const TRANSFER_SUBGROUP = `${API_BASE_URL}/monitoring/geofence-sub-group/transfer-geofence-subgroup`;
export const IMPORT_GEOFENCE = `${API_BASE_URL}/monitoring/geofence/import-geofences`;

// Company -> Departments
export const CREATE_SUB_ROLE = `${API_BASE_URL}/sub-role/create-sub-role`;
export const GET_ALL_SUB_ROLES = `${API_BASE_URL}/sub-role/get-all-sub-roles`;
export const GET_ALL_ACTIVE_SUB_ROLES = `${API_BASE_URL}/sub-role/get-all-active-sub-roles`;
export const CHANGE_SUB_ROLE_ACTIVATION_STATUS = `${API_BASE_URL}/sub-role/change-activation-status`;

// Company -> Warehouses
export const CREATE_WAREHOUSE = `${API_BASE_URL}/setup/warehouse/create-warehouse`;
export const GET_ALL_WAREHOUSES = `${API_BASE_URL}/setup/warehouse/get-all-warehouses`;
export const GET_ALL_ACTIVE_WAREHOUSES = `${API_BASE_URL}/setup/warehouse/get-all-active-warehouses`;
export const CHANGE_WAREHOUSE_ACTIVATION_STATUS = `${API_BASE_URL}/setup/warehouse/change-activation-status`;
export const DELETE_WAREHOUSE = `${API_BASE_URL}/setup/warehouse/delete-warehouse`;
export const UPDATE_WAREHOUSE = `${API_BASE_URL}/setup/warehouse/update-warehouse`;

// Company -> groups
export const CREATE_SALE_GROUP = `${API_BASE_URL}/setup/group/create-group`;
export const GET_ALL_SALE_GROUPS = `${API_BASE_URL}/setup/group/get-all-groups`;
export const GET_ALL_ACTIVE_SALE_GROUPS = `${API_BASE_URL}/setup/group/get-all-active-groups`;
export const CHANGE_SALE_GROUP_ACTIVATION_STATUS = `${API_BASE_URL}/setup/group/change-activation-status`;
export const DELETE_SALE_GROUP = `${API_BASE_URL}/setup/group/delete-group`;
export const UPDATE_SALE_GROUP = `${API_BASE_URL}/setup/group/update-group`;

// Company -> branches
export const CREATE_BRANCH = `${API_BASE_URL}/setup/branch/create-branch`;
export const GET_ALL_BRANCHES = `${API_BASE_URL}/setup/branch/get-all-branches`;
export const GET_ALL_ACTIVE_BRANCHES = `${API_BASE_URL}/setup/branch/get-all-active-branches`;
export const CHANGE_BRANCHES_ACTIVATION_STATUS = `${API_BASE_URL}/setup/branch/change-activation-status`;
export const DELETE_BRANCH = `${API_BASE_URL}/setup/branch/delete-branch`;
export const UPDATE_BRANCH = `${API_BASE_URL}/setup/branch/update-branch`;

// Company -> Modules - ComplaintCenter
export const GET_DEVICE_DATA = `${API_BASE_URL}/complaint-center/get-device-data`;
export const GET_COMPLAINT_CENTER_STATUS_TYPES = `${API_BASE_URL}/complaint-center/get-status-types`;
export const GET_COMPLAINT_CENTER_PRIORITY_STATUS = `${API_BASE_URL}/complaint-center/get-priorty-status-types`;
export const CREATE_NEW_INTERNAL_COMPLAINT = `${API_BASE_URL}/complaint-center/create-new-internal-complaint`;
export const GET_ALL_INTERNAL_COMPLAINT = `${API_BASE_URL}/complaint-center/get-all-internal-complaints`;
export const GET_INTERNAL_COMPLAIN_BY_ID = `${API_BASE_URL}/complaint-center/get-internal-complaint`;
export const SEND_INTERNAL_COMPLAINT_MESSAGE = `${API_BASE_URL}/complaint-center/internal-complaint`;
export const UPDATE_INTERNAL_COMPLAINT = `${API_BASE_URL}/complaint-center/update-internal-complaint`;
export const GET_COMPLAINT_CENTER_STATISTICS = `${API_BASE_URL}/complaint-center/get-statistics`;

// Company -> Modules - ControlRoom
export const GET_ALERT_EVENTS = `${API_BASE_URL}/company/alert-events`;
export const ASSIGN_ALERT_EVENT_TO_ME = `${API_BASE_URL}/company/assign-alert-event-to-me`;
export const GET_ALL_ASSIGNED_ALERT_EVENTS = `${API_BASE_URL}/company/get-all-assigned-events`;
export const GET_ALL_COMPLETED_ALERT_EVENTS = `${API_BASE_URL}/company/get-all-completed-events`;
export const GET_ALERT_EVENT_BY_ID = `${API_BASE_URL}/alert-events/get-alert-event-by-id`;
export const COMPLETE_AN_ALERT_EVENT = `${API_BASE_URL}/alert-events/complete-an-alert-event`;
export const GET_DEVICE_COMMANDS = `${API_BASE_URL}/control-room/get-device-commands`;
export const SEND_COMMAND_TO_DEVICE = `${API_BASE_URL}/control-room/send-command-to-device`;
export const GET_ALL_KILLED_DEVICES = `${API_BASE_URL}/control-room/get-all-killed-devices?type=self`;
export const CONTROLROOM_DASHBOARD_STATISTICS = `${API_BASE_URL}/control-room/dashboard/statistics`;
export const GET_ALL_COMMANDED_DEVICES = `${API_BASE_URL}/control-room/get-all-commanded-devices`;
export const VERIFY_VEHICLE_BLOCK_STATUS = `${API_BASE_URL}/control-room/verify-vehicle-block-status`;
export const VERIFY_AND_UPDATE_ALL_VEHICLE_BLOCK_STATUS = `${API_BASE_URL}/control-room/verify-and-update-all-block-status`;
export const ADD_PRE_INFO_FOR_DEVICE = `${API_BASE_URL}/control-room/add-pre-info`;
export const GET_ALL_VALID_PRE_INFOS = `${API_BASE_URL}/control-room/get-all-pre-infos`;
export const GET_ALL_MERGED_ALERT_EVENTS = `${API_BASE_URL}/control-room/get-all-merged-alert-events-of-device`;


// Company -> Modules - SAIO-Central - Customer

export const CREATE_NEW_CUSTOMER = `${API_BASE_URL}/customer/create-customer`;
export const GET_ALL_CUSTOMERS = `${API_BASE_URL}/customer/get-all-customers`;
export const GET_SINGLE_CUSTOMERS = `${API_BASE_URL}/customer/get-customer`;



// Company -> Modules - SIAO-Central - SaleLeads

export const CREATE_NEW_LEAD = `${API_BASE_URL}/sale-lead/create-new-lead`;
export const GET_ALL_SALELEADS = `${API_BASE_URL}/sale-lead/get-all-leads`;
export const GET_SINGLE_SALELEAD = `${API_BASE_URL}/sale-lead/get-sale-lead`;
export const CONFIRM_OR_REJECT_SALELEAD = `${API_BASE_URL}/sale-lead/confirm-or-reject-lead`;
export const CREATE_NEW_SALELEAD_VEHICLE = `${API_BASE_URL}/vehicle/create-vehicle`;

// Company -> Modules - SAIO-Central -Accounts - Expense Accounts

export const CREATE_NEW_EXPENSE_ACCOUNT = `${API_BASE_URL}/accounts/expense-account/create-expense-account`;
export const GET_ALL_EXPENSE_ACCOUNTS = `${API_BASE_URL}/accounts/expense-account/get-all-expense-accounts`;
export const GET_ALL_ACTIVE_EXPENSE_ACCOUNTS = `${API_BASE_URL}/accounts/expense-account/get-all-active-expense-accounts`;
export const CHANGE_EXPENSE_ACCOUNT_ACTIVATION_STATUS = `${API_BASE_URL}/accounts/expense-account/change-expense-account-activation`;
export const UPDATE_EXPENSE_ACCOUNT = `${API_BASE_URL}/accounts/expense-account/update-expense-account`;
export const DELETE_EXPENSE_ACCOUNT = `${API_BASE_URL}/accounts/expense-account/delete-expense-account`;


// Company -> Modules - SAIO-Central -Accounts - Bank Accounts

export const CREATE_NEW_BANK_ACCOUNT = `${API_BASE_URL}/accounts/bank-account/create-bank-account`;
export const GET_ALL_BANK_ACCOUNTS = `${API_BASE_URL}/accounts/bank-account/get-all-bank-accounts`;
export const UPDATE_BANK_ACCOUNT = `${API_BASE_URL}/accounts/bank-account/update-bank-account`;
export const DELETE_BANK_ACCOUNT = `${API_BASE_URL}/accounts/bank-account/delete-bank-account`;
export const GET_ALL_ACCOUNT_TYPES = `${API_BASE_URL}/accounts/bank-account/get-all-account-types`;


// Company -> Modules - Monitoring
export const GET_DEVICES = `${API_BASE_URL}/company/devices`;

// Company -> Modules- SAIO - inventory
export const CREATE_PRODUCT = `${API_BASE_URL}/product/create-product`;
export const GET_ALL_PRODUCTS = `${API_BASE_URL}/product/get-all-products`;
export const DELETE_PRODUCT = `${API_BASE_URL}/product/delete-product`;
export const UPDATE_PRODUCT = `${API_BASE_URL}/product/update-product`;
export const GET_ALL_PRODUCT_TYPES = `${API_BASE_URL}/product/get-all-product-types`;
export const GET_ALL_UNITS = `${API_BASE_URL}/product/get-all-units`;

// Company -> Modules- SAIO - accounts
export const CREATE_VENDOR = `${API_BASE_URL}/setup/vendor/create-vendor`;
export const GET_ALL_VENDORS = `${API_BASE_URL}/setup/vendor/get-all-vendors`;
export const DELETE_VENDOR = `${API_BASE_URL}/setup/vendor/delete-vendor`;
export const UPDATE_VENDOR = `${API_BASE_URL}/setup/vendor/update-vendor`;
export const GET_VENDOR_BY_ID = `${API_BASE_URL}/setup/vendor/get-vendor-by-id`;



// Company -> Operators
export const CREATE_OPERATOR = `${API_BASE_URL}/operator/create-operator`;
export const GET_ALL_OPERATORS = `${API_BASE_URL}/operator/get-all-operators`;
export const UPDATE_OPERATOR = `${API_BASE_URL}/operator/update-operator`;
export const DELETE_OPERATOR = `${API_BASE_URL}/operator/delete-operator`;

// Company -> Reports
export const GET_ALL_ALERT_EVENTS_REPORTS = `${API_BASE_URL}/reports/get-all-alert-events-report`;
export const GET_ALL_REPORT_TYPES = `${API_BASE_URL}/reports/get-all-report-types`;

// Dashboard
export const GET_GENERAL_DASHBOARD_STATISTICS = `${API_BASE_URL}/company/dashboard/general`;
export const GET_OPERATOR_PERFORMANCE = `${API_BASE_URL}/company/dashboard/operators-performance`;
export const GET_COMPANY_ALERTS_OVERVIEW = `${API_BASE_URL}/company/dashboard/alerts-overview`;
