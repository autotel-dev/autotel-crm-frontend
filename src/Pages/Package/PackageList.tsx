import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../Common/CommonHeader";
import { citiesListHeading, provinceListHeading } from "../../utils/Constant";
import { useEffect, useState } from "react";
import { getAll } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../Alerts/DeleteAlert";
import UpdatePackage from "./UpdatePackage";
import {
  setFilterPackages,
  setId,
  setPackages,
  setPackagesEnd,
  setPackagesStart,
  setAllPackagesDuration,
  setPackageDays,
  setPackageDuration,
  setPackage,
  setInActiveActivePackages,
  setIsConnected,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import { setNoDataFound } from "../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import H7 from "../../CommonElements/Headings/H7Element";

const PackageList = () => {
  const { packages, loading, error, id, activeInActivePackages } = useSelector(
    (state: any) => state.packages
  );
  const { noDataFound } = useSelector((state: any) => state.noDataFound);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [packageTitle, setPackageTitle] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  // const [packageDuration, setPackageDuration] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPackagesStart());
    getAll({ url: "package/get-all-packages" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "No packages Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActivePackages("All"));
        dispatch(setPackages([]));
        dispatch(setFilterPackages([]));
        dispatch(setPackagesEnd());
        return;
      }

      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
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
          dispatch(setPackages(data.data));
          dispatch(setFilterPackages(data.data));
        } else {
          dispatch(setPackages([]));
        }
      }
      dispatch(setPackagesEnd());
    });
  }, []);
  useEffect(() => {
    getAll({ url: "package/get-package-duration-types" }).then((data: any) => {
      // console.log("api call package duartion --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setAllPackagesDuration(data.data));
        }
      }
    });
  }, []);
  const renderTableRows = () => {
    return packages?.map((row: any) => (
      <tr key={row._id}>
        <td style={{ width: "10%" }}>{row._id}</td>
        <td style={{ width: "15%" }}>{row.title}</td>
        <td style={{ width: "15%" }}>{row.price}</td>
        <td style={{ width: "10%" }}>{row.days}</td>
        <td style={{ width: "10%" }}>{row.duration}</td>
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
                  checked={row.isActive}
                  // onChange={async (e: any) => {
                  //   //  --------------------------

                  //   const operator = {
                  //     fullName: row.fullName,
                  //     emailAddress: row.emailAddress,
                  //     phoneNo: row.phoneNo,
                  //     isActive: !row.isActive,
                  //     company: decodedToken.userId,
                  //   };
                  //   // console.log(operator);
                  //   setIsActive(!row.isActive);
                  //   // setRowIndex(index);
                  //   // console.log(e.target.value);
                  //   try {
                  //     await update(operator, {
                  //       url: `operator/update-operator/${row._id}`,
                  //     }).then((data: any) => {
                  //       if (data.success) {
                  //         // console.log(data);

                  //         dispatch(setOperatorsStart());
                  //         getAll({
                  //           url: "operator/get-all-operators",
                  //         }).then((data: any) => {
                  //           // console.log("api call --- >", data);
                  //           dispatch(setOperatorsEnd());
                  //           if (data !== undefined) {
                  //             if (data.success) {
                  //               // console.log("hhg");
                  //               dispatch(setOperators(data.data));
                  //               dispatch(setFilterOperators(data.data));
                  //             }
                  //           }
                  //         });
                  //       }
                  //     });
                  //     // Handle successful post creation (e.g., show a success message, redirect, etc.)
                  //   } catch (error) {
                  //     // Handle error (e.g., show an error message)
                  //     // console.error("Error creating post:", error);
                  //   }
                  // }}
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
                // console.log("345678");
                var alertData = {
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this ",
                };
                const type = "packageType";
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
                setIsUpdateModalOpen(true);
                // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                dispatch(setId(row._id));
                setPackageTitle(row.title);
                dispatch(setPackage(row));
                setPackagePrice(row.price);
                dispatch(setPackageDuration(row.duration));
                dispatch(setPackageDays(row.days));
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
              <CommonHeader title="All Packages" />
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
                    <Loader />
                  ) : packages?.length > 0 && loading === false ? (
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "10%" }}>ID</th>
                            <th style={{ width: "15%" }}>Title</th>
                            <th style={{ width: "15%" }}>Price</th>
                            <th style={{ width: "10%" }}>Days</th>
                            <th style={{ width: "10%" }}>Duration</th>
                            <th style={{ width: "10%" }}>Status</th>
                            <th style={{ width: "10%" }}>Actions</th>
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
                      // {activeInActivePackages !== "All"
                      //   ? activeInActivePackages
                      //   : "No Packages Found"}
                    // </div>
                    <H7>
                        {activeInActivePackages !== "All"
                        ? activeInActivePackages
                        : "No Packages Found"}
                    </H7>
                  )}
                </div>
                <UpdatePackage
                  isVisible={isUpdateModalOpen}
                  setIsVisible={setIsUpdateModalOpen}
                  id={id}
                  title={packageTitle}
                  price={packagePrice}
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

export default PackageList;
