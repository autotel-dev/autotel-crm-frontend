import { PlusCircle } from "react-feather";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { Cancel } from "../../../../utils/Constant";
import { H3, P } from "../../../../AbstractElements";
import { createCom, getAll } from "../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import SelectPriorityStatusesTypes from "./components/SelectPriorityStatusesTypes";
import {
  setBugReports,
  setPriorityStatus,
  setReportsEnd,
  setReportsStart,
  setSupportStatistics,
} from "../../../../ReaduxToolkit/Reducer/SupportSlice";
import { setNoDataFound } from "../../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import { getUserRole } from "../../../../Api/globals";
import { ROLES } from "../../../../constants/roles";
import DeviceSelecetdForNewComplain from "./DeviceSelectedForNewComplainModel";

interface TicketType {
  name: string;
  description: string;
}

interface Image {
  id: number;
  url: string;
}

const CreateNewComplain = () => {
  const { devices } = useSelector((state: any) => state.monitoring);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const [serverID, setServerID] = useState("");
  const [
    isUpdateModalOpenForDeviceSelecetdForNewComplain,
    setIsUpdateModalOpenForDeviceSelecetdForNewComplain,
  ] = useState(false);
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
    // if (!loading) {
    //   setAddModal(!addModal);
    //   reset({
    //     name: "",
    //     description: "",
    //   });
    //   dispatch(setPriorityStatus(null));
    //   setSelectedFiles([]);
    //   setSelectedImages([]);
    // }

    // setServerID(server?.server?._id);
    setIsUpdateModalOpenForDeviceSelecetdForNewComplain(true);
  };

  // const addTicket: SubmitHandler<TicketType> = async (data) => {
  //   // e.preventDefault();

  //   const formData = new FormData();
  //   if (
  //     data.name !== "" &&
  //     data.description !== "" &&
  //     priorityStatus !== null
  //   ) {
  //     formData.append("name", data.name);
  //     formData.append("description", data.description);
  //     formData.append("priorty", priorityStatus);

  //     selectedfiles.map((file, index) => {
  //       // console.log("image file test loop map: ", file);
  //       formData.append("images", file);
  //     });

  //     //   if (selectedfiles.length > 0) {
  //     //     // console.log("in new loop")
  //     //     for (let i = 0; i < selectedfiles.length; i++) {
  //     //         // console.log("selectedfiles[i]: ", selectedfiles[i])
  //     //       formData.append("images", selectedfiles[i]);
  //     //     }
  //     //   }

  //     try {
  //       setLoading(true);
  //       for (const [key, value] of formData.entries()) {
  //         // console.log(`Key 1: ${key}, Value 1: ${value}`);
  //       }
  //       await createCom(formData, {
  //         url: "support/bug-report/report-new-bug",
  //       }).then((data: any) => {
  //         if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
  //           setSelectedFiles([]);
  //           setSelectedImages([]);
  //           setLoading(false);
  //           setAddModal(false);
  //           reset({
  //             name: "",
  //             description: "",
  //           });
  //           dispatch(setPriorityStatus(null));
  //         }
  //         if (!data.success) {
  //           Swal.fire({
  //             text: `${data.message}`,
  //             icon: "error",
  //             timer: 2000,
  //             showConfirmButton: false,
  //           });
  //           setSelectedFiles([]);
  //           setSelectedImages([]);
  //           setLoading(false);
  //           setAddModal(false);
  //           reset({
  //             name: "",
  //             description: "",
  //           });
  //           dispatch(setPriorityStatus(null));
  //         }
  //         if (data.success) {
  //           // console.log(data);
  //           setSelectedFiles([]);
  //           setSelectedImages([]);
  //           dispatch(setPriorityStatus(null));
  //           setLoading(false);
  //           setAddModal(false);
  //           reset({
  //             name: "",
  //             description: "",
  //           });
  //           dispatch(setReportsStart());
  //           getAll({
  //             url:
  //               getUserRole() === ROLES.COMPANY
  //                 ? "company/get-all-bug-reports"
  //                 : "support/bug-report/get-all-bug-reports",
  //           }).then((data: any) => {
  //             // console.log("api call --- >", data);
  //             dispatch(setReportsEnd());
  //             if (data !== undefined) {
  //               dispatch(setNoDataFound(data.message));
  //               if (data.success) {
  //                 // console.log("hhg");
  //                 dispatch(setBugReports(data.data.allBugReports));
  //               }
  //             }
  //           });

  //           if (getUserRole() === ROLES.SUPER_ADMIN) {
  //             getAll({ url: "support/bug-report/get-statistics" }).then(
  //               (data: any) => {
  //                 // console.log("api call --- >", data);
  //                 if (data !== undefined) {
  //                   if (data.success) {
  //                     const mappedArray = Object.entries(
  //                       data.data.bugReportsStatistics
  //                     ).map(([key, value]) => {
  //                       // Remove "total" from the key and replace "Count" with "Tickets"
  //                       const formattedKey = key
  //                         .replace("total", "")
  //                         .replace("Count", " Tickets");
  //                       return { key: [formattedKey], value: value };
  //                     });
  //                     // console.log(mappedArray);
  //                     dispatch(setSupportStatistics(mappedArray));
  //                   }
  //                 }
  //               }
  //             );
  //           }
  //         }
  //       });
  //     } catch (error: any) {
  //       // Handle error (e.g., show an error message)
  //       // console.error("Error creating post:", error);
  //       setSelectedFiles([]);
  //       setSelectedImages([]);
  //       setLoading(false);
  //       setAddModal(false);
  //       reset({
  //         name: "",
  //         description: "",
  //       });
  //       dispatch(setPriorityStatus(null));
  //     }
  //   } else {
  //     Swal.fire({
  //       text: "Please Select all the fields",
  //       icon: "info",
  //       timer: 2000,
  //       showCancelButton: false,
  //       showConfirmButton: true,
  //     });
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="text-end">
      <button
        className={`btn ${
          userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
        }`}
        style={{
          color: "white",
          backgroundColor: `${
            userPersonalizationData !== null &&
            userPersonalizationData?.buttonsAndBarsColor
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
        <span style={{ fontSize: "0.8em" }}>Create New</span>
      </button>

      <DeviceSelecetdForNewComplain
        addModal={isUpdateModalOpenForDeviceSelecetdForNewComplain}
        setAddModal={setIsUpdateModalOpenForDeviceSelecetdForNewComplain}
        dropDownDevices={devices}
        prevItem=""
        serverID={serverID}
      />
    </div>
  );
};

export default CreateNewComplain;
