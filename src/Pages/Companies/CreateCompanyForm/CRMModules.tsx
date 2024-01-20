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
import { setAllowedModules } from "../../../ReaduxToolkit/Reducer/CompanySlice";

const CRMModules = ({ callbackActive }: BusinessFormCommonProps) => {
  const { allowedModules, crmModules } = useSelector(
    (state: any) => state.companies
  );
  const dispatch = useDispatch();

  const [switches, setSwitches] = useState("off");

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
                                defaultChecked={switches == "on" ? true : false}
                                value={switches === "on" ? "on" : "off"}
                                onChange={(e) => {
                                  if (switches === "on") {
                                    setSwitches("off");
                                  } else {
                                    setSwitches("on");
                                  }
                                  const itemExist = allowedModules.some(
                                    (i: any) => i === item.name
                                  );
                                  console.log(itemExist);

                                  if (itemExist) {
                                    // If the server exists, remove it from the array

                                    const updatedAllowedModules =
                                      allowedModules.filter(
                                        (i: any) => i !== item.name
                                      );
                                    console.log("If condition");
                                    console.log(
                                      "allowedModules -- >",
                                      updatedAllowedModules
                                    );

                                    dispatch(
                                      setAllowedModules(updatedAllowedModules)
                                    );
                                  } else {
                                    // If the server doesn't exist, add it to the array
                                    console.log("else condition");
                                    dispatch(
                                      setAllowedModules([
                                        ...allowedModules,
                                        item.name,
                                      ])
                                    );
                                  }
                                  console.log(e.target.value);
                                  console.log(
                                    "allowedModules -- >",
                                    allowedModules
                                  );
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
