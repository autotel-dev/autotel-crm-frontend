import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GoogleMapTrip from "./GoogleMapTrip/GoogleMapTrip";
import Swal from "sweetalert2";
import { getAll } from "../../../../../../../Utilities/api";
import {
  GET_ALL_TRIP_WAYPOINTS,
} from "../../../../../../../Utilities/api/apiEndpoints";
import {
  setType,
  setCircle,
  setPolygon,
  setRectangle,
} from "../../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import GeofencesSidebarTrip from "./SidebarTrip/GeofencesSidebarTrip";

const GeofenceTab = () => {
  const dispatch = useDispatch();
  const [geofences, setGeofences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditGeofence, setIsEditGeofence] = useState(false);

  useEffect(() => {
    fetchGeofences();
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // const fetchGeofences = () => {
  //   setLoading(true);
  //   getAll({ url: GET_ALL_GEOFENCES })
  //     .then((data: any) => {
  //       if (data === undefined) {
  //         Swal.fire({
  //           text: "Failed to fetch due to connection refused",
  //           icon: "error",
  //           timer: 2000,
  //           showConfirmButton: false,
  //         });
  //         setGeofences([]);
  //         setLoading(false);
  //         return;
  //       }

  //       if (data.success) {
  //         // Filter only ungrouped geofences and map with checked/edited flags
  //         const ungroupedGeofences = data.data
  //           .filter((item: any) => item.geofenceGroup === null)
  //           .map((item: any) => ({
  //             ...item,
  //             checked: false,
  //             edited: false,
  //           }));
  //         setGeofences(ungroupedGeofences);
  //       } else {
  //         setGeofences([]);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching geofences:", error);
  //       setGeofences([]);
  //       setLoading(false);
  //     });
  // };

  const fetchGeofences = () => {
    setLoading(true);
    getAll({ url: GET_ALL_TRIP_WAYPOINTS })
      .then((data: any) => {
        if (data === undefined) {
          Swal.fire({
            text: "Failed to fetch due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setGeofences([]);
          setLoading(false);
          return;
        }

        if (data.success) {
          // Map all trip waypoints with checked/edited flags
          const waypoints = data.data.map((item: any) => ({
            ...item,
            checked: false,
            edited: false,
          }));
          setGeofences(waypoints);
        } else {
          setGeofences([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching waypoints:", error);
        setGeofences([]);
        setLoading(false);
      });
  };

  return (
    <>
      <div
        style={{
          // marginLeft: "-35px",
          // marginTop: "80px",
          height: "84.5vh",
          display: "flex",
          overflow: "hidden",
          scrollbarWidth: "none",
          marginRight: 0,
        }}
      >
        <GoogleMapTrip
          isEditGeofence={isEditGeofence}
          setIsEditGeofence={setIsEditGeofence}
          geofences={geofences}
        />

        <div
          style={{
            position: "absolute",
          }}
        >
          <GeofencesSidebarTrip
            isEditGeofence={isEditGeofence}
            setIsEditGeofence={setIsEditGeofence}
            geofences={geofences}
            setGeofences={setGeofences}
            fetchGeofences={fetchGeofences}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default GeofenceTab;
