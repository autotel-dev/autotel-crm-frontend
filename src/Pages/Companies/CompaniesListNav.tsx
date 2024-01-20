import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCompany from "./CreateNewCompany";
const CompaniesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  //   var tempList: any = [];
  //   const { crmModules, filterCrmModules } = useSelector(
  //     (state: any) => state.crmModules
  //   );
  return (
    <Card>
      <Row>
        <Col md={6}>
          <Nav tabs className="border-tab">
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink
                className={activeTab === "1" ? "active" : ""}
                onClick={() => {
                  dispatch(setActiveTab("1"));
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
                  dispatch(setActiveTab("3"));
                }}
              >
                <Info /> {inactive}
              </NavLink>
            </NavItem>
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink
                className={activeTab === "2" ? "active" : ""}
                onClick={() => {
                  dispatch(setActiveTab("2"));
                }}
              >
                <CheckCircle />
                {active}
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <CreateNewCompany />
      </Row>
    </Card>
  );
};

export default CompaniesListNav;
