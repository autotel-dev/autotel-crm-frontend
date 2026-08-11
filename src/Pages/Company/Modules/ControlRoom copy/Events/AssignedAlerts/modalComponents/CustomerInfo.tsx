import { Col } from "reactstrap";
import { FormGroup, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { P } from "../../../../../../../AbstractElements";

const CustomerInfo = () => {
  const { modalData } = useSelector((state: any) => state.alerts);

  const alertEvent = modalData?.alertEvent;
  const vehicle = alertEvent?.vehicle || {};
  const customer = vehicle?.customer || {};

  const dob = customer?.dob ? `${customer.dob}`.slice(0, 10) : "";

  return (
    <Col md={12}>
      <form className="form-bookmark needs-validation">
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-6 create-group">
            <P>Customer Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.fullName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Mobile Number 1</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.phoneNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Mobile Number 2</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.additionalContactNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Email Address</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.emailAddress}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>CNIC Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.cnic}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Date Of Birth</P>
            <input
              className="form-control"
              type="text"
              defaultValue={dob}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Mother Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.motherName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Normal Password</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.normalPassword}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Emergency Password</P>
            <input
              className="form-control"
              type="text"
              defaultValue={customer?.emergencyPassword}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Instructions</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.instructions}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default CustomerInfo;
