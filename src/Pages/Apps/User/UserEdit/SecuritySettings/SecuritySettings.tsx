import { Card, CardBody, Col, Row, Table } from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H1, H5 } from "../../../../../AbstractElements";

const SecuritySettings = () => {
  return (
    <Col md={12}>
      <Card>
        <CommonHeader
          title="Security Settings"
          headClass="card-title mb-0 pb-0"
        />
        <CardBody>
          <Row>
            <Col
              // lg={6}
              // md={6}
              // xs={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <H5>OTP Enabled</H5>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SecuritySettings;
