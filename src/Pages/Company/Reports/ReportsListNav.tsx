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
const ReportsListNav = ({ dropDownDevices }: any) => {
  const { activeTab } = useAppSelector((state) => state.project);
  //   const dispatch = useAppDispatch();
  //   var tempList: any = [];
  //   const { operators, filterOperators } = useSelector(
  //     (state: any) => state.operators
  //   );
  return (
    <Row>
      <Col md={6}></Col>
      <CreateNewReport dropDownDevices={dropDownDevices} />
    </Row>
  );
};

export default ReportsListNav;
