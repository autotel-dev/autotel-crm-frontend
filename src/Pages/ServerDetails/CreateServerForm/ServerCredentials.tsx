import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Continue, PAN, Previous } from "../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import { setServerCredentials } from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";

const ServerCredentials = ({ callbackActive }: BusinessFormCommonProps) => {
  const { serverCredentials } = useSelector(
    (state: any) => state.serverDetails
  );
  const dispatch = useDispatch();
  const [accountCredentialsForm, setAccountCredentialsForm] = useState({
    multiCloudWebLogin: "",
    loginPasswordSoftware: "",
  });
  const { multiCloudWebLogin, loginPasswordSoftware } = accountCredentialsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setAccountCredentialsForm({ ...accountCredentialsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (multiCloudWebLogin !== "" && loginPasswordSoftware !== "") {
      dispatch(setServerCredentials(accountCredentialsForm));
      console.log("serverInfoForm -->", accountCredentialsForm);
      console.log("serverCredentials--- >", serverCredentials);
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
        <Col sm={6}>
          <Label>
            Multi Cloud Web Login
            <span className="txt-danger">*</span>
          </Label>
          <Input
            value={multiCloudWebLogin}
            name="multiCloudWebLogin"
            onChange={getUserData}
            type="email"
            placeholder="Enter Multi Cloud Web Login Email"
          />
        </Col>
        <Col sm={6}>
          <Label>
            Login Password Software
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="password"
            placeholder="Enter Login Password Software"
            value={loginPasswordSoftware}
            name="loginPasswordSoftware"
            onChange={getUserData}
          />
        </Col>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary" onClick={() => callbackActive(1)}>
            {Previous}
          </Button>
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ServerCredentials;
