import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  ModalBody,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { H4 } from "../../../../../../AbstractElements";

interface AlertsModalProps {
  isVisible: any;
  setIsVisible: any;
}

const AlertsModal: React.FC<AlertsModalProps> = ({
  isVisible,
  setIsVisible = () => {},
}: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  // Optional: Handle active tab state
  const [activeTab, setActiveTab] = useState("Devices");

  const navItems = [
    "Devices",
    "Type",
    "Geofencing",
    "Schedule",
    "Notifications",
    "Command",
  ];

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Alerts</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            {/* Navbar */}
            <Nav
              tabs
              className="mb-3"
              style={{ borderBottom: "1px solid gray" }}
            >
              {navItems.map((item) => (
                <NavItem key={item} style={{ borderBottom: "1px solid gray" }}>
                  <NavLink
                    className={activeTab === item ? "active" : ""}
                    onClick={() => setActiveTab(item)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: activeTab == item ? "white" : "black",
                      backgroundColor: activeTab == item ? "#35bfbf" : "white",
                    }}
                  >
                    {item}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>

            {/* Placeholder content for selected tab */}
            <div>
              <p className="text-muted">
                You selected: <strong>{activeTab}</strong>
              </p>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default AlertsModal;

// I have a github repo which has 3 branches main , client, server
// main has 2 folders client and server and  all updated code of client and server both

// while client branch has only client folder
// and
// server branch has only server folder

// and I timely merge the code of client and server branch to main branch whene any one of these branches updated

// Now I have to deploy this mern stack project to Render using main branch

// Now my folder structure of main branch be like

// client
// server

// client -> node_modules, src,.env, .gitignore, package-lock.json, package.json, tsconfig.json
