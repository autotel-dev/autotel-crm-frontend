import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCompany from "./CreateNewCompany";
import { useSelector } from "react-redux";
import { setCompanies } from "../../../ReaduxToolkit/Reducer/CompanySlice";
const CompaniesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { companies, filterCompanies } = useSelector(
    (state: any) => state.companies
  );
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                // // console.log(filterCompanies);

                dispatch(setActiveTab("1"));
                filterCompanies.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setCompanies(tempList));
                tempList = [];
              }}
            >
              <Target />
              {all}
            </NavLink>
          </NavItem>
          {/* <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => {
                // // console.log(filterCompanies);

                dispatch(setActiveTab("3"));
                filterCompanies.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setCompanies(tempList));
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
                // // console.log(filterCompanies);

                dispatch(setActiveTab("2"));
                filterCompanies.map((item: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setCompanies(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem> */}
        </Nav>
      </Col>
      <CreateNewCompany />
    </Row>
  );
};

export default CompaniesListNav;
