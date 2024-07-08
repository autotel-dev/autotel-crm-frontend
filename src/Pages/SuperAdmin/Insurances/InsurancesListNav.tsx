import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCountry from "./CreateNewInsurance";
import {
  setInsurance,
  setInActiveActiveInsurances,
} from "../../../ReaduxToolkit/Reducer/InsuranceSlice";
import { useSelector } from "react-redux";
import CreateNewInsurance from "./CreateNewInsurance";
const InsurancesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { insurance, filterInsurances } = useSelector(
    (state: any) => state.insurance
  );
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                // console.log(filterCountries);

                dispatch(setActiveTab("1"));
                filterInsurances.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveInsurances("All"));
                dispatch(setInsurance(tempList));
                tempList = [];
              }}
            >
              <Target />
              {all}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => {
                // console.log(filterCountries);

                dispatch(setActiveTab("3"));
                filterInsurances.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveInsurances("No Inactive Insurances Found"));
                dispatch(setInsurance(tempList));
                tempList = [];
              }}
            >
              <Info /> {inactive}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => {
                // console.log(filterCountries);

                dispatch(setActiveTab("2"));
                filterInsurances.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveInsurances("No Active Insurances Found")
                );
                dispatch(setInsurance(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewInsurance />
    </Row>
  );
};

export default InsurancesListNav;
