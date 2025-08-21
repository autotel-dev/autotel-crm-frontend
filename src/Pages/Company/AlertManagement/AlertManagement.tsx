import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import AlertManagementList from "./AlertManagementList";
import AlertManagementListNav from "./AlertManagementListNav";
import {
  setWarehouse,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/WarehouseSlice";

const AlertManagement = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { warehouse, filterWarehouses, isConnected } = useSelector(
    (state: any) => state.warehouse
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterWarehousess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterWarehouses.filter((warehouse: any, index: any) => {
      return warehouse.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setWarehouse(filtered));
  };

  // Update original countries whenever Redux countries change

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Alert Managment"
            parent={setup}
            title="Alert Managment"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <AlertManagementListNav />
                  <Col md={12}>
                    <input
                      className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterWarehousess(e);
                      }}
                    />
                  </Col>
                </Card>
              </Col>
              <Col sm={12}>
                <AlertManagementList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default AlertManagement;
