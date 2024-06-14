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

<<<<<<< HEAD
  // useEffect(() => {
  //   dispatch(setIsConnected(false));
  // }, []);

  // useEffect(() => {
  //   let intervalId: any; // Declare variable to store interval ID

  //   // Function to fetch data and dispatch actions
  //   const fetchDataAndDispatch = () => {
  //     getAll({ url: GET_DEVICES }).then((data: any) => {
  //       // console.log("data", data);
  //       // if (data == undefined) {
  //       //   setUndefinedData(true);
  //       //   setLoading(false);
  //       //   Swal.fire({
  //       //     text: "Failed to Fetch",
  //       //     icon: "error",
  //       //     timer: 2000,
  //       //     showConfirmButton: false,
  //       //   });
  //       // }
  //       if (data !== undefined) {
  //         if (!data.success && data.message === ERROR_MESSAGE) {
  //           dispatch(setIsConnected(true));
  //         }
  //         if (!data.success) {
  //           setLoading(false);
  //           Swal.fire({
  //             text: `${data.message}`,
  //             icon: "error",
  //             timer: 2000,
  //             showConfirmButton: false,
  //           });
  //         }
  //         if (data.success) {
  //           setUndefinedData(false);
  //           // console.log("api call --- >", data);
  //           // console.log("length --- >", data.data.length);
  //           if (data.data.serverErrors.length !== 0) {
  //             setServerErrors(data.data.serverErrors);
  //           }

  //           dispatch(setServerDevices(data.data.allDevices));
  //           for (let i = 0; i < data.data.allDevices.length; i++) {
  //             const element = data.data.allDevices[i].title;
  //             if (!groups.includes(element)) {
  //               groups.push(element);
  //             }
  //           }

  //           groups.forEach((title: any) => {
  //             groupDevicesObj[title] = data.data.allDevices
  //               .filter((obj: any) => obj.title === title)
  //               .map((item: any) => ({ ...item, checked: false }));
  //           });

  //           // Convert groupDevicesObj to initialGroupDevices array format
  //           Object.keys(groupDevicesObj).forEach((title: any) => {
  //             initialGroupDevices.push({
  //               title,
  //               checked: false,
  //               items: groupDevicesObj[title],
  //             });
  //           });

  //           // Match and update the checked status in initialGroupDevices based on the devices list
  //           const updatedInitialGroupDevices = initialGroupDevices.map(
  //             (group: any, index: any) => {
  //               // Find the corresponding group in devices list
  //               const correspondingGroup = devices.find(
  //                 (deviceGroup: any) => deviceGroup.title === group.title
  //               );

  //               if (correspondingGroup) {
  //                 // Update the checked status of each item in the group
  //                 const updatedItems = group.items.map(
  //                   (device: any, deviceIndex: any) => {
  //                     // const deviceData = device;
  //                     if (expandedDevice != null) {
  //                       if (device.id === expandedDevice.deviceId) {
  //                         console.log("device", device);
  //                         console.log("expandedDevice", expandedDevice);
  //                         dispatch(
  //                           setExpandedDevice({
  //                             position: {
  //                               lat: device.lat,
  //                               lng: device.lng,
  //                             },
  //                             tail: device.tail,
  //                             deviceId: device.id,
  //                           })
  //                         );
  //                       }
  //                     }

  //                     const correspondingDevice = correspondingGroup.items.find(
  //                       (device: any) =>
  //                         device.id ===
  //                         initialGroupDevices[index].items[deviceIndex].id
  //                     );
  //                     if (correspondingDevice) {
  //                       // Return a new object with updated checked key
  //                       return {
  //                         ...device,
  //                         checked: correspondingDevice.checked,
  //                       };
  //                     }

  //                     return device;
  //                   }
  //                 );

  //                 // Check if any item in the group is checked and update the group's checked key
  //                 const anyChecked = updatedItems.every(
  //                   (item: any) => item.checked
  //                 );
  //                 const updatedGroup = {
  //                   ...group,
  //                   items: updatedItems,
  //                   checked: anyChecked,
  //                 };

  //                 return updatedGroup;

  //                 // // Return the updated group object
  //                 // return { ...group, items: updatedItems };
  //               }
  //               return group;
  //             }
  //           );
  //           // console.log(
  //           //   "updatedInitialGroupDevices",
  //           //   updatedInitialGroupDevices
  //           // );

  //           // Update state with initialGroupDevices
  //           setgroupdevices(updatedInitialGroupDevices);
  //           // console.log("groups", groups);
  //           // console.log("groupDevices", groupdevices);
  //           dispatch(setDevices(updatedInitialGroupDevices));
  //           // setLoading(false);

  //           // ---------------------- For device status-----------------------------------

  //           for (let i = 0; i < data.data.allDevices.length; i++) {
  //             const element = data.data.allDevices[i].online;
  //             if (!statuses.includes(element)) {
  //               statuses.push(element);
  //               // setMyArray((prevArray) => [...prevArray, element]);
  //             }
  //           }
  //           statuses.forEach((online: any) => {
  //             statusDevicesObj[online] = data.data.allDevices
  //               .filter((obj: any) => obj.online === online)
  //               .map((item: any) => ({ ...item, checked: false }));
  //           });

  //           // Convert groupDevicesObj to initialGroupDevices array format
  //           Object.keys(statusDevicesObj).forEach((online: any) => {
  //             initialGroupDevicesStatuses.push({
  //               online,
  //               items: statusDevicesObj[online],
  //             });
  //           });

  //           const expiredDevices = [];
  //           const notConnectedDevices = [];
  //           const currentDate = new Date(); // Get the current date and time

  //           for (let i = 0; i < data.data.allDevices.length; i++) {
  //             const element = data.data.allDevices[i];
  //             if (
  //               element.expiration_date != null &&
  //               element.expiration_date !== ""
  //             ) {
  //               const expirationDate = new Date(element.expiration_date); // Convert expiration date string to Date object
  //               if (expirationDate < currentDate) {
  //                 // Compare expiration date with current date
  //                 expiredDevices.push({ ...element, checked: false });
  //               }
  //             }
  //             if (i === data.data.allDevices.length - 1) {
  //               // console.log("expiredDevices", expiredDevices);
  //               initialGroupDevicesStatuses.push({
  //                 online: "Expired",
  //                 items: expiredDevices,
  //               });
  //             }
  //           }

  //           for (let i = 0; i < data.data.allDevices.length; i++) {
  //             const element = data.data.allDevices[i];
  //             if (
  //               element.time == null ||
  //               element.time === "" ||
  //               element.time == undefined
  //             ) {
  //               notConnectedDevices.push({ ...element, checked: false });
  //             }
  //             if (i === data.data.length - 1) {
  //               // console.log("notConnectedDevices", notConnectedDevices);
  //               initialGroupDevicesStatuses.push({
  //                 online: "Not Connected",
  //                 items: notConnectedDevices,
  //               });
  //             }
  //           }

  //           // Update state with initialGroupDevicesStatuses
  //           setgroupdevicesStatuses(initialGroupDevicesStatuses);
  //           // console.log("statuses", statuses);
  //           // console.log("groupDevicesStatuses", initialGroupDevicesStatuses);
  //           dispatch(setDevicesStatuses(initialGroupDevicesStatuses));
  //         }
  //       }
  //     });
  //   };

  //   // console.log("Setting up interval...");
  //   intervalId = setInterval(() => {
  //     // console.log("Devices Called");
  //     // console.log("DevicesCalled in Devices");
  //     fetchDataAndDispatch(); // Call function to fetch data and dispatch actions
  //   }, 60000);

  //   // Cleanup function to clear interval when component unmounts or when loading becomes true
  //   return () => {
  //     // console.log("Clearing interval...");
  //     clearInterval(intervalId);
  //   };
  // }, [devices, expandedDevice]); 
=======
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
>>>>>>> 6626c42b639697204421ba9e937f2633e5563f57

  // ------------------------------------------------

  // ------------------------------------------------
  const navigate = useNavigate();
<<<<<<< HEAD
  // const getData = () => {
  //   setLoading(true);
  //   getAll({ url: GET_DEVICES }).then((data: any) => {
  //     if (data !== undefined) {
  //       if (!data.success && data.message === ERROR_MESSAGE) {
  //         dispatch(setIsConnected(true));
  //       }
  //       if (!data.success) {
  //         setLoading(false);
  //         Swal.fire({
  //           text: `${data.message}`,
  //           icon: "error",
  //           timer: 2000,
  //           showConfirmButton: false,
  //         });
  //       }
=======
  const getData = () => {
    setLoading(true);
    getAll({ url: "monitoring/geofence/get-all-geofences" }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data == undefined) {
          Swal.fire({
            text: "Failed to fetch due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
>>>>>>> 6626c42b639697204421ba9e937f2633e5563f57

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
    getAll({ url: "monitoring/geofence-group/get-all-groups" }).then(
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
