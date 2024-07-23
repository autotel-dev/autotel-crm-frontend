import { ChangeEvent, useState } from "react";
import ShowError from "../../ShowError";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { P } from "../../../../../../../../../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import SelectBanksBox from "./components/SelectBanksBox";
import SelectInsuranceBox from "./components/SelectInsuranceBox";
import SelectGroupsBox from "./components/SelectGroupsBox";
import SelectVehicleMakeBox from "./components/SelectVehicleMakeBox";
import SelectVehicleModelBox from "./components/SelectVehicleModelBox";
import SelectVehicleYearBox from "./components/SelectVehicleYearBox";
import SelectTransmissionBox from "./components/SelectTransmissionBox";
import SelectFuelTypeBox from "./components/SelectFuelTypeBox";
import { setCustomer, setSaleLead, setSaleLeadId, setSaleLeads } from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { create, getAll } from "../../../../../../../../../../../Utilities/api";
import Swal from "sweetalert2";
import { CREATE_NEW_SALELEAD_VEHICLE, GET_ALL_SALELEADS } from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";

interface VehicleDetailsProps {
  callbackActive: (val: number | undefined) => void;
  iscreateNewSaleLead: boolean;
  setIscreateNewSaleLead: any;

}

const VehicleDetails = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: VehicleDetailsProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { saleLead } = useSelector((state: any) => state.sales);
  console.log("saleLead", saleLead);
  const dispatch = useDispatch();
  const [vehicleDetailsForm, setVehicleDetailsForm] = useState({
    registrationNo: "",
    color: "",
    engineNo: "",
    chasisNo: "",
    instructions: "",
    remarks: "",
  });
  const [bank, setBank] = useState("");
  const [insurance, setInsurance] = useState("");
  const [group, setGroup] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({});
  const {
    registrationNo,
    color,
    engineNo,
    chasisNo,
    instructions,
    remarks,

  } = vehicleDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    let name = event.target.name;
    let value =
      event.target.value;
    setVehicleDetailsForm({ ...vehicleDetailsForm, [name]: value });
  };

  const [loading, setLoading] = useState(false)

  const createVehicle = async () => {
    setLoading(true);
    if (
      registrationNo !== "" &&
      color !== "" &&
      engineNo !== "" &&
      // province !== "" &&
      chasisNo !== "" && instructions !== "" && remarks !== ""
    ) {
      const body = {
        ...vehicleDetailsForm,
        bank: bank,
        insurance: insurance,
        vehicleMake: vehicleMake,
        vehicleModel: vehicleModel,
        year: Number(vehicleYear),
        fuelType: fuelType,
        transmissionType: transmission,
        saleLeadId: saleLead.id,
        group: group
      }

      try {
        await create(body, { url: CREATE_NEW_SALELEAD_VEHICLE }).then((data: any) => {
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === ERROR_MESSAGE
            ) {
              setLoading(false);
              console.log("data.message", data.message);

            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);

            }
            if (data.success) {
              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
                if (data !== undefined) {
                  if (!data.success) {
                    // setIscreateNewSaleLead(false)
                  }
                  if (data.success) {
                    dispatch(setSaleLeads(data.data));
                   

                    // setIscreateNewSaleLead(false)
                    // // console.log("hhg");
                   
                  }
                }
              });
              callbackActive(4);
              setLoading(false);
            }
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
      }

    } else {
      ShowError();
      setLoading(false);
    }
  };
  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Bank
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectBanksBox placeholder="Select Bank" bank={bank} setBank={setBank} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Insurance
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectInsuranceBox placeholder="Select Insurance" insurance={insurance} setInsurance={setInsurance} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Group
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectGroupsBox placeholder="Select Group" group={group} setGroup={setGroup} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Make
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleMakeBox placeholder="Select Vehicle Make" vehicleMake={vehicleMake} setVehicleMake={setVehicleMake} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Model
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleModelBox placeholder="Select Vehicle Model" vehicleModel={vehicleModel} setVehicleModel={setVehicleModel} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Year
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleYearBox placeholder="Select Vehicle Year" vehicleYear={vehicleYear} setVehicleYear={setVehicleYear} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Fuel Type
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectFuelTypeBox placeholder="Select Fuel Type" fuelType={fuelType} setFuelType={setFuelType} />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Transmission
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectTransmissionBox placeholder="Select Transmission" transmission={transmission} setTransmission={setTransmission} />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Vehicle Registration No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Vehicle Registration No"
            value={registrationNo}
            name="registrationNo"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Vehicle Color
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Vehicle Color"
            value={color}
            name="color"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>

            Chasis No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Chasis No"
            value={
              chasisNo}
            name="chasisNo"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>

            Engine No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Engine No"
            value={engineNo}
            name="engineNo"
            onChange={getUserData}
          />
        </Col>
        <Col xl={12} xs={12}>
          <P>
            Instructions
            <span className="txt-danger">*</span>
          </P>
          <textarea
            className="form-control"
            placeholder="Enter Instructions"
            rows={2} // Minimum number of visible lines
            style={{
              maxHeight: "200px", // Maximum height for 5 lines of text
              resize: "vertical", // Allow vertical resizing within the specified range
            }}
            value={instructions}
            name="instructions"
            onChange={getUserData}
          // {...register("description", { required: true })}
          />
        </Col>
        <Col xl={12} xs={12}>
          <P>
            Remarks
            <span className="txt-danger">*</span>
          </P>
          <textarea
            className="form-control"
            placeholder="Enter Remarks"
            rows={2} // Minimum number of visible lines
            style={{
              maxHeight: "200px", // Maximum height for 5 lines of text
              resize: "vertical", // Allow vertical resizing within the specified range
            }}
            value={remarks}
            name="remarks"
            onChange={getUserData}
          // {...register("description", { required: true })}
          />
        </Col>

        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="secondary" onClick={() => { dispatch(setSaleLead(null)); dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); setIscreateNewSaleLead(false) }}>
            Cancel
          </Button>
          {/* <Button color="primary" onClick={() => callbackActive(1)}>
            Previous
          </Button> */}
          <Button color="primary" onClick={createVehicle}>
            {loading ? "Loading..." : "Create"}
          </Button>
        </Col>
      </Row>
    </Form >
  );
};

export default VehicleDetails;
