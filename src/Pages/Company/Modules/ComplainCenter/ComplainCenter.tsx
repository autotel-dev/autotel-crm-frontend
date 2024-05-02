import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { support } from "../../../../utils/Constant";
import CommonHeader from "../../../../Common/CommonHeader";
import SupportList from "./ComplainList";
import SupportTable from "./ComplainTable";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import {
  setBugReports,
  setIsConnected,
  setPriorityStatuses,
  setStatuses,
  setSupportStatistics,
} from "../../../../ReaduxToolkit/Reducer/SupportSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../Loader/Loader";
import { getUserRole } from "../../../../Api/globals";
import Swal from "sweetalert2";
import NoInternetConnection from "../../../NoInternetConnection/NoInternetConnection";
import { ROLES } from "../../../../constants/roles";
import ComplainList from "./ComplainList";
import ComplainTable from "./ComplainTable";

const ComplainCenter = () => {
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

    getAll({ url: "support/bug-report/get-statistics" }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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
          const mappedArray = Object.entries(
            data.data.bugReportsStatistics
          ).map(([key, value]) => {
            // Remove "total" from the key and replace "Count" with "Tickets"
            const formattedKey = key
              .replace("total", "")
              .replace("Count", " Complains");
            return { key: [formattedKey], value: value };
          });
          // console.log(mappedArray);
          dispatch(setSupportStatistics(mappedArray));
          setStatisticsLoading(false);
        }
      }
    });

    getAll({
      url:
        getUserRole() === ROLES.COMPANY
          ? "company/get-all-bug-reports"
          : getUserRole() === ROLES.OPERATOR
          ? "operator/get-all-bug-reports"
          : "support/bug-report/get-all-bug-reports",
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
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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

    getAll({ url: "support/bug-report/get-priorty-status-types" }).then(
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

    getAll({ url: "support/bug-report/get-status-types" }).then((data: any) => {
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
          <Breadcrumbs mainTitle="Complain Center" parent="Complains" title="complain center" />
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
                            No Complains Found
                          </div>
                        </div>
                      ) : (
                        getUserRole() === ROLES.SUPER_ADMIN && <ComplainList />
                      )}
                      {getUserRole() !== ROLES.SUPER_ADMIN && <ComplainList />}
                      <ComplainTable />
                    </CardBody>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "60vh",
                        backgroundColor: "white",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <Loader />
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

export default ComplainCenter;
