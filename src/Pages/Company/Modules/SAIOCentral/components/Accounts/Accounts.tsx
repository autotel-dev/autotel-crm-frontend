
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PlusCircle } from 'react-feather'
import StickyBar from './components/StickyBar/StickyBar'
import VendorsTable from './components/Vendor/VendorList'
import PurchaseInvoiceTable from './components/PurchaseInvoice/PurchaseInvoicelist'
import ExpenseAccountsTable from './components/ExpenseAccounts/ExpenseAccountsList'
import BankAccountsTable from './components/BankAccounts/BankAccountsList'
import MakePaymentTable from './components/MakePayment/MakePaymentList'
import ExpensesTable from './components/Expenses/ExpensesList'


const Accounts = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const [component, setComponent] = useState("Vendors")
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
            </Container> : component == "Purchase Invoice" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <PurchaseInvoiceTable />
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
            </Container> : <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ExpensesTable />
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
