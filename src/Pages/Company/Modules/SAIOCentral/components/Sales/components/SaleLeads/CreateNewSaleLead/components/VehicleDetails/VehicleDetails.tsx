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

const VehicleDetails = ({ callbackActive }: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { createCompany, imageBackground, companyLogo } = useSelector(
    (state: any) => state.companies
  );
  const dispatch = useDispatch();
  const [vehicleDetailsForm, setVehicleDetailsForm] = useState({
    vehicleRegistrationNo: "",
    vehicleColor: "",
    engineNo: "",
    chasisNo: "",
    instructions: "",
    remarks: "",

  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({});
  const {
    vehicleRegistrationNo,
    vehicleColor,
    engineNo,
    chasisNo,
    instructions,
    remarks,

  } = vehicleDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setVehicleDetailsForm({ ...vehicleDetailsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      vehicleRegistrationNo !== "" &&
      vehicleColor !== "" &&
      engineNo !== "" &&
      chasisNo !== "" &&
      instructions !== "" &&
      remarks !== ""

    ) {
      // dispatch(setServersAddItemsList([]));
      // dispatch(
      //   setCreateCompany({
      //     ...createCompany,
      //     ...accountCredentialsForm,
      //   })
      // );
      // console.log("formData -->", accountCredentialsForm);
      // console.log("createCompany--- >", createCompany);
      callbackActive(3);
    } else {
      ShowError();
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
          <SelectBanksBox placeholder="Select Bank" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Insurance
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectInsuranceBox placeholder="Select Insurance" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Group
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectGroupsBox placeholder="Select Group" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Make
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleMakeBox placeholder="Select Vehicle Make" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Model
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleModelBox placeholder="Select Vehicle Model" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Vehicle Year
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectVehicleYearBox placeholder="Select Vehicle Year" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Fuel Type
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectFuelTypeBox placeholder="Select Fuel Type" />
        </Col>
        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Transmission
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectTransmissionBox placeholder="Select Transmission" />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Vehicle Registration No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Vehicle Registration No"
            value={vehicleRegistrationNo}
            name="vehicleRegistrationNo"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
          <P>
            Vehicle Color
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Vehicle Color"
            value={vehicleColor}
            name="vehicleColor"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
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
        </Col> <Col xl={4} xs={12}>
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
          // {...register("description", { required: true })}
          />
        </Col>

        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary" onClick={() => callbackActive(1)}>
            Previous
          </Button>
          <Button color="primary" onClick={handleNextButton}>
            Continue
          </Button>
        </Col>
      </Row>
    </Form >
  );
};

export default VehicleDetails;
