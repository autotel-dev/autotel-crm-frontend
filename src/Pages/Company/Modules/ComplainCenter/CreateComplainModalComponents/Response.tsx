import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { P } from "../../../../../AbstractElements";
import {
  setAllComplains,
  setComplainCenterRoles,
  setComplainCenterStatistics,
  setCreateComplainModalData,
} from "../../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import SelectComplainTypesList from "../components/SelectComplainTypesList";
import SelectComplainStatusTypes from "../components/SelectComplainStatusTypes";
import SelectComplainRole from "../components/SelectComplainRole";
import { create, getAll } from "../../../../../Utilities/api";
import {
  formatUnderscoredString,
  getUserRole,
  getUserRoleID,
} from "../../../../../Utilities/globals/globals";
import { ROLES } from "../../../../../constants/roles";
import {
  CREATE_NEW_INTERNAL_COMPLAINT,
  GET_ALL_INTERNAL_COMPLAINT,
  GET_COMPLAINT_CENTER_STATISTICS,
} from "../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../Utilities/constants/constants";
import { setNRReport } from "../../../../../ReaduxToolkit/Reducer/NRSlice";

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
  setIsVisible = () => {},
  isDeviceSelectedModalVisible,
  setIsDeviceSelectedModalVisible = () => {},
  selectedItems,
  setBasicTab = () => {},
}) => {
  const { report } = useSelector((state: any) => state.nrReport);
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
  // console.log(selectedItems);

  const createComplain: SubmitHandler<ResponseType> = async (data: any) => {
    setLoading(true);
    if (data.response !== "") {
      const complainData = {
        description: data.response,
        priorty: priority,
        internalComplaintType: type,
        deviceId: selectedItems[0].id,
        deviceName: selectedItems[0].name,
        subRole: role === "" ? null : role,
        server: selectedItems[0].server._id,
        status: priority === "GENERAL" ? "RESOLVED" : "NEW",
        deviceInfo: {
          customerName: selectedItems[0].customerInfo.name,
          mobileNo1: selectedItems[0].customerInfo.mobile_1,
          mobileNo2: selectedItems[0].customerInfo.mobile_2,
          vehicleName: selectedItems[0].name,
          simNumber: selectedItems[0].sim_number,
          imei: selectedItems[0].imei,
          deviceModel: selectedItems[0].device_model,
        },
        resolvingDate: priority == "GENERAL" ? new Date() : null,
      };

      // // console.log(completedResponse);
      try {
        await create(complainData, {
          url: CREATE_NEW_INTERNAL_COMPLAINT,
        }).then((data: any) => {
          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            setIsVisible(!isVisible);
            // setIsDeviceSelectedModalVisible(!isDeviceSelectedModalVisible);
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
            // setIsDeviceSelectedModalVisible(!isDeviceSelectedModalVisible);
          }
          if (data.success) {
            if (selectedItems.length > 0) {
              const updatedReport = report.map((item: any) => {
                // Check if the item matches the selected item by ID
                if (item.id === selectedItems[0].id) {
                  // Return a new object with the updated status
                  return {
                    ...item,
                    hasComplaint: true, // Update the status to 'PENDING'
                    complaintMessage: complainData.description,
                  };
                }
                // Return the item unchanged if no match is found
                return item;
              });

              // Dispatch the updated report
              dispatch(setNRReport(updatedReport));
            }
            // // console.log(data);
            setLoading(false);
            setIsVisible(!isVisible);
            // setIsDeviceSelectedModalVisible(!isDeviceSelectedModalVisible);
            reset({
              response: "",
            });
            dispatch(setCreateComplainModalData(null));
            setBasicTab("1");
            getAll({
              url: GET_ALL_INTERNAL_COMPLAINT,
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

                getAll({ url: GET_COMPLAINT_CENTER_STATISTICS }).then(
                  (data: any) => {
                    // console.log("Data", data);

                    if (data !== undefined) {
                      if (data.success) {
                        dispatch(
                          setComplainCenterRoles(
                            data.data.InternalComplaintsStatistics.subRoleCounts
                          )
                        );
                        const mappedArray = Object.entries(
                          data.data.InternalComplaintsStatistics
                        ).map(([key, value]) => {
                          // Remove "total" from the key and replace "Count" with "Tickets"
                          if (key !== "subRoleCounts") {
                            const formattedKey = key
                              .replace("total", "")
                              .replace("Count", "");
                            return { key: formattedKey, value: value };
                          }
                        });
                        mappedArray.pop();
                        // console.log(mappedArray);
                        dispatch(setComplainCenterStatistics(mappedArray));
                      }
                    }
                  }
                );
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
    <Col
      md={12}
      style={{
        overflow: "auto",
        overflowX: "hidden",
      }}
    >
      <form
        className="form-bookmark needs-validation"
        onSubmit={handleSubmit(createComplain)}
      >
        <Row style={{ paddingTop: "20px" }}>
          <FormGroup className="col-md-6 create-group">
            <P>Complain Type </P>
            <SelectComplainTypesList
              type={type}
              setType={setType}
              priority={priority}
              setPriority={setPriority}
            />
          </FormGroup>
          {type !== "" && (
            <>
              <FormGroup className="col-md-6 create-group">
                <P>Priority</P>
                <input
                  className="form-control"
                  type="text"
                  value={formatUnderscoredString(priority)}
                  disabled
                />
              </FormGroup>

              <FormGroup className="col-md-6 create-group">
                <P>Select Status</P>
                <SelectComplainStatusTypes
                  priority={priority}
                  status={statuss}
                  setStatus={setStatuss}
                />
              </FormGroup>
              <FormGroup className="col-md-6 create-group">
                <P>Departmemnt</P>
                <SelectComplainRole
                  priority={priority}
                  role={role}
                  setRole={setRole}
                />
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
            </>
          )}
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
    </Col>
  );
};

export default ResponseForm;
