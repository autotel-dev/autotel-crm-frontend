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
import { AddPreInfoAlertType, SendCommandType } from "./Type/SendCommandType";
import { H3 } from "../../../../../../AbstractElements";
import DevicesDropdown from "./DevicesDropdown/DevicesDropdown";
import { create, getAll } from "../../../../../../Api";
import {
  setDashboardStatistics,
  setPreInfoAlerts,
} from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices: any;
  fromDate: any;
  toDate: any;
}

const AddPreAlertInfo: React.FC<PropsTypes> = ({
  addModal,
  setAddModal = () => {},
  dropDownDevices,
  fromDate,
  toDate,
}) => {
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
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPreInfoAlertType>();

  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        message: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      });
      setSelectedItems([]);
      setLoading(false);
    }
  };
  const [selectedItems, setSelectedItems]: any = useState([]);

  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString());
  //   ---------------
  const currentTime = new Date();
  const currentHour = currentTime.getHours().toString().padStart(2, "0");
  const currentMinute = currentTime.getMinutes().toString().padStart(2, "0");
  const currentSecond = currentTime.getSeconds().toString().padStart(2, "0");
  const initialStartTime = `${currentHour}:${currentMinute}:${currentSecond}`;
  const initialEndTime = `${currentHour}:${currentMinute}:${currentSecond}`;

  const [startTime, setStartTime] = useState<string>(initialStartTime);
  const [endTime, setEndTime] = useState<string>(initialEndTime);

  const addPreInfoAlertHandler: SubmitHandler<AddPreInfoAlertType> = async (
    data: any
  ) => {
    setLoading(true);
    if (selectedItems.length !== 0 && data.message !== "") {
      const selectedEndDate = new Date(endDate.slice(0, 10) + "T" + endTime);
      const selectedstartDate = new Date(
        startDate.slice(0, 10) + "T" + startTime
      );

      // let adjustedEndDate = selectedEndDate;

      // if (
      //   selectedEndDate.toDateString() === currentDateTime.toDateString() &&
      //   selectedEndDate > currentDateTime
      // ) {
      //   // console.log(
      //     "selectedEndDate.toDateString()",
      //     selectedEndDate.toDateString()
      //   );
      //   // console.log(
      //     "currentDateTime.toDateString()",
      //     currentDateTime.toDateString()
      //   );
      //   // console.log("selectedEndDate", selectedEndDate);
      //   // console.log("currentDateTime", currentDateTime);

      //   adjustedEndDate.setDate(selectedEndDate.getDate() - 1);
      // }
      // // console.log(
      //   "adjustedEndTime",
      //   `${adjustedEndDate.getHours()}:
      //     ${adjustedEndDate.getMinutes()}:
      //    ${adjustedEndDate.getSeconds()}`
      // );
      // // console.log("adjustedEndDate", `${adjustedEndDate}`);
      // console.log("selectedstartDate -- ", `${selectedstartDate}`);
      // console.log("selectedEndDate -- ", `${selectedEndDate}`);

      const addPreInfoData = {
        preInfoMessage: data.message,
        fromDate: selectedstartDate,
        toDate: selectedEndDate,
        deviceData: selectedItems[0],
      };
      // console.log("addPreInfoData -- ", addPreInfoData);

      try {
        await create(addPreInfoData, {
          url: `control-room/add-pre-info`,
        }).then(async (data: any) => {
          // // console.log("data", data);

          setLoading(false);
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            setLoading(false);
            addToggle();
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            addToggle();
          }
          if (data.success) {
            // // console.log(data);

            getAll({ url: "control-room/get-all-pre-infos" }).then(
              (data: any) => {
                // // console.log("api call --- >", data);

                if (data !== undefined) {
                  if (data.success) {
                    // // // console.log("length --- >", data.data);
                    dispatch(setPreInfoAlerts(data.data));
                  }
                }
              }
            );
            const fromDateUpdated = new Date(fromDate);
            fromDateUpdated.setMinutes(new Date().getMinutes());
            fromDateUpdated.setSeconds(new Date().getSeconds() + 10);
            const toDateUpdated = new Date(toDate);
            toDateUpdated.setMinutes(new Date().getMinutes());
            toDateUpdated.setSeconds(new Date().getSeconds() + 10);

            getAll({
              url: `control-room/dashboard/statistics?fromDate=${fromDateUpdated}&toDate=${toDateUpdated}`,
            }).then((data: any) => {
              // // console.log("api call --- >", data);

              if (data !== undefined) {
                if (data.success) {
                  // // // console.log("length --- >", data.data);
                  dispatch(setDashboardStatistics(data.data));
                }
              }
            });
            addToggle();
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // // console.error("Error creating post:", error);

        setLoading(false);
        addToggle();
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

      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(addPreInfoAlertHandler)}
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
                serverID=""
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
                    // console.log("e", e.target.value);
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
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setStartTime(e.target.value);
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
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setEndTime(e.target.value);
                  }}
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
              {loading ? "Loading ..." : `Save`}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AddPreAlertInfo;
