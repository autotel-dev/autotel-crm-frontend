import { Col, Row } from "reactstrap";

import CreateNewTripReport from "./CreateNewTripReport";

const ReportsListNav = ({ dropDownDevices }: any) => {
  return (
    <Row>
      <Col md={6}></Col>
      <CreateNewTripReport dropDownDevices={dropDownDevices} />
    </Row>
  );
};

export default ReportsListNav;
