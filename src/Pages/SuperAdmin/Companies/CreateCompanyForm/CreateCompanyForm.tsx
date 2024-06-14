import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import {
  Businesshorizontalwizard,
  Businessverticalwizard,
  Customhorizontalwizard,
  Customverticalwizard,
  FormLayouts,
  FormWizard2Heading,
} from "../../../../utils/Constant";
import CustomHorizontalWizard from "./CustomHorizontalWizard";
import { useEffect } from "react";
import { getAll } from "../../../../Utilities/api";
import { useDispatch } from "react-redux";

import {
  setServers,
  setTimeZones,
  setCRMModules,
  setCities,
  setPackages,
  setCompaniesStart,
  setCompaniesEnd,
  setCompanies,
  setFilterCompanies,
  setPermissions,
  setIsConnected,
} from "../../../../ReaduxToolkit/Reducer/CompanySlice";
import { GET_ALL_ACTIVE_CITIES, GET_ALL_ACTIVE_CRM_MODULES, GET_ALL_ACTIVE_PACKAGES, GET_ALL_ACTIVE_SERVERS, GET_ALL_PERMISSIONS, GET_ALL_TIMEZONES } from "../../../../Utilities/api/apiEndpoints";
// import BusinessVerticalWizard from "./BusinessVerticalWizard/BusinessVerticalWizard";

const CreateCompanyForm = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getAll({ url: GET_ALL_TIMEZONES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setTimeZones(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setTimeZones([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_PERMISSIONS }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setPermissions(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setPermissions([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_SERVERS }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // console.log("hhg");
            dispatch(setServers(data.data.activeServers));
          }
          if (!data.success) {
            // console.log("hhg");
            dispatch(setServers([]));
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
        if (!data.success) {
          // console.log("hhg");
          dispatch(setCRMModules([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_CITIES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setCities(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setCities([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_PACKAGES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setPackages(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setPackages([]));
        }
      }
    });
  }, []);

  return (
    <>
      <Breadcrumbs
        mainTitle="Create Comapany"
        parent="Company"
        title="Create Comapany"
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

export default CreateCompanyForm;
