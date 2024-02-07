import { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  // useProSidebar,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Row } from "reactstrap";
import DevicesTreeViewAccordian from "../DevicesAccordian/DevicesTreeViewAccordian";
import { FaCarAlt } from "react-icons/fa";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";

const MonitoringSidebar = () => {
  const [collapsedWidth, setCollapsedWidth] = useState("0px");
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
          Move &nbsp;=&nbsp; 10
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
          Idle &nbsp;=&nbsp; 10
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
          Stop &nbsp;=&nbsp; 10
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
          Inactive &nbsp;=&nbsp; 10
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
          Expired &nbsp;=&nbsp; 10
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
          Not Connected &nbsp;=&nbsp; 10
        </div>
        <div
          style={{
            backgroundColor: "#3d3de9",
            transform: "rotate(-90deg)",
            textAlign: "center",
            display: "flex",
            height: "35px",
            margin: "30px",
            width: "90px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
        >
          Total &nbsp;=&nbsp; 200
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
        }}
      >
        {/* <DevicesTreeViewAccordian /> */}
        {collapsedWidth !== "0px" && <DevicesTreeViewAccordian />}
      </div>
    </div>
  );
};

export default MonitoringSidebar;
