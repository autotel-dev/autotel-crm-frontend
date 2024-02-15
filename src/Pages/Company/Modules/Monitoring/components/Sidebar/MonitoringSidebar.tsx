import { useState } from "react";
import DevicesTreeViewAccordian from "../DevicesAccordian/DevicesTreeViewAccordian";
import { FaCarAlt } from "react-icons/fa";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { useSelector } from "react-redux";

const MonitoringSidebar = () => {
  const [collapsedWidth, setCollapsedWidth] = useState("0px");
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
          width: "35px",
        }}
      >
        <div
          onClick={() => {
            if (collapsedWidth === "0px") {
              setCollapsedWidth("500px");
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
          {collapsedWidth == "500px" ? (
            <ImArrowLeft style={{ color: "white" }} />
          ) : (
            <ImArrowRight style={{ color: "white" }} />
          )}
        </div>

        <div
          style={{
            backgroundColor: "#3cff3c",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "25px",
            width: "85px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
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
            margin: "30px",
            width: "85px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
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
            margin: "25px",
            width: "85px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
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
            margin: "35px",
            width: "95px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
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
            margin: "32px",
            width: "100px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
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
            margin: "62px",
            width: "150px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
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
        <div
          style={{
            backgroundColor: "#3d3de9",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "40px",
            width: "110px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
        >
          Total &nbsp;=&nbsp; {serverDevices.length}
        </div>
      </div>

      {/* Devices Sidebar */}
      <div
        style={{
          width: `${collapsedWidth}`,
          backgroundColor: "white",
          transition: "width 0.5s",
          height: "87vh",
          overflow: "auto",
        }}
      >
        {/* <DevicesTreeViewAccordian /> */}
        {collapsedWidth !== "0px" && <DevicesTreeViewAccordian />}
      </div>
    </div>
  );
};

export default MonitoringSidebar;
