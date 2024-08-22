import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./Route";
import Layout from "../Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
// import Sales from "../Pages/Company/Modules/SAIO/components/Sales/Sales";
import Accounts from "../Pages/Company/Modules/SAIO/components/Accounts/Accounts";
import Inventory from "../Pages/Company/Modules/SAIO/components/Inventory/Inventory";
import Operations from "../Pages/Company/Modules/SAIO/components/Operations/Operations";
import ProductsTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/Products/ProductsList";
import StockMovementTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/StockMovement/StockMovementList";
import StockAdjustmentTypesTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/StockAdjustmentTypes/StockAdjustmentTypesList";
import VendorsTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/Vendor/VendorList";
import PurchaseInvoiceTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/PurchaseInvoice/PurchaseInvoicelist";
import ExpenseAccountsTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/ExpenseAccounts/ExpenseAccountsList";
import BankAccountsTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/BankAccounts/BankAccountsList";
import ExpensesTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/Expenses/ExpensesList";
import MakePaymentTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/MakePayment/MakePaymentList";
import CreateNewPurchaseInvoice from "../Pages/Company/Modules/SAIO/components/Accounts/components/PurchaseInvoice/CreateNewPurchaseInvoice/CreateNewPurchaseInvoice";
import CreateNewExpenses from "../Pages/Company/Modules/SAIO/components/Accounts/components/Expenses/CreateNewExpenses/CreateNewExpenses";
import Sales from "../Pages/Company/Modules/SAIOCentral/components/Sales/Sales";
import TaxTable from "../Pages/Company/Modules/SAIO/components/Accounts/components/Tax/TaxesList";
import StockAdjustmentTable from "../Pages/Company/Modules/SAIO/components/Inventory/components/StockAdjustment/StockAdjustmentList";

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
              isLayout
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
                  {
                    isLayout == true ? <Route path={path} element={Component} key={i}>
                      <Route path={path} element={<Navigate to={`${path}/sales`} replace />} />
                      <Route path={`${path}/sales`} element={<Sales />} />
                      {/* <Route path={`${path}/accounts`} element={<Accounts />} /> */}
                      <Route path={`${path}/accounts`} element={<Accounts />} >
                        <Route path={`${path}/accounts`} element={<Navigate to={`${path}/accounts/vendors`} replace />} />
                        <Route path={`${path}/accounts/vendors`} element={<VendorsTable />} />
                        <Route path={`${path}/accounts/purchase-invoices`} element={<PurchaseInvoiceTable />} />
                        <Route path={`${path}/accounts/purchase-invoices/create-invoice`} element={<CreateNewPurchaseInvoice />} />
                        <Route path={`${path}/accounts/purchase-invoices/invoice-detail/:id`} element={<CreateNewPurchaseInvoice />} />
                        <Route path={`${path}/accounts/expense-accounts`} element={<ExpenseAccountsTable />} />
                        <Route path={`${path}/accounts/bank-accounts`} element={<BankAccountsTable />} />
                        <Route path={`${path}/accounts/expenses`} element={<ExpensesTable />} />
                        <Route path={`${path}/accounts/expenses/create-expense`} element={<CreateNewExpenses />} />
                        <Route path={`${path}/accounts/expenses/expense-detail/:id`} element={<CreateNewExpenses />} />
                        <Route path={`${path}/accounts/make-payments`} element={<MakePaymentTable />} />
                        <Route path={`${path}/accounts/tax`} element={<TaxTable />} />
                      </Route>
                      <Route path={`${path}/inventory`} element={<Inventory />} >
                        <Route path={`${path}/inventory`} element={<Navigate to={`${path}/inventory/products`} replace />} />
                        <Route path={`${path}/inventory/products`} element={<ProductsTable />} />
                        <Route path={`${path}/inventory/stock-movement`} element={<StockMovementTable />} />
                        <Route path={`${path}/inventory/stock-adjustment-type`} element={<StockAdjustmentTypesTable />} />
                        <Route path={`${path}/inventory/stock-adjustment`} element={<StockAdjustmentTable />} />
                      </Route>
                      <Route path={`${path}/operations`} element={<Operations />} />
                    </Route> : <Route path={path} element={Component} />
                  }

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
