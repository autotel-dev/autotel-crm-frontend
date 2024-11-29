import { Col, Container, Row, Input, Form, Card } from "reactstrap";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";

import "../../../CssConstaints/Style.css";
import { getAll } from "../../../Utilities/api";

import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import PackagesListNav from "./PackagesListNav";
import PackagesList from "./PackagesList";
import {
  setAllPackagesDuration,
  setServices,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/CompanyServicePackageSlice";
import {
  GET_ALL_SERVICE_PACKAGES_DURATION,
  GET_ALL_SERVICES,
} from "../../../Utilities/api/apiEndpoints";

const ServicePackages = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { isConnected } = useSelector(
    (state: any) => state.companyServicePackages
  );

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    dispatch(setAllPackagesDuration([]));
    getAll({ url: GET_ALL_SERVICE_PACKAGES_DURATION }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          // // // console.log("hhg");
          dispatch(setAllPackagesDuration(data.data.packageDurationTypes));
        }
      }
    });
  }, []);
  useEffect(() => {
    dispatch(setServices([]));
    getAll({ url: GET_ALL_SERVICES }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          // // // console.log("hhg");
          dispatch(setServices(data.data));
        }
      }
    });
  }, []);

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Packages List"
            parent={setup}
            title="Packages List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <PackagesListNav />
                  <Col md={12}>
                    <input
                      className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        // filterDepartments(e);
                      }}
                    />
                  </Col>
                </Card>
              </Col>
              <Col sm={12}>
                <PackagesList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default ServicePackages;
