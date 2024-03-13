import { Col, Container, Row, Input, Form, Card } from "reactstrap";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import RolesList from "./RolesList";
import RolesListNav from "./RolesListNav";
import { getAll } from "../../../Api";
import {
  setIsConnected,
  setRoles,
  setUserPermissions,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
import NoInternetConnection from "../../NoInternetConnection/NoInternetConnection";
// import { setCountries } from "../../ReaduxToolkit/Reducer/CountrySlice";

const Roles = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { roles, filterRoles, isConnected } = useSelector(
    (state: any) => state.roles
  );

  
  const filterRoless = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterRoles.filter((country: any, index: any) => {
      return roles.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setRoles(filtered));

    console.log(filtered);
  };
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  // getAll({ url: "user/get-user" }).then((parentData: any) => {
  //   console.log("api call --- >", parentData);
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
            mainTitle="Roles List"
            parent={setup}
            title="Roles List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <RolesListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterRoless(e);
                      }}
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: "5px",
                        padding: "15px",
                        margin: "15px",
                        width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                        border: "none",
                        outline: "none", // Removing default border outline
                      }}
                    />
                  </Col>
                </Card>
              </Col>
              <Col sm={12}>
                <RolesList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Roles;
