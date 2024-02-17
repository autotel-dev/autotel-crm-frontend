import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../../../../../AbstractElements";

const CustomerInfo = () => {
  const dispatch = useDispatch();
  const { modalData } = useSelector((state: any) => state.alerts);

  return (
    <Col md={12}>
      <form
        className="form-bookmark needs-validation"
        //   onSubmit={handleSubmit(addCountry)}
      >
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-6 create-group">
            <Label>Customer Name</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.customerName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Mobile Number 1</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.mobile1}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Mobile Number 2</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.mobile2}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Secondary Mobile Number</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.secondaryMobileNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Emergency Contact 1</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.emergencyMobileNo_1}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Emergency Contact 2</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.emergencyMobileNo_2}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>CNIC Number</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.nicNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Address</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.address}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Mother Name</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.motherName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Date Of Birth</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.dateOfBirth}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Normal Password</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.normalPassword}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Emergency Password</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.emergencyPassword}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>Instructions</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.instructions}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <Label>SIM Number</Label>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData.customerInfo.simNumber}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default CustomerInfo;
