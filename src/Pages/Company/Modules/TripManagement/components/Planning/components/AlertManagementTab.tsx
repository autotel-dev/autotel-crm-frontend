import { Card, CardBody, Col, Row, Button } from "reactstrap";
import { useEffect, useState } from "react";
import { getAll } from "../../../../../../../Utilities/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { GET_ALERT_RULES } from "../../../../../../../Utilities/api/apiEndpoints";
import { formatUnderscoredString } from "../../../../../../../Utilities/globals/globals";
import { PlusCircle } from "react-feather";
import deleteAlert from "../../../../../../../Utilities/alerts/DeleteAlert";
import { useDispatch } from "react-redux";
import AlertsModal from "../../../../../AlertManagement/components/AlertsModal";

const AlertManagementTab = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const dispatch = useDispatch();
  const [alertRules, setAlertRules] = useState<any[]>([]);
  const [filteredAlertRules, setFilteredAlertRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedRuleForUpdate, setSelectedRuleForUpdate] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");

  function hexToRgb(hex: any) {
    hex = hex?.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  const fetchAlertRules = () => {
    setLoading(true);
    getAll({ url: GET_ALERT_RULES }).then((data: any) => {
      if (data === undefined) {
        Swal.fire({
          text: "No Alert Rules Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setAlertRules([]);
        setFilteredAlertRules([]);
        setLoading(false);
        return;
      }

      if (data !== undefined) {
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setAlertRules([]);
          setFilteredAlertRules([]);
        }
        if (data.success) {
          setAlertRules(data.data);
          setFilteredAlertRules(data.data);
        }
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAlertRules();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const filtered = alertRules.filter(
        (rule) =>
          rule.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          rule.alertType.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAlertRules(filtered);
    } else {
      setFilteredAlertRules(alertRules);
    }
  }, [searchValue, alertRules]);

  const handleModalClose = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    // Refresh data after modal closes
    fetchAlertRules();
  };

  const renderTableRows = () => {
    return filteredAlertRules?.map((row: any) => (
      <tr
        key={row._id}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredId(row._id);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && hoveredId === row._id
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{row.name}</td>
        <td>{formatUnderscoredString(row.alertType)}</td>
        <td>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              className="global-table-edit-btn"
              onClick={() => {
                setSelectedRuleForUpdate(row);
                setIsUpdateModalVisible(true);
              }}
            >
              Edit
            </button>
            <button
              className="global-table-delete-btn"
              onClick={() => {
                const alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this alert rule!",
                };
                const type = "alertRuleType";
                deleteAlert(alertData, row._id, type, dispatch);
                // Refresh after delete
                setTimeout(() => fetchAlertRules(), 1000);
              }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Card>
      <CardBody>
        <Row className="mb-3">
          <Col md="6">
            <input
              className="form-control"
              type="text"
              placeholder="Search alert rules..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
          <Col md="6" className="text-end">
            <Button
              color="primary"
              style={{
                backgroundColor:
                  userPersonalizationData?.buttonsAndBarsColor || "#63d5be",
                border: "none",
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
              onClick={() => setIsCreateModalVisible(true)}
            >
              <PlusCircle size={18} style={{ marginRight: "5px" }} />
              Create Alert Rule
            </Button>
          </Col>
        </Row>

        <div className="table-responsive product-table">
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Loading...</p>
            </div>
          ) : filteredAlertRules?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p style={{ fontSize: "18px", color: "#666" }}>
                No Alert Rules Found
              </p>
            </div>
          )}
        </div>
      </CardBody>

      {/* Create Modal */}
      <AlertsModal
        isVisible={isCreateModalVisible}
        setIsVisible={(value: boolean) => {
          setIsCreateModalVisible(value);
          if (!value) handleModalClose();
        }}
        mode="create"
      />

      {/* Update Modal */}
      <AlertsModal
        isVisible={isUpdateModalVisible}
        setIsVisible={(value: boolean) => {
          setIsUpdateModalVisible(value);
          if (!value) handleModalClose();
        }}
        mode="update"
        selectedRule={selectedRuleForUpdate}
      />
    </Card>
  );
};

export default AlertManagementTab;
