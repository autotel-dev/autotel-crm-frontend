import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { citiesList, citiesListHeading, setup } from "../../utils/Constant";
import CitiesListNav from "./CitiesListNav";
import CitiesList from "./CitiesList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCities } from "../../ReaduxToolkit/Reducer/CitiesSlice";

const Cities = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterCities } = useSelector((state: any) => state.cities);

  // const [filteredCountries, setFilteredCountries]: any = useState([]);

  const filterCitiess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCities.filter((city: any, index: any) => {
      return city.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCities(filtered));

    console.log(filtered);
  };
  return (
    <>
      <Breadcrumbs mainTitle={citiesList} parent={setup} title={citiesList} />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <Card>
              <CitiesListNav />
              <Col md={12}>
                <input
                  type="text"
                  placeholder="Type to Search.."
                  value={searchValue}
                  onChange={(e) => {
                    filterCitiess(e);
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
            <CitiesList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Cities;
