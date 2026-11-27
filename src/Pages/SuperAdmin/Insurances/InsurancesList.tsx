import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { citiesListHeading } from "../../../utils/Constant";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import "./tableStyle.css";
import deleteAlert from "../../../Utilities/alerts/DeleteAlert";
import "../../../CssConstaints/Style.css";

import {
  setInsurance,
  setInsuranceEnd,
  setInsuranceStart,
  setFilterInsurances,
  setId,
  setInActiveActiveInsurances,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/InsuranceSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import UpdateCountry from "./UpdateInsurance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import H7 from "../../../CommonElements/Headings/H7Element";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { GET_ALL_INSURANCES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";
import UpdateInsurance from "./UpdateInsurance";

const InsurancesList = () => {
  const { insurance, loading, id, activeInActiveInsurances } = useSelector(
    (state: any) => state.insurance
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
  const [insuranceName, setInsuranceName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setInsuranceStart());
    getAll({ url: GET_ALL_INSURANCES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "No Insurances Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(setInActiveActiveInsurances("All"));
        dispatch(setInsurance([]));
        dispatch(setFilterInsurances([]));
        dispatch(setInsuranceEnd());
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

          dispatch(setInsurance(data.data));
          dispatch(setFilterInsurances(data.data));
        }
      }
      dispatch(setInsuranceEnd());
    });
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");
  const renderTableRows = () => {
    return insurance?.map((row: any) => (
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
        }}>
        <td>{row.name}</td>
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
                  disabled
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
                //       url: `${UPDATE_OPERATOR}/${row._id}`,
                //     }).then((data: any) => {
                //       if (data.success) {
                //         // console.log(data);

                //         dispatch(setOperatorsStart());
                //         getAll({
                //           url: GET_ALL_OPERATORS,
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
                const type = "insuranceType";
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
                setInsuranceName(row.name);
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
            <CommonHeader title="All Insurances" />
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
                ) : insurance?.length > 0 && loading === false ? (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          {/* <th>Status</th> */}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderTableRows()}</tbody>
                    </table>
                  </div>
                ) : (
                  <H7>
                    {activeInActiveInsurances !== "All"
                      ? activeInActiveInsurances
                      : "No Insurances Found"}

                  </H7>
                )}

                {/* )} */}
              </div>
              <UpdateInsurance
                isVisible={isUpdateModalOpen}
                setIsVisible={setIsUpdateModalOpen}
                id={id}
                value={insuranceName}
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

export default InsurancesList;
