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
import { H3, Image, LI, P, UL } from "../../../AbstractElements";
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
  const [isEdit, setIsEdit] = useState(false);
  const [addServersForm, setAddServersForm] = useState({
    emailAddress: "",
    password: "",
    server: `${server.server}`,
    hostUrl: `${server.hostUrl}`,
  });
  const dispatch = useDispatch();
  const { createCompany, serverCredentials, serversAddItemsList } = useSelector(
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
    // console.log(serverCredentials);
  };

  const handleNextButton = () => {
    if (emailAddress !== "" && password !== "") {
      // callbackActive(3);
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
      <div
        style={{
          padding: "20px",
          border: "1px solid black",
          borderRadius: "10px",
          margin: "20px 0px",
        }}
      >
        <Row className="g-3">
          <Col lg={12} sm={12}>
            <CommonHeader title={server.label} headClass="pb-0" />
          </Col>
          <Col sm={6}>
            <P>
              Email Address
              <span className="txt-danger">*</span>
            </P>
            <Input
              value={emailAddress}
              disabled={
                !isEdit &&
                serverCredentials.some(
                  (item: any) => item.server === server.server
                )
                  ? true
                  : false
              }
              name="emailAddress"
              onChange={getUserData}
              type="email"
              placeholder="Enter Email Address"
            />
          </Col>
          <Col sm={6}>
            <P>
              Password
              <span className="txt-danger">*</span>
            </P>
            <Input
              type="text"
              disabled={
                !isEdit &&
                serverCredentials.some(
                  (item: any) => item.server === server.server
                )
                  ? true
                  : false
              }
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
                if (isEdit) {
                  // console.log("server", server);
                  // console.log("serverCredentials", serverCredentials);
                  const updatedList = serversAddItemsList.filter(
                    (item: any) => item.value !== server.server
                  );
                  dispatch(setServerCredentials(updatedList));

                  // const filteredServers = serverCredentials.filter(
                  //   (item: any) => item.server !== server.server
                  // );
                  // dispatch(setServerCredentials([...filteredServers]));
                  // console.log("filteredServers", filteredServers);
                  // console.log("addServersForm", addServersForm);

                  dispatch(
                    setServerCredentials([
                      ...serverCredentials.filter(
                        (item: any) => item.server !== server.server
                      ),
                      addServersForm,
                    ])
                  );
                  // const updatedList = [...filteredServers, addServersForm];

                  // dispatch(setServerCredentials(updatedList));
                  // console.log(
                  //   "serverCredentials after filter",
                  //   serverCredentials
                  // );

                  setIsEdit(false);
                  return;
                }
                const isPresent = serverCredentials.some(
                  (item: any) => item.server === server.server
                );
                if (isPresent) {
                  setIsEdit(true);
                } else {
                  addServer();
                }
              }}
              // disabled={
              //   serverCredentials.some(
              //     (item: any) => item.server === server.server
              //   )
              //     ? true
              //     : false
              // }
            >
              {serverCredentials.some(
                (item: any) => item.server === server.server
              )
                ? isEdit
                  ? "Add"
                  : "Edit"
                : "Add"}
            </Button>
            {isEdit && (
              <Button
                color="primary"
                onClick={() => {
                  setIsEdit(false);
                }}
              >
                Cancel
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default AddServersComponent;
