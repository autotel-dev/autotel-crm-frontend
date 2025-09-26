import "./SensorInfo.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // small delay between items
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

const SensorInfo = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  const items = [
    {
      label: "Ignition",
      value:
        selectedSingleDevice?.latestPosition?.attributes?.ignition === false
          ? "Off"
          : "On",
    },
    { label: "Status", value: selectedSingleDevice?.status },
    {
      label: "Odometer",
      value: Number(
        selectedSingleDevice?.latestPosition?.attributes?.odometer
      ).toFixed(2),
    },
    {
      label: "RSSI",
      value: Number(
        selectedSingleDevice?.latestPosition?.attributes?.rssi
      ).toFixed(6),
    },
    {
      label: "Power",
      value: selectedSingleDevice?.latestPosition?.attributes?.power,
    },
    {
      label: "ADC",
      value: `${Number(
        selectedSingleDevice?.latestPosition?.attributes?.adc1
      ).toFixed(2)}`,
    },
    {
      label: "Distance",
      value: Number(
        selectedSingleDevice?.latestPosition?.attributes?.totalDistance
      ).toFixed(2),
    },
    {
      label: "Hours",
      value: selectedSingleDevice?.latestPosition?.attributes?.hours,
    },
    {
      label: "Motion",
      value:
        selectedSingleDevice?.latestPosition?.attributes?.motion === false
          ? "No"
          : "Yes",
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
        className="sensor-image"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src="https://static.thenounproject.com/png/sensor-icon-126475-512.png"
          alt="Sensor"
          className="sensor-image-content"
        />
      </motion.div>

      <motion.div
        className="sensor-detail"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => {
          // ✨ Center open animation
          const itemVariants = {
            hidden: { scale: 0.5, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          };

          return (
            <motion.div
              key={index}
              className="sensor-detail-item"
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

export default SensorInfo;
