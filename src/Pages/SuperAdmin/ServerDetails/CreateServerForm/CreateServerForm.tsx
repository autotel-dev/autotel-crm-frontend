import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";

import CustomHorizontalWizard from "./CustomHorizontalWizard";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import {
  setServers,
  setCRMModules,
} from "../../../../ReaduxToolkit/Reducer/CompanySlice";
import { getAll } from "../../../../Utilities/api";
import { GET_ALL_ACTIVE_CRM_MODULES, GET_ALL_ACTIVE_SERVERS } from "../../../../Utilities/api/apiEndpoints";
// import BusinessVerticalWizard from "./BusinessVerticalWizard/BusinessVerticalWizard";

const CreateServerForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_SERVERS }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // console.log("hhg");
            dispatch(setServers(data.data.activeServers));
          }
        }
      }
    );
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_CRM_MODULES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
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
