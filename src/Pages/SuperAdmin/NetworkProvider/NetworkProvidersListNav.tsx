import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCountry from "./CreateNewNetworkProvider";
import {
  setNetworkProvider,
  setInActiveActiveNetworkProvider,
} from "../../../ReaduxToolkit/Reducer/NetworkProviderSlice";
import { useSelector } from "react-redux";
import CreateNewNetworkProvider from "./CreateNewNetworkProvider";
const NetworkProvidersListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { networkProvider, filterNetworkProvider } = useSelector(
    (state: any) => state.networkProvider
  );
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                // console.log(filterCountries);

                dispatch(setActiveTab("1"));
                filterNetworkProvider.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveNetworkProvider("All"));
                dispatch(setNetworkProvider(tempList));
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
                // console.log(filterCountries);

                dispatch(setActiveTab("3"));
                filterNetworkProvider.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveNetworkProvider("No Inactive Countries Found"));
                dispatch(setNetworkProvider(tempList));
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
                // console.log(filterCountries);

                dispatch(setActiveTab("2"));
                filterNetworkProvider.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveNetworkProvider("No Active Network Provider Found")
                );
                dispatch(setNetworkProvider(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewNetworkProvider />
    </Row>
  );
};

export default NetworkProvidersListNav;
