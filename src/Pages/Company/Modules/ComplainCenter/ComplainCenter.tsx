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
import { setAllComplains, setComplainCenterRoles, setComplainCenterStatistics, setComplainPriorityTypes, setComplainRoleSelection, setComplainStatusTypes, setComplainTypesList, setFilteredRole } from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import { setDevices, setDevicesStatuses, setServerDevices } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";

const ComplainCenter = () => {
  const { supportStatistics, isConnected } = useSelector(
    (state: any) => state.support
  );
  const dispatch = useDispatch();
  const [statisticsloading, setStatisticsLoading] = useState(true);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  useEffect(() => {
    dispatch(setIsConnected(false));
    dispatch(setFilteredRole("All"));
  }, []);
  useEffect(() => {
    dispatch(setAllComplains([]));
    dispatch(setSupportStatistics(null));
    setStatisticsLoading(true);
    setComplaintsLoading(true);

    getAll({ url: "complaint-center/get-statistics" }).then((data: any) => {
      // console.log("Data", data);

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
          dispatch(setComplainCenterRoles(data.data.InternalComplaintsStatistics.subRoleCounts))
          const mappedArray = Object.entries(
            data.data.InternalComplaintsStatistics
          ).map(([key, value]) => {
            // Remove "total" from the key and replace "Count" with "Tickets"
            if (key !== "subRoleCounts") {
              const formattedKey = key
                .replace("total", "")
                .replace("Count", "");
              return { key: formattedKey, value: value };
            }
          });
          mappedArray.pop()
          // console.log(mappedArray);
          dispatch(setComplainCenterStatistics(mappedArray));
          setStatisticsLoading(false);
        }
      }
    });

    getAll({
      url: "complaint-center/get-all-internal-complaints",
    }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "Complaints not Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setAllComplains([]));
        setComplaintsLoading(false);
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
          dispatch(setAllComplains([]));
          setComplaintsLoading(false);
          setStatisticsLoading(false);
        }

        if (data.success) {
          // console.log("hhg");
          dispatch(setAllComplains(data.data.allInternalComplaints));
          setComplaintsLoading(false);
          setStatisticsLoading(false);
        }
      }
    });


  }, []);

  useEffect(() => {
    getAll({ url: "complaint-center/internal-complaint-type/get-all-active-types" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setComplainTypesList(data.data));
        }
      }
    });
    getAll({ url: "complaint-center/get-status-types" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setComplainStatusTypes(data.data.internalComplaintStatusTypes));
        }
      }
    });

    getAll({ url: "complaint-center/get-priorty-status-types" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setComplainPriorityTypes(data.data.internalComplaintPriortyStatusTypes));
        }
      }
    });

    getAll({ url: "sub-role/get-all-active-sub-roles" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setComplainRoleSelection(data.data));
        }
      }
    });

  }, [])
  const { devices } = useSelector((state: any) => state.monitoring);

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const statuses: any = [];
  const statusDevicesObj: any = {};
  var initialGroupDevicesStatuses: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);

  useEffect(() => {
    if (devices.length === 0) {
      getAll({ url: "company/devices" }).then((data: any) => {
        // // console.log("data", data);
        // if (data == undefined) {
        //   setDevicesLoading(false);
        //   Swal.fire({
        //     text: "Failed to Fetch",
        //     icon: "error",
        //     timer: 2000,
        //     showConfirmButton: false,
        //   });
        // }
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
            // setDevicesLoading(false);
          }

          if (data.success) {
            // // console.log("api call --- >", data);
            // // console.log("length --- >", data.data.length);
            dispatch(setServerDevices(data.data.allDevices));

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i].title;
              if (!groups.includes(element)) {
                groups.push(element);
              }
            }

            groups.forEach((title: any) => {
              groupDevicesObj[title] = data.data.allDevices
                .filter((obj: any) => obj.title === title)
                .map((item: any) => ({ ...item, checked: false }));
            });

            // Convert groupDevicesObj to initialGroupDevices array format
            Object.keys(groupDevicesObj).forEach((title: any) => {
              initialGroupDevices.push({
                title,
                checked: false,
                items: groupDevicesObj[title],
              });
            });

            // Update state with initialGroupDevices
            setgroupdevices(initialGroupDevices);
            // // console.log("groups", groups);
            // // console.log("groupDevices", groupdevices);
            dispatch(setDevices(initialGroupDevices));
            // setDevicesLoading(false);

            // ---------------------- For device status-----------------------------------

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i].online;
              if (!statuses.includes(element)) {
                statuses.push(element);
                // setMyArray((prevArray) => [...prevArray, element]);
              }
            }
            statuses.forEach((online: any) => {
              statusDevicesObj[online] = data.data.allDevices
                .filter((obj: any) => obj.online === online)
                .map((item: any) => ({ ...item, checked: false }));
            });

            // Convert groupDevicesObj to initialGroupDevices array format
            Object.keys(statusDevicesObj).forEach((online: any) => {
              initialGroupDevicesStatuses.push({
                online,
                items: statusDevicesObj[online],
              });
            });

            const expiredDevices = [];
            const notConnectedDevices = [];
            const currentDate = new Date(); // Get the current date and time

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i];
              if (
                element.expiration_date != null &&
                element.expiration_date !== ""
              ) {
                const expirationDate = new Date(element.expiration_date); // Convert expiration date string to Date object
                if (expirationDate < currentDate) {
                  // Compare expiration date with current date
                  expiredDevices.push({ ...element, checked: false });
                }
              }
              if (i === data.data.length - 1) {
                // // console.log("expiredDevices", expiredDevices);
                initialGroupDevicesStatuses.push({
                  online: "Expired",
                  items: expiredDevices,
                });
              }
            }

            for (let i = 0; i < data.data.allDevices.length; i++) {
              const element = data.data.allDevices[i];
              if (
                element.time == null ||
                element.time === "" ||
                element.time == undefined
              ) {
                notConnectedDevices.push({ ...element, checked: false });
              }
              if (i === data.data.length - 1) {
                // // console.log("notConnectedDevices", notConnectedDevices);
                initialGroupDevicesStatuses.push({
                  online: "Not Connected",
                  items: notConnectedDevices,
                });
              }
            }

            // Update state with initialGroupDevicesStatuses
            setgroupdevicesStatuses(initialGroupDevicesStatuses);
            // // console.log("statuses", statuses);
            // // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
            dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
          }
        }
      });
    }
  }, []);

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Complain Center"
            parent="Complains"
            title="complain center"
          />
          <Container fluid>
            <Row>
              <Col sm={12}>
                <div>
                  {!statisticsloading && !complaintsLoading ? (
                    <>
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

                      <Card>
                        <CardBody>
                          <ComplainTable />
                        </CardBody>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardBody>
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
                      </CardBody>
                    </Card>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default ComplainCenter;
