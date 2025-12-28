import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./Route";
import Layout from "../Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
// import Sales from "../Pages/Company/Modules/SAIO/components/Sales/Sales";
import Accounts from "../Pages/Company/Modules/SAIO/components/Accounts/Accounts";
import Inventory from "../Pages/Company/Modules/SAIO/components/Inventory/Inventory";
import ProductsTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/Products/ProductsList";
import StockMovementTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/StockMovement/StockMovementList";
import StockAdjustmentTypesTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/StockAdjustmentTypes/StockAdjustmentTypesList";
import ExpenseAccountsTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/ExpenseAccounts/ExpenseAccountsList";
import BankAccountsTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/BankAccounts/BankAccountsList";
import ExpensesTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/Expenses/ExpensesList";
import CreateNewExpenses from "../Pages/Company/Modules/SAIO/components/Accounts/components/Expenses/CreateNewExpenses/CreateNewExpenses";
import TaxTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/Tax/TaxesList";
import StockAdjustmentTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/StockAdjustment/StockAdjustmentList";
import Operations from "../Pages/Company/Modules/SAIO/components/Operations/Operations";
import ActivityTable from "../Pages/Company/Modules/SAIO/components/Operations/components/Activity/ActivityList";
import CreateNewActivity from "../Pages/Company/Modules/SAIO/components/Operations/components/Activity/CreateNewActivity/CreateNewActivity";
import SaleLeadsTable from "../Pages/Company/Modules/SAIO/components/Sales/components/SaleLeads/SaleLeadsList";
import CreateNewSaleLead from "../Pages/Company/Modules/SAIO/components/Sales/components/SaleLeads/CreateNewSaleLead/CreateNewSaleLead";
import Sales from "../Pages/Company/Modules/SAIO/components/Sales/Sales";
import InvoicesTable from "../Pages/Company/Modules/SAIO/components/Sales/components/Invoices/InvoicesList";
import ReceiveMoneyTable from "../Pages/Company/Modules/SAIO/components/Sales/components/ReceiveMoney/ReceiveMoneyList";
import CustomerTable from "../Pages/Company/Modules/SAIO/components/Sales/components/Customer/CustomerList";
import CreateNewSaleInvoice from "../Pages/Company/Modules/SAIO/components/Sales/components/Invoices/CreateNewSaleInvoice/CreateNewSaleInvoice";
import CreateNewCustomer from "../Pages/Company/Modules/SAIO/components/Sales/components/Customer/CreateNewCustomer/CreateNewCustomer";
import Purchases from "../Pages/Company/Modules/SAIO/components/Purchases/Purchases";
import VendorsTable from "../Pages/Company/Modules/SAIO/components/Purchases/components/Vendor/VendorList";
import PurchaseInvoiceTable from "../Pages/Company/Modules/SAIO/components/Purchases/components/PurchaseInvoice/PurchaseInvoicelist";
import CreateNewPurchaseInvoice from "../Pages/Company/Modules/SAIO/components/Purchases/components/PurchaseInvoice/CreateNewPurchaseInvoice/CreateNewPurchaseInvoice";
import MakePaymentTable from "../Pages/Company/Modules/SAIO/components/Purchases/components/MakePayment/MakePaymentList";
import SalesDashboard from "../Pages/Company/Modules/SAIO/components/Dashboard/Dashboard";
import ChartOfAccountTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/ChartOfAccounts/ChartOfAccountLists";
import InvoiceDetail from "../Pages/Company/Modules/SAIO/components/Sales/components/Invoices/CreateNewSaleInvoice/InvoiceDetail";
import CreateNewMakePayment from "../Pages/Company/Modules/SAIO/components/Purchases/components/MakePayment/CreateNewMakePayment/CreateNewMakePayment";
import CreateNewReceiveMoney from "../Pages/Company/Modules/SAIO/components/Sales/components/ReceiveMoney/CreateNewMakePayment/CreateNewReceiveMoney";
import CustomerLedgerTable from "../Pages/Company/Modules/SAIO/components/Sales/components/CustomerLedger/CustomerLedgerList";
import CreateNewCustomerLedger from "../Pages/Company/Modules/SAIO/components/Sales/components/CustomerLedger/CreateNewMakePayment/CreateNewCustomerLedger";
import VendorLedgerTable from "../Pages/Company/Modules/SAIO/components/Purchases/components/VendorLedger/VendorLedgerList";
import CreateNewVendorLedger from "../Pages/Company/Modules/SAIO/components/Purchases/components/VendorLedger/CreateNewMakePayment/CreateNewVendorLedger";
import CompanyLedgerTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/AccountingLedgerReport/CompanyLedgerReport";
import TripManagementDashboard from "../Pages/Company/Modules/TripManagement/components/Dashboard/Dashboard";
import TripManagementPlanning from "../Pages/Company/Modules/TripManagement/components/Planning/Planning";
import TripManagementAlerts from "../Pages/Company/Modules/TripManagement/components/Alerts/Alerts";
import TripManagementReports from "../Pages/Company/Modules/TripManagement/components/Reports/Reports";
import Trips from "../Pages/Company/Modules/TripManagement/components/Trips/Trips";
import TripsList from "../Pages/Company/Modules/TripManagement/components/Trips/TripsList";
import CreateNewTrip from "../Pages/Company/Modules/TripManagement/components/Trips/CreateNewTrip/CreateNewTrip";
import TripDetails from "../Pages/Company/Modules/TripManagement/components/Trips/TripDetails/TripDetails";

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
