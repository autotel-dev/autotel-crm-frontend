import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../utils/Constant";
import CountriesListNav from "./CountriesListNav";
import CountriesList from "./CountriesList";
import SVG from "../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCountries } from "../../ReaduxToolkit/Reducer/CountrySlice";

const Countries = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { countries, filterCountries } = useSelector(
    (state: any) => state.countries
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);

  const filterCountriess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCountries.filter((country: any, index: any) => {
      return country.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCountries(filtered));

    console.log(filtered);
  };

  // Update original countries whenever Redux countries change

  return (
    <>
      <Breadcrumbs
        mainTitle="Countries List"
        parent={setup}
        title="Countries List"
      />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <Card>
              <CountriesListNav />
              <Col md={12}>
                <input
                  type="text"
                  placeholder="Type to Search.."
                  value={searchValue}
                  onChange={(e) => {
                    filterCountriess(e);
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
            <CountriesList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Countries;
