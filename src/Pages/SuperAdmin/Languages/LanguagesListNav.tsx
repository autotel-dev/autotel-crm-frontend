import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../../ReaduxToolkit/Reducer/ProjectSlice";
import {
  setLanguages,
  setInActiveActiveLanguages,
} from "../../../ReaduxToolkit/Reducer/LanguageSlice";
import { useSelector } from "react-redux";
import CreateNewLanguage from "./CreateNewLanguage";
const LanguagesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { languages, filterLanguages } = useSelector(
    (state: any) => state.languages
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
                filterLanguages.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveLanguages("All"));
                dispatch(setLanguages(tempList));
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
                filterLanguages.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    // console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveLanguages("No Inactive Languages Found"));
                dispatch(setLanguages(tempList));
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
                filterLanguages.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    // console.log("isActive -- >", 1);
                  }
                });
                dispatch(
                  setInActiveActiveLanguages("No Active Languages Found")
                );
                dispatch(setLanguages(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewLanguage />
    </Row>
  );
};

export default LanguagesListNav;
