
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PlusCircle } from 'react-feather'
import StickyBar from './components/StickyBar/StickyBar'
import VendorsTable from './components/Vendor/VendorList'
import ExpenseAccountsTable from './components/ExpenseAccounts/ExpenseAccountsList'
import BankAccountsTable from './components/BankAccounts/BankAccountsList'
import MakePaymentTable from './components/MakePayment/MakePaymentList'
import ExpensesTable from './components/Expenses/ExpensesList'
import { useDispatch } from 'react-redux'
import { setExpenseAccounts, setIsConnected } from '../../../../../../ReaduxToolkit/Reducer/ExpenseAccountsSlice'
import Swal from 'sweetalert2'
import { create, getAll } from '../../../../../../Utilities/api'
import { GET_ALL_BANK_ACCOUNTS, GET_ALL_EXPENSE_ACCOUNTS, GET_ALL_EXPENSES, GET_ALL_PURCHASE_INVOICES } from '../../../../../../Utilities/api/apiEndpoints'
import { ERROR_MESSAGE } from '../../../../../../Utilities/constants/constants'
import { setBankAccounts } from '../../../../../../ReaduxToolkit/Reducer/BankAccountSlice'
import CreateNewExpenses from './components/Expenses/CreateNewExpenses/CreateNewExpenses'
import CreateNewPurchaseInvoice from './components/PurchaseInvoice/CreateNewPurchaseInvoice/CreateNewPurchaseInvoice'
import PurchaseInvoiceTable from './components/PurchaseInvoice/PurchaseInvoicelist'
import { setExpenses } from '../../../../../../ReaduxToolkit/Reducer/ExpensesSlice'
import { setPurchaseInvoices } from '../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice'


const Accounts = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const [component, setComponent] = useState("Vendors");
    const [iscreateNewPurchaseInvoice, setIscreateNewPurchaseInvoice] = useState(false);
    const [iscreateNewExpenses, setIscreateNewExpenses] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setExpenseAccounts([]));
        getAll({ url: GET_ALL_EXPENSE_ACCOUNTS }).then((data: any) => {

            if (data !== undefined) {
                if (!data.success && data.message === ERROR_MESSAGE) {
                    dispatch(setIsConnected(true));
                }
                if (!data.success) {
                    // Swal.fire({
                    //     text: `${data.message}`,
                    //     icon: "error",
                    //     timer: 2000,
                    //     showConfirmButton: false,
                    // });
                }
                if (data.success) {
                    // // console.log("hhg");
                    dispatch(setExpenseAccounts(data.data));
                }
            }
        });
    }, []);

    useEffect(() => {
        dispatch(setBankAccounts([]));
        getAll({ url: GET_ALL_BANK_ACCOUNTS }).then((data: any) => {

            if (data !== undefined) {
                if (!data.success) {
                    // Swal.fire({
                    //     text: `${data.message}`,
                    //     icon: "error",
                    //     timer: 2000,
                    //     showConfirmButton: false,
                    // });
                }
                if (data.success) {
                    // // console.log("hhg");
                    dispatch(setBankAccounts(data.data));
                }
            }
        });
    }, []);

    useEffect(() => {
        dispatch(setExpenses([]));
        getAll({ url: GET_ALL_EXPENSES }).then((data: any) => {

            if (data !== undefined) {
                if (!data.success) {
                    // Swal.fire({
                    //     text: `${data.message}`,
                    //     icon: "error",
                    //     timer: 2000,
                    //     showConfirmButton: false,
                    // });
                }
                if (data.success) {
                    // // console.log("hhg");
                    dispatch(setExpenses(data.data));
                }
            }
        });
    }, []);
    useEffect(() => {
        dispatch(setPurchaseInvoices([]));
        getAll({ url: GET_ALL_PURCHASE_INVOICES }).then((data: any) => {

            if (data !== undefined) {
                if (!data.success) {
                    // Swal.fire({
                    //     text: `${data.message}`,
                    //     icon: "error",
                    //     timer: 2000,
                    //     showConfirmButton: false,
                    // });
                }
                if (data.success) {
                    // // console.log("hhg");
                    dispatch(setPurchaseInvoices(data.data));
                }
            }
        });
    }, []);

    return (
        <div>
            <StickyBar component={component} setComponent={setComponent} />
            <div style={{
                margin: "-10px 30px 0px 15px",
            }}>
                <Breadcrumbs mainTitle={component} parent="SAIO Central" title={component} />
            </div>
            {component == "Vendors" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <VendorsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Purchase Invoice" ? iscreateNewPurchaseInvoice ? <CreateNewPurchaseInvoice iscreateNewPurchaseInvoice={iscreateNewPurchaseInvoice} setIscreateNewPurchaseInvoice={setIscreateNewPurchaseInvoice} /> : <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <PurchaseInvoiceTable iscreateNewPurchaseInvoice={iscreateNewPurchaseInvoice} setIscreateNewPurchaseInvoice={setIscreateNewPurchaseInvoice} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Expense Accounts" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ExpenseAccountsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Bank Accounts" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <BankAccountsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Make Payment" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <MakePaymentTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : iscreateNewExpenses ? <CreateNewExpenses iscreateNewExpenses={iscreateNewExpenses} setIscreateNewExpenses={setIscreateNewExpenses} /> : <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ExpensesTable iscreateNewExpenses={iscreateNewExpenses} setIscreateNewExpenses={setIscreateNewExpenses} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

                // <CreateNewSaleLead />
            }
        </div>
    )
}

export default Accounts
