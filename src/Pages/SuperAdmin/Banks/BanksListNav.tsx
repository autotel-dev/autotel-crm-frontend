import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import {
  setBanks,
  setInActiveActiveBanks,
} from "../../../ReaduxToolkit/Reducer/BankSlice";
import { useSelector } from "react-redux";
import CreateNewBank from "./CreateNewBank";
const BanksListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { banks, filterBanks } = useSelector(
    (state: any) => state.banks
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
                filterBanks.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveBanks("All"));
                dispatch(setBanks(tempList));
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
                filterBanks.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveBanks("No Inactive Banks Found"));
                dispatch(setBanks(tempList));
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
                filterBanks.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveBanks("No Active Countries Found")
                );
                dispatch(setBanks(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewBank />
    </Row>
  );
};

export default BanksListNav;
