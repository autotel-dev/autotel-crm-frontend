import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Continue } from "../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateServer,
  setServerInfo,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";

const ServerInfoForm = ({ callbackActive }: BusinessFormCommonProps) => {
  const dispatch = useDispatch();
  const { serverInfo, createServer } = useSelector(
    (state: any) => state.serverDetails
  );
  const [serverInfoForm, setServerInfoForm] = useState({
    companyName: "",
    serviceProvider: "",
    ipAddress: "",
    url: "",
    loginUserSoftware: "",
    operatingSystem: "",
    loginUserServer: "",
    sshPort: "",
    serverSpecifications: "",
  });
  const {
    companyName,
    serviceProvider,
    ipAddress,
    url,
    loginUserSoftware,
    operatingSystem,
    loginUserServer,
    sshPort,
    serverSpecifications,
  } = serverInfoForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime"
        ? event.target.checked
        : name === "sshPort"
        ? Number(event.target.value)
        : event.target.value;
    setServerInfoForm({ ...serverInfoForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      companyName !== "" &&
      serviceProvider !== "" &&
      ipAddress !== "" &&
      url !== "" &&
      loginUserSoftware !== "" &&
      operatingSystem !== "" &&
      loginUserServer !== "" &&
      sshPort !== "" &&
      serverSpecifications !== ""
    ) {
      dispatch(setServerInfo(serverInfoForm));
      console.log("serverInfoForm -->", serverInfoForm);
      console.log("serverInfo--- >", serverInfo);
      dispatch(
        setCreateServer({
          ...createServer,
          ...serverInfoForm,
        })
      );

      callbackActive(2);
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
        <Col xl={4} sm={6}>
          <Label>
            Full Name
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Full Name"
            value={companyName}
            name="companyName"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} sm={6}>
          <Label>
            Service Provider
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Service Provider"
            value={serviceProvider}
            name="serviceProvider"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            IP Address
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="ipAddress"
            type="text"
            placeholder="IP Address"
            value={ipAddress}
            name="ipAddress"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} sm={6}>
          <Label>
            Server URL
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Server URL"
            value={url}
            name="url"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} sm={6}>
          <Label>
            Login User Software
            <span className="txt-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter Login User Software"
            value={loginUserSoftware}
            name="loginUserSoftware"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            Operating System
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="operatingSystem"
            type="text"
            placeholder="Enter Operating System"
            value={operatingSystem}
            name="operatingSystem"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            Login User Server
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="loginUserServer"
            type="text"
            placeholder="Enter Login User Server"
            value={loginUserServer}
            name="loginUserServer"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            SSH Port
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="sshPort"
            type="text"
            placeholder="Enter SSH Port"
            value={sshPort}
            name="sshPort"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <Label>
            Server Specifications
            <span className="txt-danger">*</span>
          </Label>
          <Input
            id="serverSpecifications"
            type="text"
            placeholder="Enter Server Specifications"
            value={serverSpecifications}
            name="serverSpecifications"
            onChange={getUserData}
          />
        </Col>
        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ServerInfoForm;
