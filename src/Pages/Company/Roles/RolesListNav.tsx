import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { useAppSelector, useAppDispatch } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";

import { useSelector } from "react-redux";
import CreateNewRole from "./CreateNewRole";
import {
  setInActiveActiveRoles,
  setRoles,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
const RolesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { roles, filterRoles } = useSelector((state: any) => state.roles);
  return (
    <Row style={{ display: "flex", justifyContent: "end" }}>
      <Nav tabs className="border-tab">
        <NavItem style={{ cursor: "pointer" }}>
          <NavLink
            className={activeTab === "1" ? "active" : ""}
            onClick={() => {
              console.log(filterRoles);

              dispatch(setActiveTab("1"));
              filterRoles.map((item: any, index: any) => {
                tempList.push(item);
              });
              dispatch(setInActiveActiveRoles("All"));
              dispatch(setRoles(tempList));
              tempList = [];
            }}
          >
            <Target />
            All
          </NavLink>
        </NavItem>
        <NavItem style={{ cursor: "pointer" }}>
          <NavLink
            className={activeTab === "3" ? "active" : ""}
            onClick={() => {
              console.log(filterRoles);

              dispatch(setActiveTab("3"));
              filterRoles.map((item: any, index: any) => {
                if (!item.isActive) {
                  tempList.push(item);
                }
              });
              dispatch(setInActiveActiveRoles("No inactive roles found"));

              dispatch(setRoles(tempList));
              tempList = [];
            }}
          >
            <Info /> Inactive
          </NavLink>
        </NavItem>
        <NavItem style={{ cursor: "pointer" }}>
          <NavLink
            className={activeTab === "2" ? "active" : ""}
            onClick={() => {
              console.log(filterRoles);

              dispatch(setActiveTab("2"));
              filterRoles.map((item: any, index: any) => {
                if (item.isActive) {
                  tempList.push(item);
                  console.log("isActive -- >", 1);
                }
              });
              dispatch(setInActiveActiveRoles("No active roles found"));

              dispatch(setRoles(tempList));
              tempList = [];
            }}
          >
            <CheckCircle />
            Active
          </NavLink>
        </NavItem>
      </Nav>
      <CreateNewRole />
    </Row>
  );
};

export default RolesListNav;
