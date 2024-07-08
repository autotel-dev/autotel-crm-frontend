
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import StickyBar from './components/StickyBar/StickyBar'
import { useState } from 'react'
import CreateNewSaleLead from './components/CreateNewSaleLead/CreateNewSaleLead'
import SaleLeadsTable from './components/SaleLeads/SaleLeadsList'

const Sales = () => {
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
            </Container> : <CreateNewSaleLead />
            }
        </div>
    )
}

export default Sales
