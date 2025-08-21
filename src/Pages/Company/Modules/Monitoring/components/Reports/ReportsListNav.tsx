import { Col, Row } from "reactstrap";

import CreateNewReport from "./CreateNewReport";

const ReportsListNav = ({ dropDownDevices }: any) => {
  return (
    <Row>
      <Col md={6}></Col>
      <CreateNewReport dropDownDevices={dropDownDevices} />
    </Row>
  );
};

export default ReportsListNav;
