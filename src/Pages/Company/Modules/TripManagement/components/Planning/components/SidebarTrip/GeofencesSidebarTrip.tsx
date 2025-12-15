import { useState } from "react";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setType } from "../../../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import GeofencesListTrip from "./GeofencesListTrip";
import GeofenceSvg from "../../../../../../../../../src/assets/placeholder.png";

interface PropTypes {
  isEditGeofence: boolean;
  setIsEditGeofence: any;
  geofences: any[];
  setGeofences: any;
  fetchGeofences: any;
  loading: boolean;
}

const GeofencesSidebarTrip = ({
  isEditGeofence,
  setIsEditGeofence,
  geofences,
  setGeofences,
  fetchGeofences,
  loading,
}: PropTypes) => {
  const [collapsedWidth, setCollapsedWidth] = useState("350px");
  const dispatch = useDispatch();
  const [isNewGeofence, setIsNewGeofence] = useState(false);

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
          scrollbarWidth: "none",
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
            justifyContent: "center",
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
          title="Geofence"
          style={{
            width: "40px",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            height: "40px",
            backgroundColor: "#1f2f3e",
            paddingTop: "7px",
          }}
          onClick={() => {
            setCollapsedWidth("350px");
            setIsNewGeofence(true);
            setIsEditGeofence(false);
            dispatch(setType(null));
          }}
        >
          <img
            src={GeofenceSvg}
            alt="Geofence"
            style={{
              maxWidth: "25px",
              maxHeight: "25px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: collapsedWidth,
          height: "92.5vh",
          backgroundColor: "#f5f5f5",
          overflowY: "auto",
          scrollbarWidth: "none",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        }}
      >
        {collapsedWidth === "350px" && (
          <GeofencesListTrip
            isNewGeofence={isNewGeofence}
            setIsNewGeofence={setIsNewGeofence}
            isEditGeofence={isEditGeofence}
            setIsEditGeofence={setIsEditGeofence}
            geofences={geofences}
            setGeofences={setGeofences}
            fetchGeofences={fetchGeofences}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default GeofencesSidebarTrip;
