import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../../../../../AbstractElements";

const CustomerInfo = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <Col md={12}>
      <form
        className="form-bookmark needs-validation"
        //   onSubmit={handleSubmit(addCountry)}
      >
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-12 create-group">
            <Label>Name</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={"Name"}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-12 create-group">
            <Label>City</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={"City"}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-12 create-group">
            <Label>Phone Number</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={"Phone Number"}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default CustomerInfo;
