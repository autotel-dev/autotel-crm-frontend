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
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import Loader from "../../../Loader/Loader";
import Swal from "sweetalert2";

const Monitoring = () => {
  const apiKey = "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34"; // Replace with your actual API key

  const dispatch = useDispatch();
  const { devices } = useSelector((state: any) => state.monitoring);
  console.log("devices", devices);

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const statuses: any = [];
  const statusDevicesObj: any = {};
  var initialGroupDevicesStatuses: any = [];
  const [loading, setLoading] = useState(false);

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);

  useEffect(() => {
    let intervalId: any; // Declare variable to store interval ID

    // Function to fetch data and dispatch actions
    const fetchDataAndDispatch = () => {
      getAll({ url: "company/devices" }).then((data: any) => {
        console.log("data", data);
        if (data == undefined) {
          setUndefinedData(true);
          setLoading(false);
          Swal.fire({
            text: "Failed to Fetch",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data !== undefined) {
          if (!data.success) {
            setLoading(false);
            Swal.fire({
              text: "Failed to Fetch the devices",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (data.success) {
            setUndefinedData(false);
            console.log("api call --- >", data);
            console.log("length --- >", data.data.length);

            dispatch(setServerDevices(data.data));
            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i].title;
              if (!groups.includes(element)) {
                groups.push(element);
              }
            }

            groups.forEach((title: any) => {
              groupDevicesObj[title] = data.data
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
                  const anyChecked = updatedItems.some(
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
            console.log(
              "updatedInitialGroupDevices",
              updatedInitialGroupDevices
            );

            // Update state with initialGroupDevices
            setgroupdevices(updatedInitialGroupDevices);
            console.log("groups", groups);
            console.log("groupDevices", groupdevices);
            dispatch(setDevices(updatedInitialGroupDevices));
            // setLoading(false);

            // ---------------------- For device status-----------------------------------

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i].online;
              if (!statuses.includes(element)) {
                statuses.push(element);
                // setMyArray((prevArray) => [...prevArray, element]);
              }
            }
            statuses.forEach((online: any) => {
              statusDevicesObj[online] = data.data
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

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
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
                console.log("expiredDevices", expiredDevices);
                initialGroupDevicesStatuses.push({
                  online: "Expired",
                  items: expiredDevices,
                });
              }
            }

            for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
              if (
                element.time == null ||
                element.time === "" ||
                element.time === undefined
              ) {
                notConnectedDevices.push({ ...element, checked: false });
              }
              if (i === data.data.length - 1) {
                console.log("notConnectedDevices", notConnectedDevices);
                initialGroupDevicesStatuses.push({
                  online: "Not Connected",
                  items: notConnectedDevices,
                });
              }
            }

            // Update state with initialGroupDevicesStatuses
            setgroupdevicesStatuses(initialGroupDevicesStatuses);
            console.log("statuses", statuses);
            console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
            dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
          }
        }
      });
    };

    console.log("Setting up interval...");
    intervalId = setInterval(() => {
      console.log("Devices Called");
      console.log("DevicesCalled in Devices");
      fetchDataAndDispatch(); // Call function to fetch data and dispatch actions
    }, 60000);

    // Cleanup function to clear interval when component unmounts or when loading becomes true
    return () => {
      console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, [devices]); // Empty dependency array to run the effect only once after mounting

  // ------------------------------------------------

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when the component unmounts
    dispatch(setExpandedDevice(null));
    getData();

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ------------------------------------------------

  const getData = () => {
    setLoading(true);
    getAll({ url: "company/devices" }).then((data: any) => {
      console.log("data", data);
      if (data == undefined) {
        setUndefinedData(true);
        setLoading(false);
        Swal.fire({
          text: "Failed to Fetch",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      if (data !== undefined) {
        if (!data.success) {
          setLoading(false);
          Swal.fire({
            text: "Failed to Fetch the devices",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          setUndefinedData(false);
          console.log("api call --- >", data);
          console.log("length --- >", data.data.length);

          dispatch(setServerDevices(data.data));
          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i].title;
            if (!groups.includes(element)) {
              groups.push(element);
            }
          }

          groups.forEach((title: any) => {
            groupDevicesObj[title] = data.data
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
          console.log("groups", groups);
          console.log("groupDevices", groupdevices);
          dispatch(setDevices(initialGroupDevices));
          setLoading(false);

          // ---------------------- For device status-----------------------------------

          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i].online;
            if (!statuses.includes(element)) {
              statuses.push(element);
              // setMyArray((prevArray) => [...prevArray, element]);
            }
          }
          statuses.forEach((online: any) => {
            statusDevicesObj[online] = data.data
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

          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i];
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
              console.log("expiredDevices", expiredDevices);
              initialGroupDevicesStatuses.push({
                online: "Expired",
                items: expiredDevices,
              });
            }
          }

          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i];
            if (
              element.time == null ||
              element.time === "" ||
              element.time === undefined
            ) {
              notConnectedDevices.push({ ...element, checked: false });
            }
            if (i === data.data.length - 1) {
              console.log("notConnectedDevices", notConnectedDevices);
              initialGroupDevicesStatuses.push({
                online: "Not Connected",
                items: notConnectedDevices,
              });
            }
          }

          // Update state with initialGroupDevicesStatuses
          setgroupdevicesStatuses(initialGroupDevicesStatuses);
          console.log("statuses", statuses);
          console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
          dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
        }
      }
    });
  };
  const [undefinedData, setUndefinedData] = useState<any>(false);
  return (
    <>
      {undefinedData ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "80vh",
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
            No Data Found
          </div>
        </div>
      ) : !loading ? (
        devices.length > 0 && (
          <div
            style={{
              margin: "-35px",
              marginTop: "130px",
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
