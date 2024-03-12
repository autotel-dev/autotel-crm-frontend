import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";

import { jwtDecode } from "jwt-decode";
import { Select } from "antd";
import Swal from "sweetalert2";
import { SendCommandType } from "./Type/SendCommandType";
import { H3 } from "../../../../../../AbstractElements";
import DevicesDropdown from "./DevicesDropdown/DevicesDropdown";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices: any;
}

const AddPreAlertInfo: React.FC<PropsTypes> = ({
  addModal,
  setAddModal = () => {},
  dropDownDevices,
}) => {
  const { reports, reportsType } = useSelector((state: any) => state.reports);
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
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendCommandType>();

  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        message: "",
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

  const [reportType, setReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString());
  //   ---------------
  const [startTime, setStartTime] = useState<string>(
    new Date().getTime().toString()
  );

  const [endTime, setEndTime] = useState<string>(new Date().getTime().toString());

  //   const addReport: SubmitHandler<SendCommandType> = async (data: any) => {
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

  //       try {
  //         const today = new Date(); // Get current date and time
  //         console.log("today", today);
  //         console.log("endDate", endDate);
  //         const endDateTime = new Date(endDate);
  //         console.log("endDateTime", endDateTime);

  //         // If endDate is today's date, set time to current time

  //         console.log("today time: ", today.getTime());
  //         console.log("endDateTime time: ", endDateTime.getTime());

  //         console.log("before setting time: ", endDateTime);

  //         endDateTime.setTime(today.getTime());

  //         console.log("after setting time: ", endDateTime);

  //         console.log("called");
  //         console.log("endDateTime", endDateTime);
  //         console.log("today", today);
  //         var deviceIds: number[];
  //         if (selectedItems.length == 0) {
  //           const allItems = await dropDownDevices.flatMap((group: any) =>
  //             group.items.map((item: any) => ({
  //               deviceId: item.id,
  //               name: item.name,
  //               title: item.title,
  //             }))
  //           );
  //           console.log("allItems", allItems);

  //           await setSelectedItems([...allItems]);
  //           deviceIds = await selectedItems.map((device: any) => device.deviceId);
  //           console.log(deviceIds);
  //         } else {
  //           deviceIds = await selectedItems.map((device: any) => device.deviceId);
  //           console.log(deviceIds);
  //         }

  //         await create(
  //           {
  //             // fromDate: new Date(startDate).toISOString(),
  //             toDate: endDateTime.toISOString(), // Convert to ISO format
  //             fromDate: startDate,
  //             // toDate: endDate, // Convert to ISO format
  //             deviceIds: deviceIds,
  //           },
  //           {
  //             url: `reports${type}`,
  //           }
  //         ).then((data: any) => {
  //           console.log("data", data);

  //           setLoading(false);
  //           if (data.success) {
  //             console.log(data);
  //             tempReports.push({
  //               title: report.title,
  //               startDate: startDate,
  //               endDate: endDate,
  //               data: data.data,
  //             });
  //             console.log("Reports", reports);
  //             dispatch(setReports(tempReports));
  //             setSelectedItems([]);
  //             const yesterday = new Date();
  //             yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
  //             setStartDate(yesterday.toISOString());
  //             // setStartDate(new Date().toISOString());
  //             setEndDate(new Date().toISOString());
  //             setLoading(false);
  //             addToggle();
  //             setType("Select Type");
  //           }
  //         });
  //         // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //       } catch (error: any) {
  //         // Handle error (e.g., show an error message)
  //         console.error("Error creating post:", error);
  //         setSelectedItems([]);
  //         const yesterday = new Date();
  //         yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
  //         setStartDate(yesterday.toISOString());
  //         // setStartDate(new Date().toISOString());
  //         setEndDate(new Date().toISOString());
  //         if (data == undefined) {
  //           Swal.fire({
  //             text: "Failed to create due to connection refused",
  //             icon: "error",
  //             timer: 2000,
  //             showConfirmButton: false,
  //           });

  //           return;
  //         }
  //         setLoading(false);
  //         addToggle();
  //         setType("Select Type");
  //       }
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

  return (
    <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
      <div className="modal-header">
        <H3 className="modal-title">Pre Alert Info</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>

      <ModalBody style={{ height: "50vh" }}>
        <form
          className="form-bookmark needs-validation"
          //   onSubmit={handleSubmit(addReport)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <div>
                <Label>Devices</Label>
              </div>
              <DevicesDropdown
                data={dropDownDevices}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
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
              <div>Date From:</div>
              <Col md={8}>
                <input
                  className="form-control"
                  type="date"
                  value={startDate.slice(0, 10)}
                  onChange={(e) => {
                    setStartDate(new Date(e.target.value).toISOString());
                    console.log("e", e.target.value);
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup
              className="col-md-6 create-group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>Time From:</div>
              <Col md={8}>
                <input
                  className="form-control"
                  type="time"
                  value={startTime}
                //   onChange={(e) => {
                //     setStartDate(new Date(e.target.value).toISOString());
                //     console.log("e", e.target.value);
                //   }}
                />
              </Col>
            </FormGroup>
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
                    console.log("e", e.target.value);
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup
              className="col-md-6 create-group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>Time To:</div>
              <Col md={8}>
                <input
                  className="form-control"
                  type="time"
                  value={endTime}
                //   onChange={(e) => {
                //     setStartDate(new Date(e.target.value).toISOString());
                //     console.log("e", e.target.value);
                //   }}
                />
              </Col>
            </FormGroup>
            <FormGroup className="col-md-12 create-group">
              <Label>Message</Label>
              <textarea
                className="form-control"
                rows={3} // Minimum number of visible lines
                style={{
                  maxHeight: "70px", // Maximum height for 5 lines of text
                  resize: "vertical", // Allow vertical resizing within the specified range
                }}
                {...register("message", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.message && "Message is required"}
              </span>
            </FormGroup>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              marginTop: "-20px",
            }}
          >
            <Button
              disabled={loading ? true : false}
              color="secondary"
              onClick={addToggle}
            >
              Cancel
            </Button>
            &nbsp;&nbsp;
            <Button color="primary" className="me-1">
              {loading ? "Loading ..." : `Send`}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AddPreAlertInfo;
