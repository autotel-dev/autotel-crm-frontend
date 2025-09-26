import "./DeviceInfo.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// ✨ Image unfold animation (like paper opening)
const imageVariants = {
  hidden: { scaleX: 0, opacity: 0 }, // folded (flat)
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const DeviceInfo = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  const items = [
    { label: "IMEI", value: selectedSingleDevice?.vehicle?.imei },
    { label: "Status", value: selectedSingleDevice?.status },
    {
      label: "Latitude",
      value: Number(selectedSingleDevice?.latestPosition?.latitude).toFixed(6),
    },
    {
      label: "Longitude",
      value: Number(selectedSingleDevice?.latestPosition?.longitude).toFixed(6),
    },
    {
      label: "Altitude",
      value: selectedSingleDevice?.latestPosition?.altitude,
    },
    {
      label: "Speed",
      value: `${Number(selectedSingleDevice?.latestPosition?.speed).toFixed(
        2
      )} km/h`,
    },
    {
      label: "Protocol",
      value: selectedSingleDevice?.latestPosition?.protocol,
    },
    { label: "Course", value: selectedSingleDevice?.latestPosition?.course },
    {
      label: "Device Time",
      value: selectedSingleDevice?.latestPosition?.deviceTime,
    },
    {
      label: "Server Time",
      value: selectedSingleDevice?.latestPosition?.serverTime,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "25px",
      }}
    >
      <motion.div
        className="device-image"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src="https://img.pikbest.com/png-images/20241201/gps-tracker-device-3d-illustration-isolated-on-transparent-background-_11154739.png%21w700wp"
          alt="Device"
          className="device-image-content"
        />
      </motion.div>

      <motion.div
        className="device-detail"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => {
          // alternate direction: even -> top, odd -> bottom
          const itemVariants = {
            hidden: { y: index % 2 === 0 ? -40 : 40, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.5 },
            },
          };

          return (
            <motion.div
              key={index}
              className="device-detail-item"
              variants={itemVariants}
            >
              <label>{item.label} :</label>
              <p>{item.value}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DeviceInfo;
