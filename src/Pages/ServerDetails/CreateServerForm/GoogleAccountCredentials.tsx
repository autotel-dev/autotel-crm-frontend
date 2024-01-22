import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Continue, PAN, Previous } from "../../../utils/Constant";
import { setServersAddItemsList } from "../../../ReaduxToolkit/Reducer/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCompany } from "../../../ReaduxToolkit/Reducer/CompanySlice";
import {
  setCreateServer,
  setGoogleAccountCreadentials,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";

const GoogleAccountCredentials = ({
  callbackActive,
}: BusinessFormCommonProps) => {
  const { googleAccountCreadentials, createServer } = useSelector(
    (state: any) => state.serverDetails
  );
  const dispatch = useDispatch();
  const [accountCredentialsForm, setAccountCredentialsForm] = useState({
    emailAddress: "",
    password: "",
  });
  const { emailAddress, password } = accountCredentialsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setAccountCredentialsForm({ ...accountCredentialsForm, [name]: value });
  };

  const handleNextButton = () => {
    if (emailAddress !== "" && password !== "") {
      dispatch(setGoogleAccountCreadentials(accountCredentialsForm));
      console.log("GoogleaccountCredentialsForm -->", accountCredentialsForm);
      console.log("googleAccountCreadentials --- >", googleAccountCreadentials);
      dispatch(
        setCreateServer({
          ...createServer,
          googleAccount: accountCredentialsForm,
        })
      );
      callbackActive(4);
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
            Email Address
            <span className="txt-danger">*</span>
          </Label>
          <Input
            value={emailAddress}
            name="emailAddress"
            onChange={getUserData}
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
            type="password"
            placeholder="Enter Password"
            value={[password]}
            name="password"
            onChange={getUserData}
          />
        </Col>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary" onClick={() => callbackActive(2)}>
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

export default GoogleAccountCredentials;
