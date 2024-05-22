import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { citiesList, citiesListHeading, setup } from "../../utils/Constant";
import CitiesListNav from "./CitiesListNav";
import CitiesList from "./CitiesList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../CssConstaints/Style.css";
import {
  setCities,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";

const Cities = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterCities, isConnected } = useSelector(
    (state: any) => state.cities
  );

  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterCitiess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCities.filter((city: any, index: any) => {
      return city.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCities(filtered));
    // console.log(filtered);
  };
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle={citiesList}
            parent={setup}
            title={citiesList}
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <CitiesListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterCitiess(e);
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
                <CitiesList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Cities;
