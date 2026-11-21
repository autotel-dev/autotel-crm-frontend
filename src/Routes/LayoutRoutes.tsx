import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./Route";
import Layout from "../Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

// Pages load on demand: each page's code downloads the first time it is opened.
const Accounts = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/Accounts"));
const Inventory = lazy(() => import("../Pages/Company/Modules/SAIO/components/Inventory/Inventory"));
const ProductsTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Inventory/components/Products/ProductsList"));
const StockMovementTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Inventory/components/StockMovement/StockMovementList"));
const StockAdjustmentTypesTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Inventory/components/StockAdjustmentTypes/StockAdjustmentTypesList"));
const ExpenseAccountsTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/ExpenseAccounts/ExpenseAccountsList"));
const BankAccountsTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/BankAccounts/BankAccountsList"));
const ExpensesTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/Expenses/ExpensesList"));
const CreateNewExpenses = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/Expenses/CreateNewExpenses/CreateNewExpenses"));
const TaxTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/Tax/TaxesList"));
const StockAdjustmentTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Inventory/components/StockAdjustment/StockAdjustmentList"));
const Operations = lazy(() => import("../Pages/Company/Modules/SAIO/components/Operations/Operations"));
const ActivityTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Operations/components/Activity/ActivityList"));
const CreateNewActivity = lazy(() => import("../Pages/Company/Modules/SAIO/components/Operations/components/Activity/CreateNewActivity/CreateNewActivity"));
const SaleLeadsTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/SaleLeads/SaleLeadsList"));
const CreateNewSaleLead = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/SaleLeads/CreateNewSaleLead/CreateNewSaleLead"));
const Sales = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/Sales"));
const InvoicesTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/Invoices/InvoicesList"));
const ReceiveMoneyTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/ReceiveMoney/ReceiveMoneyList"));
const CustomerTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/Customer/CustomerList"));
const CreateNewSaleInvoice = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/Invoices/CreateNewSaleInvoice/CreateNewSaleInvoice"));
const CreateNewCustomer = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/Customer/CreateNewCustomer/CreateNewCustomer"));
const Purchases = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/Purchases"));
const VendorsTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/Vendor/VendorList"));
const PurchaseInvoiceTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/PurchaseInvoice/PurchaseInvoicelist"));
const CreateNewPurchaseInvoice = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/PurchaseInvoice/CreateNewPurchaseInvoice/CreateNewPurchaseInvoice"));
const MakePaymentTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/MakePayment/MakePaymentList"));
const SalesDashboard = lazy(() => import("../Pages/Company/Modules/SAIO/components/Dashboard/Dashboard"));
const ChartOfAccountTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/ChartOfAccounts/ChartOfAccountLists"));
const InvoiceDetail = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/Invoices/CreateNewSaleInvoice/InvoiceDetail"));
const CreateNewMakePayment = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/MakePayment/CreateNewMakePayment/CreateNewMakePayment"));
const CreateNewReceiveMoney = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/ReceiveMoney/CreateNewMakePayment/CreateNewReceiveMoney"));
const CustomerLedgerTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/CustomerLedger/CustomerLedgerList"));
const CreateNewCustomerLedger = lazy(() => import("../Pages/Company/Modules/SAIO/components/Sales/components/CustomerLedger/CreateNewMakePayment/CreateNewCustomerLedger"));
const VendorLedgerTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/VendorLedger/VendorLedgerList"));
const CreateNewVendorLedger = lazy(() => import("../Pages/Company/Modules/SAIO/components/Purchases/components/VendorLedger/CreateNewMakePayment/CreateNewVendorLedger"));
const CompanyLedgerTable = lazy(() => import("../Pages/Company/Modules/SAIO/components/Accounts/components/AccountingLedgerReport/CompanyLedgerReport"));
const TripManagementDashboard = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Dashboard/Dashboard"));
const TripManagementPlanning = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Planning/Planning"));
const TripManagementAlerts = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Alerts/Alerts"));
const TripManagementReports = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Reports/Reports"));
const Trips = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Trips/Trips"));
const TripsList = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Trips/TripsList"));
const CreateNewTrip = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Trips/CreateNewTrip/CreateNewTrip"));
const TripDetails = lazy(() => import("../Pages/Company/Modules/TripManagement/components/Trips/TripDetails/TripDetails"));
// import Sales from "../Pages/Company/Modules/SAIO/components/Sales/Sales";

