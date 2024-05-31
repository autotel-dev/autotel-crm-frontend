import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersListNav from "./UsersListNav";
import UsersList from "./UsersList";
import {
  setIsConnected,
  setOperators,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import { getAll } from "../../../Utilities/api";
import {
  setFilterRoles,
  setRoles,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import "../../../CssConstaints/Style.css";

const Users = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterOperators, isConnected } = useSelector(
    (state: any) => state.operators
  );

  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterOperatorss = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterOperators.filter((operator: any, index: any) => {
      return operator.fullName.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setOperators(filtered));

    // console.log(filtered);
  };

  useEffect(() => {
    getAll({ url: "sub-role/get-all-active-sub-roles" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setRoles(data.data));
          dispatch(setFilterRoles(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setRoles([]));
          dispatch(setFilterRoles([]));
          
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
          <Breadcrumbs mainTitle="Users List" parent={setup} title="Users" />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <UsersListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterOperatorss(e);
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
                <UsersList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Users;
