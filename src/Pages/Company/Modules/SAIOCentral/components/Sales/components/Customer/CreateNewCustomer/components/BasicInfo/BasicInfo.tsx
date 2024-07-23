import { ChangeEvent, useState } from "react";
import ShowError from "../../ShowError";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";

import SelectCitiesBox from "./components/SelectCitiesBox";
import SelectProvincesBox from "./components/SelectProvincesBox";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { P } from "../../../../../../../../../../../AbstractElements";

const BasicInfo = ({ callbackActive }: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const { createCompany } = useSelector((state: any) => state.companies);
  const [customerInfoForm, setCustomerInfoForm] = useState({
    customerName: "",
    customerContactno: "",
    city: "",
    province: "",
    packagee: "",
    serviceCharges: "",
    requirements: "",

  });
  const {
    customerName,
    customerContactno,
    city,
    province,
    packagee,
    serviceCharges,
    requirements,
  } = customerInfoForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setCustomerInfoForm({ ...customerInfoForm, [name]: value });
  };

  const handleNextButton = () => {
    if (
      customerName !== "" &&
      customerContactno !== "" &&
      city !== "" &&
      province !== "" &&
      packagee !== "" && serviceCharges !== "" && requirements !== ""
    ) {

      // dispatch(
      //   setCreateCompany({
      //     ...createCompany,
      //     ...companyInfoForm,
      //   })
      // );

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
        <Col xl={4} xs={12}>
          <P>
            Customer Name
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Customer Name"
            value={customerName}
            name="customerName"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Customer Contact No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Customer Contact No"
            value={customerContactno}
            name="customerContactno"
            onChange={getUserData}
          />
        </Col>

        <Col xl={4} xs={12}>
          <div>
            <P>
              Select City
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectCitiesBox placeholder="Select City" />
        </Col>

        <Col xl={4} xs={12}>
          <div>
            <P>
              Select Province
              <span className="txt-danger">*</span>
            </P>
          </div>
          <SelectProvincesBox placeholder="Select Province" />
        </Col>
        {/* <Col xl={12} xs={12}>
          <P>
            Requirements
            <span className="txt-danger">*</span>
          </P>
          <textarea
            className="form-control"
            placeholder="Enter Requirements"
            rows={3} // Minimum number of visible lines
            style={{
              maxHeight: "200px", // Maximum height for 5 lines of text
              resize: "vertical", // Allow vertical resizing within the specified range
            }}
          // {...register("description", { required: true })}
          />

        </Col> */}

        <Col xs={12} className="text-end">
          <Button color="primary" onClick={handleNextButton}>
            Continue
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfo;
