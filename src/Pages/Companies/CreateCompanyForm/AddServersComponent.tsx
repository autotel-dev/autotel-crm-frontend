import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import {
  AadhaarNumber,
  ChooseBanks,
  Continue,
  PAN,
  Previous,
} from "../../../utils/Constant";
import { H3, Image, LI, UL } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service";
import { popularBanksList } from "../../../Data/Forms/FormsLayout/FormWizardData";
import CommonHeader from "../../../Common/CommonHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateCompany,
  setServer,
  setServerCredentials,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
interface propTypes {
  server: any;
}

const AddServersComponent: React.FC<propTypes> = ({ server }) => {
  const [addServersForm, setAddServersForm] = useState({
    emailAddress: "",
    password: "",
    server: `${server.server}`,
    hostUrl: `${server.hostUrl}`,
  });
  const dispatch = useDispatch();
  const { createCompany, serverCredentials } = useSelector(
    (state: any) => state.companies
  );
  const { emailAddress, password } = addServersForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setAddServersForm({ ...addServersForm, [name]: value });
    dispatch(setServer(addServersForm));

    // dispatch(
    //   setCreateCompany({
    //     ...createCompany,
    //     serverCredentials: serverCredentials,
    //   })
    // );
  };
  const addServer = () => {
    dispatch(setServerCredentials([...serverCredentials, addServersForm]));
    console.log(serverCredentials);
  };

  //   const handleNextButton = () => {
  //     if (emailAddress !== "" && password !== "") {
  //       callbackActive(3);
  //     } else {
  //       ShowError();
  //     }
  //   };
  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <div
        style={{
          padding: "20px",
          border: "2px solid black",
          borderRadius: "10px",
          margin: "20px",
        }}
      >
        <Row className="g-3">
          <Col lg={12} sm={12}>
            <CommonHeader title={server.label} headClass="pb-0" />
          </Col>
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
              value={password}
              name="password"
              onChange={getUserData}
            />
          </Col>
          <Col
            xs={12}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            <Button
              color="primary"
              onClick={() => {
                addServer();
              }}
              disabled={
                serverCredentials.some(
                  (item: any) => item.server === server.server
                )
                  ? true
                  : false
              }
            >
              {serverCredentials.some(
                (item: any) => item.server === server.server
              )
                ? "Added"
                : "Add"}
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default AddServersComponent;
