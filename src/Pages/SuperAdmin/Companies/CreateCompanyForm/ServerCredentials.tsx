import { ChangeEvent, useState } from "react";
import { BusinessFormCommonProps } from "../../../../Types/Forms/FormLayout/FormWizardTypes";
import ShowError from "./ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { P } from "../../../../AbstractElements";
import { itemsName } from "../../../../Data/Forms/FormsLayout/FormWizardData";
import {
  ContactNumber,
  Continue,
  Email,
  Previous,
} from "../../../../utils/Constant";
import SelectServerBox from "./SelectServersBox";
import { useDispatch, useSelector } from "react-redux";
import AddServersComponent from "./AddServersComponent";
import { setCreateCompany } from "../../../../ReaduxToolkit/Reducer/CompanySlice";

const ServerCredentials = ({ callbackActive }: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { servers, serversAddItemsList, serverCredentials } = useSelector(
    (state: any) => state.companies
  );
  const { createCompany } = useSelector((state: any) => state.companies);
  const dispatch = useDispatch();

  const handleNextButton = () => {
    if (serverCredentials.length > 0) {
      dispatch(
        setCreateCompany({
          ...createCompany,
          serverCredentials: serverCredentials,
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
        <Col xs={12} className="inquiries-form">
          <Row>
            <Col md={6}>
              <Row className="g-3">
                <Col xs={12}>
                  <P>
                    Select Servers
                    <span className="txt-danger">*</span>
                  </P>
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
