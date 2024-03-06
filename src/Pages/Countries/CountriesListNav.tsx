import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCity from "./CreateNewCountry";
import {
  setCountries,
  setInActiveActiveCountries,
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import { useSelector } from "react-redux";
const CountriesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { countries, filterCountries } = useSelector(
    (state: any) => state.countries
  );
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                console.log(filterCountries);

                dispatch(setActiveTab("1"));
                filterCountries.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveCountries("All"));
                dispatch(setCountries(tempList));
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
                console.log(filterCountries);

                dispatch(setActiveTab("3"));
                filterCountries.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveCountries("No Inactive Countries Found"));
                dispatch(setCountries(tempList));
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
                console.log(filterCountries);

                dispatch(setActiveTab("2"));
                filterCountries.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveCountries("No Active Countries Found")
                );
                dispatch(setCountries(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewCity />
    </Row>
  );
};

export default CountriesListNav;
