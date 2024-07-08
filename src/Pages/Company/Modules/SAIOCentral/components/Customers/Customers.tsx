
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import { useState } from 'react'
import StickyBar from './StickyBar/StickyBar'
import CustomerList from './CustomerList/CustomerList'
import CreateNewCustomer from './CreateNewCustomer/CreateNewCustomer'


const Customers = () => {
    const [component, setComponent] = useState("Customer List")
    return (
        <div>
            <StickyBar component={component} setComponent={setComponent} />
            <div style={{
                margin: "-10px 30px 0px 15px",
            }}>
                <Breadcrumbs mainTitle={component} parent="SAIO Central" title={component} />
            </div>
            {component == "Customer List" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <CustomerList />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : <CreateNewCustomer />
            }
        </div>
    )
}

export default Customers
