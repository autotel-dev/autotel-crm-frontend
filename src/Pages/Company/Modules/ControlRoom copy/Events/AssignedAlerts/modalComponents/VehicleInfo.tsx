import { Col } from "reactstrap";
import { FormGroup, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { P } from "../../../../../../../AbstractElements";

const VehicleInfo = () => {
  const { modalData } = useSelector((state: any) => state.alerts);

  const alertEvent = modalData?.alertEvent;
  const vehicle = alertEvent?.vehicle || {};
  const inventory = vehicle?.inventory || [];

  const simItem = inventory.find((i: any) => i?.productType === "SIM");
  const deviceItem = inventory.find((i: any) => i?.productType === "DEVICES");
  const geofenceNames = (vehicle?.geofences || [])
    .map((g: any) => g?.title || g?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Col md={12}>
      <form className="form-bookmark needs-validation">
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-6 create-group">
            <P>Object Owner</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.customer?.fullName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Make</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.make?.name}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Model</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.model?.name}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Color</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.color}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Fuel Type</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.fuelType}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Transmission</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.transmissionType}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Year</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.year}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Engine</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.engineNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Chases Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.chasisNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>VRN</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.vrn ?? vehicle?.registrationNo}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>SIM Number</P>
            <input
              className="form-control"
              type="text"
              defaultValue={simItem?.serialNumber}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Insurance Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.insurance?.name}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Bank Name</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.bank?.name}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Geofence</P>
            <input
              className="form-control"
              type="text"
              defaultValue={geofenceNames}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>Device Model</P>
            <input
              className="form-control"
              type="text"
              defaultValue={deviceItem?.productName}
              disabled
            />
          </FormGroup>
          <FormGroup className="col-md-6 create-group">
            <P>IMEI</P>
            <input
              className="form-control"
              type="text"
              defaultValue={vehicle?.imei}
              disabled
            />
          </FormGroup>
        </Row>
      </form>
    </Col>
  );
};

export default VehicleInfo;
