import React from "react";
import "./VehicleInfo.css";
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

const itemVariants = {
  hidden: { x: -70, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
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

const VehicleInfo = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "25px",
      }}
    >
      {/* Image with unfold animation */}
      <motion.div
        className="image"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop"
          alt="Vehicle"
          className="image-content"
        />
      </motion.div>

      {/* Vehicle details */}
      <motion.div
        className="vehicle-detail"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            label: "Reg No",
            value: selectedSingleDevice?.vehicle?.registrationNo,
          },
          { label: "Eng No", value: selectedSingleDevice?.vehicle?.engineNo },
          {
            label: "Chasis No",
            value: selectedSingleDevice?.vehicle?.chasisNo,
          },
          { label: "Make", value: selectedSingleDevice?.vehicle?.make?.name },
          { label: "Model", value: selectedSingleDevice?.vehicle?.model?.name },
          { label: "Year", value: selectedSingleDevice?.vehicle?.year },
          { label: "Color", value: selectedSingleDevice?.vehicle?.color },
          {
            label: "Insurance",
            value: selectedSingleDevice?.vehicle?.insurance?.name,
          },
          { label: "Bank", value: selectedSingleDevice?.vehicle?.bank?.name },
          { label: "Group", value: selectedSingleDevice?.vehicle?.group?.name },
          {
            label: "Fuel Type",
            value: selectedSingleDevice?.vehicle?.fuelType,
          },
          {
            label: "Transmission",
            value: selectedSingleDevice?.vehicle?.transmissionType,
          },
          {
            label: "Service Charges",
            value: selectedSingleDevice?.vehicle?.servicePackageCharges,
          },
          {
            label: "Renewal Date",
            value: selectedSingleDevice?.vehicle?.serviceRenewalDate,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="detail-item"
            variants={itemVariants}
          >
            <label>{item.label} :</label>
            <p>{item.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VehicleInfo;
