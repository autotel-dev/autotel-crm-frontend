import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, inactive, active } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewVehicleMOdel from "./CreateNewVehicleModel";
import { useSelector } from "react-redux";
import { setInActiveActiveVehiclesModel, setVehicleModel } from "../../../ReaduxToolkit/Reducer/VehicleModelSlice";
const VehicleModelListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  const { vehicleModel, filterVehiclesModel } = useSelector(
    (state: any) => state.vehicleModel
  );
  var tempList: any = [];
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                // console.log(filterProvinces);

                dispatch(setActiveTab("1"));
                filterVehiclesModel.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveVehiclesModel("All"));
                dispatch(setVehicleModel(tempList));
                tempList = [];
              }}
            >
              <Target />
              {all}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => {
                // console.log(filterProvinces);

                dispatch(setActiveTab("2"));
                filterVehiclesModel.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveVehiclesModel("No Inactive Vehicle Model Found"));
                dispatch(setVehicleModel(tempList));
                tempList = [];
              }}
            >
              <Info />
              {inactive}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => {
                // console.log(filterProvinces);

                dispatch(setActiveTab("3"));
                filterVehiclesModel.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveVehiclesModel("No Active Vehicle Model Found"));
                dispatch(setVehicleModel(tempList));
                tempList = [];
              }}
            >
              <CheckCircle /> {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewVehicleMOdel />
    </Row>
  );
};

export default VehicleModelListNav;
