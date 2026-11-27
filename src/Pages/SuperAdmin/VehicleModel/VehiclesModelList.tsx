import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import {
  citiesListHeading,
  provinceListHeading,
  vehicleModelListHeading,
} from "../../../utils/Constant";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import "../../../CssConstaints/Style.css";
import {
  setVehicleMake,
  setId,
  setVehicleModel,
  setVehicleModelEnd,
  setVehicleModelStart,
  setFilterVehiclesModel,
  setVehicleMakeName,
  setInActiveActiveVehiclesModel,
  setIsConnected,
  setVehicleMakeId,
} from "../../../ReaduxToolkit/Reducer/VehicleModelSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import H7 from "../../../CommonElements/Headings/H7Element";
import { photoFormData, preparePhoto } from "../../../Component/VehiclePhoto/vehiclePhotoData";
import { getUserRole } from "../../../Utilities/globals/globals";
import { ROLES } from "../../../constants/roles";
import { deleteSingle, getAll, updateWithMultipart } from "../../../Utilities/api";
import VehiclePhoto from "../../../Component/VehiclePhoto/VehiclePhoto";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import {
  GET_ALL_VEHICLES_MAKE,
  GET_ALL_VEHICLES_MODEL,
  UPLOAD_VEHICLE_MODEL_IMAGE,
  REMOVE_VEHICLE_MODEL_IMAGE,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
import UpdateVehicleModel from "./UpdateVehicleModel";

const VehiclesModelList = () => {
  const {
    vehicleModel,
    loading,
    error,
    id,
    value,
    activeInActiveVehiclesModel,
  } = useSelector((state: any) => state.vehicleModel);
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
  const [vehicleModelName, setVehicleModelName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setVehicleModelStart());
    getAll({ url: GET_ALL_VEHICLES_MODEL }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "No Vehicle Model Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActiveVehiclesModel("All"));
        dispatch(setVehicleModelEnd());
        dispatch(setVehicleModel([]));
        dispatch(setFilterVehiclesModel([]));

        return;
      }

      if (data !== undefined) {
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
          dispatch(setVehicleModel(data.data));
          dispatch(setFilterVehiclesModel(data.data));
        }
      }
      dispatch(setVehicleModelEnd());
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_VEHICLES_MAKE }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setVehicleMake(data.data));
        }
      }
    });
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");

  // Vehicle catalog photo: the weekly sync fills photos from Wikimedia
  // Commons; an uploaded photo replaces it for that model.
  const [photoBusy, setPhotoBusy] = useState<string | null>(null);
  const replaceRow = (updated: any) => {
    if (!updated?._id) return;
    const list = vehicleModel.map((m: any) =>
      m._id === updated._id ? { ...m, ...updated, vehicleMake: m.vehicleMake } : m
    );
    dispatch(setVehicleModel(list));
    dispatch(setFilterVehiclesModel(list));
  };
  const isSuperAdmin = getUserRole() === ROLES.SUPER_ADMIN;
  const uploadPhoto = async (row: any, file?: File | null) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      Swal.fire({ text: "That photo is larger than 15 MB. Choose a smaller one.", icon: "error", timer: 2500, showConfirmButton: false });
      return;
    }
    setPhotoBusy(row._id);
    let form: FormData;
    try {
      // Resized in the browser (max 1280 px + a 160 px map copy)
      form = photoFormData(await preparePhoto(file), "image");
    } catch (e: any) {
      setPhotoBusy(null);
      Swal.fire({ text: e?.message || "That file isn't a photo we can read.", icon: "error", timer: 2500, showConfirmButton: false });
      return;
    }
    const res: any = await updateWithMultipart(form, { url: `${UPLOAD_VEHICLE_MODEL_IMAGE}/${row._id}` });
    setPhotoBusy(null);
    if (res?.success) replaceRow(res.data);
    else Swal.fire({ text: res?.message || "Upload failed.", icon: "error", timer: 2500, showConfirmButton: false });
  };
  const removePhoto = async (row: any) => {
    setPhotoBusy(row._id);
    const res: any = await deleteSingle({ url: `${REMOVE_VEHICLE_MODEL_IMAGE}/${row._id}` });
    setPhotoBusy(null);
    if (res?.success) replaceRow(res.data);
    else Swal.fire({ text: res?.message || "Could not remove the photo.", icon: "error", timer: 2500, showConfirmButton: false });
  };
  const renderTableRows = () => {
    return vehicleModel.map((row: any) => (
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
        <td>
          <VehiclePhoto
            model={row}
            variant="thumb"
            label={[row?.vehicleMake?.name, row?.name].filter(Boolean).join(" ")}
          />
        </td>
        <td>{row?.name}</td>
        <td>{row?.vehicleMake?.name}</td>
        {/* <td>
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
                  checked={row.isActive}
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
        </td> */}
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
                const type = "vehicleModelType";
                deleteAlert(alertData, row._id, type, dispatch);
              }}
            >
              Delete
            </button>
            {/* Model photos are shared by every company: super admin only. Companies add photos to their own vehicles. */}
            {isSuperAdmin && (
              <>
            <label
              className="global-table-edit-btn"
              style={{ cursor: photoBusy === row._id ? "wait" : "pointer", marginBottom: 0 }}
              title="Upload a photo for this model (JPG, PNG or WebP). Every company sees it."
            >
              {photoBusy === row._id ? "Saving…" : row?.customImageUrl ? "Change photo" : "Upload photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                disabled={photoBusy === row._id}
                onChange={(e) => {
                  uploadPhoto(row, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {row?.customImageUrl && (
              <button
                className="global-table-delete-btn"
                disabled={photoBusy === row._id}
                title="Remove your photo and go back to the synced one"
                onClick={() => removePhoto(row)}
              >
                Remove photo
              </button>
            )}
              </>
            )}
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
                dispatch(setVehicleMakeId(row.vehicleMake));
                // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setVehicleModelName(row.name);
                dispatch(setVehicleMakeName(row.vehicleMake.name));
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
        <Row>
          <Col sm="12">
            <Card>
              <CommonHeader title={vehicleModelListHeading} />
              <CardBody>
                <div className="table-responsive product-table">
                  {loading ? (
                    // <div
                    //   style={{
                    //     textAlign: "center",
                    //     fontSize: "25px",
                    //     fontWeight: "bold",
                    //   }}
                    // >
                    //   Loading....
                    // </div>
                    // <Loader />
                    <>
                      <Skeleton
                        height="100px"
                        width="100%"
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
                      <Skeleton
                        height="40px"
                        width="100%"
                        marginTop="10px"
                        marginBottom="10"
                        borderRadius="10px"
                      />
                    </>
                  ) : // <Loader />
                  vehicleModel?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Vehicle Make</th>
                            {/* <th>Status</th> */}
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>{renderTableRows()}</tbody>
                      </table>
                    </div>
                  ) : (
                    // <div
                    //   style={{
                    //     textAlign: "center",
                    //     fontSize: "25px",
                    //     fontWeight: "bold",
                    //   }}
                    // >
                    // {activeInActiveProvinces !== "All"
                    //   ? activeInActiveProvinces
                    //   : "No Provinces Found"}
                    // </div>
                    <H7>
                      {" "}
                      {activeInActiveVehiclesModel !== "All"
                        ? activeInActiveVehiclesModel
                        : "No Vehicle Model Found"}
                    </H7>
                  )}
                </div>
                <UpdateVehicleModel
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  value={vehicleModelName}
                  isActive={isActive}
                  setIsActive={setIsActive}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VehiclesModelList;
