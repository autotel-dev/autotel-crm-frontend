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
import { useSelector } from "react-redux";
import AddServersComponent from "./AddServersComponent";

const CRMModules = ({ callbackActive }: BusinessFormCommonProps) => {
  const { servers, serversAddItemsList, crmModules } = useSelector(
    (state: any) => state.companies
  );

  const handleNextButton = () => {
    callbackActive(5);
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
                  <Label style={{ fontSize: "25px", fontWeight: "bold" }}>
                    Select CRM Modules
                    <span className="txt-danger">*</span>
                  </Label>
                </Col>
                {crmModules.map((item: any, index: any) => {
                  return (
                    <div
                      style={{
                        margin: "15px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Col md={6}>{item.name}</Col>
                      <Col md={6}>
                        <div className="d-flex" key={index}>
                          <div
                            className={`text-end flex-shrink-0 icon-state switch-outline
                            }`}
                          >
                            <Label className="switch mb-0">
                              <Input
                                type="checkbox"
                                defaultChecked={item.isActive}
                                value={item.isActive ? "on" : "off"}
                                onChange={(e) => {
                                  //   setIsActive(!isActive);
                                  console.log(e.target.value);
                                }}
                              />
                              <span className={`switch-state bg-primary`} />
                            </Label>
                          </div>
                        </div>
                      </Col>
                    </div>
                  );
                })}
              </Row>
            </Col>
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

export default CRMModules;
