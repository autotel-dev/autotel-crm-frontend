import { useDispatch, useSelector } from "react-redux";
// import GoogleMap from "./components/GoogleMap/GoogleMap";
import { useEffect } from "react";
import MapContainer from "./components/GoogleMap/MapContainer";
import { setIsConnected } from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import PlaybackDetails from "./components/PlaybackDetails/PlaybackDetails";
import Header from "./components/Header/Header";

const Playback = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (devices?.length === 0) {
      // getData();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "91vh",
        top: "2vh",
        marginLeft: "-35px",
        position: "absolute",
        overflow: "hidden", // prevent scrollbars
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <MapContainer />
        {/* Overlay PlaybackDetails at the bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            // zIndex: 10, // ensure it's above the map
          }}
        >
          <PlaybackDetails />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            // zIndex: 10, // ensure it's above the map
          }}
        >
          <Header />
        </div>
      </div>
    </div>
  );
};

export default Playback;
