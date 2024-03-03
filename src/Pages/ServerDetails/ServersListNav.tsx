import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewServer from "./CreateNewServer";
import { setInActiveActiveServers, setServers } from "../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { useSelector } from "react-redux";
const ServersListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { servers, filterServers } = useSelector(
    (state: any) => state.serverDetails
  );
  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                console.log(filterServers);

                dispatch(setActiveTab("1"));
                filterServers?.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveServers("All"));
                dispatch(setServers(tempList));
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
                console.log(filterServers);

                dispatch(setActiveTab("3"));
                filterServers?.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                  }
                });
                
                dispatch(setInActiveActiveServers("No Active Modules Found"));
                dispatch(setServers(tempList));
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
                console.log(filterServers);

                dispatch(setActiveTab("2"));
                filterServers?.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveServers("No Active Modules Found"));
                dispatch(setServers(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />

              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewServer />
    </Row>
  );
};

export default ServersListNav;
