import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import {
  setCurrencies,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/CurrencySlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import CurrenciesListNav from "./CurrenciesListNav";
import CurrenciesList from "./CurrenciesList";


const Currencies = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { currencies, filterCurrencies, isConnected } = useSelector(
    (state: any) => state.currencies
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterBankss = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCurrencies.filter((currencies: any, index: any) => {
      return currencies.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCurrencies(filtered));

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
            mainTitle="Currencies List"
            parent={setup}
            title="Currencies List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <CurrenciesListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterBankss(e);
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
                <CurrenciesList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Currencies;
