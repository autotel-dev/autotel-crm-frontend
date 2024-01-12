import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { support } from "../../utils/Constant";
import CommonHeader from "../../Common/CommonHeader";
import SupportList from "./SupportList";
import SupportTable from "./SupportTable";

const Support = () => {
  return (
    <>
      <Breadcrumbs mainTitle={support} parent={support} title={support} />
      <Container fluid>
        <Row>
          <Col sm={12}>
            <Card>
              <CommonHeader
                title={support}
                subTitle={[{ text: "List of supports opened by customers" }]}
              />
              <CardBody>
                <SupportList />
                <SupportTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Support;
