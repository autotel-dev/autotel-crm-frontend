
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PlusCircle } from 'react-feather'
import StickyBar from './components/StickyBar/StickyBar'

import { useDispatch } from 'react-redux'
import { setExpenseAccounts, setIsConnected } from '../../../../../../ReaduxToolkit/Reducer/ExpenseAccountsSlice'
import { create, getAll } from '../../../../../../Utilities/api'
import { GET_ACCOUNTING_CHART, GET_ALL_BANK_ACCOUNTS, GET_ALL_EXPENSE_ACCOUNTS, GET_ALL_EXPENSES, GET_ALL_PURCHASE_INVOICES, GET_ALL_TAXES } from '../../../../../../Utilities/api/apiEndpoints'
import { ERROR_MESSAGE } from '../../../../../../Utilities/constants/constants'
import { setBankAccounts } from '../../../../../../ReaduxToolkit/Reducer/BankAccountSlice'
import { setExpenses } from '../../../../../../ReaduxToolkit/Reducer/ExpensesSlice'
import { setPurchaseInvoices } from '../../../../../../ReaduxToolkit/Reducer/PurchaseInvoiceSlice'
import { Outlet } from 'react-router-dom'
import { setTaxes } from '../../../../../../ReaduxToolkit/Reducer/TaxSlice'
import { setChartOfAccount } from '../../../../../../ReaduxToolkit/Reducer/AccountSlice'


const Accounts = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const [component, setComponent] = useState("Bank Accounts");

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
        dispatch(setTaxes([]));
        getAll({ url: GET_ALL_TAXES }).then((data: any) => {

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
                    dispatch(setTaxes(data.data));
                }
            }
        });
    }, []);
    useEffect(() => {
        dispatch(setChartOfAccount([]));
        getAll({ url: GET_ACCOUNTING_CHART }).then((data: any) => {

            if (data !== undefined) {
                if (!data.success) {

                }
                if (data.success) {
                    // // console.log("hhg");
                    dispatch(setChartOfAccount(data.data));
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
            <Container fluid>
                <Row
                    style={{
                        width: "100%",
                    }}
                >
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <Outlet />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default Accounts
