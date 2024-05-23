import { useDispatch, useSelector } from "react-redux";
import GoogleMap from "./components/GoogleMap/GoogleMap";
import MonitoringSidebar from "./components/Sidebar/MonitoringSidebar";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import {
  setDevices,
  setServerDevices,
  setDevicesStatuses,
  setExpandedDevice,
  setIsConnected,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import Loader from "../../../Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import NoInternetConnection from "../../../NoInternetConnection/NoInternetConnection";
import { setErrorData } from "../../../../ReaduxToolkit/Reducer/UserSlice";
import DeviceDetailsBar from "./components/RIghtSidebar/DeviceDetailsBar";

const Monitoring = () => {
  const apiKey = "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34"; // Replace with your actual API key

  const dispatch = useDispatch();
  const { devices, isConnected, expandedDevice, devicesDetailData } =
    useSelector((state: any) => state.monitoring);
  // console.log("devices", devices);

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const statuses: any = [];
  const statusDevicesObj: any = {};
  var initialGroupDevicesStatuses: any = [];
  const [loading, setLoading] = useState(false);

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    let intervalId: any; // Declare variable to store interval ID

    // Function to fetch data and dispatch actions
    const fetchDataAndDispatch = () => {
      getAll({ url: "company/devices" }).then((data: any) => {
        // console.log("data", data);
        // if (data == undefined) {
        //   setUndefinedData(true);
        //   setLoading(false);
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
            setLoading(false);
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (data.success) {
            setUndefinedData(false);
            // console.log("api call --- >", data);
            // console.log("length --- >", data.data.length);
            if (data.data.serverErrors.length !== 0) {
              setServerErrors(data.data.serverErrors);
            }

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

            // Match and update the checked status in initialGroupDevices based on the devices list
            const updatedInitialGroupDevices = initialGroupDevices.map(
              (group: any, index: any) => {
                // Find the corresponding group in devices list
                const correspondingGroup = devices.find(
                  (deviceGroup: any) => deviceGroup.title === group.title
                );

                if (correspondingGroup) {
                  // Update the checked status of each item in the group
                  const updatedItems = group.items.map(
                    (device: any, deviceIndex: any) => {
                      // const deviceData = device;
                      if (expandedDevice != null) {
                        if (device.id === expandedDevice.deviceId) {
                          console.log("device", device);
                          console.log("expandedDevice", expandedDevice);
                          dispatch(
                            setExpandedDevice({
                              position: {
                                lat: device.lat,
                                lng: device.lng,
                              },
                              tail: device.tail,
                              deviceId: device.id,
                            })
                          );
                        }
                      }

                      const correspondingDevice = correspondingGroup.items.find(
                        (device: any) =>
                          device.id ===
                          initialGroupDevices[index].items[deviceIndex].id
                      );
                      if (correspondingDevice) {
                        // Return a new object with updated checked key
                        return {
                          ...device,
                          checked: correspondingDevice.checked,
                        };
                      }

                      return device;
                    }
                  );

                  // Check if any item in the group is checked and update the group's checked key
                  const anyChecked = updatedItems.every(
                    (item: any) => item.checked
                  );
                  const updatedGroup = {
                    ...group,
                    items: updatedItems,
                    checked: anyChecked,
                  };

                  return updatedGroup;

                  // // Return the updated group object
                  // return { ...group, items: updatedItems };
                }
                return group;
              }
            );
            // console.log(
            //   "updatedInitialGroupDevices",
            //   updatedInitialGroupDevices
            // );

            // Update state with initialGroupDevices
            setgroupdevices(updatedInitialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            dispatch(setDevices(updatedInitialGroupDevices));
            // setLoading(false);

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
              if (i === data.data.allDevices.length - 1) {
                // console.log("expiredDevices", expiredDevices);
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
                // console.log("notConnectedDevices", notConnectedDevices);
                initialGroupDevicesStatuses.push({
                  online: "Not Connected",
                  items: notConnectedDevices,
                });
              }
            }

            // Update state with initialGroupDevicesStatuses
            setgroupdevicesStatuses(initialGroupDevicesStatuses);
            // console.log("statuses", statuses);
            // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
            dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
          }
        }
      });
    };

    // console.log("Setting up interval...");
    intervalId = setInterval(() => {
      // console.log("Devices Called");
      // console.log("DevicesCalled in Devices");
      fetchDataAndDispatch(); // Call function to fetch data and dispatch actions
    }, 60000);

    // Cleanup function to clear interval when component unmounts or when loading becomes true
    return () => {
      // console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, [devices, expandedDevice]); // Empty dependency array to run the effect only once after mounting

  // ------------------------------------------------

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when the component unmounts
    dispatch(setExpandedDevice(null));
    if (devices.length == 0) {
      getData();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ------------------------------------------------
  const navigate = useNavigate();
  const getData = () => {
    setLoading(true);
    getAll({ url: "company/devices" }).then((data: any) => {
      if (data !== undefined) {
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          setLoading(false);
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }

        if (data.success) {
          setUndefinedData(false);
          // console.log("api call --- >", data);
          // console.log("length --- >", data.data.length);

          if (data.data.serverErrors.length !== 0) {
            setServerErrors(data.data.serverErrors);
          }
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
          // console.log("groups", groups);
          // console.log("groupDevices", groupdevices);
          dispatch(setDevices(initialGroupDevices));
          setLoading(false);

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
              // console.log("expiredDevices", expiredDevices);
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
              // console.log("notConnectedDevices", notConnectedDevices);
              initialGroupDevicesStatuses.push({
                online: "Not Connected",
                items: notConnectedDevices,
              });
            }
          }

          // Update state with initialGroupDevicesStatuses
          setgroupdevicesStatuses(initialGroupDevicesStatuses);
          // console.log("statuses", statuses);
          // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
          dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
        }
      }
    });
  };

  useEffect(() => {
    const showSwalAlerts = (errors: any, index: any) => {
      // Base case: If index is equal to the length of errors array, stop recursion
      if (index === errors.length) return;

      const server = errors[index].server;
      const serverError = errors[index].serverError;

      Swal.fire({
        title: `${server?.companyName}`,
        text: `${serverError?.message}`,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Update Credentials", // Add "Update Credentials" button
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK", recursively call showSwalAlerts with the next index
          showSwalAlerts(errors, index + 1);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // User clicked "Update Credentials", handle update logic here
          // You can add your update logic here or call a separate function
          dispatch(setErrorData(true));
          navigate(`${process.env.PUBLIC_URL}/users/account`);
          // console.log("Update Credentials clicked");
        }
      });
    };

    const timer = setTimeout(() => {
      // const serverErrorss = serverErrors;
      // If there are server errors, start showing alerts
      if (serverErrors && serverErrors.length !== 0) {
        showSwalAlerts(serverErrors, 0); // Start from index 0
      }
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [serverErrors]);

  const [undefinedData, setUndefinedData] = useState<any>(false);
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : !loading ? (
        devices.length > 0 && (
          <div
            style={{
              margin: "-35px",
              marginTop: "80px",
              // marginTop: "130px",
              height: "100vh",
              display: "flex",
              overflow: "unset",
            }}
          >
            <GoogleMap />

            <div
              style={{
                position: "absolute",
                // marginTop:"15px"
              }}
            >
              <MonitoringSidebar />
            </div>

            {devicesDetailData.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                }}
              >
                <DeviceDetailsBar />
              </div>
            )}
          </div>
        )
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "85vh",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export default Monitoring;