const LayoutRoutes = () => {
  return (
    <>
      <Routes>
        {routes.map(
          (
            {
              path,
              Component,
              isProtected,
              allowedUserRoles,
              permissionValue,
              isLayout,
            },
            i
          ) =>
            isProtected ? (
              <Route
                element={
                  <ProtectedRoute
                    allowedUserRoles={allowedUserRoles}
                    permissionValue={permissionValue}
                  />
                }
                key={i}
              >
                {/* <Route element={<Layout />} key={i}>
                  <Route path={path} element={Component} />
                </Route> */}
                <Route element={<Layout />} key={i}>
                  {isLayout == true ? (
                    <Route path={path} element={Component} key={i}>
                      {/* SAIO Central Routes */}
                      {path.includes('/saio-central') && (
                        <>
                          <Route
                            path={path}
                            element={<Navigate to={`${path}/dashboard`} replace />}
                          />
                          <Route
                            path={`${path}/dashboard`}
                            element={<SalesDashboard />}
                          />
                        </>
                      )}
                      {/* Trip Management Routes */}
                      {path.includes('/trip-management') && (
                        <>
                          <Route
                            path={path}
                            element={<Navigate to={`${path}/dashboard`} replace />}
                          />
                          <Route
                            path={`${path}/dashboard`}
                            element={<TripManagementDashboard />}
                          />
                          <Route path={`${path}/trips`} element={<Trips />}>
                            <Route
                              path={`${path}/trips`}
                              element={<TripsList />}
                            />
                            <Route
                              path={`${path}/trips/create-trip`}
                              element={<CreateNewTrip />}
                            />
                            <Route
                              path={`${path}/trips/view/:tripId`}
                              element={<TripDetails />}
                            />
                          </Route>
                          <Route
                            path={`${path}/planning`}
                            element={<TripManagementPlanning />}
                          />
                          <Route
                            path={`${path}/alerts`}
                            element={<TripManagementAlerts />}
                          />
                          <Route
                            path={`${path}/reports`}
                            element={<TripManagementReports />}
                          />
                        </>
                      )}
                      {/* SAIO Sales Routes */}
                      {path.includes('/saio-central') && (
                      <>
                      <Route path={`${path}/sales`} element={<Sales />}>
                        <Route
                          path={`${path}/sales`}
                          element={
                            <Navigate to={`${path}/sales/leads`} replace />
                          }
                        />
                        <Route
                          path={`${path}/sales/leads`}
                          element={<SaleLeadsTable />}
                        />
                        <Route
                          path={`${path}/sales/leads/sale-lead`}
                          element={<CreateNewSaleLead />}
                        />
                        <Route
                          path={`${path}/sales/leads/:id`}
                          element={<CreateNewSaleLead />}
                        />
                        <Route
                          path={`${path}/sales/invoices`}
                          element={<InvoicesTable />}
                        />
                        <Route
                          path={`${path}/sales/invoices/create-invoice`}
                          element={<CreateNewSaleInvoice />}
                        />
                        <Route
                          path={`${path}/sales/invoices/invoice-detail/:id`}
                          element={<InvoiceDetail />}
                        />
                        <Route
                          path={`${path}/sales/receive-money`}
                          element={<ReceiveMoneyTable />}
                        />
                        <Route
                          path={`${path}/sales/receive-money/create-receive-money`}
                          element={<CreateNewReceiveMoney />}
                        />
                        <Route
                          path={`${path}/sales/receive-money/:id`}
                          element={<CreateNewReceiveMoney />}
                        />
                        <Route
                          path={`${path}/sales/customers`}
                          element={<CustomerTable />}
                        />
                        <Route
                          path={`${path}/sales/customers/:id`}
                          element={<CreateNewCustomer />}
                        />
                        <Route
                          path={`${path}/sales/customers/create-customer`}
                          element={<CreateNewCustomer />}
                        />
                        <Route
                          path={`${path}/sales/customer-ledger`}
                          element={<CustomerLedgerTable />}
                        />
                        <Route
                          path={`${path}/sales/customer-ledger/create-customer-ledger`}
                          element={<CreateNewCustomerLedger />}
                        />
                      </Route>
                      <Route path={`${path}/purchases`} element={<Purchases />}>
                        <Route
                          path={`${path}/purchases`}
                          element={
                            <Navigate
                              to={`${path}/purchases/vendors`}
                              replace
                            />
                          }
                        />
                        <Route
                          path={`${path}/purchases/vendors`}
                          element={<VendorsTable />}
                        />
                        <Route
                          path={`${path}/purchases/purchase-invoices`}
                          element={<PurchaseInvoiceTable />}
                        />
                        <Route
                          path={`${path}/purchases/purchase-invoices/create-invoice`}
                          element={<CreateNewPurchaseInvoice />}
                        />
                        <Route
                          path={`${path}/purchases/purchase-invoices/invoice-detail/:id`}
                          element={<CreateNewPurchaseInvoice />}
                        />
                        <Route
                          path={`${path}/purchases/make-payments`}
                          element={<MakePaymentTable />}
                        />
                        <Route
                          path={`${path}/purchases/make-payments/create-payment`}
                          element={<CreateNewMakePayment />}
                        />
                        <Route
                          path={`${path}/purchases/make-payments/:id`}
                          element={<CreateNewMakePayment />}
                        />

                        <Route
                          path={`${path}/purchases/vendor-ledger`}
                          element={<VendorLedgerTable />}
                        />
                        <Route
                          path={`${path}/purchases/vendor-ledger/create-vendor-ledger`}
                          element={<CreateNewVendorLedger />}
                        />
                      </Route>
                      <Route path={`${path}/accounts`} element={<Accounts />}>
                        <Route
                          path={`${path}/accounts`}
                          element={
                            <Navigate
                              to={`${path}/accounts/bank-accounts`}
                              replace
                            />
                          }
                        />
                        <Route
                          path={`${path}/accounts/bank-accounts`}
                          element={<BankAccountsTable />}
                        />
                        <Route
                          path={`${path}/accounts/expense-accounts`}
                          element={<ExpenseAccountsTable />}
                        />
                        <Route
                          path={`${path}/accounts/bank-accounts`}
                          element={<BankAccountsTable />}
                        />
                        <Route
                          path={`${path}/accounts/expenses`}
                          element={<ExpensesTable />}
                        />
                        <Route
                          path={`${path}/accounts/expenses/create-expense`}
                          element={<CreateNewExpenses />}
                        />
                        <Route
                          path={`${path}/accounts/expenses/expense-detail/:id`}
                          element={<CreateNewExpenses />}
                        />
                        <Route
                          path={`${path}/accounts/tax`}
                          element={<TaxTable />}
                        />
                        <Route
                          path={`${path}/accounts/accounting-chart`}
                          element={<ChartOfAccountTable />}
                        />
                        <Route
                          path={`${path}/accounts/accounting-ledger`}
                          element={<CompanyLedgerTable />}
                        />
                      </Route>
                      <Route path={`${path}/inventory`} element={<Inventory />}>
                        <Route
                          path={`${path}/inventory`}
                          element={
                            <Navigate
                              to={`${path}/inventory/products`}
                              replace
                            />
                          }
                        />
                        <Route
                          path={`${path}/inventory/products`}
                          element={<ProductsTable />}
                        />
                        <Route
                          path={`${path}/inventory/stock-movement`}
                          element={<StockMovementTable />}
                        />
                        <Route
                          path={`${path}/inventory/stock-adjustment-type`}
                          element={<StockAdjustmentTypesTable />}
                        />
                        <Route
                          path={`${path}/inventory/stock-adjustment`}
                          element={<StockAdjustmentTable />}
                        />
                      </Route>
                      <Route
                        path={`${path}/operations`}
                        element={<Operations />}
                      >
                        <Route
                          path={`${path}/operations`}
                          element={
                            <Navigate
                              to={`${path}/operations/activity`}
                              replace
                            />
                          }
                        />
                        <Route
                          path={`${path}/operations/activity`}
                          element={<ActivityTable />}
                        />
                        <Route
                          path={`${path}/operations/activity/create-activity`}
                          element={<CreateNewActivity />}
                        />
                        <Route
                          path={`${path}/operations/activity/activity-detail/:id`}
                          element={<CreateNewActivity />}
                        />
                      </Route>
                      </>
                      )}
                    </Route>
                  ) : (
                    <Route path={path} element={Component} />
                  )}
                </Route>
              </Route>
            ) : (
              <Route element={<Layout />} key={i}>
                <Route path={path} element={Component} />
              </Route>
            )
        )}
      </Routes>

      {/* <Routes>
        {routes.map(({ path, Component }, i) => (
          <Route element={<Layout />} key={i}>
            <Route path={path} element={Component} />
          </Route>
        ))}
      </Routes> */}
    </>
  );
};

export default LayoutRoutes;
