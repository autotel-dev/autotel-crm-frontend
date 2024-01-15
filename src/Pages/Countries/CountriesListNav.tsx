import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCity from "./CreateNewCountry";
const CitiesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  return (
    <Card>
      <Row>
        <Col md={6}>
          <Nav tabs className="border-tab">
            <NavItem>
              <NavLink
                className={activeTab === "1" ? "active" : ""}
                onClick={() => dispatch(setActiveTab("1"))}
              >
                <Target />
                {all}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "2" ? "active" : ""}
                onClick={() => dispatch(setActiveTab("2"))}
              >
                <Info />
                {active}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "3" ? "active" : ""}
                onClick={() => dispatch(setActiveTab("3"))}
              >
                <CheckCircle /> {inactive}
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <CreateNewCity />
      </Row>
    </Card>
  );
};

export default CitiesListNav;
