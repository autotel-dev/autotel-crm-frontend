import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";

import CustomHorizontalWizard from "./CustomHorizontalWizard";
import { useEffect } from "react";
import { getAll } from "../../../Api";
import { useDispatch } from "react-redux";
import {
  setServers,
  setCRMModules,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
// import BusinessVerticalWizard from "./BusinessVerticalWizard/BusinessVerticalWizard";

const CreateServerForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getAll({ url: "server-management/get-all-active-servers" }).then(
      (data: any) => {
        console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            console.log("hhg");
            dispatch(setServers(data.data.activeServers));
          }
        }
      }
    );
  }, []);
  useEffect(() => {
    getAll({ url: "crm-module/get-all-active-modules" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setCRMModules(data.data));
        }
      }
    });
  }, []);

  return (
    <>
      <Breadcrumbs
        mainTitle="Create Server"
        parent="Server"
        title="Create Server"
      />
      <Container fluid>
        <Row>
          <CustomHorizontalWizard heading="" xs={12} />

          {/* <CustomHorizontalWizard
            heading={Customverticalwizard}
            horizontalWizardWrapperClassName="vertical-options vertical-variations"
            firstXl={3}
            secondXl={9}
          /> */}
          {/* <BusinessVerticalWizard heading={Businesshorizontalwizard} xs={12} /> */}
        </Row>
      </Container>
    </>
  );
};

export default CreateServerForm;
