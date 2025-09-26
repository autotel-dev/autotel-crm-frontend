import "./CustomerInfo.css";
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

const CustomerInfo = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  const items = [
    {
      label: "Name",
      value: selectedSingleDevice?.vehicle?.customer?.fullName,
    },
    {
      label: "Email",
      value: selectedSingleDevice?.vehicle?.customer?.emailAddress,
    },
    {
      label: "Phone No",
      value: selectedSingleDevice?.vehicle?.customer?.phoneNo,
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
        className="customer-image"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
          alt="Device"
          className="customer-image-content"
        />
      </motion.div>

      <motion.div
        className="customer-detail"
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
              className="customer-detail-item"
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

export default CustomerInfo;
