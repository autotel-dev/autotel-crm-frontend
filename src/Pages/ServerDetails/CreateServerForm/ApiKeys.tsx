import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Continue, PAN, Previous } from "../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import {
  setApiKeys,
  setCreateServer,
} from "../../../ReaduxToolkit/Reducer/ServerDetailsSlice";

const ApiKeys = ({ callbackActive }: BusinessFormCommonProps) => {
  const { apiKeys, createServer } = useSelector(
    (state: any) => state.serverDetails
  );
  const dispatch = useDispatch();
  const [googleMapApiKey, setGoogleMapApiKey] = useState("");
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setGoogleMapApiKey(event.target.value);
  };

  const handleNextButton = () => {
    if (googleMapApiKey !== "") {
      dispatch(setApiKeys(googleMapApiKey));
      // console.log("googleMapApiKey -->", googleMapApiKey);
      // console.log("apiKeys --- >", apiKeys);
      dispatch(
        setCreateServer({
          ...createServer,
          googleMapApiKey: googleMapApiKey,
        })
      );
      callbackActive(6);
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
            API Key
            <span className="txt-danger">*</span>
          </Label>
          <Input
            value={googleMapApiKey}
            name="googleMapApiKey"
            onChange={getUserData}
            type="text"
            placeholder="Enter API Key"
          />
        </Col>
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary" onClick={() => callbackActive(4)}>
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

export default ApiKeys;
