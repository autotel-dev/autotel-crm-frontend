import { Card, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import { CheckCircle, Info, Target } from "react-feather";
import { all, active, inactive } from "../../utils/Constant";
import { useAppDispatch, useAppSelector } from "../../ReaduxToolkit/Hooks";
import { setActiveTab } from "../../ReaduxToolkit/Reducer/ProjectSlice";
import CreateNewCity from "./CreateNewCity";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useSelector } from "react-redux";
import {
  setCities,
  setInActiveActiveCities,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
const CitiesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  const { cities, filterCities } = useSelector((state: any) => state.cities);
  var tempList: any = [];

  return (
    <Row>
      <Col md={6}>
        <Nav tabs className="border-tab">
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                console.log(filterCities);

                dispatch(setActiveTab("1"));
                filterCities.map((item: any, index: any) => {
                  tempList.push(item);
                });
                dispatch(setInActiveActiveCities("All"));
                dispatch(setCities(tempList));
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
                console.log(filterCities);

                dispatch(setActiveTab("3"));
                filterCities.map((item: any, index: any) => {
                  if (!item.isActive) {
                    tempList.push(item);
                    console.log("isNotActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveCities("No Inactive Cities Found"));
                dispatch(setCities(tempList));
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
                console.log(filterCities);

                dispatch(setActiveTab("2"));
                filterCities.map((item: any, index: any) => {
                  if (item.isActive) {
                    tempList.push(item);
                    console.log("isActive -- >", 1);
                  }
                });
                dispatch(setInActiveActiveCities("No Active Cities Found"));
                dispatch(setCities(tempList));
                tempList = [];
              }}
            >
              <CheckCircle />
              {active}
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <CreateNewCity />
    </Row>
  );
};

export default CitiesListNav;
