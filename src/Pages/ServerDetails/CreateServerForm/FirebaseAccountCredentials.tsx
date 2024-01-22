import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Continue, PAN, Previous } from "../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateServer,
  setFirebaseAccountCredentials,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";

const FirebaseAccountCredentials = ({
  callbackActive,
}: BusinessFormCommonProps) => {
  const { firebaseAccountCredentials, createServer } = useSelector(
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
      dispatch(setFirebaseAccountCredentials(accountCredentialsForm));
      console.log("FirebaseAccountCredentialsForm -->", accountCredentialsForm);
      console.log(
        "firebaseAccountCreadentials --- >",
        firebaseAccountCredentials
      );
      dispatch(
        setCreateServer({
          ...createServer,
          firebaseAccount: accountCredentialsForm,
        })
      );
      callbackActive(5);
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
            placeholder="Enter Email Address"
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
          <Button color="primary" onClick={() => callbackActive(3)}>
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

export default FirebaseAccountCredentials;
