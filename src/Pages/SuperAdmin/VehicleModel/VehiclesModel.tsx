import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { provinceList, setup, vehicleModelList } from "../../../utils/Constant";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import {
  setIsConnected,
  setVehicleModel,
} from "../../../ReaduxToolkit/Reducer/VehicleModelSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import VehicleModelListNav from "./VehicleModelListNav";
import VehiclesModelList from "./VehiclesModelList";

const VehiclesModel = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterVehiclesModel, isConnected } = useSelector(
    (state: any) => state.vehicleModel
  );
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterVehiclesModels = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterVehiclesModel.filter((vehicleModel: any, index: any) => {
      return vehicleModel.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setVehicleModel(filtered));

    // console.log(filtered);
  };

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle={vehicleModelList}
            parent={setup}
            title={vehicleModelList}
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <VehicleModelListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      className="global-search-field"
                      value={searchValue}
                      onChange={(e) => {
                        filterVehiclesModels(e);
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
                <VehiclesModelList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default VehiclesModel;
