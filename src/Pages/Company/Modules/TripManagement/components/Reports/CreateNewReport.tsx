import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3, P } from "../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../Utilities/api";

import { jwtDecode } from "jwt-decode";
import { Select } from "antd";
import Swal from "sweetalert2";
import { ReportsType } from "./ReportsType/ReportsTypes";

import {
  setTripsForReport,
  setReports,
  setVehiclesForTripReport,
} from "../../../../../../ReaduxToolkit/Reducer/TripReportsSlice";

import {
  GET_ALL_TRIPS_DROPDOWN,
  GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT,
  GET_REPORT_BASE_URL,
} from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

const CreateNewReport = ({ dropDownDevices }: any) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
  );
  const { reports, reportsType } = useSelector(
    (state: any) => state.tripReports,
  );
  var tempReports: any = [...reports];
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);

  useEffect(() => {
    tempReports = [...reports];
  }, [reports]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReportsType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        title: "",
      });
      setTrip("");
      setLoading(false);
    }
  };

  const [reportsTypeList, setReportsType] = useState([]);

  const [type, setType] = useState("");
  const tempReportsTypeList: any = [];

  useEffect(() => {
    tempReportsTypeList.push({
      value: `/get-trip-detail-report`,
      label: `Trip Detail`,
    });
    setReportsType(tempReportsTypeList);
  }, [reportsType]);

  const [tripsForReportsList, setTripsForReportsList]: any =
    useState([]);

  const [vehiclesForTripReportList, setVehiclesForTripReportList]: any =
    useState([]);


  const [trip, setTrip]: any = useState("");
  const [vehicleId, setVehicleId] = useState("");

  useEffect(() => {
    if (type == "/get-trip-detail-report") {
      getAll({ url: GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT }).then((data: any) => {
        if (data?.success) {
          console.log("data", data);
          dispatch(setVehiclesForTripReport(data.data));
          setVehiclesForTripReportList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.registrationNo}`,
              };
            }),
          );
        } else {
          setVehiclesForTripReportList([]);
        }
      });
    }
  }, [type]);

  useEffect(() => {
    if (vehicleId) {
      getAll({
        url: `${GET_ALL_TRIPS_DROPDOWN}?vehicleId=${vehicleId}`,
      }).then((data: any) => {
        if (data?.success) {
          console.log("data", data);
          dispatch(setTripsForReport(data.data));
          setTripsForReportsList(
            data.data.map((item: any) => {
              return {
                value: `${item._id}`,
                label: `${item.title}`,
              };
            }),
          );
        } else {
          setTripsForReportsList([]);
        }
      });
    }
  }, [vehicleId]);

  const addReportForTripDetail: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      trip !== "" &&
      type !== ""
    ) {
      const report = {
        tripId: trip,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((dataa: any) => {
          if (!dataa.success && dataa.message === ERROR_MESSAGE) {
            setLoading(false);
            addToggle();
            setType("Select Type");
            setTrip("");
          }
          if (!dataa.success) {
            Swal.fire({
              text: `${dataa.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            addToggle();
            setType("Select Type");
          }
          if (dataa.success) {
            tempReports.push({
              type: type,
              data: {
                // title: data.data.tripInfo.title,
                title: data.title,
                startDate: dataa.data.tripInfo.start,
                endDate: dataa.data.tripInfo.end,
                data: dataa.data,
              },
            });

            dispatch(setReports(tempReports));
            setLoading(false);
            addToggle();
            setType("Select Type");
            setTrip("");
          }
        });
      } catch (error: any) {
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setTrip("");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };


  const getReport = (data: any) => {
    if (type == "/get-trip-detail-report") {
      addReportForTripDetail(data);
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
            ? "btn-primary"
            : ""
            }`}
          style={{
            color: "white",
            backgroundColor: `${userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
              }`,
          }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New Report
        </button>
        <Modal
          isOpen={addModal}
          toggle={addToggle}
          size="lg"
          centered
          style={
            {
              // he
            }
          }
        >
          <div className="modal-header">
            <H3 className="modal-title">Create Report</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>

          <ModalBody
            style={{
              // minHeight: "60vh",
              // maxHeight: "655vh",
            }}
          >
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(getReport)}
            >
              <Row>
                <FormGroup className="col-md-6 create-group">
                  <P>Title</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.title && "Report title is required"}
                  </span>
                </FormGroup>
                <FormGroup className="col-md-6 create-group">
                  <div>
                    <P>Report Type</P>
                  </div>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={(e: any, options) => {
                      setValue("title", options.label);
                      // console.log(e);
                      setType(e);
                    }}
                    options={reportsTypeList}
                  />
                </FormGroup>


                {type == "/get-trip-detail-report" && (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Vehicle:</div>
                    <Col md={9}>
                      <Select
                        // mode="multiple"

                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Vehicle"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setVehicleId(e);
                        }}
                        options={[...vehiclesForTripReportList]}
                      />
                    </Col>
                  </FormGroup>
                )}

                {type == "/get-trip-detail-report" && vehicleId ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Trips:</div>
                    <Col md={9}>
                      <Select
                        // mode="multiple"

                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Trips"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setTrip(e);
                        }}
                        options={[...tripsForReportsList]}
                      />
                    </Col>
                  </FormGroup>
                ) : (
                  <div className="col-md-6 create-group"></div>
                )}
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  // height: "150px",
                  alignItems: "end",
                }}
              >
                <Button color="primary" className="me-1">
                  {loading ? "Loading ..." : `Generate`}
                </Button>
                &nbsp;&nbsp;
                <Button
                  disabled={loading ? true : false}
                  color="secondary"
                  onClick={addToggle}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewReport;
