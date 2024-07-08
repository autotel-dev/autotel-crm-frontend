import { useState } from "react";
import {
  PopoverBody,
  PopoverHeader,
  UncontrolledPopover,
  UncontrolledTooltip,
} from "reactstrap";
import { H6, LI } from "../../../../../AbstractElements";
import { FaCarAlt } from "react-icons/fa";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setDevices } from "../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import GeofencesTreeViewAccordian from "../GeofencesAccordian/GeofencesTreeViewAccordian";
import GroupSvg from "../../../../../../src/assets/people (1).png";
import SubGroupSvg from "../../../../../../src/assets/group.png";
import GeofenceSvg from "../../../../../../src/assets/placeholder.png";
import { setType } from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import AddGroupModal from "../modals/GroupModal/AddGroupModal";
import AddSubGroupModal from "../modals/SubGroupModal/AddSubGroupModal";
import GroupListModal from "../modals/GroupModal/GroupListModal";
import SubGroupListModal from "../modals/SubGroupModal/SubGroupListModal";

interface PropTypes {
  isEditGeofence: boolean;
  setIsEditGeofence: any;
  
}

const GeofencesSidebar = ({ isEditGeofence, setIsEditGeofence }: PropTypes) => {
  const [collapsedWidth, setCollapsedWidth] = useState("350px");
  const dispatch = useDispatch();
  // ---------------------------------------------------
  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const [groupdevices, setgroupdevices]: any = useState([]);
  const [statusDevices, setStatusDevices] = useState<String>("");

  //------------------------------------------------------
  const { geofences } = useSelector((state: any) => state.geofence);
  //--------------------------------------------------test code----

  const [isNewGeofence, setIsNewGeofence] = useState(false);

  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNewSubGroup, setIsNewSubGroup] = useState(false);

  const [group, setGroup] = useState("");
  const [geofenceType, setGeofenceType] = useState("");

  const [formData, setFormData] = useState({
    title: "",
  });

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
            setIsNewGeofence(false);
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
            paddingTop: "10px",
            height: "45px",
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
        <div
          title="Group"
          style={{
            // backgroundColor:"red",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            height: "40px",
            alignItems: "center",
            borderTop: "1px solid white",
            cursor: "pointer",
            borderBottom: "1px solid white",
          }}
          onClick={(e: any) => {
            e.preventDefault(); // Add this line
            e.stopPropagation();
            setIsNewGroup(true);
          }}
        >
          <img src={GroupSvg} alt="" height={18} width={24} id="Tooltip" />
        </div>
        {isNewGroup && (
          <GroupListModal isVisible={isNewGroup} setIsVisible={setIsNewGroup} />
        )}

        <div
          title="Sub Group"
          style={{
            // backgroundColor:"red",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            height: "40px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid white",
          }}
          onClick={(e: any) => {
            e.preventDefault(); // Add this line
            e.stopPropagation();
            setIsNewSubGroup(true);
          }}
        >
          <img src={SubGroupSvg} alt="" height={18} width={24} />
        </div>
        {isNewSubGroup && (
          <SubGroupListModal
            isVisible={isNewSubGroup}
            setIsVisible={setIsNewSubGroup}
            

            // setValue={setCityName}
          />
        )}
        <div
          title="Geofence"
          style={{
            // backgroundColor:"red",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            height: "40px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid white",
          }}
          onClick={(e: any) => {
            e.preventDefault(); // Add this line
            e.stopPropagation();
            dispatch(setType(""));
            setIsNewGeofence(true);
            setGeofenceType("");
            setGroup("");
            const updateFormData = {
              ...formData,
              title: "",
            };
            setFormData(updateFormData);
            if (collapsedWidth === "0px" && !isNewGeofence) {
              setCollapsedWidth("350px");
            }
            // else {
            //   setCollapsedWidth("0px");
            // }

            // dispatch(setType(bodyItem.type));
          }}
        >
          <img src={GeofenceSvg} alt="" height={17} width={22} />
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
          <GeofencesTreeViewAccordian
            statusDevices={statusDevices}
            isNewGeofence={isNewGeofence}
            setIsNewGeofence={setIsNewGeofence}
            isEditGeofence={isEditGeofence}
            setIsEditGeofence={setIsEditGeofence}
            isNewGroup={isNewGroup}
            setIsNewGroup={setIsNewGroup}
            isNewSubGroup={isNewSubGroup}
            setIsNewSubGroup={setIsNewSubGroup}
            group={group}
            setGroup={setGroup}
            geofenceType={geofenceType}
            setGeofenceType={setGeofenceType}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

export default GeofencesSidebar;
