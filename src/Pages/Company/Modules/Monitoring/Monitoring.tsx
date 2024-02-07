import { useDispatch, useSelector } from "react-redux";
import GoogleMap from "./components/GoogleMap/GoogleMap";
import MonitoringSidebar from "./components/Sidebar/MonitoringSidebar";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import {
  setDevices,
  setServerDevices,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import Loader from "../../../Loader/Loader";

const Monitoring = () => {
  const apiKey = "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34"; // Replace with your actual API key
  const [newList, setNewList] = useState([{ title: "New List", data: [] }]);

  const dispatch = useDispatch();
  const { devices } = useSelector((state: any) => state.monitoring);
  console.log("devices", devices);

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
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
            height: "100vh",
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
