import { useDispatch, useSelector } from "react-redux";
import GoogleMap from "./components/GoogleMap/GoogleMap";
import MonitoringSidebar from "./components/Sidebar/MonitoringSidebar";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import {
  setDevices,
  setServerDevices,
  setDevicesStatuses,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import Loader from "../../../Loader/Loader";

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

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [groupdevicesStatuses, setgroupdevicesStatuses]: any = useState([]);
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when the component unmounts

    getData();

    console.log("groups", groups);
    console.log("groupDevices", groupdevices);
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const getData = () => {
    getAll({ url: "company/devices" }).then((data: any) => {
      console.log("api call --- >", data);
      console.log("length --- >", data.data.length);

      dispatch(setServerDevices(data.data));

      if (data !== undefined) {
        if (data.success) {
          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i].title;
            if (!groups.includes(element)) {
              groups.push(element);
              // setMyArray((prevArray) => [...prevArray, element]);
            }
          }
          groups.forEach((title: any) => {
            groupDevicesObj[title] = data.data.filter(
              (obj: any) => obj.title === title
            );
          });

          // Convert groupDevicesObj to initialGroupDevices array format
          Object.keys(groupDevicesObj).forEach((title: any) => {
            initialGroupDevices.push({ title, items: groupDevicesObj[title] });
          });

          // Update state with initialGroupDevices
          setgroupdevices(initialGroupDevices);
          console.log("groups", groups);
          console.log("groupDevices", groupdevices);
          dispatch(setDevices(initialGroupDevices));

          // ---------------------- For device status-----------------------------------

          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i].online;
            if (!statuses.includes(element)) {
              statuses.push(element);
              // setMyArray((prevArray) => [...prevArray, element]);
            }
          }
          statuses.forEach((online: any) => {
            statusDevicesObj[online] = data.data.filter(
              (obj: any) => obj.online === online
            );
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
                expiredDevices.push(element);
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
              notConnectedDevices.push(element);
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

  return (
    <>
      {devices.length > 0 ? (
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
