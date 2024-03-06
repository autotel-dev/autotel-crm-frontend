import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppSelector, useAppDispatch } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import { useSelector } from "react-redux";
import {
  setInActiveActiveUsers,
  setOperators,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import CreateNewReport from "./CreateNewReport";
const ReportsListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  //   const dispatch = useAppDispatch();
  //   var tempList: any = [];
  //   const { operators, filterOperators } = useSelector(
  //     (state: any) => state.operators
  //   );
  return (
    <Row>
      <Col md={6}>
        {/* <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                // console.log(filterOperators);
                // dispatch(setActiveTab("1"));
                // filterOperators.map((item: any, index: any) => {
                //   tempList.push(item);
                // });
                // dispatch(setInActiveActiveUsers("All"));
                // dispatch(setOperators(tempList));
                // tempList = [];
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
                // console.log(filterOperators);
                // dispatch(setActiveTab("3"));
                // filterOperators.map((item: any, index: any) => {
                //   if (!item.isActive) {
                //     tempList.push(item);
                //     console.log("isNotActive -- >", 1);
                //     console.log("Users", tempList);
                //   }
                // });
                // dispatch(setInActiveActiveUsers("inActive"));
                // dispatch(setOperators(tempList));
                // tempList = [];
              }}
            >
              <Info /> {inactive}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => {
                // console.log(filterOperators);
                // dispatch(setActiveTab("2"));
                // filterOperators.map((item: any, index: any) => {
                //   if (item.isActive) {
                //     tempList.push(item);
                //     console.log("isActive -- >", 1);
                //   }
                // });
                // dispatch(setInActiveActiveUsers("active"));
                // dispatch(setOperators(tempList));
                // tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav> */}
      </Col>
      <CreateNewReport />
    </Row>
  );
};

export default ReportsListNav;
