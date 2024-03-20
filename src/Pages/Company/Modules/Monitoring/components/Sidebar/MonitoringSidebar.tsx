import { useState } from "react";
import DevicesTreeViewAccordian from "../DevicesAccordian/DevicesTreeViewAccordian";
import { FaCarAlt } from "react-icons/fa";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";

const MonitoringSidebar = () => {
  const [collapsedWidth, setCollapsedWidth] = useState("0px");
  const dispatch = useDispatch();
  // ---------------------------------------------------
  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [statusDevices, setStatusDevices] = useState<String>("");

  //------------------------------------------------------
  const { devicesStatuses, serverDevices } = useSelector(
    (state: any) => state.monitoring
  );
  // const { collapseSidebar } = useProSidebar();
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          height: "100vh",
          backgroundColor: "#1f2f3e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "scrollY",
          width: "35px",
        }}
      >
        <div
          onClick={() => {
            if (collapsedWidth === "0px") {
              setCollapsedWidth("550px");
            } else {
              setCollapsedWidth("0px");
            }
          }}
          style={{
            textAlign: "center",
            backgroundColor: "#1f2f3e",
            display: "flex",
            alignItems: "center",
            height: "50px",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
        >
          {collapsedWidth == "550px" ? (
            <ImArrowLeft style={{ color: "white" }} />
          ) : (
            <ImArrowRight style={{ color: "white" }} />
          )}
        </div>
        <div
          style={{
            backgroundColor: "#3d3de9",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "22px",
            width: "75px",
            fontWeight: "bold",
            fontSize: "10px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            setStatusDevices("");
            // const array = serverDevices;
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i].title;
            //   if (!groups.includes(element)) {
            //     groups.push(element);
            //   }
            // }
            // groups.forEach((title: any) => {
            //   groupDevicesObj[title] = array.filter(
            //     (obj: any) => obj.title === title
            //   );
            // });

            // // Convert groupDevicesObj to initialGroupDevices array format
            // Object.keys(groupDevicesObj).forEach((title: any) => {
            //   initialGroupDevices.push({
            //     title,
            //     items: groupDevicesObj[title],
            //   });
            // });

            // // Update state with initialGroupDevices
            // setgroupdevices(initialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            // dispatch(setDevices(initialGroupDevices));
          }}
        >
          Total &nbsp;=&nbsp; {serverDevices.length}
        </div>
        <div
          style={{
            backgroundColor: "#3cff3c",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "18px",
            width: "75px",
            fontWeight: "bold",
            fontSize: "11px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            // const filteredDevices = devices.flatMap(item => {
            //   // Iterate over each item in the items array
            //   return item.items.filter(bodyItem => bodyItem.icon_color === "green");
            // });

            // console.log(filteredDevices);

            // -----------------------------------

            // const filteredDevices = devices.map(item =>
            //   item.items.filter(bodyItem => bodyItem.icon_color === "green")
            // ).flat();

            // console.log(filteredDevices);
            setStatusDevices("online");
            // const array =
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "online"
            //   ) &&
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "online"
            //   ).items;
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i].title;
            //   if (!groups.includes(element)) {
            //     groups.push(element);
            //   }
            // }
            // groups.forEach((title: any) => {
            //   groupDevicesObj[title] = array.filter(
            //     (obj: any) => obj.title === title
            //   );
            // });

            // // Convert groupDevicesObj to initialGroupDevices array format
            // Object.keys(groupDevicesObj).forEach((title: any) => {
            //   initialGroupDevices.push({
            //     title,
            //     items: groupDevicesObj[title],
            //   });
            // });

            // // Update state with initialGroupDevices
            // setgroupdevices(initialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            // dispatch(setDevices(initialGroupDevices));
          }}
        >
          {devicesStatuses.find((item: any) => item.online === "online") &&
            "Move"}
          &nbsp;=&nbsp;
          {devicesStatuses.find(
            (item: any, index: any) => item.online === "online"
          ) &&
            devicesStatuses.find(
              (item: any, index: any) => item.online === "online"
            ).items.length}
        </div>
        <div
          style={{
            backgroundColor: "#ffff4f",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "22px",
            width: "70px",
            fontWeight: "bold",
            fontSize: "11px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            setStatusDevices("engine");
            // const array =
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "engine"
            //   ) &&
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "engine"
            //   ).items;
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i].title;
            //   if (!groups.includes(element)) {
            //     groups.push(element);
            //   }
            // }
            // groups.forEach((title: any) => {
            //   groupDevicesObj[title] = array.filter(
            //     (obj: any) => obj.title === title
            //   );
            // });

            // // Convert groupDevicesObj to initialGroupDevices array format
            // Object.keys(groupDevicesObj).forEach((title: any) => {
            //   initialGroupDevices.push({
            //     title,
            //     items: groupDevicesObj[title],
            //   });
            // });

            // // Update state with initialGroupDevices
            // setgroupdevices(initialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            // dispatch(setDevices(initialGroupDevices));
          }}
        >
          {devicesStatuses.find((item: any) => item.online === "engine") &&
            "Idle"}
          &nbsp;=&nbsp;
          {devicesStatuses.find(
            (item: any, index: any) => item.online === "engine"
          ) &&
            devicesStatuses.find(
              (item: any, index: any) => item.online === "engine"
            ).items.length}
        </div>
        <div
          style={{
            backgroundColor: "#fd5959",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "15px",
            width: "70px",
            fontWeight: "bold",
            fontSize: "11px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            setStatusDevices("ack");
            // const array =
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "ack"
            //   ) &&
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "ack"
            //   ).items;
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i].title;
            //   if (!groups.includes(element)) {
            //     groups.push(element);
            //   }
            // }
            // groups.forEach((title: any) => {
            //   groupDevicesObj[title] = array.filter(
            //     (obj: any) => obj.title === title
            //   );
            // });

            // // Convert groupDevicesObj to initialGroupDevices array format
            // Object.keys(groupDevicesObj).forEach((title: any) => {
            //   initialGroupDevices.push({
            //     title,
            //     items: groupDevicesObj[title],
            //   });
            // });

            // // Update state with initialGroupDevices
            // setgroupdevices(initialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            // dispatch(setDevices(initialGroupDevices));
          }}
        >
          {devicesStatuses.find((item: any) => item.online === "ack") && "Stop"}
          &nbsp;=&nbsp;
          {devicesStatuses.find(
            (item: any, index: any) => item.online === "ack"
          ) &&
            devicesStatuses.find(
              (item: any, index: any) => item.online === "ack"
            ).items.length}
        </div>
        <div
          style={{
            backgroundColor: "#7b7bff",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "22px",
            width: "75px",
            fontWeight: "bold",
            fontSize: "11px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            setStatusDevices("offline");
            // const array =
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "offline"
            //   ) &&
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "offline"
            //   ).items;
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i].title;
            //   if (!groups.includes(element)) {
            //     groups.push(element);
            //   }
            // }
            // groups.forEach((title: any) => {
            //   groupDevicesObj[title] = array.filter(
            //     (obj: any) => obj.title === title
            //   );
            // });

            // // Convert groupDevicesObj to initialGroupDevices array format
            // Object.keys(groupDevicesObj).forEach((title: any) => {
            //   initialGroupDevices.push({
            //     title,
            //     items: groupDevicesObj[title],
            //   });
            // });

            // // Update state with initialGroupDevices
            // setgroupdevices(initialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            // dispatch(setDevices(initialGroupDevices));
          }}
        >
          {devicesStatuses.find((item: any) => item.online === "offline") &&
            "Offline"}
          &nbsp;=&nbsp;
          {devicesStatuses.find(
            (item: any, index: any) => item.online === "offline"
          ) &&
            devicesStatuses.find(
              (item: any, index: any) => item.online === "offline"
            ).items.length}
        </div>
        <div
          style={{
            backgroundColor: "#d3d3d3",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "18px",
            width: "70px",
            fontWeight: "bold",
            fontSize: "11px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            setStatusDevices("Expired");
            // const array =
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "Expired"
            //   ) &&
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "Expired"
            //   ).items;
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i].title;
            //   if (!groups.includes(element)) {
            //     groups.push(element);
            //   }
            // }
            // groups.forEach((title: any) => {
            //   groupDevicesObj[title] = array.filter(
            //     (obj: any) => obj.title === title
            //   );
            // });

            // // Convert groupDevicesObj to initialGroupDevices array format
            // Object.keys(groupDevicesObj).forEach((title: any) => {
            //   initialGroupDevices.push({
            //     title,
            //     items: groupDevicesObj[title],
            //   });
            // });

            // // Update state with initialGroupDevices
            // setgroupdevices(initialGroupDevices);
            // console.log("groups", groups);
            // console.log("groupDevices", groupdevices);
            // dispatch(setDevices(initialGroupDevices));
          }}
        >
          {devicesStatuses.find((item: any) => item.online === "Expired") &&
            "Expired"}
          &nbsp;=&nbsp;
          {devicesStatuses.find(
            (item: any, index: any) => item.online === "Expired"
          ) &&
            devicesStatuses.find(
              (item: any, index: any) => item.online === "Expired"
            ).items.length}
        </div>
        <div
          style={{
            backgroundColor: "#e76be7",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "26px",
            width: "85px",
            fontWeight: "bold",
            fontSize: "9px",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
          onClick={() => {
            setStatusDevices("Not Connected");
            // const array =
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "Not Connected"
            //   ) &&
            //   devicesStatuses.find(
            //     (item: any, index: any) => item.online === "Not Connected"
            //   ).items;
            // if (array.length > 0) {
            //   for (let i = 0; i < array.length; i++) {
            //     const element = array[i].title;
            //     if (!groups.includes(element)) {
            //       groups.push(element);
            //     }
            //   }
            //   groups.forEach((title: any) => {
            //     groupDevicesObj[title] = array.filter(
            //       (obj: any) => obj.title === title
            //     );
            //   });

            //   // Convert groupDevicesObj to initialGroupDevices array format
            //   Object.keys(groupDevicesObj).forEach((title: any) => {
            //     initialGroupDevices.push({
            //       title,
            //       items: groupDevicesObj[title],
            //     });
            //   });

            //   // Update state with initialGroupDevices
            //   setgroupdevices(initialGroupDevices);
            //   console.log("groups", groups);
            //   console.log("groupDevices", groupdevices);
            //   dispatch(setDevices(initialGroupDevices));
            // }
          }}
        >
          {devicesStatuses.find(
            (item: any) => item.online === "Not Connected"
          ) && "Not Connecetd"}
          &nbsp;=&nbsp;
          {devicesStatuses.find(
            (item: any, index: any) => item.online === "Not Connected"
          ) &&
            devicesStatuses.find(
              (item: any, index: any) => item.online === "Not Connected"
            ).items.length}
        </div>
      </div>

      {/* Devices Sidebar */}
      <div
        style={{
          width: `${collapsedWidth}`,
          backgroundColor: "white",
          transition: "width 0.5s",
          height: "85vh",
          overflow: "auto",
          paddingBottom: "30%",
        }}
      >
        {/* <DevicesTreeViewAccordian /> */}
        {collapsedWidth !== "0px" && (
          <DevicesTreeViewAccordian statusDevices={statusDevices} />
        )}
      </div>
    </div>
  );
};

export default MonitoringSidebar;
