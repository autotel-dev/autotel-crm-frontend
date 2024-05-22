import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";

import {
  setCountries,
  setInActiveActiveCountries,
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import { useSelector } from "react-redux";
import CreateNewEmailTemplate from "./CreateNewEmailTemplate";
const EmailTemplatesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { countries, filterCountries } = useSelector(
    (state: any) => state.countries
  );
  return (
    <Row>
      <Col md={6}>
      </Col>
      <CreateNewEmailTemplate />
    </Row>
  );
};

export default EmailTemplatesListNav;
