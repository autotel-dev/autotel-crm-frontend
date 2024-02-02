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
        collapsedWidth="120px"
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: disabled ? "white" : "white",
                  fontWeight: "bold",
                  height: "80px",
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
            style={{ textAlign: "center", backgroundColor: "#1f2f3e" }}
          >
            Devices
          </MenuItem>

          <MenuItem
            style={{
              textAlign: "center",
              backgroundColor: "green",
            }}
          >
            <div>
              <FaCarAlt />
            </div>
            Move
          </MenuItem>
          <MenuItem
            style={{
              textAlign: "center",
              backgroundColor: "red",
            }}
          >
            <div>
              <FaCarAlt />
            </div>
            Stop
          </MenuItem>
          <MenuItem
            style={{
              textAlign: "center",
              backgroundColor: "green",
            }}
          >
            <div>
              <FaCarAlt />
            </div>
            Active
          </MenuItem>
          <MenuItem
            style={{
              textAlign: "center",
              backgroundColor: "yellow",
            }}
          >
            <div>
              <FaCarAlt />
            </div>
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
        }}
      >
        {/* <DevicesTreeViewAccordian /> */}
        {collapsedWidth !== "0px" && <DevicesTreeViewAccordian />}
      </div>
    </div>
  );
};

export default MonitoringSidebar;
