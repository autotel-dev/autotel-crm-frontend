import { PlusCircle } from "react-feather";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../utils/Constant";
import { H3, H4, P } from "../../../AbstractElements";
import { createCom, getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import SelectPriorityStatusesTypes from "./components/SelectPriorityStatusesTypes";
import {
  setBugReports,
  setPriorityStatus,
  setReportsEnd,
  setReportsStart,
  setSupportStatistics,
} from "../../../ReaduxToolkit/Reducer/SupportSlice";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { getUserRole } from "../../../Utilities/globals/globals";
import { ROLES } from "../../../constants/roles";

interface TicketType {
  name: string;
  description: string;
}

interface Image {
  id: number;
  url: string;
}

const CreateNewTicket = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const { priorityStatus } = useSelector((state: any) => state.support);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        name: "",
        description: "",
      });
      dispatch(setPriorityStatus(null));
      setSelectedFiles([]);
      setSelectedImages([]);
    }
  };

  const addTicket: SubmitHandler<TicketType> = async (data) => {
    // e.preventDefault();

    const formData = new FormData();
    if (
      data.name !== "" &&
      data.description !== "" &&
      priorityStatus !== null
    ) {
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("priorty", priorityStatus);

      selectedfiles.map((file, index) => {
        // console.log("image file test loop map: ", file);
        formData.append("images", file);
      });

      //   if (selectedfiles.length > 0) {
      //     // console.log("in new loop")
      //     for (let i = 0; i < selectedfiles.length; i++) {
      //         // console.log("selectedfiles[i]: ", selectedfiles[i])
      //       formData.append("images", selectedfiles[i]);
      //     }
      //   }

      try {
        setLoading(true);
        for (const [key, value] of formData.entries()) {
          // console.log(`Key 1: ${key}, Value 1: ${value}`);
        }
        await createCom(formData, {
          url: "support/bug-report/report-new-bug",
        }).then((data: any) => {
          if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
            setSelectedFiles([]);
            setSelectedImages([]);
            setLoading(false);
            setAddModal(false);
            reset({
              name: "",
              description: "",
            });
            dispatch(setPriorityStatus(null));
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setSelectedFiles([]);
            setSelectedImages([]);
            setLoading(false);
            setAddModal(false);
            reset({
              name: "",
              description: "",
            });
            dispatch(setPriorityStatus(null));
          }
          if (data.success) {
            // console.log(data);
            setSelectedFiles([]);
            setSelectedImages([]);
            dispatch(setPriorityStatus(null));
            setLoading(false);
            setAddModal(false);
            reset({
              name: "",
              description: "",
            });
            dispatch(setReportsStart());
            getAll({
              url:
                getUserRole() === ROLES.COMPANY
                  ? "company/get-all-bug-reports"
                  : "support/bug-report/get-all-bug-reports",
            }).then((data: any) => {
              // console.log("api call --- >", data);
              dispatch(setReportsEnd());
              if (data !== undefined) {
                dispatch(setNoDataFound(data.message));
                if (data.success) {
                  // console.log("hhg");
                  dispatch(setBugReports(data.data.allBugReports));
                }
              }
            });

            if (getUserRole() === ROLES.SUPER_ADMIN) {
              getAll({ url: "support/bug-report/get-statistics" }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  if (data !== undefined) {
                    if (data.success) {
                      const mappedArray = Object.entries(
                        data.data.bugReportsStatistics
                      ).map(([key, value]) => {
                        // Remove "total" from the key and replace "Count" with "Tickets"
                        const formattedKey = key
                          .replace("total", "")
                          .replace("Count", " Tickets");
                        return { key: [formattedKey], value: value };
                      });
                      // console.log(mappedArray);
                      dispatch(setSupportStatistics(mappedArray));
                    }
                  }
                }
              );
            }
          }
        });
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setSelectedFiles([]);
        setSelectedImages([]);
        setLoading(false);
        setAddModal(false);
        reset({
          name: "",
          description: "",
        });
        dispatch(setPriorityStatus(null));
      }
    } else {
      Swal.fire({
        text: "Please Select all the fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [selectedfiles, setSelectedFiles] = useState<any[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        id: index + selectedImages.length,
        url: URL.createObjectURL(file),
      }));
      const newFiles = Array.from(files).map((file, index) => file);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
      // console.log("selecetdImages", selectedImages);

      setSelectedFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
      // console.log("selecetdFiles", selectedfiles);
    }
  };

  const handleDeleteImage = (id: number, e: any, imageindex: any) => {
    e.preventDefault();
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image.id !== id)
    );
    setSelectedFiles((prevImages) =>
      prevImages.filter((image, index) => index !== imageindex)
    );
  };

  return (
    <div className="text-end">
      <button
        className={`btn ${
          userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
        }`}
        style={{
          color: "white",
          backgroundColor: `${
            userPersonalizationData !== null && userPersonalizationData?.buttonsAndBarsColor
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px 10px",
          height: "40px",
          width: "100%",
        }}
        onClick={addToggle}
      >
        <div
          style={{ marginRight: "2.5%", display: "flex", alignItems: "center" }}
        >
          <PlusCircle />
        </div>
        <span style={{ fontSize: "1em" }}>Create New Ticket</span>
      </button>
      <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
        <div className="modal-header">
          <H4 className="modal-title">Create New Ticket</H4>
          <Button
            color="transprant"
            className="btn-close"
            onClick={addToggle}
          ></Button>
        </div>
        <ModalBody>
          <form
            className="form-bookmark needs-validation"
            onSubmit={handleSubmit(addTicket)}
          >
            <Row>
              <FormGroup className="col-md-12 create-group">
                <P>Name</P>
                <input
                  className="form-control"
                  type="text"
                  {...register("name", { required: true })}
                />
                <span style={{ color: "red" }}>
                  {errors.name && "Name is required"}
                </span>
              </FormGroup>
              <FormGroup className="col-md-12 create-group">
                <P>Description</P>

                <textarea
                  className="form-control"
                  rows={3} // Minimum number of visible lines
                  style={{
                    maxHeight: "200px", // Maximum height for 5 lines of text
                    resize: "vertical", // Allow vertical resizing within the specified range
                  }}
                  {...register("description", { required: true })}
                />
                <span style={{ color: "red" }}>
                  {errors.description && "Description is required"}
                </span>
              </FormGroup>
            </Row>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <SelectPriorityStatusesTypes
                placeholder={"Select Priority Status"}
              />
            </div>
            <div>
              <Label
                htmlFor="imageInput"
                style={{
                  cursor: "pointer",
                  backgroundColor: "lightgray",
                  color: "white",
                  padding: "10px",
                  fontSize: "15px",
                  borderRadius: "5px",
                  border: "1px solid gray",
                }}
              >
                Select Images
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Label>
              <div style={{ marginTop: "10px" }}>
                {selectedImages.map((image, index) => (
                  <div
                    key={image.id}
                    style={{
                      display: "inline-block",
                      marginRight: "10px",
                      position: "relative",
                    }}
                  >
                    <img
                      src={image.url}
                      alt="selected"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <button
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={(e: any) =>
                        handleDeleteImage(image.id, e, index)
                      }
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
                <Button color="primary" className="me-1">
                  {loading ? "Loading ..." : `Add`}
                </Button>
                &nbsp;&nbsp;
                <Button
                  disabled={loading ? true : false}
                  color="secondary"
                  onClick={addToggle}
                >
                  {Cancel}
                </Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CreateNewTicket;
