

import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import Breadcrumbs from '../../../../../../CommonElements/Breadcrumbs/Breadcrumbs'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import ActivitiesTable from './components/Activity/ActivitiesList'



const Operations = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const [component, setComponent] = useState("Vendors")
  return (
    <div>

      <div style={{
        margin: "-10px 30px 0px 15px",
      }}>
        <Breadcrumbs mainTitle="Operations" parent="SAIO Central" title="Operations" />
      </div>
      <Container fluid>
        <Row style={{
          width: "100%",
        }}>
          <Col sm={12}>
            <Card>
              <CardBody>
                <ActivitiesTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

         {/* <CreateNewSaleLead /> */}
      
    </div>
  )
}

export default Operations
