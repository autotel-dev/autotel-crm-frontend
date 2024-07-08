import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import {
  setCurrencies,
  setInActiveActiveCurrencies,
} from "../../../ReaduxToolkit/Reducer/CurrencySlice";
import { useSelector } from "react-redux";
import CreateNewCurrency from "./CreateNewCurrency";
const CurrenciesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { currencies, filterCurrencies } = useSelector(
    (state: any) => state.currencies
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
                filterCurrencies.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveCurrencies("All"));
                dispatch(setCurrencies(tempList));
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
                filterCurrencies.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveCurrencies("No Inactive Currencies Found"));
                dispatch(setCurrencies(tempList));
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
                filterCurrencies.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveCurrencies("No Active Currencies Found")
                );
                dispatch(setCurrencies(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewCurrency/>
    </Row>
  );
};

export default CurrenciesListNav;
