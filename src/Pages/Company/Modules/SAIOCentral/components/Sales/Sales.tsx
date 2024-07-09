
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import StickyBar from './components/StickyBar/StickyBar'
import { useState } from 'react'
import SaleLeadsTable from './components/SaleLeads/SaleLeadsList'
import CreateNewSaleLead from './components/SaleLeads/CreateNewSaleLead/CreateNewSaleLead'
import { useSelector } from 'react-redux'
import { PlusCircle } from 'react-feather'
import InvoicesTable from './components/Invoices/InvoicesList'
import ReceiveMoneyTable from './components/ReceiveMoney/ReceiveMoneyList'

const Sales = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const [component, setComponent] = useState("Sale Leads")
    return (
        <div>
            <StickyBar component={component} setComponent={setComponent} />
            <div style={{
                margin: "-10px 30px 0px 15px",
            }}>
                <Breadcrumbs mainTitle={component} parent="SAIO Central" title={component} />
            </div>
            {component == "Sale Leads" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <SaleLeadsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Invoices" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <InvoicesTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Receive Money" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ReceiveMoneyTable />
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
                                <SaleLeadsTable />
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

export default Sales
