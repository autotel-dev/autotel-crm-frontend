import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { packageList, setup } from "../../utils/Constant";
import PackageList from "./PackageList";
import PackageListNav from "./PackageListNav";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsConnected,
  setPackages,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";

const Package = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterPackages, isConnected } = useSelector(
    (state: any) => state.packages
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterPackagess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterPackages.filter((packag: any, index: any) => {
      return packag.title.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setPackages(filtered));
    console.log(filtered);
  };

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle={packageList}
            parent={setup}
            title={packageList}
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <PackageListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterPackagess(e);
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
                <PackageList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Package;
