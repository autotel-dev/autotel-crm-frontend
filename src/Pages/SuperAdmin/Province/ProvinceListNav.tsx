import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, inactive, active } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewProvince from "./CreateNewProvince";
import { useSelector } from "react-redux";
import { setInActiveActiveProvinces, setProvinces } from "../../../ReaduxToolkit/Reducer/ProvinceSlice";
const ProvinceListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  const { provinces, filterProvinces } = useSelector(
    (state: any) => state.provinces
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
                filterProvinces.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveProvinces("All"));
                dispatch(setProvinces(tempList));
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
                filterProvinces.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveProvinces("No Inactive Provinces Found"));
                dispatch(setProvinces(tempList));
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
                filterProvinces.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveProvinces("No Active Provinces Found"));
                dispatch(setProvinces(tempList));
                tempList = [];
              }}
            >
              <CheckCircle /> {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewProvince />
    </Row>
  );
};

export default ProvinceListNav;
