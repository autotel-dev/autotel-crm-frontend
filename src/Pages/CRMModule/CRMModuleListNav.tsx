import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import { useSelector } from "react-redux";
import CreateNewCRMModule from "./CreateNewCRMModule";
import {
  setCRMModules,
  setInActiveActiveModules,
} from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
const CRMModuleListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { crmModules, filterCrmModules } = useSelector(
    (state: any) => state.crmModules
  );
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                console.log(filterCrmModules);

                dispatch(setActiveTab("1"));
                filterCrmModules.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveModules("All"));
                dispatch(setCRMModules(tempList));
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
                console.log(filterCrmModules);

                dispatch(setActiveTab("3"));
                filterCrmModules.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveModules("No Inactive Modules Found"));
                dispatch(setCRMModules(tempList));
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
                console.log(filterCrmModules);

                dispatch(setActiveTab("2"));
                filterCrmModules.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveModules("No Active Modules Found"));
                dispatch(setCRMModules(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewCRMModule />
    </Row>
  );
};

export default CRMModuleListNav;
