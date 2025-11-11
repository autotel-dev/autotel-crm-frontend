import { Col } from "reactstrap";
import { Button, Modal, ModalBody } from "reactstrap";
import { H4 } from "../../../../../../AbstractElements";
import { motion } from "framer-motion";

interface CustomerDetailsModalProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  device: any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
};

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isVisible,
  setIsVisible,
  device,
}) => {
  const addToggle = () => {
    setIsVisible(!isVisible);
  };

  const customerData = [
    {
      label: "Full Name",
      value: device?.vehicle?.customer?.fullName || "N/A",
    },
    {
      label: "Email Address",
      value: device?.vehicle?.customer?.emailAddress || "N/A",
    },
    {
      label: "Phone Number",
      value: device?.vehicle?.customer?.phoneNo || "N/A",
    },
    {
      label: "Address",
      value: device?.vehicle?.customer?.address || "N/A",
    },
    {
      label: "CNIC",
      value: device?.vehicle?.customer?.cnic || "N/A",
    },
    {
      label: "City",
      value: device?.vehicle?.customer?.city || "N/A",
    },
  ];

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">
              Customer Details - {device?.vehicle?.registrationNo || "N/A"}
            </H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* Customer Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                  alt="Customer"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "4px solid #6dbfb8",
                    objectFit: "cover",
                  }}
                />
              </motion.div>

              {/* Customer Details */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {customerData.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#F8F8F8",
                      borderRadius: "8px",
                      borderLeft: "4px solid #6dbfb8",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      {item.label}:
                    </span>
                    <span
                      style={{
                        fontWeight: "500",
                        color: "#333",
                        fontSize: "14px",
                      }}
                    >
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Close Button */}
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  color="secondary"
                  onClick={addToggle}
                  style={{
                    backgroundColor: "#6dbfb8",
                    border: "none",
                    padding: "10px 30px",
                    fontWeight: "600",
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CustomerDetailsModal;
