import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../utils/Constant";
import CountriesList from "./WhatsAppTemplatesList";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCountries,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";
import WhatsAppTemplatesListNav from "./WhatsAppTemplatesListNav";

const WhatsAppTemplates = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { countries, filterCountries, isConnected } = useSelector(
    (state: any) => state.countries
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  // const filterCountriess = (e: any) => {
  //   const searchKey = e.target.value;
  //   setSearchValue(searchKey);
  //   const filtered = filterCountries.filter((country: any, index: any) => {
  //     return country.name.toLowerCase().includes(searchKey.toLowerCase());
  //     // ^ Add 'return' statement here
  //   });

  //   dispatch(setCountries(filtered));

  //   // console.log(filtered);
  // };

  // Update original countries whenever Redux countries change

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="WhatsApp Templates List"
            parent={setup}
            title="WhatsApp Templates List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <WhatsAppTemplatesListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        // filterCountriess(e);
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
              {/* <Col sm={12}>
                <CountriesList />
              </Col> */}
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default WhatsAppTemplates;
