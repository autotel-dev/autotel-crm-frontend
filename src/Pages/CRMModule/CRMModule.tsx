import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../utils/Constant";
import CRMModuleListNav from "./CRMModuleListNav";
import CRMModuleList from "./CRMModuleList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCRMModules } from "../../ReaduxToolkit/Reducer/CRMModuleSlice";

const CRMModule = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { crmModules, filterCrmModules } = useSelector(
    (state: any) => state.crmModules
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);

  const filterCRMModule = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCrmModules.filter((module: any, index: any) => {
      return module.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCRMModules(filtered));

    console.log(filtered);
  };
  return (
    <>
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
            <CRMModuleList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CRMModule;
