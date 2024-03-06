import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../AbstractElements";
import { create, getAll } from "../../../Api";
import {
  setFilterOperators,
  setInActiveActiveUsers,
  setOperators,
  setOperatorsEnd,
  setOperatorsStart,
} from "../../../ReaduxToolkit/Reducer/OperatorSlice";
import { jwtDecode } from "jwt-decode";
import { Select } from "antd";
import Swal from "sweetalert2";
import { ReportsType } from "./ReportsType/ReportsTypes";
import { setReports } from "../../../ReaduxToolkit/Reducer/ReportsSlice";

const CreateNewReport = () => {
  const { reports } = useSelector((state: any) => state.reports);
  var tempReports: any = [...reports];
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);

  useEffect(() => {
    tempReports = [...reports];
  }, [reports]);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportsType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        title: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      });
      setRole("");
    }
  };

  //   const addReport: SubmitHandler<ReportsType> = async (data: any) => {
  //     setLoading(true);
  //     if (
  //       data.title !== "" &&
  //       startDate !== null &&
  //       endDate !== null &&
  //       type !== ""
  //     ) {
  //       const report = {
  //         id: 1,
  //         title: data.title,
  //         startDate: startDate,
  //         endDate: endDate,
  //       };
  //       console.log(report);
  //       tempReports.push(report);
  //       console.log("Reports", reports);

  //       dispatch(setReports(tempReports));
  //       setLoading(false);
  //       addToggle();
  //     } else {
  //       Swal.fire({
  //         text: "Required Fields are empty",
  //         icon: "info",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       setLoading(false);
  //     }
  //   };

  const addReport: SubmitHandler<ReportsType> = async (data: any) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        id: 1,
        title: data.title,
        startDate: startDate,
        endDate: endDate,
      };
      console.log(report);

      try {
        await create(
          {
            fromDate: startDate,
            toDate: endDate,
          },
          {
            url: "reports/get-all-alert-events-report",
          }
        ).then((data: any) => {
          setLoading(false);
          if (data.success) {
            console.log(data);
            tempReports.push({
              title: report.title,
              startDate: startDate,
              endDate: endDate,
              data: data.data,
            });
            console.log("Reports", reports);
            dispatch(setReports(tempReports));
            setLoading(false);
            addToggle();
            setType("Select Type");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
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

  const [reportsTypeList, setReportsType] = useState([]);
  const [role, setRole] = useState("");

  const typeList: any = [{ _id: 1, name: "Alert Events" }];
  const [type, setType] = useState("");
  const tempReportsTypeList: any = [];
  useEffect(() => {
    typeList.map((item: any, index: any) => {
      tempReportsTypeList.push({
        value: `${item.name}`,
        label: `${item.name}`,
      });
    });
    setReportsType(tempReportsTypeList);
  }, []);

  const [reportPeriodList, setReportPeriodType] = useState([]);

  const periodList: any = [
    { _id: 1, name: "Yesterday" },
    { _id: 2, name: "previous Week" },
    { _id: 3, name: "2 weeks" },
    { _id: 5, name: "Previous Month" },
    { _id: 6, name: "Previous 2 Months" },
    { _id: 7, name: "This Month" },
    { _id: 8, name: "This Week" },
  ];
  const tempReportPeriodList: any = [];
  useEffect(() => {
    periodList.map((item: any, index: any) => {
      tempReportPeriodList.push({
        value: `${item.name}`,
        label: `${item.name}`,
      });
    });
    setReportPeriodType(tempReportPeriodList);
  }, []);

  const [reportType, setReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleReportTypeChange = (selectedOption: any) => {
    console.log("SelectedOption", selectedOption);
    setReportType(selectedOption);
    handleDateSelection(selectedOption);
    console.log("Start Date", startDate);
    console.log("End Date", endDate);
  };

  const handleDateSelection = (selectedType: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (selectedType) {
      case "Yesterday":
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        end = new Date(today);
        end.setDate(today.getDate() - 1);
        break;
      case "previous Week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() - 6 - 7); // Previous Monday
        end = new Date(today);
        end.setDate(today.getDate() - today.getDay() - 7); // Previous Sunday
        break;
      case "This Week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // This Monday
        end = new Date(today);
        break; // Today is the end of the week
      case "2 weeks":
        start = new Date(today);
        start.setDate(today.getDate() - 13); // 14 days ago
        end = new Date(today);
        break; // Today
      case "Previous Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Previous 2 Months":
        start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "This Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        start = new Date();
        end = new Date();
    }

    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
  };

  useEffect(() => {
    handleDateSelection("Yesterday"); // Default selection
  }, []);

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={addToggle}
        >
          <PlusCircle />
          Create New Report
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H3 className="modal-title">Create Report</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(addReport)}
            >
              <Row>
                <FormGroup className="col-md-6 create-group">
                  <Label>Title</Label>
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
                    <Label>Report Type</Label>
                  </div>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      console.log(e);
                      setType(e);
                    }}
                    options={reportsTypeList}
                  />
                </FormGroup>

                <FormGroup
                  className="col-md-6 create-group"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Period:</div>
                  <Col md={8}>
                    <Select
                      showSearch
                      style={{ width: "100%", height: 36 }}
                      placeholder="Select Period"
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      //   onChange={(e: any) => {
                      //     //   console.log(e);
                      //     //   setRole(e);
                      //   }}
                      //   options={reportPeriodList}

                      options={reportPeriodList}
                      onChange={handleReportTypeChange}
                    />
                  </Col>
                </FormGroup>
                <div></div>
                <FormGroup
                  className="col-md-6 create-group"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Date From:</div>
                  <Col md={8}>
                    <input
                      className="form-control"
                      type="date"
                      value={startDate}
                    />
                  </Col>
                </FormGroup>
                <div></div>
                <FormGroup
                  className="col-md-6 create-group"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Date To:</div>
                  <Col md={8}>
                    <input
                      className="form-control"
                      type="date"
                      value={endDate}
                    />
                  </Col>
                </FormGroup>
              </Row>
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
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewReport;
