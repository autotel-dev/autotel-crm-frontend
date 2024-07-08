import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import {
  setNetworkProvider,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/NetworkProviderSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import NetworkProvidersListNav from "./NetworkProvidersListNav";
import NetworkProvidersList from "./NetworkProvidersList";


const NetworkProviders = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { networkProvider, filterNetworkProvider, isConnected } = useSelector(
    (state: any) => state.networkProvider
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterNetworkProviders = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterNetworkProvider.filter((networkProvider: any, index: any) => {
      return networkProvider.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setNetworkProvider(filtered));

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
            mainTitle="Network Provider List"
            parent={setup}
            title="Network Provider List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <NetworkProvidersListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterNetworkProviders(e);
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
                <NetworkProvidersList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default NetworkProviders;
