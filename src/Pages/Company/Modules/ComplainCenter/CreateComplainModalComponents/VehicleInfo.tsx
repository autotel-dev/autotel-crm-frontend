import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../AbstractElements";


const VehicleInfo = () => {
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
            <P>Object Owner</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.objectOwner}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Make</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.make}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Model</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.model}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Color</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.color}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Type</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.type}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Engine</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.engine}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Chases Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.chasisNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>VRN</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.vrn}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>SIM Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.simNumer}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Insurance Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.insuranceName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Bank Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.bankName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Corporate Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.corporateName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>City</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.city}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Geofence</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.geofence}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Device Model</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.deviceModel}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>IMEI</P>
            <input
              className="form-control"
              type="text"
              defaultValue={createComplainModalData?.vehicleInfo?.imei}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default VehicleInfo;
