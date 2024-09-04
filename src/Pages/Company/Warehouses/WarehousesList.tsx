import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { citiesListHeading } from "../../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll, patch } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import "../../../CssConstaints/Style.css";
import {
  setWarehouse,
  setWarehouseEnd,
  setWarehouseStart,
  setFilterWarehouses,
  setId,
  setInActiveActiveWarehouses,
  setIsConnected,
  setBranches,
} from "../../../ReaduxToolkit/Reducer/WarehouseSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import UpdateWarehouse from "./UpdateWarehouse";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import H7 from "../../../CommonElements/Headings/H7Element";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import {
  CHANGE_WAREHOUSE_ACTIVATION_STATUS,
  GET_ALL_ACTIVE_BRANCHES,
  GET_ALL_BRANCHES,
  GET_ALL_WAREHOUSES,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const WarehousesList = () => {
  const { warehouse, loading, id, activeInActiveWarehouses } = useSelector(
    (state: any) => state.warehouse
  );
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Usage
  const hexColor = "#ff0000"; // Example hex color
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor); // Convert hex to RGB
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setWarehouseStart());
    getAll({ url: GET_ALL_WAREHOUSES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "No Warehouses Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActiveWarehouses("All"));
        dispatch(setWarehouse([]));
        dispatch(setFilterWarehouses([]));
        dispatch(setWarehouseEnd());
        return;
      }

      if (data !== undefined) {
        // console.log("Data", data);

        dispatch(setNoDataFound(data.message));
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        if (data.success) {
          // console.log("hhg");

          dispatch(setWarehouse(data.data));
          dispatch(setFilterWarehouses(data.data));
        }
      }
      dispatch(setWarehouseEnd());
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_BRANCHES }).then((data: any) => {

      if (data !== undefined) {
        if (data.success) {
          // // console.log("hhg");
          dispatch(setBranches(data.data));
        }
      }
    });
  }, []);


  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");
  const renderTableRows = () => {
    return warehouse?.map((row: any) => (
      // <tr key={row.id}>
      <tr
        key={row._id}
        onMouseEnter={() => {
          setIsHovered(true);
          setIdd(row._id);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && idd == row._id
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <div
              className={`text-end flex-shrink-0 icon-state 
                            }`}
            >
              <Label className="switch mb-0">
                <Input
                  type="checkbox"
                  defaultChecked={row.isActive}
                  value={row.isActive}
                  onChange={async (e: any) => {
                    //  --------------------------
                    const changeStatus = {
                      isActive: !row.isActive,
                    };

                    try {
                      await patch(changeStatus, {
                        url: `${CHANGE_WAREHOUSE_ACTIVATION_STATUS}/${row._id}`,
                      }).then((data: any) => {
                        if (data.success) {
                          // // console.log(data);
                          dispatch(setWarehouseStart());
                          getAll({ url: GET_ALL_WAREHOUSES }).then(
                            (data: any) => {
                              // // console.log("api call --- >", data);
                              dispatch(setWarehouseEnd());
                              if (data !== undefined) {
                                if (data.success) {
                                  // // console.log("hhg");
                                  dispatch(setWarehouse(data.data));
                                  dispatch(setFilterWarehouses(data.data));
                                }
                              }
                            }
                          );
                        } else {
                          Swal.fire({
                            text: `${data.message}`,
                            icon: "error",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                        }
                      });
                      // Handle successful post creation (e.g., show a success message, redirect, etc.)
                    } catch (error: any) {
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
                  // className={`switch-state ${
                  //   row.isActive ? "bg-primary" : "bg-secondary"
                  // }`}
                  className="switch-state"
                  style={{ backgroundColor: row.isActive ? "green" : "red" }}
                />
              </Label>
            </div>
          </div>
        </td>
        <td>
          <div>
            <button
              className="global-table-delete-btn"
              // style={{
              //   width: 60,
              //   fontSize: 14,
              //   padding: 3,
              //   color: "white",
              //   backgroundColor: "red",
              //   borderRadius: "5px",
              //   marginRight: "5px",
              //   border: "none",
              // }}
              onClick={() => {
                // console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "warehouseType";
                deleteAlert(alertData, row._id, type, dispatch);
              }}
            >
              Delete
            </button>
            <button
              className="global-table-edit-btn"
              // style={{
              //   width: 60,
              //   fontSize: 14,
              //   padding: 3,
              //   color: "white",
              //   backgroundColor: "green",
              //   borderRadius: "5px",
              //   border: "none",
              // }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setWarehouseName(row.name);
                setIsActive(row.isActive);
              }}
            >
              Edit
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
            <CommonHeader title="All Warehouses" />
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  // <Loader />
                  <>
                    <Skeleton height="100px" width="100%" borderRadius="10px" />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                    <Skeleton
                      height="40px"
                      width="100%"
                      marginTop="10px"
                      marginBottom="10"
                      borderRadius="10px"
                    />
                  </>
                ) : warehouse?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <H7>
                    {activeInActiveWarehouses !== "All"
                      ? activeInActiveWarehouses
                      : "No Warehouse Found"}
                  </H7>
                )}

                {/* )} */}
              </div>
              <UpdateWarehouse
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                value={warehouseName}
                isActive={isActive}
                setIsActive={setIsActive}

              // setValue={setCityName}
              />
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default WarehousesList;
