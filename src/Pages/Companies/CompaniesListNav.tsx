import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import { setCountries } from "../../ReaduxToolkit/Reducer/CountrySlice";
import { useSelector } from "react-redux";
import { setCRMModules } from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
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
            <NavItem>
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
            <NavItem>
              <NavLink
                className={activeTab === "3" ? "active" : ""}
                onClick={() => {
                  dispatch(setActiveTab("3"));
                }}
              >
                <CheckCircle /> {inactive}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "2" ? "active" : ""}
                onClick={() => {
                  dispatch(setActiveTab("2"));
                }}
              >
                <Info />
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
