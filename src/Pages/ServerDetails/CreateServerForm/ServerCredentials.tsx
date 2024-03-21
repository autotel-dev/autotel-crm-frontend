import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import {
  Button,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Continue, PAN, Previous } from "../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateServer,
  setServerCredentials,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ServerCredentials = ({ callbackActive }: BusinessFormCommonProps) => {
  const { serverCredentials, createServer } = useSelector(
    (state: any) => state.serverDetails
  );
  const dispatch = useDispatch();
  const [accountCredentialsForm, setAccountCredentialsForm] = useState({
    multiCloudWebLogin: "",
    loginPasswordSoftware: "",
    loginPasswordServer: "",
  });
  const { multiCloudWebLogin, loginPasswordSoftware, loginPasswordServer } =
    accountCredentialsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setAccountCredentialsForm({ ...accountCredentialsForm, [name]: value });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordServer, setShowPasswordServer] = useState(false);
  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const togglePasswordServerVisibility = (e: any) => {
    e.preventDefault();
    setShowPasswordServer(!showPasswordServer);
  };

  const handleNextButton = () => {
    if (multiCloudWebLogin !== "" && loginPasswordSoftware !== "") {
      dispatch(setServerCredentials(accountCredentialsForm));
      // console.log("serverInfoForm -->", accountCredentialsForm);
      // console.log("serverCredentials--- >", serverCredentials);
      dispatch(
        setCreateServer({
          ...createServer,
          ...accountCredentialsForm,
        })
      );
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

          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Login Password Software"
              value={loginPasswordSoftware}
              name="loginPasswordSoftware"
              onChange={getUserData}
            />
            <Button
              color="white"
              // className="bg-transparent"
              onClick={togglePasswordVisibility}
              style={{
                backgroundColor: "transparent",
                width: "80px",
                border: "1px solid #dee2e6",
              }}
            >
              <FontAwesomeIcon
                // color="secondary"
                style={{
                  color: "green",
                  fontSize: "20px",
                  marginRight: "20px",
                }}
                icon={showPassword ? faEye : faEyeSlash}
              />
            </Button>
          </InputGroup>
        </Col>
        <Col sm={6}>
          <Label>
            Login Password Server
            <span className="txt-danger">*</span>
          </Label>

          <InputGroup>
            <Input
              type={showPasswordServer ? "text" : "password"}
              placeholder="Enter Login Password Server"
              value={loginPasswordServer}
              name="loginPasswordServer"
              onChange={getUserData}
            />
            <Button
              color="white"
              // className="bg-transparent"
              onClick={togglePasswordServerVisibility}
              style={{
                backgroundColor: "transparent",
                width: "80px",
                border: "1px solid #dee2e6",
              }}
            >
              <FontAwesomeIcon
                // color="secondary"
                style={{
                  color: "green",
                  fontSize: "20px",
                  marginRight: "20px",
                }}
                icon={showPasswordServer ? faEye : faEyeSlash}
              />
            </Button>
          </InputGroup>
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
