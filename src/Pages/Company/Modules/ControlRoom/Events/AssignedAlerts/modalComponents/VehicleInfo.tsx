import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3, P } from "../../../../../../../AbstractElements";

const VehicleInfo = () => {
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
            <P>Object Owner</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.objectOwner}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Make</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.make}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Model</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.model}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Color</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.color}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Type</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.type}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Engine</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.engine}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Chases Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.chasesNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>VRN</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.vrn}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>SIM Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.simNumer}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Insurance Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.insuranceName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Bank Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.bankName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Corporate Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.corporateName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>City</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.city}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Geofence</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.geofence}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Device Model</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.deviceModel}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>IMEI</P>
            <input
              className="form-control"
              type="text"
              defaultValue={modalData?.vehicleInfo?.imei}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default VehicleInfo;
