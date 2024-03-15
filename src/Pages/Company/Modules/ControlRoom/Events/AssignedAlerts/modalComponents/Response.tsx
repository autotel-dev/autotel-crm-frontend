import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3 } from "../../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../../Api";
import {
  setAssignedAlerts,
  setCompletedAlerts,
  setModalData,
} from "../../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import Swal from "sweetalert2";

interface ResponseType {
  response?: string;
}

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  setBasicTab: any;
}

const ResponseForm: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  setBasicTab = () => {},
}) => {
  const { modalData } = useSelector((state: any) => state.alerts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResponseType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        response: "",
      });
    }
  };

  const sendResponse: SubmitHandler<ResponseType> = async (data: any) => {
    setLoading(true);
    if (data.response !== "") {
      const completedResponse = {
        alertEventId: modalData.alertEvent._id,
        completionResponse: data.response,
        alertEventCloseDate: new Date().toISOString(),
      };
      console.log(completedResponse);
      try {
        await create(completedResponse, {
          url: "alert-events/complete-an-alert-event",
        }).then((data: any) => {
          if (!data.success && data.message == "ERROR_INTERNET_DISCONNECTED") {
            setLoading(false);
            setIsVisible(!isVisible);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            setIsVisible(!isVisible);
          }
          if (data.success) {
            console.log(data);
            setLoading(false);
            setIsVisible(!isVisible);
            reset({
              response: "",
            });
            dispatch(setModalData(null));
            setBasicTab("1");
            getAll({
              url: "company/get-all-assigned-events",
            }).then((data: any) => {
              console.log("assigned --- >", data);
              // setLoading(false);
              if (data !== undefined) {
                if (data.success) {
                  console.log("length --- >", data.data.length);
                  dispatch(setAssignedAlerts(data.data));
                }
                if (data.statusCode == 404) {
                  dispatch(setAssignedAlerts([]));
                }
              }
            });
            getAll({
              url: "company/get-all-completed-events",
            }).then((data: any) => {
              console.log("assigned --- >", data);
              // setLoading(false);
              if (data !== undefined) {
                if (data.success) {
                  console.log("length --- >", data.data.length);
                  dispatch(setCompletedAlerts(data.data));
                }
                // if (!data.success) {
                //   console.log("length --- >", data.data.length);
                //   dispatch(setAssignedAlerts([]));
                // }
              }
            });
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        setIsVisible(!isVisible);
        reset({
          response: "",
        });
      }
    }
  };

  return (
    <Col md={12}>
      <form
        className="form-bookmark needs-validation"
        onSubmit={handleSubmit(sendResponse)}
      >
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-12 create-group">
            <Label>Response</Label>
            <textarea
              className="form-control"
              rows={3} // Minimum number of visible lines
              style={{
                maxHeight: "500px", // Maximum height for 5 lines of text
                resize: "vertical", // Allow vertical resizing within the specified range
              }}
              {...register("response", { required: true })}
            />
            <span style={{ color: "red" }}>
              {errors.response && "Response is required"}
            </span>
          </FormGroup>
        </Row>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Complete`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              setIsVisible(!isVisible);
              dispatch(setModalData(null));
              setBasicTab("1");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Col>
  );
};

export default ResponseForm;
