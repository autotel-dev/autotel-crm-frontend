import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { Select } from "antd";
import Swal from "sweetalert2";
import { getAll } from "../../../../../../../../../Utilities/api";
import { GET_ALL_TRIP_DRIVERS_DROPDOWN } from "../../../../../../../../../Utilities/api/apiEndpoints";
import { P } from "../../../../../../../../../AbstractElements";
import SelectDriverBox from "./components/SelectDriverBox";
import SelectVehicleBox from "./components/SelectVehicleBox";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../TripContext";

interface TripDetailsProps {
  callbackActive: (tab: number | undefined) => void;
}

interface TripDetailsForm {
  tripName: string;
  tripType: string;
  vehicleId: string;
  driverId: string;
  notes: string;
}

const TripDetails: React.FC<TripDetailsProps> = ({ callbackActive }) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const navigate = useNavigate();
  const { tripData, updateTripDetails } = useTripContext();

  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [tripName, setTripName] = useState(tripData.tripName);
  const [tripType, setTripType] = useState(tripData.tripType);
  const [vehicleId, setVehicleId] = useState(tripData.vehicleId);
  const [driverId, setDriverId] = useState(tripData.driverId);
  const [notes, setNotes] = useState(tripData.notes);

  // Dummy vehicles - will be replaced with actual API call later
  const dummyVehicles = [
    { _id: "1", name: "Vehicle 001 - ABC-123" },
    { _id: "2", name: "Vehicle 002 - XYZ-456" },
    { _id: "3", name: "Vehicle 003 - DEF-789" },
    { _id: "4", name: "Vehicle 004 - GHI-012" },
    { _id: "5", name: "Vehicle 005 - JKL-345" },
  ];

  // Fetch drivers from API
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    getAll({ url: GET_ALL_TRIP_DRIVERS_DROPDOWN })
      .then((data: any) => {
        if (data === undefined) {
          Swal.fire({
            text: "Failed to fetch drivers due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setDrivers([]);
          return;
        }
        if (data.success) {
          setDrivers(data.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
        setDrivers([]);
      });
  };

  const handleNext = () => {
    setLoading(true);
    // Validation
    if (!tripName || !tripType || !vehicleId || !driverId) {
      Swal.fire({
        text: "Please fill in all required fields!",
        icon: "info",
        timer: 2000,
        showConfirmButton: true,
      });
      setLoading(false);
      return;
    }

    // Save to context
    updateTripDetails({
      tripName,
      tripType,
      vehicleId,
      driverId,
      notes,
    });

    setLoading(false);
    // Move to next step
    callbackActive(2);
  };

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xl={4} xs={12}>
          <P>
            Trip Name
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
        </Col>

        <Col xl={4} xs={12}>
          <div>
            <P>
              Trip Type
              <span className="txt-danger">*</span>
            </P>
          </div>
          <Select
            showSearch
            value={tripType !== "" ? tripType : null}
            style={{ width: "100%", height: 36 }}
            placeholder="Select Trip Type"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(e) => setTripType(e)}
            options={[
              { value: "Schedule", label: "Schedule" },
              { value: "Recurring", label: "Recurring" },
            ]}
          />
        </Col>

        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleBox
            placeholder="Select Vehicle"
            setVehicle={setVehicleId}
            vehicle={vehicleId}
            vehicles={dummyVehicles}
          />
        </Col>

        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Driver
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectDriverBox
            placeholder="Select Driver"
            setDriver={setDriverId}
            driver={driverId}
            drivers={drivers}
          />
        </Col>

        <Col xl={12} xs={12}>
          <P>Notes</P>
          <textarea
            className="form-control"
            placeholder="Enter any additional notes or instructions"
            rows={3}
            style={{
              maxHeight: "200px",
              resize: "vertical",
            }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Col>

        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button
            color="secondary"
            disabled={loading}
            onClick={() => {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/trip-management/trips`
              );
            }}
          >
            Cancel
          </Button>
          <Button color="primary" disabled={loading} onClick={handleNext}>
            {loading ? "Loading..." : "Next"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TripDetails;
