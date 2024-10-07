import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";

import { useEffect, useState } from "react";
// import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import "./tableStyle.css";
import CommonHeader from "../../../Common/CommonHeader";
import Loader from "../../Utilities/Loader/Loader";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { getAll, patch, update } from "../../../Utilities/api";
import {
  setFilterRoles,
  setInActiveActiveRoles,
  setIsConnected,
  setRoles,
  setRolesEnd,
  setRolesStart,
} from "../../../ReaduxToolkit/Reducer/RolesSlice";
import { setOperatorsEnd } from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { H4, H5 } from "../../../AbstractElements";
import H7 from "../../../CommonElements/Headings/H7Element";
import { CHANGE_SUB_ROLE_ACTIVATION_STATUS, GET_ALL_SUB_ROLES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
import { setFilterPackages, setPackages, setPackagesEnd, setPackagesStart } from "../../../ReaduxToolkit/Reducer/PackageSlice";

const PackagesList = () => {
  const { packages, activeInActivePackages, loading } = useSelector(
    (state: any) => state.roles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    dispatch(setPackages([]));
    dispatch(setFilterPackages([]));
    dispatch(setPackagesStart());
    getAll({ url: GET_ALL_SUB_ROLES }).then((data: any) => {


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
          // // console.log("hhg");
          dispatch(setPackages(data.data));
          dispatch(setFilterPackages(data.data));
        }
      }
      dispatch(setPackagesEnd());
    });
  }, []);

  // const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");
  const renderTableRows = () => {
    return packages?.map((row: any) => (
      <tr key={row._id}
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
        }}>
        <td>{row._id}</td>
        <td>{row.name}</td>

        <td>
          <div>
            <button
              style={{
                width: 60,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "red",
                borderRadius: "5px",
                marginRight: "5px",
                border: "none",
              }}
            // onClick={() => {
            //   // // console.log("345678");
            //   var alertData = {
            //     title: "Are you sure?",
            //     text: "Once deleted, you will not be able to recover this ",
            //   };
            //   const type = "countryType";
            //   deleteAlert(alertData, row._id, type, dispatch);
            // }}
            >
              Delete
            </button>
            <button
              style={{
                width: 60,
                fontSize: 14,
                padding: 3,
                color: "white",
                backgroundColor: "green",
                borderRadius: "5px",
                border: "none",
              }}
            // onClick={() => {
            //   setIsUpdateModalOpen(true);
            //   // // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
            //   dispatch(setId(row._id));
            //   setCountryName(row.name);
            //   setIsActive(row.isActive);
            // }}
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
            <CardHeader className="pb-0">
              <H4>All Packages</H4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive product-table">
                {loading ? (
                  // <Loader />
                  <>
                    <Skeleton height="100px" width="100%" borderRadius="10px" />
                    <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                    <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                    <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                    <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
                  </>
                ) : packages?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
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
                  // {activeInActiveRoles !== "All"
                  //   ? activeInActiveRoles
                  //   : "No Roles Found"}
                  // </div>
                  <H7>
                    {activeInActivePackages !== "All"
                      ? activeInActivePackages
                      : "No Packages Found"}
                  </H7>
                )}

                {/* )} */}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default PackagesList;
