import { Col, Container, Row, Input, Form, Card } from "reactstrap";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import DepartmentsList from "./PackagesList";
import DepartmentsListNav from "./PackagesListNav";
import "../../../CssConstaints/Style.css";
import { getAll } from "../../../Utilities/api";
import {
  setIsConnected,
  setRoles,
  setUserPermissions,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import PackagesListNav from "./PackagesListNav";
import PackagesList from "./PackagesList";
// import { setCountries } from "../../ReaduxToolkit/Reducer/CountrySlice";

const Packages = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { roles, filterRoles, isConnected } = useSelector(
    (state: any) => state.roles
  );


  const filterDepartments = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterRoles.filter((role: any, index: any) => {
      return role.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setRoles(filtered));

    // console.log(filtered);
  };
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  // getAll({ url: GET_USER_BY_ID }).then((parentData: any) => {
  //   // console.log("api call --- >", parentData);
  //   if (parentData == undefined) {
  //   }

  //   if (parentData !== undefined) {
  //     if (parentData.success) {
  //       dispatch(setUserPermissions(parentData.data.user.permissions));
  //     }
  //   }
  // });
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Department List"
            parent={setup}
            title="Department List"
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
                        filterDepartments(e);
                      }}
                    // style={{
                    //   backgroundColor: "#f1f1f1",
                    //   borderRadius: "5px",
                    //   padding: "12px",
                    //   height:"40px",
                    //   margin: "15px",
                    //   width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                    //   border: "none",
                    //   outline: "none", // Removing default border outline
                    // }}
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

export default Packages;
