import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppSelector, useAppDispatch } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import { useSelector } from "react-redux";
import CreateNewUser from "./CreateNewUser";
import {
  setInActiveActiveUsers,
  setOperators,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
const UsersListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { operators, filterOperators } = useSelector(
    (state: any) => state.operators
  );
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var user = userPermissions.find((item: any) => item.title === "User");
  console.log("user", user);

  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                console.log(filterOperators);

                dispatch(setActiveTab("1"));
                filterOperators.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveUsers("All"));
                dispatch(setOperators(tempList));
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
                console.log(filterOperators);

                dispatch(setActiveTab("3"));
                filterOperators.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                    console.log("Users", tempList);
                  }
                });
                dispatch(setInActiveActiveUsers("No inactive users found"));
                dispatch(setOperators(tempList));
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
                console.log(filterOperators);

                dispatch(setActiveTab("2"));
                filterOperators.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    console.log("isActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveUsers("No active users found"));
                dispatch(setOperators(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      {user?.create && <CreateNewUser />}
    </Row>
  );
};

export default UsersListNav;
