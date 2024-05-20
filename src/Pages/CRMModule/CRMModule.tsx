import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../utils/Constant";
import CRMModuleListNav from "./CRMModuleListNav";
import CRMModuleList from "./CRMModuleList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCRMModules,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";

const CRMModule = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { crmModules, filterCrmModules, isConnected } = useSelector(
    (state: any) => state.crmModules
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterCRMModule = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCrmModules.filter((module: any, index: any) => {
      return module.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCRMModules(filtered));

    // console.log(filtered);
  };
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="CRM Module List"
            parent={setup}
            title="CRM Module List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <CRMModuleListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterCRMModule(e);
                      }}
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: "5px",
                        height:"40px",
                        padding: "12px",
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
                <CRMModuleList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default CRMModule;
