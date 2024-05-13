import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../AbstractElements";


const CustomerInfo = () => {
  const dispatch = useDispatch();
  const { createComplainModalData } = useSelector((state: any) => state.complainCenter);

  return (
    <Col md={12}>
      <form
        className="form-bookmark needs-validation"
      //   onSubmit={handleSubmit(addCountry)}
      >
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-6 create-group">
            <P>Customer Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.customerName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Mobile Number 1</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.mobile1}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Mobile Number 2</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.mobile2}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Secondary Mobile Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.secondaryMobileNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Emergency Contact 1</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.emergencyMobileNo_1}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Emergency Contact 2</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.emergencyMobileNo_2}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>CNIC Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.nicNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Address</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.address}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Mother Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.motherName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Date Of Birth</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.dateOfBirth}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Normal Password</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.normalPassword}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Emergency Password</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.emergencyPassword}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Instructions</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.instructions}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Value Added Services</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.customerInfo?.simNumber}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default CustomerInfo;
