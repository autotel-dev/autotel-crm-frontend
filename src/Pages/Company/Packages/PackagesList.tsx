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

import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { getAll, patch, update } from "../../../Utilities/api";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { H4 } from "../../../AbstractElements";
import H7 from "../../../CommonElements/Headings/H7Element";

import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

import { GET_ALL_SERVICE_PACKAGES } from "../../../Utilities/api/apiEndpoints";
import {
  setIsConnected,
  setServicePackages,
  setServiceFilterPackages,
  setPackagesStart,
  setPackagesEnd,
} from "../../../ReaduxToolkit/Reducer/CompanyServicePackageSlice";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import UpdateNewPackage from "./UpdateNewPackage";
import { formatUnderscoredString } from "../../../Utilities/globals/globals";

const PackagesList = () => {
  const { servicePackages, activeInActivePackages, loading } = useSelector(
    (state: any) => state.companyServicePackages
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
    dispatch(setServicePackages([]));
    dispatch(setServiceFilterPackages([]));
    dispatch(setPackagesStart());
    getAll({ url: GET_ALL_SERVICE_PACKAGES }).then((data: any) => {
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
          dispatch(setServicePackages(data.data));
          dispatch(setServiceFilterPackages(data.data));
        }
      }
      dispatch(setPackagesEnd());
    });
  }, []);

  // const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");
  const renderTableRows = () => {
    return servicePackages?.map((row: any) => (
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
        <td>{row.title}</td>
        <td>{formatUnderscoredString(row.duration)}</td>
        <td>{row.days}</td>

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
              onClick={() => {
                // // console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "servicePackagesType";
                deleteAlert(alertData, row._id, type, dispatch);
              }}
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
              onClick={() => {
                setSelectedPackage(row);
                setIsUpdateModalOpen(true);
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
            <CardHeader className="pb-0">
              <H4>All Packages</H4>
            </CardHeader>
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
                ) : servicePackages?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Duration</th>
                          <th>Days</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <H7>
                    {activeInActivePackages !== "All"
                      ? activeInActivePackages
                      : "No Packages Found"}
                  </H7>
                )}

                <UpdateNewPackage
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  packagee={selectedPackage}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
};

export default PackagesList;
