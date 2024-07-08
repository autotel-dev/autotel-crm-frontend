import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import {
  setGroup,
  setInActiveActiveGroups,
} from "../../../ReaduxToolkit/Reducer/GroupSlice";
import { useSelector } from "react-redux";
import CreateNewGroup from "./CreateNewGroup";
const GroupsListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { group, filterGroups} = useSelector(
    (state: any) => state.group
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
                filterGroups.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveGroups("All"));
                dispatch(setGroup(tempList));
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
                filterGroups.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveGroups("No Inactive Groups Found"));
                dispatch(setGroup(tempList));
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
                filterGroups.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveGroups("No Active GRoups Found")
                );
                dispatch(setGroup(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewGroup />
    </Row>
  );
};

export default GroupsListNav;
