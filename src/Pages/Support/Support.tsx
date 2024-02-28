import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { support } from "../../utils/Constant";
import CommonHeader from "../../Common/CommonHeader";
import SupportList from "./SupportList";
import SupportTable from "./SupportTable";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import {
  setBugReports,
  setPriorityStatuses,
  setStatuses,
  setSupportStatistics,
} from "../../ReaduxToolkit/Reducer/SupportSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { getUserRole } from "../../Api/globals";

const Support = () => {
  const { supportStatistics } = useSelector((state: any) => state.support);
  const dispatch = useDispatch();
  const [statisticsloading, setStatisticsLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  useEffect(() => {
    setStatisticsLoading(true);
    setReportsLoading(true);

    if (getUserRole() === "SUPER_ADMIN") {
      getAll({ url: "support/bug-report/get-statistics" }).then((data: any) => {
        console.log("api call --- >", data);
        if (data !== undefined) {
          if (!data.success) {
            setStatisticsLoading(false);
          }
          if (data.success) {
            console.log("hhg");
            setStatisticsLoading(false);
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
            console.log(mappedArray);
            dispatch(setSupportStatistics(mappedArray));
          }
        }
      });
    }

    getAll({
      url:
        getUserRole() === "COMPANY"
          ? "company/get-all-bug-reports"
          : "support/bug-report/get-all-bug-reports",
    }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (!data.success) {
          dispatch(setBugReports([]));
          setReportsLoading(false);
          setStatisticsLoading(false);
        }
        if (data.success) {
          console.log("hhg");
          dispatch(setBugReports(data.data.allBugReports));
          setReportsLoading(false);
          setStatisticsLoading(false);
        }
      }
    });

    getAll({ url: "support/bug-report/get-priorty-status-types" }).then(
      (data: any) => {
        console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            console.log("hhg");
            dispatch(
              setPriorityStatuses(data.data.bugReportPriortyStatusTypes)
            );
          }
        }
      }
    );

    getAll({ url: "support/bug-report/get-status-types" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          console.log("hhg");
          dispatch(setStatuses(data.data.bugReportStatusTypes));
        }
      }
    });
  }, []);
  return (
    <>
      <Breadcrumbs mainTitle={support} parent={support} title={support} />
      <Container fluid>
        <Row>
          <Col sm={12}>
            <Card>
              <CommonHeader
                title=""
                subTitle={[{ text: "List of supports opened by customers" }]}
              />
              {!statisticsloading && !reportsLoading ? (
                <CardBody>
                  {supportStatistics === null &&
                  getUserRole() === "SUPER_ADMIN" ? (
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
                        No Statistics Foound
                      </div>
                    </div>
                  ) : (
                    getUserRole() === "SUPER_ADMIN" && <SupportList />
                  )}
                  <SupportTable />
                </CardBody>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "80vh",
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
    </>
  );
};

export default Support;
