import { Col, Row } from "reactstrap";

import { Fragment, useEffect, useRef, useState } from "react";

import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";

import "./operations.css";
import { getAll } from "../../../../../../../../Utilities/api";

import {
  GET_ACTIVITIES_BY_TYPE,
  GET_ACTIVITY_STATISTICS,
} from "../../../../../../../../Utilities/api/apiEndpoints";

import {
  setOperationsActivitiesData,
  setOperationsActivitiesLoading,
  setOperationsStatisticsData,
  setOperationsStatisticsLoading,
} from "../../../../../../../../ReaduxToolkit/Reducer/SalesDashboardSlice";
import TotalActivities from "./components/totalActivites/TotalActivities";
import ActivityTypes from "./components/activityTypes/ActivityTypes";
import ActivityTypesTable from "./components/activityTypesTable/ActivityTypesTable";
import Skeleton from "../../../../../../../Utilities/Skeleton/Skeleton";

const Operations = () => {
  const dispatch = useDispatch();

  // Simulating data fetching with a timeout

  const { operationStatisticsLoading, operationActivitiesLoading } =
    useSelector((state: any) => state.salesDashboard);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 7);
  const startDate = yesterday.toISOString();
  const endDate = new Date().toISOString();

  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [activityType, setActivityType] = useState("TRANSFER");

  const [selectedFilter, setSelectedFilter] = useState("1 Week");
  const dropdownRef = useRef<HTMLDivElement>(null); // Add type assertion here
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getActivitiesData = (from: any, to: any) => {
    dispatch(setOperationsStatisticsLoading(true));
    getAll({
      url: `${GET_ACTIVITY_STATISTICS}/?fromDate=${from}&toDate=${to}`,
    }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          dispatch(setOperationsStatisticsData(data.data.statistics));
        }
        if (!data.success) {
          dispatch(setOperationsStatisticsData(null));
        }
      }
    });
  };

  const getActivitiesDataByType = (from: any, to: any, type: any) => {
    dispatch(setOperationsActivitiesLoading(true));
    getAll({
      url: `${GET_ACTIVITIES_BY_TYPE}/?activityType=${type}&fromDate=${from}&toDate=${to}`,
    }).then((data: any) => {
      if (data !== undefined) {
        if (data.success) {
          dispatch(setOperationsActivitiesData(data.data));
        }
        if (!data.success) {
          dispatch(setOperationsActivitiesData(null));
        }
      }
    });
  };

  useEffect(() => {
    getActivitiesData(fromDate, toDate);
  }, [fromDate, toDate]);
  useEffect(() => {
    getActivitiesDataByType(fromDate, toDate, activityType);
  }, [fromDate, toDate, activityType]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !document.querySelector(".modal-content")?.contains(event.target as Node)
    ) {
      // Add type assertion here
      setIsDropdownOpen(false);
      setAddModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: any) => {
    e.stopPropagation(); // Stop event propagation
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [addModal, setAddModal] = useState(false);

  const addToggle = () => {
    setAddModal(!addModal);
  };

  return (
    <Col xl="12" lg="12" md="12" sm="12" style={{}}>
      {operationStatisticsLoading == true &&
      operationActivitiesLoading == true ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "40px",
          }}
        >
          <Col
            xl="3"
            lg="3"
            md="3"
            sm="3"
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Skeleton
              height="410px"
              width="100%"
              marginTop="20px"
              marginBottom="20"
              marginRight="20px"
              borderRadius="10px"
            />
          </Col>
          <Col
            xl="6"
            lg="6"
            md="6"
            sm="6"
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Skeleton
              height="410px"
              width="100%"
              marginTop="20px"
              marginBottom="20"
              marginRight="20px"
              borderRadius="10px"
            />
          </Col>
          <Col
            xl="3"
            lg="3"
            md="3"
            sm="3"
            style={{
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Skeleton
              height="410px"
              width="100%"
              marginTop="20px"
              marginBottom="20"
              marginRight="20px"
              borderRadius="10px"
            />
          </Col>
        </div>
      ) : (
        <Row style={{ display: "flex" }}>
          {/* {operationStatisticsData !== null && !operationStatisticsLoading && ( */}
          <TotalActivities />
          {/* // )} */}

          {/* {operationActivitiesData !== null && !operationActivitiesLoading && ( */}
          <ActivityTypesTable
            toggleDropdown={toggleDropdown}
            selectedFilter={selectedFilter}
            dropdownRef={dropdownRef}
            isDropdownOpen={isDropdownOpen}
            setSelectedFilter={setSelectedFilter}
            setFromDate={setFromDate}
            fromDate={fromDate}
            toDate={toDate}
            setToDate={setToDate}
            addToggle={addToggle}
            addModal={addModal}
            activityType={activityType}
            setActivityType={setActivityType}
          />
          {/* )} */}

          {/* {operationStatisticsData !== null && !operationStatisticsLoading && ( */}
          <ActivityTypes />
          {/* )} */}
        </Row>
      )}
    </Col>
  );
};

export default Operations;
