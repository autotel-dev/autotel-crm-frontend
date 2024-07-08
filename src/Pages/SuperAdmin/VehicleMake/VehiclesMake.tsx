import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import {
  setVehicleMake,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/VehicleMakeSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import VehicleMakeList from "./VehicleMakeList";
import VehicleMakeListNav from "./VehicleMakeListNav";


const VehiclesMake = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { vehicleMake, filterVehiclesMake, isConnected } = useSelector(
    (state: any) => state.vehicleMake
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterVehiclesMakes = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterVehiclesMake.filter((vehicleMake: any, index: any) => {
      return vehicleMake.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setVehicleMake(filtered));

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
            mainTitle="Vehicles Make List"
            parent={setup}
            title="Vehicles Make List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <VehicleMakeListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterVehiclesMakes(e);
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
                <VehicleMakeList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default VehiclesMake;
