import { useDispatch, useSelector } from "react-redux";
import GoogleMap from "./components/GoogleMap/GoogleMap";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import GeofencesSidebar from "./components/Sidebar/GeofenceSidebar";
import {
  setGeofences,
  setGeofencesGroup,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/GeofenceSlice";
import { getAll } from "../../../Utilities/api";
import { log } from "console";
import { GET_ALL_GEOFENCES, GET_ALL_GROUPS } from "../../../Utilities/api/apiEndpoints";
const Geofence = () => {
  // const apiKey = "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34"; // Replace with your actual API key

  const dispatch = useDispatch();
  const { geofences, isConnected } = useSelector(
    (state: any) => state.geofence
  );
  // console.log("devices", devices);

  const groups: any = [];
  const groupDevicesObj: any = {};
  const initialGroupDevices: any = [];

  const [loading, setLoading] = useState(false);

  const [groupgeofences, setgroupgeofences]: any = useState([]);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  // ------------------------------------------------

  // ------------------------------------------------
  const navigate = useNavigate();
  const getData = () => {
    setLoading(true);
    getAll({ url: GET_ALL_GEOFENCES }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data == undefined) {
          Swal.fire({
            text: "Failed to fetch due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          dispatch(setGeofences([]));
          // dispatch(setType(null));
          // setIsNewGeofence(false);
          // setFormData({
          //   title: "",
          // });
          return;
        }

        if (data.success) {
          // console.log("api call --- >", data);
          // console.log("length --- >", data.data.length);
          for (let i = 0; i < data.data.length; i++) {
            var element = "";
            if (data.data[i].geofenceGroup == null) {
              element = "Ungrouped";
            } else {
              element = data.data[i].geofenceGroup.title;
            }
            // const element = data.data[i].geofenceGroup.title;
            if (!groups.includes(element)) {
              groups.push(element);
            }
          }
          console.log(groups);

          groups.forEach((geofenceGroup: any) => {
            groupDevicesObj[geofenceGroup] = data.data
              .filter((obj: any) => {
                if (!obj.geofenceGroup || !obj.geofenceGroup.title) {
                  return geofenceGroup === "Ungrouped";
                } else {
                  return obj.geofenceGroup.title === geofenceGroup;
                }
              })
              .map((item: any) => ({ ...item, checked: false, edited: false }));
          });

          // console.log(groups);
          console.log(groupDevicesObj);

          // Convert groupDevicesObj to initialGroupDevices array format
          Object.keys(groupDevicesObj).forEach((group: any) => {
            initialGroupDevices.push({
              group: group,
              checked: false,
              items: groupDevicesObj[group],
            });
          });
          console.log("initialGroupDevices", initialGroupDevices);

          // Update state with initialGroupDevices
          setGeofencesGroup(initialGroupDevices);
          // console.log("groups", groups);
          // console.log("groupDevices", groupdevices);
          dispatch(setGeofences(initialGroupDevices));
          setLoading(false);
        }
      }
    );
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // if (geofences.length == 0) {
    getData();
    // }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_GROUPS }).then(
      (data: any) => {
        console.log("group-data", data);

        // console.log("api call --- >", data);
        if (data == undefined) {
          Swal.fire({
            text: "Failed to fetch due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          dispatch(setGeofencesGroup([]));
          return;
        }

        if (data !== undefined) {
          if (data.success) {
            dispatch(setGeofencesGroup(data.data));
          }
        }
      }
    );
  }, []);

  const [undefinedData, setUndefinedData] = useState<any>(false);
  const [isEditGeofence, setIsEditGeofence] = useState(false);

  return (
    <>
      <div
        style={{
          marginLeft: "-35px",
          marginTop: "80px",
          // marginTop: "130px",
          height: "92.5vh",
          display: "flex",
          overflow: "hidden",
          scrollbarWidth: "none",
          marginRight: "-35px",
          // paddingLeft:"50px",
        }}
      >
        <GoogleMap
          isEditGeofence={isEditGeofence}
          setIsEditGeofence={setIsEditGeofence}
        />

        <div
          style={{
            position: "absolute",
          }}
        >
          <GeofencesSidebar
            isEditGeofence={isEditGeofence}
            setIsEditGeofence={setIsEditGeofence}
          />
        </div>
      </div>
    </>
  );
};

export default Geofence;
