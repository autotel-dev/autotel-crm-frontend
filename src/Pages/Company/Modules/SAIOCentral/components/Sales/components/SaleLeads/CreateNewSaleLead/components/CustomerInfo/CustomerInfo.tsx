import { ChangeEvent, useEffect, useState } from "react";
import ShowError from "../../ShowError";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { P } from "../../../../../../../../../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { create, getAll } from "../../../../../../../../../../../Utilities/api";
import { CREATE_NEW_CUSTOMER, GET_ALL_SALELEADS } from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import { setCustomer, setSaleLead, setSaleLeadId, setSaleLeads } from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";

interface CustomerInfoProps {
  callbackActive: (val: number | undefined) => void;
  iscreateNewSaleLead: boolean;
  setIscreateNewSaleLead: any;

}

const CustomerInfo = ({ callbackActive, iscreateNewSaleLead, setIscreateNewSaleLead }: CustomerInfoProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { saleLeadId, customer, saleLead } = useSelector(
    (state: any) => state.sales
  );
  console.log("saleLeadId", saleLeadId);

  const dispatch = useDispatch();
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    cnic: "",
    dob: "",
    additionalContactNo: "",
    officeNo: "",
    emailAddress: "",
    residentialNo: "",
    homeAddress: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({});
  const {
    cnic,
    dob,
    additionalContactNo,
    officeNo,
    emailAddress,
    residentialNo,
    homeAddress,

  } = personalDetailsForm;
  const getUserData = (event: ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    let value =
      name === "rememberNextTime" ? event.target.checked : event.target.value;
    setPersonalDetailsForm({ ...personalDetailsForm, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  console.log("saleLeadId", saleLeadId);


  const createCustomer = async () => {
    console.log("personalDetailsForm", personalDetailsForm);
    console.log("saleLeadId", saleLeadId);
    console.log("saleLead", saleLead);

    setLoading(true);
    if (
      cnic !== "" &&
      dob !== "" &&
      additionalContactNo !== "" &&
      officeNo !== "" &&
      emailAddress !== "" &&
      residentialNo !== "" &&
      homeAddress

    ) {

      try {
        await create({ ...personalDetailsForm, saleLeadId: saleLead._id }, { url: CREATE_NEW_CUSTOMER }).then((data: any) => {
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === ERROR_MESSAGE
            ) {
              setLoading(false);
              console.log("data.message", data.message);

            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              dispatch(setCustomer(null));
              dispatch(setSaleLeadId(""))

            }
            if (data.success) {

              getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {

                if (data !== undefined) {
                  if (!data.success) {
                    Swal.fire({
                      text: `${data.message}`,
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                    setIscreateNewSaleLead(false)
                    dispatch(setSaleLeadId(""));
                    dispatch(setCustomer(null));
                  }
                  if (data.success) {
                    setIscreateNewSaleLead(false)
                    dispatch(setSaleLeadId(""));
                    dispatch(setCustomer(null));
                    // // console.log("hhg");
                    dispatch(setSaleLeads(data.data));
                  }
                }
              });

              setLoading(false);
            }
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
      }
    } else {
      ShowError();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer !== null) {
      setPersonalDetailsForm({
        cnic: customer !== null ? customer?.cnic : "",
        dob: customer !== null ? customer?.dob?.slice(0, 10) : "",
        additionalContactNo: customer !== null ? customer?.additionalContactNo : "",
        officeNo: customer !== null ? customer?.officeNo : "",
        emailAddress: customer !== null ? customer?.emailAddress : "",
        residentialNo: customer !== null ? customer?.residentialNo : "",
        homeAddress: customer !== null ? customer?.homeAddress : "",
      })
    }
  }, [customer])

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <Col xl={4} xs={12}>
          <P>
            CNIC No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter CNIC No"
            value={cnic}
            name="cnic"
            onChange={getUserData}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Date of Birth
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="date"
            placeholder="Enter Date of Birth"
            value={dob}
            name="dob"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
          <P>
            Additional Contact No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Additional Contact No"
            value={additionalContactNo}
            name="additionalContactNo"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
          <P>
            Office No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Office No"
            value={officeNo}
            name="officeNo"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
          <P>
            Email Address
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Email Address"
            value={emailAddress}
            name="emailAddress"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
          <P>

            Residential No
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Residential No"
            value={
              residentialNo}
            name="residentialNo"
            onChange={getUserData}
          />
        </Col> <Col xl={4} xs={12}>
          <P>

            Home Address
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Home Address"
            value={homeAddress}
            name="homeAddress"
            onChange={getUserData}
          />
        </Col>

        {
          customer !== null ? <Col
            xs={12}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            <Button color="secondary" onClick={() => { dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); dispatch(setSaleLead(null)); setIscreateNewSaleLead(false) }}>
              Cancel
            </Button>
            <Button color="primary" onClick={() => setIscreateNewSaleLead(false)}>
              OK
            </Button>
          </Col> : <Col
            xs={12}
            className="text-end d-flex justify-content-end gap-2 align-center"
          >
            {/* {customer !== null &&  */}
            <Button color="secondary" onClick={() => { dispatch(setCustomer(null)); dispatch(setSaleLeadId("")); dispatch(setSaleLead(null)); setIscreateNewSaleLead(false) }}>
              Cancel
            </Button>

            {/* } */}
            <Button color="primary" onClick={createCustomer}>
              {loading ? "Loading..." : "Create Customer"}
            </Button>

          </Col>
        }

      </Row>
    </Form>
  );
};

export default CustomerInfo;
