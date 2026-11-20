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
import {
  GET_ALL_GEOFENCES,
  GET_ALL_GROUPS,
} from "../../../Utilities/api/apiEndpoints";
const Geofence = () => {
  // const apiKey = (process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""); // Replace with your actual API key

  const dispatch = useDispatch();
  const { geofences, isConnected } = useSelector(
    (state: any) => state.geofence,
  );
  // console.log("devices", devices);

  const groups: any = [];
  const groupGeofencesObj: any = {};
  const initialGroupGeofences: any = [];

  let subGroups: any = [];
  let subGroupsGeofencesObj: any = {};
  let initialSubGroupsGeofences: any = [];

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
    getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
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

        const updatedData = data.data.map((item: any, index: any) => {
          return {
            ...item,
          };
        });
        // console.log("updatedData", updatedData);

        for (let i = 0; i < updatedData.length; i++) {
          var element = "";
          if (updatedData[i].geofenceGroup == null) {
            element = "Ungrouped";
          } else {
            element = updatedData[i].geofenceGroup.title;
          }
          // const element = data.data[i].geofenceGroup.title;
          if (!groups.includes(element)) {
            groups.push(element);
          }
        }
        // console.log(groups);

        groups.forEach((geofenceGroup: any) => {
          groupGeofencesObj[geofenceGroup] = updatedData
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
        // console.log(groupGeofencesObj);

        // Convert groupDevicesObj to initialGroupDevices array format
        Object.keys(groupGeofencesObj).forEach((group: any) => {
          initialGroupGeofences.push({
            group: group,
            checked: false,
            items: groupGeofencesObj[group],
          });
        });
        // console.log("initialGroupDevices", initialGroupGeofences);

        // -------------------------------------------------------------

        for (let i = 0; i < initialGroupGeofences.length; i++) {
          // console.log("item.group -- >", initialGroupGeofences[i].group);
          for (let j = 0; j < initialGroupGeofences[i].items.length; j++) {
            var element = "";
            if (initialGroupGeofences[i].items[j].geofenceSubGroup !== null) {
              element =
                initialGroupGeofences[i].items[j].geofenceSubGroup.title;
            }
            // const element = data.data[i].geofenceGroup.title;
            if (!subGroups.includes(element)) {
              if (element !== "") {
                subGroups.push(element);
              }
            }
          }
          // console.log("subGroups", subGroups);

          subGroups.forEach((geofenceSubGroup: any) => {
            subGroupsGeofencesObj[geofenceSubGroup] = initialGroupGeofences[
              i
            ].items
              .filter((obj: any) => {
                if (!obj.geofenceSubGroup || !obj.geofenceSubGroup.title) {
                  return;
                } else {
                  return obj.geofenceSubGroup.title === geofenceSubGroup;
                }
              })
              .map((item: any) => ({ ...item, checked: false, edited: false }));
          });

          // console.log(groups);
          // console.log("subGroupsGeofencesObj", subGroupsGeofencesObj);

          // Convert groupDevicesObj to initialGroupDevices array format
          Object.keys(subGroupsGeofencesObj).forEach((group: any) => {
            initialSubGroupsGeofences.push({
              subgroup: group,
              checked: false,
              items: subGroupsGeofencesObj[group],
            });
          });

          initialGroupGeofences[i] = {
            ...initialGroupGeofences[i],
            // items: initialGroupGeofences[i].items.filter(
            //   (item: any) => item.geofenceSubGroup == null
            // ),
            subgroups: initialSubGroupsGeofences,
          };

          subGroups = [];
          subGroupsGeofencesObj = {};
          initialSubGroupsGeofences = [];
        }

        // console.log("initialGroupDevicesFinalzied", initialGroupGeofences);

        // Update state with initialGroupDevices
        setGeofencesGroup(initialGroupGeofences);

        dispatch(setGeofences(initialGroupGeofences));
        setLoading(false);
      }
    });
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
    getAll({ url: GET_ALL_GROUPS }).then((data: any) => {
      // console.log("group-data", data);

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
    });
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
