import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";


import Swal from "sweetalert2";
import { P } from "../../../../../AbstractElements";
import { setAllComplains, setCreateComplainModalData } from "../../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import SelectComplainTypesList from "../components/SelectComplainTypesList";
import SelectComplainStatusTypes from "../components/SelectComplainStatusTypes";
import SelectComplainRole from "../components/SelectComplainRole";
import { create, getAll } from "../../../../../Api";

interface ResponseType {
  response?: string;
}

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  isDeviceSelectedModalVisible: any;
  setIsDeviceSelectedModalVisible: any;
  selectedItems: any;
  setBasicTab: any;
}

const ResponseForm: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => { },
  isDeviceSelectedModalVisible,
  setIsDeviceSelectedModalVisible = () => { },
  selectedItems,
  setBasicTab = () => { },
}) => {
  const { modalData } = useSelector((state: any) => state.alerts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [statuss, setStatuss] = useState("");
  const [role, setRole] = useState("");
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

  const createComplain: SubmitHandler<ResponseType> = async (data: any) => {
    setLoading(true);
    if (data.response !== "") {

      const complainData = {
        description: data.response,
        priorty: priority,
        internalComplaintType: type,
        deviceId: selectedItems[0].id,
        deviceName: selectedItems[0].name,
        subRole: priority == "GENERAL" ? null : role,
        server: selectedItems[0].server._id,
        status: priority == "GENERAL" ? "RESOLVED" : statuss,
        deviceInfo: {
          ok: "ok"
        },
        resolvingDate: priority == "GENERAL" ? new Date() : null
      }

      // // console.log(completedResponse);
      try {
        await create(complainData, {
          url: "complaint-center/create-new-internal-complaint",
        }).then((data: any) => {
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            setLoading(false);
            setIsVisible(!isVisible);
            setIsDeviceSelectedModalVisible(!isDeviceSelectedModalVisible)
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
            setIsDeviceSelectedModalVisible(!isDeviceSelectedModalVisible)
          }
          if (data.success) {
            // // console.log(data);
            setLoading(false);
            setIsVisible(!isVisible);
            setIsDeviceSelectedModalVisible(!isDeviceSelectedModalVisible)
            reset({
              response: "",
            });
            dispatch(setCreateComplainModalData(null));
            setBasicTab("1");
            getAll({
              url: "complaint-center/get-all-internal-complaints",
            }).then((data: any) => {
              // // console.log("assigned --- >", data);
              // setLoading(false);
              if (data !== undefined) {
                if (data.success) {
                  // // console.log("length --- >", data.data.length);
                  dispatch(setAllComplains(data.data.allInternalComplaints));
                }
                if (data.statusCode === 404) {
                  dispatch(setAllComplains([]));
                }
              }
            });

          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // // console.error("Error creating post:", error);
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
        onSubmit={handleSubmit(createComplain)}
      >
        <Row style={{ paddingTop: "20px" }}>

          <FormGroup className="col-md-6 create-group">
            <P>Complain Type </P>
            <SelectComplainTypesList type={type} setType={setType} priority={priority} setPriority={setPriority} />

          </FormGroup>
          {type !== "" && <>
            < FormGroup className="col-md-6 create-group">
              <P>Priority</P>
              <input
                className="form-control"
                type="text"
                value={priority}
                disabled
              />
            </FormGroup>

            <FormGroup className="col-md-6 create-group">
              <P>Select Status</P>
              <SelectComplainStatusTypes priority={priority} status={statuss} setStatus={setStatuss} />

            </FormGroup>
            <FormGroup className="col-md-6 create-group">
              <P>Departmemnt</P>
              <SelectComplainRole priority={priority} role={role} setRole={setRole} />

            </FormGroup>
            <FormGroup className="col-md-12 create-group">
              <P>Response</P>
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
          </>}
        </Row>
        <div style={{ display: "flex", justifyContent: "end" }}>

          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              setIsVisible(!isVisible);
              dispatch(setCreateComplainModalData(null));
              setBasicTab("1");
            }}
          >
            Cancel
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Create`}
          </Button>
        </div>
      </form>
    </Col >
  );
};

export default ResponseForm;
