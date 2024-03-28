import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { H3, P } from "../../../AbstractElements";
import { create, getAll } from "../../../Api";

import { jwtDecode } from "jwt-decode";
import { Select } from "antd";
import Swal from "sweetalert2";
import { ReportsType } from "./ReportsType/ReportsTypes";
import { setReports } from "../../../ReaduxToolkit/Reducer/ReportsSlice";
import CustomDropdown from "./CustomDropdown";

const CreateNewReport = ({ dropDownDevices }: any) => {
  const { reports, reportsType } = useSelector((state: any) => state.reports);
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
      setLoading(false);
    }
  };
  const [selectedItems, setSelectedItems]: any = useState([]);
  const { Option, OptGroup } = Select;
  const [selectedOption, setSelectedOption] = useState("");

  const [undefinedData, setUndefinedData] = useState(false);

  const [reportsTypeList, setReportsType] = useState([]);
  const [role, setRole] = useState("");

  // const typeList: any = [reportsType];
  const [type, setType] = useState("");
  const tempReportsTypeList: any = [];
  useEffect(() => {
    reportsType.map((item: any, index: any) => {
      tempReportsTypeList.push({
        value: `${item.endPoint}`,
        label: `${item.title}`,
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
        P: `${item.name}`,
      });
    });
    setReportPeriodType(tempReportPeriodList);
  }, []);

  const [reportType, setReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString());

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
      // console.log(report);

      try {
        const today = new Date(); // Get current date and time
        // console.log("today", today);
        // console.log("endDate", endDate);
        const endDateTime = new Date(endDate);
        // console.log("endDateTime", endDateTime);

        // If endDate is today's date, set time to current time

        // console.log("today time: ", today.getTime());
        // console.log("endDateTime time: ", endDateTime.getTime());

        // console.log("before setting time: ", endDateTime);

        endDateTime.setTime(today.getTime());

        // console.log("after setting time: ", endDateTime);

        // console.log("called");
        // console.log("endDateTime", endDateTime);
        // console.log("today", today);
        var deviceIds: number[];
        if (selectedItems.length == 0) {
          const allItems = await dropDownDevices.flatMap((group: any) =>
            group.items.map((item: any) => ({
              deviceId: item.id,
              name: item.name,
              title: item.title,
            }))
          );
          // console.log("allItems", allItems);

          await setSelectedItems([...allItems]);
          deviceIds = await selectedItems.map((device: any) => device.deviceId);
          // console.log(deviceIds);
        } else {
          deviceIds = await selectedItems.map((device: any) => device.deviceId);
          // console.log(deviceIds);
        }

        await create(
          {
            // fromDate: new Date(startDate).toISOString(),
            toDate: endDateTime.toISOString(), // Convert to ISO format
            fromDate: startDate,
            // toDate: endDate, // Convert to ISO format
            deviceIds: deviceIds,
          },
          {
            url: `reports${type}`,
          }
        ).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
            setLoading(false);
            setSelectedItems([]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            setSelectedItems([]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              title: report.title,
              startDate: startDate,
              endDate: endDate,
              data: data.data,
            });
            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            setSelectedItems([]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setSelectedItems([]);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
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

  const handleReportTypeChange = (selectedOption: any) => {
    // console.log("SelectedOption", selectedOption);
    setReportType(selectedOption);
    handleDateSelection(selectedOption);
    // console.log("Start Date", startDate);
    // console.log("End Date", endDate);
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
        end.setDate(today.getDate());
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

    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
  };

  useEffect(() => {
    handleDateSelection("Yesterday"); // Default selection
  }, []);
  const data = [
    { title: "LHR", items: [] }, // Fill in your data here
    { title: "Ungrouped", items: [] },
    { title: "NLC", items: [] },
    { title: "ISB", items: [] },
    { title: "Testing Lynkworld", items: [] },
  ];

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
                    style={{ width: "100%", height: 36 }}
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
                    onChange={(e: any) => {
                      // console.log(e);
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
                        (option?.P ?? "").includes(input)
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.P ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.P ?? "").toLowerCase())
                      }
                      //   onChange={(e: any) => {
                      //     //   // console.log(e);
                      //     //   setRole(e);
                      //   }}
                      //   options={reportPeriodList}

                      options={reportPeriodList}
                      onChange={handleReportTypeChange}
                    />
                  </Col>
                </FormGroup>

                <FormGroup
                  className="col-md-6 create-group"
                  style={{ marginTop: "-25px" }}
                >
                  <div>
                    <P>Devices</P>
                  </div>
                  <CustomDropdown
                    data={dropDownDevices}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                  {/* <Select
                      // showSearch
                      // style={{ width: "100%", height: 36 }}
                      // placeholder="Select Type"
                      // optionFilterProp="children"
                      // filterOption={(input: any, option: any) =>
                      //   (option?.P ?? "").includes(input)
                      // }
                      // filterSort={(optionA: any, optionB: any) =>
                      //   (optionA?.P ?? "")
                      //     .toLowerCase()
                      //     .localeCompare((optionB?.P ?? "").toLowerCase())
                      // }
                      // onChange={(e: any) => {
                      //   // console.log(e);
                      //   setType(e);
                      // }}
                      // options={reportsTypeList}
                      defaultValue="Select an option"
                      style={{ width: "100%", height: 36 }}
                      onChange={(e: any) => {
                        // setSelectedOption(value);
                        // console.log("e", e);
                      }}
                    >
                      <OptGroup>
                        <Option>
                          <input
                            type="text"
                            value="abc"
                            // onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search..."
                          />
                        </Option>
                      </OptGroup>

                      {dropDownDevices.map((group: any) => (
                        <OptGroup
                          P={
                            <strong
                              style={{
                                background: "lightgray",
                                display: "block",
                                padding: "4px 8px",
                                color: "white",
                              }}
                            >
                              {group.title}
                            </strong>
                          }
                          key={group.title}
                        >
                          {group.items.map((item: any, index: any) => (
                            <Option value={item._id} key={item._id}>
                              {item.name}
                            </Option>
                          ))}
                        </OptGroup>
                      ))}
                    </Select> */}
                </FormGroup>
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
                      value={startDate.slice(0, 10)}
                      onChange={(e) => {
                        setStartDate(new Date(e.target.value).toISOString());
                        // console.log("e", e.target.value);
                      }}
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
                      value={endDate.slice(0, 10)}
                      onChange={(e) => {
                        setEndDate(new Date(e.target.value).toISOString());
                        // console.log("e", e.target.value);
                      }}
                    />
                  </Col>
                </FormGroup>
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
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
