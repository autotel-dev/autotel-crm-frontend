import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { P } from "../../../AbstractElements";
import { itemsName } from "../../../Data/Forms/FormsLayout/FormWizardData";
import {
  ContactNumber,
  Continue,
  Email,
  Previous,
} from "../../../utils/Constant";
import SelectServerBox from "./SelectServersBox";
import { useDispatch, useSelector } from "react-redux";
import AddServersComponent from "./AddServersComponent";

const ServerCredentials = ({ callbackActive }: BusinessFormCommonProps) => {
  const { servers, serversAddItemsList } = useSelector(
    (state: any) => state.companies
  );
  const { createCompany } = useSelector((state: any) => state.companies);
  const dispatch = useDispatch();

  const handleNextButton = () => {
    if (servers.length > 0) {
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
        <Col xs={12} className="inquiries-form">
          <Row>
            <Col md={6}>
              <Row className="g-3">
                <Col xs={12}>
                  <Label>
                    Select Servers
                    <span className="txt-danger">*</span>
                  </Label>
                </Col>
                <Col md={6} sm={12} sx={12}>
                  <SelectServerBox placeholder="Select Servers" />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            {serversAddItemsList.map((element: any, index: any) => {
              return <AddServersComponent server={element} />;
            })}
          </Row>
        </Col>

        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          <Button color="primary">{Previous}</Button>
          <Button color="primary" onClick={handleNextButton}>
            {Continue}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ServerCredentials;
