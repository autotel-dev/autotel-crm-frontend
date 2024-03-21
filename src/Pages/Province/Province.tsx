import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { provinceList, setup } from "../../utils/Constant";
import ProvinceListNav from "./ProvinceListNav";
import ProvinceList from "./ProvinceList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsConnected,
  setProvinces,
} from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";

const Province = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterProvinces, isConnected } = useSelector(
    (state: any) => state.provinces
  );
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterProvincess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterProvinces.filter((province: any, index: any) => {
      return province.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setProvinces(filtered));

    // console.log(filtered);
  };

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle={provinceList}
            parent={setup}
            title={provinceList}
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <ProvinceListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterProvincess(e);
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
                <ProvinceList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Province;
