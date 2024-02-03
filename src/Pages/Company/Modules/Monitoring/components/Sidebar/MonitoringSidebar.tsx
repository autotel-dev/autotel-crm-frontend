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
import { ImArrowRight } from "react-icons/im";

const MonitoringSidebar = () => {
  const [collapsedWidth, setCollapsedWidth] = useState("0px");
  // const { collapseSidebar } = useProSidebar();
  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        style={{ height: "100vh" }}
        backgroundColor="#1f2f3e"
        breakPoint="sm"
        transitionDuration={800}
        collapsed={true}
        collapsedWidth="70px"
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: disabled ? "white" : "white",
                  fontWeight: "bold",
                  // height: "75px",
                  width: "100%",
                  // backgroundColor: active ? "#33BFBF" : "#33BFBF",
                };
            },
          }}
        >
          <MenuItem
            onClick={() => {
              if (collapsedWidth == "0px") {
                setCollapsedWidth("450px");
              } else {
                setCollapsedWidth("0px");
              }
            }}
            // icon={<MenuOutlinedIcon />}
            // onClick={() => {
            //   collapseSidebar();
            // }}
            style={{
              textAlign: "center",
              backgroundColor: "#1f2f3e",
              display: "flex",
              alignItems: "center",
              height: "60px",
            }}
          >
            <ImArrowRight style={{ color: "white" }} />
          </MenuItem>

          <MenuItem
            style={{
              backgroundColor: "green",
              transform: "rotate(-90deg)",
              textAlign: "center",
              padding: 0,
              height: "75px",
            }}
          >
            Move
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "red",
              transform: "rotate(-90deg)",
              textAlign: "center",
              padding: 0,
              height: "75px",
            }}
          >
            Stop
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "green",
              transform: "rotate(-90deg)",
              textAlign: "center",
              padding: 0,
              height: "75px",
            }}
          >
            Active
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "yellow",
              transform: "rotate(-90deg)",
              textAlign: "center",
              padding: 0,
              height: "75px",
            }}
          >
            In Active
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Devices Sidebar */}
      <div
        style={{
          width: `${collapsedWidth}`,
          backgroundColor: "white",
          transition: "width 0.5s",
          height: "90vh",
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
