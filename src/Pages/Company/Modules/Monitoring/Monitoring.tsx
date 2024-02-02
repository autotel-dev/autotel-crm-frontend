import BasicMapComp from "../../../MISCELLANEOUS/Maps/GoogleMap/BasicMapComp";
import GoogleMap from "./components/GoogleMap/GoogleMap";
import MonitoringSidebar from "./components/Sidebar/MonitoringSidebar";

const Monitoring = () => {
  const apiKey = "AIzaSyDI3fB-ItM1LpMOyMg_P8UxTUuxHCyQS34"; // Replace with your actual API key

  return (
    <div
      style={{
        margin: "-35px",
        marginTop: "130px",
        height: "100vh",
        display: "flex",
      }}
    >
      <GoogleMap />

      <div
        style={{
          position: "absolute",
          
        }}
      >
        <MonitoringSidebar />
      </div>
    </div>
  );
};

export default Monitoring;
