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
} from "../../../../../../../ReaduxToolkit/Reducer/AlertsSlice";

interface ResponseType {
  response?: string;
}

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
}

const ResponseForm: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
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
          setLoading(false);
          setIsVisible(!isVisible);
          if (data.success) {
            console.log(data);
            setLoading(false);
            setIsVisible(!isVisible);
            reset({
              response: "",
            });

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
            <input
              className="form-control"
              type="text"
              {...register("response", { required: true })}
            />
            <span style={{ color: "red" }}>
              {errors.response && "Response is required"}
            </span>
          </FormGroup>
        </Row>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Completed`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              setIsVisible(!isVisible);
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
