import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, inactive, active } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewPackage from "./CreateNewPackage";
import { useSelector } from "react-redux";
import { setPackages } from "../../ReaduxToolkit/Reducer/PackageSlice";
const PackageListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  const { packages, filterPackages } = useSelector(
    (state: any) => state.packages
  );
  var tempList: any = [];
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                console.log(filterPackages);

                dispatch(setActiveTab("1"));
                filterPackages.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setPackages(tempList));
                tempList = [];
              }}
            >
              <Target />
              {all}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => {
                console.log(filterPackages);

                dispatch(setActiveTab("1"));
                filterPackages.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    console.log("isActive -- >", 1);
                  }
                });
                dispatch(setPackages(tempList));
                tempList = [];
              }}
            >
              <Info />
              {inactive}
            </NavLink>
          </NavItem>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => {
                console.log(filterPackages);

                dispatch(setActiveTab("1"));
                filterPackages.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    console.log("isActive -- >", 1);
                  }
                });
                dispatch(setPackages(tempList));
                tempList = [];
              }}
            >
              <CheckCircle /> {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewPackage />
    </Row>
  );
};

export default PackageListNav;
