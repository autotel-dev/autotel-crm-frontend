import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";

import { useSelector } from "react-redux";
import CreateNewRole from "./CreateNewRole";
const RolesListNav = () => {
  var tempList: any = [];
  const { countries, filterCountries } = useSelector(
    (state: any) => state.countries
  );
  return (
    <Row style={{ display: "flex", justifyContent: "end" }}>
      <CreateNewRole />
    </Row>
  );
};

export default RolesListNav;
