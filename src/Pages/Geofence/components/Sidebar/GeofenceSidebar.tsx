import { useState } from "react";

import { FaCarAlt } from "react-icons/fa";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import GeofencesTreeViewAccordian from "../GeofencesAccordian/GeofencesTreeViewAccordian";

const GeofencesSidebar = () => {
  const [collapsedWidth, setCollapsedWidth] = useState("350px");
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
          height: "92.5vh",
          backgroundColor: "#1f2f3e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "scrollY",
          width: "40px",

        }}
      >
        <div
          onClick={() => {
            if (collapsedWidth === "0px") {
              setCollapsedWidth("350px");
            } else {
              setCollapsedWidth("0px");
            }
          }}
          style={{
            textAlign: "center",
            backgroundColor: "#1f2f3e",
            display: "flex",
            alignItems: "center",
            height: "60px",
            justifyContent: "center", // Adjust content alignment
            cursor: "pointer",
          }}
        >
          {collapsedWidth === "350px" ? (
            <ImArrowLeft style={{ color: "white", marginBottom: "5px" }} />
          ) : (
            <ImArrowRight style={{ color: "white", marginBottom: "5px" }} />
          )}
        </div>

      </div>

      {/* Devices Sidebar */}
      <div
        style={{
          width: `${collapsedWidth}`,
          backgroundColor: "white",
          transition: "width 0.5s",
          height: "92.5vh",
          overflow: "auto",
          paddingBottom: "40%",
          scrollbarWidth: "none",
        }}
      >
        {/* <DevicesTreeViewAccordian /> */}
        {collapsedWidth !== "0px" && (
          <GeofencesTreeViewAccordian statusDevices={statusDevices} />
        )}
      </div>
    </div>
  );
};

export default GeofencesSidebar;
