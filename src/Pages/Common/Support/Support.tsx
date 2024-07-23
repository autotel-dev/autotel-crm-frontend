import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { support } from "../../../utils/Constant";
import CommonHeader from "../../../Common/CommonHeader";
import SupportList from "./SupportList";
import SupportTable from "./SupportTable";
import { useEffect, useState } from "react";
import { getAll } from "../../../Utilities/api";
import Skeleton from "../../Utilities/Skeleton/Skeleton";

import {
  setBugReports,
  setIsConnected,
  setPriorityStatuses,
  setStatuses,
  setSupportStatistics,
} from "../../../ReaduxToolkit/Reducer/SupportSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Utilities/Loader/Loader";
import { getUserRole } from "../../../Utilities/globals/globals";
import Swal from "sweetalert2";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import { ROLES } from "../../../constants/roles";
import { GET_ALL_BUG_REPORTS, GET_ALL_COMPANY_BUG_REPORTS, GET_ALL_OPERATOR_BUG_REPORTS, GET_BUG_REPORT_PRIORITY_STATUS_TYPES, GET_BUG_REPORT_STATISTICS, GET_BUG_REPORT_STATUS_TYPES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const Support = () => {
  const { supportStatistics, isConnected } = useSelector(
    (state: any) => state.support
  );
  const dispatch = useDispatch();
  const [statisticsloading, setStatisticsLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  useEffect(() => {
    dispatch(setBugReports([]));
    dispatch(setSupportStatistics(null));
    setStatisticsLoading(true);
    setReportsLoading(true);

    if (getUserRole() === ROLES.SUPER_ADMIN) {
      getAll({ url: GET_BUG_REPORT_STATISTICS }).then((data: any) => {

        if (data !== undefined) {
          if (!data.success && data.message === ERROR_MESSAGE) {
            dispatch(setIsConnected(true));
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setStatisticsLoading(false);
          }

          if (data.success) {
            // console.log("hhg");

            // const statisticsArray = Object.entries(
            //   data.data.bugReportsStatistics
            // );

            // const mappedArray = statisticsArray.map(([key, value]) => {
            //   return { key, value };
            // });

            const mappedArray = Object.entries(
              data.data.bugReportsStatistics
            ).map(([key, value]) => {
              // Remove "total" from the key and replace "Count" with "Tickets"
              const formattedKey = key
                .replace("total", "")
                .replace("Count", " Tickets");
              return { key: [formattedKey], value: value };
            });
            // console.log(mappedArray);
            dispatch(setSupportStatistics(mappedArray));
            // setStatisticsLoading(false);
          }
        }
      });
    }

    getAll({
      url:
        getUserRole() === ROLES.COMPANY
          ? GET_ALL_COMPANY_BUG_REPORTS
          : getUserRole() === ROLES.OPERATOR
            ? GET_ALL_OPERATOR_BUG_REPORTS
            : GET_ALL_BUG_REPORTS,
    }).then((data: any) => {
      // console.log("api call --- >", data);

      if (data == undefined) {
        Swal.fire({
          text: "Support Data not Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setBugReports([]));
        setReportsLoading(false);
        setStatisticsLoading(false);
        return;
      }

      if (data !== undefined) {
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          dispatch(setBugReports([]));
          setReportsLoading(false);
          setStatisticsLoading(false);
        }

        if (data.success) {
          // console.log("hhg");
          dispatch(setBugReports(data.data.allBugReports));
          setReportsLoading(false);
          setStatisticsLoading(false);
        }
      }
    });

    getAll({ url: GET_BUG_REPORT_PRIORITY_STATUS_TYPES }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // console.log("hhg");
            dispatch(
              setPriorityStatuses(data.data.bugReportPriortyStatusTypes)
            );
          }
        }
      }
    );

    getAll({ url: GET_BUG_REPORT_STATUS_TYPES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setStatuses(data.data.bugReportStatusTypes));
        }
      }
    });
  }, []);

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs mainTitle={support} parent={support} title={support} />
          <Container fluid>
            <Row>
              <Col sm={12}>
                <Card>
                  {/* <CommonHeader
                    title=""
                    subTitle={[
                      { text: "List of supports opened by customers" },
                    ]}
                  /> */}
                  {!statisticsloading && !reportsLoading ? (
                    <CardBody>
                      {supportStatistics == null &&
                        getUserRole() === ROLES.SUPER_ADMIN ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            height: "15vh",
                            backgroundColor: "white",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "25px",
                              fontWeight: "bold",
                            }}
                          >
                            No Statistics Found
                          </div>
                        </div>
                      ) : (
                        getUserRole() === ROLES.SUPER_ADMIN && <SupportList />
                      )}
                      <SupportTable />
                    </CardBody>
                  ) : (
                    <div
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   height: "80vh",
                    //   backgroundColor: "white",
                    //   alignItems: "center",
                    // }}
                    >
                      <div style={{ textAlign: "center" }}>
                        {/* <Loader /> */}

                        <div style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px 0px",


                        }}>

                          <Skeleton height="140px" width="23%" borderRadius="10px" />
                          <Skeleton height="140px" width="23%" borderRadius="10px" marginLeft="10px" />
                          <Skeleton height="140px" width="23%" borderRadius="10px" marginLeft="10px" />
                          <Skeleton height="140px" width="23%" borderRadius="10px" marginLeft="10px" />
                        </div>
                        <div style={{ margin: "10px 10px", }}>
                          <Skeleton height="100px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                          <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                          <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                          <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                          <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                        </div>


                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Support;
