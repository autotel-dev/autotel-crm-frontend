import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Cancel } from "../../../utils/Constant";
import { H3, H4, P } from "../../../AbstractElements";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, update } from "../../../Utilities/api";
import { Type } from "./GroupsTypes/GroupTypes";
import {
  setGroupStart,
  setGroupEnd,
  setGroup,
  setId,
  setFilterGroups,
  setInActiveActiveGroups,
} from "../../../ReaduxToolkit/Reducer/GroupSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import Swal from "sweetalert2";
import { GET_ALL_SALE_GROUPS, UPDATE_SALE_GROUP } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  id: any;
  value: any;
  isActive: any;
  setIsActive: any;
}

const UpdateGroup: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => { },
  id,
  value,
  isActive,
  setIsActive,

  // setValue
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Type>({
    defaultValues: {
      // Set the initial value from props
      name: value,
      isActive: isActive,
    },
  });
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      reset({
        isActive: isActive,
      });
    }
  };
  // console.log(id);
  // console.log(value);
  // console.log("isActive -- >", isActive);
  // dispatch(setValue(value));
  // console.log("is: ", isVisible);

  // const updateGroup: SubmitHandler<Type> = async (data) => {
  //   setLoading(true);
  //   if (data.name !== "") {
  //     const group = {
  //       name: data.name,
  //       isActive: isActive,
  //     };
  //     // console.log(country);
  //     try {
  //       await update(group, { url: `${UPDATE_SALE_GROUP}/${id}` }).then(
  //         (data: any) => {
  //           if (
  //             !data.success &&
  //             data.message === ERROR_MESSAGE
  //           ) {
  //             setLoading(false);
  //             setIsVisible(!isVisible);
  //           }
  //           if (!data.success) {
  //             Swal.fire({
  //               text: `${data.message}`,
  //               icon: "error",
  //               timer: 2000,
  //               showConfirmButton: false,
  //             });
  //             setLoading(false);
  //             setIsVisible(!isVisible);
  //           }
  //           if (data.success) {
  //             // console.log(data);
  //             setLoading(false);
  //             setIsVisible(!isVisible);

  //             dispatch(setId(null));
  //             // dispatch(setValue(""));
  //             dispatch(setGroupStart());
  //             getAll({ url: GET_ALL_SALE_GROUPS }).then((data: any) => {
  //               // console.log("api call --- >", data);
  //               if (data == undefined) {
  //                 Swal.fire({
  //                   text: "Failed to fetch due to connection refused",
  //                   icon: "error",
  //                   timer: 2000,
  //                   showConfirmButton: false,
  //                 });
  //                 dispatch(setInActiveActiveGroups("All"));
  //                 dispatch(setGroup([]));
  //                 dispatch(setFilterGroups([]));
  //                 dispatch(setGroupEnd());
  //                 return;
  //               }
  //               dispatch(setGroupEnd());
  //               if (data !== undefined) {
  //                 dispatch(setNoDataFound(data.message));
  //                 if (data.success) {
  //                   // console.log("hhg");
  //                   dispatch(setGroup(data.data));
  //                   dispatch(setFilterGroups(data.data));
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       );
  //       // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //     } catch (error) {
  //       // Handle error (e.g., show an error message)
  //       // console.error("Error creating post:", error);

  //       setLoading(false);
  //       setIsVisible(!isVisible);
  //     }
  //   }
  // };
  const updateGroup: SubmitHandler<Type> = async (data) => {
    setLoading(true);
    if (data.name !== "") {
      const group = {
        name: data.name,
        isActive: isActive,
      };
      // console.log(country);
      try {
        await update(group, { url: `${UPDATE_SALE_GROUP}/${id}` }).then(
          (data: any) => {
            if (
              !data.success &&
              data.message === ERROR_MESSAGE
            ) {
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
              // console.log(data);
              setLoading(false);
              setIsVisible(!isVisible);

              dispatch(setId(null));
              // dispatch(setValue(""));
              dispatch(setGroupStart());
              getAll({ url: GET_ALL_SALE_GROUPS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  dispatch(setInActiveActiveGroups("All"));
                  dispatch(setGroup([]));
                  dispatch(setFilterGroups([]));
                  dispatch(setGroupEnd());
                  return;
                }
                dispatch(setGroupEnd());
                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setGroup(data.data));
                    dispatch(setFilterGroups(data.data));
                  }
                }
              });
            }
          }
        );
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);

        setLoading(false);
        setIsVisible(!isVisible);
      }
    }
  };
  useEffect(() => {
    setValue("name", value);
  }, [value, setValue]);

  useEffect(() => {
    setValue("isActive", isActive);
  }, [isActive, setValue]);

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={
        addToggle
        //   () => {
        //   setIsVisible(!isVisible);
        // }
      }
      size="md"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
        // console.log(value);
      }}
    >
      <div className="modal-header">
        <H4 className="modal-title">Update Groups</H4>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
            // console.log(value);
          }}
        ></Button>
      </div>
      <ModalBody>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(updateGroup)}
        >
          <Row>
            <FormGroup className="col-md-12 ">
              <P>Group Name</P>
              <input
                className="form-control"
                type="text"
                // defaultValue={value}
                autoComplete="off"
                {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {errors.name && "Group name is required"}
              </span>
              <div className="d-flex">
                <div
                  className={`text-end flex-shrink-0 icon-state 
                            }`}
                >
                  <Label className="switch mb-0">
                    <Input
                      type="checkbox"
                      defaultChecked={isActive}
                      value={isActive ? "on" : "off"}
                      onChange={(e) => {
                        setIsActive(!isActive);
                        // console.log(e.target.value);
                      }}
                    />
                    <span
                      className={`switch-state ${isActive ? "bg-primary" : "bg-secondary"
                        }`}
                    />
                  </Label>
                </div>
              </div>
            </FormGroup>
          </Row>
          <div style={{ marginLeft: "10px" }}>
            <Row>
              {/* <FormGroup check switch inline className="col-md-12 create-group">
                <Input
                  type="checkbox"
                  role="switch"
                  defaultChecked={isActive}
                  value={isActive ? "on" : "off"}
                  onChange={(e) => {
                    setIsActive(!isActive);
                    // console.log(e.target.value);
                  }}
                />
              </FormGroup> */}
            </Row>
          </div>
          <Button color="primary" className="me-1">
            {loading ? "Loading ..." : `Update`}
          </Button>
          &nbsp;&nbsp;
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={() => {
              // setValue("")
              setIsVisible(!isVisible);
              // console.log(value);
            }}
          >
            {Cancel}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateGroup;
