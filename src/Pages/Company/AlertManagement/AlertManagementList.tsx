import { Card, CardBody, Col, Container, Input, Label } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { useEffect, useState } from "react";
import { getAll, patch } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import "../../../CssConstaints/Style.css";
import Swal from "sweetalert2";
import H7 from "../../../CommonElements/Headings/H7Element";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { GET_ALERT_RULES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
import {
  setAlertRuleEnd,
  setAlertRules,
  setAlertRuleStart,
  setFilterAlertRules,
  setInActiveActiveAlertRules,
} from "../../../ReaduxToolkit/Reducer/AlertRuleSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { formatUnderscoredString } from "../../../Utilities/globals/globals";
import AlertsModal from "./components/AlertsModal";

const AlertManagementList = () => {
  const { alertRules, loading, id, activeInActiveAlertRules } = useSelector(
    (state: any) => state.alertRules
  );
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState("");
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedRuleForUpdate, setSelectedRuleForUpdate] = useState<any>(null);

  // Convert HEX → RGB for hover color
  const hexToRgb = (hex: any) => {
    hex = hex?.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  useEffect(() => {
    dispatch(setAlertRuleStart());
    getAll({ url: GET_ALERT_RULES }).then((data: any) => {
      if (data === undefined) {
        Swal.fire({
          text: "No Alert Rules Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActiveAlertRules("All"));
        dispatch(setAlertRules([]));
        dispatch(setFilterAlertRules([]));
        dispatch(setAlertRuleEnd());
        return;
      }

      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));

        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          dispatch(setAlertRules(data.data));
          dispatch(setFilterAlertRules(data.data));
        }
      }
      dispatch(setAlertRuleEnd());
    });
  }, [dispatch]);

  const renderTableRows = () => {
    return alertRules?.map((row: any) => (
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
        {/* <td>{row._id}</td> */}
        <td>{row.name}</td>

        <td>{formatUnderscoredString(row.alertType)}</td>
        {/* <td>
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <Label className="switch mb-0">
              <Input
                type="checkbox"
                defaultChecked={row.isActive}
                onChange={async () => {
                  const changeStatus = { isActive: !row.isActive };
                  try {
                    const res = await patch(changeStatus, {
                      url: `${CHANGE_ALERT_RULE_STATUS}/${row._id}`,
                    });
                    if (res.success) {
                      // Refresh data
                      dispatch(setAlertRuleStart());
                      getAll({ url: GET_ALL_ALERT_RULES }).then((data) => {
                        dispatch(setAlertRuleEnd());
                        if (data?.success) {
                          dispatch(setAlertRules(data.data));
                          dispatch(setFilterAlertRules(data.data));
                        }
                      });
                    } else {
                      Swal.fire({
                        text: `${res.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }
                  } catch (error) {
                    Swal.fire({
                      text: `${error.message}`,
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                  }
                }}
              />
              <span
                className="switch-state"
                style={{ backgroundColor: row.isActive ? "green" : "red" }}
              />
            </Label>
          </div>
        </td> */}
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
    <>
      <Container fluid>
        <Col sm="12">
          <Card>
            <CommonHeader title="All Alert Rules" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  <>
                    <Skeleton height="100px" width="100%" borderRadius="10px" />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton
                        key={i}
                        height="40px"
                        width="100%"
                        marginTop="10px"
                        marginBottom="10"
                        borderRadius="10px"
                      />
                    ))}
                  </>
                ) : alertRules?.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        {/* <th>ID</th> */}
                        <th>Name</th>
                        <th>Type</th>
                        {/* <th>Status</th> */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                  </table>
                ) : (
                  <H7>
                    {activeInActiveAlertRules !== "All"
                      ? activeInActiveAlertRules
                      : "No Alert Rules Found"}
                  </H7>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Container>

      {/* Update Modal */}
      <AlertsModal
        isVisible={isUpdateModalVisible}
        setIsVisible={setIsUpdateModalVisible}
        mode="update"
        selectedRule={selectedRuleForUpdate}
      />
    </>
  );
};

export default AlertManagementList;
