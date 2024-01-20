import { H2, Image } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { SuccessfullyCompleted } from "../../../utils/Constant";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "../CreateServerForm/ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setCreateServer,
  setServersStart,
  setServers,
  setServersEnd,
  setFilterServers,
  setServerInfo,
  setServerCredentials,
  setGoogleAccountCreadentials,
  setFirebaseAccountCredentials,
  setApiKeys,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { create, getAll } from "../../../Api";
import { useLocation, useNavigate } from "react-router-dom";
interface PropsTypes {
  server: any;
}

const UpdateServerForm = () => {
  const location = useLocation();
  const { server } = location.state;
  console.log("server", server);

  const {
    createServer,
    serverInfo,
    serverCredentials,
    googleAccountCreadentials,
    firebaseAccountCredentials,
    apiKeys,
  } = useSelector((state: any) => state.serverDetails);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createServerSubmitted = async () => {
    console.log("createServerRedux", createServer);
  };

  useEffect(() => {
    setFormData({
      ...formData,
      ...server,
    });

    console.log("Update formData --- UseEffect -- >", formData);
  }, [server]);

  return (
    <div className="form-completed">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "70px",
        }}
      >
        <H2>Edit Server</H2>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <H2>Server Info</H2>
        <Row>
          <Col
            xs={9}
            className="text-end d-flex justify-content-end gap-2 align-center"
          ></Col>
        </Row>
      </div>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col xl={4} sm={6}>
            <Label>
              Company Name
              <span className="txt-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter Company Name"
              defaultValue={serverInfo.companyName}
              disabled
              name="companyName"
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
              defaultValue={serverInfo.serviceProvider}
              disabled
              name="serviceProvider"
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
              defaultValue={serverInfo.ipAddress}
              disabled
              name="ipAddress"
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
              defaultValue={serverInfo.url}
              disabled
              name="url"
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
              defaultValue={serverInfo.loginUserSoftware}
              disabled
              name="loginUserSoftware"
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
              defaultValue={serverInfo.operatingSystem}
              disabled
              name="operatingSystem"
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
              defaultValue={serverInfo.loginUserServer}
              disabled
              name="loginUserServer"
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
              defaultValue={serverInfo.sshPort}
              disabled
              name="sshPort"
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
              defaultValue={serverInfo.serverSpecifications}
              disabled
              name="serverSpecifications"
            />
          </Col>
        </Row>
      </Form>
      {/*  */}

      <H2>Server Credentials</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <Label>
              Multi Cloud Web Login
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={serverCredentials.multiCloudWebLogin}
              disabled
              name="multiCloudWebLogin"
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
              defaultValue={serverCredentials.loginPasswordSoftware}
              disabled
              name="loginPasswordSoftware"
            />
          </Col>
        </Row>
      </Form>

      <H2>Google Account Credentials</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <Label>
              Email Address
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={googleAccountCreadentials.emailAddress}
              disabled
              name="emailAddress"
              type="email"
              placeholder="Enter Enter Email Address"
            />
          </Col>
          <Col sm={6}>
            <Label>
              Password
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={googleAccountCreadentials.password}
              disabled
              name="password"
              type="password"
              placeholder="Enter Password"
            />
          </Col>
        </Row>
      </Form>

      <H2>Firebase Account credentials</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <Label>
              Email Address
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={firebaseAccountCredentials.emailAddress}
              disabled
              name="emailAddress"
              type="email"
              placeholder="Enter Enter Email Address"
            />
          </Col>
          <Col sm={6}>
            <Label>
              Password
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={firebaseAccountCredentials.password}
              disabled
              name="password"
              type="password"
              placeholder="Enter Password"
            />
          </Col>
        </Row>
      </Form>

      <H2>API Keys</H2>

      <Form style={{ marginBottom: "65px", marginTop: "20px" }}>
        <Row className="g-3">
          <Col sm={6}>
            <Label>
              Google Maps API Key
              <span className="txt-danger">*</span>
            </Label>
            <Input
              defaultValue={apiKeys}
              disabled
              name="googleMapApiKey"
              type="text"
              placeholder="Enter Google Maps API Key"
            />
          </Col>
        </Row>
      </Form>

      <Row>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary">Print</Button>
          <Button
            color="primary"
            onClick={() => {
              //   createServerSubmitted();
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateServerForm;
