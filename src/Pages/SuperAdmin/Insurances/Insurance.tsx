import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import CountriesListNav from "./InsurancesListNav";
import CountriesList from "./InsurancesList";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import {
  setInsurance,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/InsuranceSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import InsurancesList from "./InsurancesList";
import InsurancesListNav from "./InsurancesListNav";


const Insurances = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { insurance, filterInsurances, isConnected } = useSelector(
    (state: any) => state.insurance
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterCountriess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterInsurances.filter((insurance: any, index: any) => {
      return insurance.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setInsurance(filtered));

    // console.log(filtered);
  };

  // Update original countries whenever Redux countries change

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Insurances List"
            parent={setup}
            title="Insurances List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <InsurancesListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterInsurances(e);
                      }}
                      // style={{
                      //   backgroundColor: "#f1f1f1",
                      //   borderRadius: "5px",
                      //   padding: "12px",
                      //   margin: "15px",
                      //   height:"40px",
                      //   width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                      //   border: "none",
                      //   outline: "none", // Removing default border outline
                      // }}
                    />
                  </Col>
                </Card>
              </Col>
              <Col sm={12}>
                <InsurancesList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Insurances;
