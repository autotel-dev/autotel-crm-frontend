
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PlusCircle } from 'react-feather'
import StickyBar from './components/StickyBar/StickyBar'
import ProductsTable from './components/Products/ProductsList'
import ProductTypesTable from './components/ProductTypes/ProductTypesList'
import StockMovementTable from './components/StockMovement/StockMovementList'
import StockAdjustmentTable from './components/StockAdjustment/StockAdjustment'


const Inventory = () => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const [component, setComponent] = useState("Products")
    return (
        <div>
            <StickyBar component={component} setComponent={setComponent} />
            <div style={{
                margin: "-10px 30px 0px 15px",
            }}>
                <Breadcrumbs mainTitle={component} parent="SAIO Central" title={component} />
            </div>
            {component == "Products" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ProductsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Product types" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ProductTypesTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> : component == "Stock Movement" ? <Container fluid>
                <Row style={{
                    width: "100%",
                }}>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <StockMovementTable />
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
                                <StockAdjustmentTable />
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

export default Inventory
