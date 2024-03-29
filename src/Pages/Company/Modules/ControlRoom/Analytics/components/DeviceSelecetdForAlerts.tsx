import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { Select } from "antd";
import Swal from "sweetalert2";
import { SendCommandType } from "./Type/SendCommandType";
import { H3 } from "../../../../../../AbstractElements";
import DevicesDropdown from "./DevicesDropdown/DevicesDropdown";
import {
  setDashboardStatistics,
  setKilledDevices,
  setSelfSendCommands,
  setSendCommandsType,
} from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import { create, getAll } from "../../../../../../Api";
import { serverCredentials } from "../../../../../../Api/header";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices: any;
  prevItem: any;
  fromDate: any;
  toDate: any;
}

const DeviceSelecetdForAlerts: React.FC<PropsTypes> = ({
  addModal,
  setAddModal = () => {},
  dropDownDevices,
  prevItem,
  fromDate,
  toDate,
}) => {
  // // // console.log("Previtem", prevItem);

  const { sendCommandsType } = useSelector((state: any) => state.alerts);

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
      });
      setLoading(false);
      if (prevItem === "") {
        setSelectedItems([]);
      }
    }
  };
  const [selectedItems, setSelectedItems]: any = useState([]);

  //   const sendCommandHandler: SubmitHandler<SendCommandType> = async (
  //     data: any
  //   ) => {
  //     setLoading(true);
  //     if (selectedItems.length !== 0 ) {
  //       const serverInfo = serverCredentials(selectedItems[0]?.server?._id);
  //       const commandData = {
  //         deviceId: selectedItems[0].id,
  //         serverId: serverInfo?.serverId,
  //         serverHashKey: serverInfo?.serverHashKey,
  //         deviceData: selectedItems[0],
  //       };
  //       // // console.log(commandData);

  //       try {
  //         await create(commandData, {
  //           url: `control-room/send-command-to-device`,
  //         }).then(async (data: any) => {
  //           // console.log("data send command", data);

  //           setLoading(false);
  //           if (!data.success && data.message === "ERROR_INTERNET_DISCONNECTED") {
  //             setLoading(false);
  //             addToggle();
  //           }
  //           if (!data.success) {
  //             Swal.fire({
  //               text: `${data.message}`,
  //               icon: "error",
  //               timer: 2000,
  //               showConfirmButton: false,
  //             });
  //             setLoading(false);
  //             addToggle();
  //           }
  //           if (data.success) {
  //             // // console.log(data);
  //             setLoading(false);

  //             if (data.data.reasons) {
  //               Swal.fire({
  //                 text: `${data.data.reasons[0]}`,
  //                 icon: "error",
  //                 timer: 2000,
  //                 showConfirmButton: false,
  //               });
  //               addToggle();
  //             } else {
  //               let intervalId: any; // Declare variable to store interval ID
  //               // // console.log("Setting up interval...");
  //               intervalId = setTimeout(async () => {
  //                 setcommandedVehicleDeviceId(data.data.commandedDeviceId);

  //                 const serverInfo = serverCredentials(
  //                   selectedItems[0]?.server?._id
  //                 );
  //                 const verifyData = {
  //                   deviceId: selectedItems[0].id,
  //                   serverId: serverInfo?.serverId,
  //                   serverHashKey: serverInfo?.serverHashKey,
  //                   commandedVehicleDeviceId: data.data.commandedDeviceId,
  //                 };

  //                 await create(verifyData, {
  //                   url: `control-room/verify-vehicle-block-status`,
  //                 }).then((data: any) => {
  //                   // // console.log("data", data);
  //                   setLoading(false);
  //                   if (
  //                     !data.success &&
  //                     data.message === "ERROR_INTERNET_DISCONNECTED"
  //                   ) {
  //                     setLoading(false);
  //                     addToggle();
  //                   }
  //                   if (!data.success) {
  //                     Swal.fire({
  //                       text: `${data.message}`,
  //                       icon: "error",
  //                       timer: 2000,
  //                       showConfirmButton: false,
  //                     });
  //                     setLoading(false);
  //                     addToggle();
  //                   }
  //                   if (data.success) {
  //                     // // console.log(data);
  //                     setLoading(false);
  //                     addToggle();
  //                   }
  //                 });
  //               }, 30000);

  //               Swal.fire({
  //                 text: `${data.message}`,
  //                 icon: "success",
  //                 timer: 1000,
  //                 showConfirmButton: false,
  //               });
  //               getAll({ url: "control-room/get-all-commanded-devices" }).then(
  //                 (data: any) => {
  //                   // // console.log("api call --- >", data);

  //                   if (data !== undefined) {
  //                     if (data.success) {
  //                       // // // console.log("length --- >", data.data);
  //                       dispatch(setSelfSendCommands(data.data));
  //                     }
  //                   }
  //                 }
  //               );
  //               const fromDateUpdated = new Date(fromDate);
  //               fromDateUpdated.setMinutes(new Date().getMinutes());
  //               fromDateUpdated.setSeconds(new Date().getSeconds() + 10);
  //               const toDateUpdated = new Date(toDate);
  //               toDateUpdated.setMinutes(new Date().getMinutes());
  //               toDateUpdated.setSeconds(new Date().getSeconds() + 10);

  //               getAll({
  //                 url: `control-room/dashboard/statistics?fromDate=${fromDateUpdated}&toDate=${toDateUpdated}`,
  //               }).then((data: any) => {
  //                 // // console.log("api call --- >", data);

  //                 if (data !== undefined) {
  //                   if (data.success) {
  //                     // // // console.log("length --- >", data.data);
  //                     dispatch(setDashboardStatistics(data.data));
  //                   }
  //                 }
  //               });
  //               getAll({
  //                 url: "control-room/get-all-killed-devices?type=self",
  //               }).then((data: any) => {
  //                 // // console.log("api call --- >", data);

  //                 if (data !== undefined) {
  //                   if (data.success) {
  //                     // // console.log("length --- >", data.data);
  //                     dispatch(setKilledDevices(data.data));
  //                   }
  //                 }
  //               });
  //               addToggle();

  //               // Cleanup function to clear interval when component unmounts or when loading becomes true
  //               return () => {
  //                 // // console.log("Clearing interval...");
  //                 clearInterval(intervalId);
  //               };
  //             }
  //           }
  //         });
  //         // Handle successful post creation (e.g., show a success message, redirect, etc.)
  //       } catch (error: any) {
  //         // Handle error (e.g., show an error message)
  //         // // console.error("Error creating post:", error);

  //         setLoading(false);
  //         addToggle();
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
    <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
      <div className="modal-header">
        <H3 className="modal-title">Select Device For Alert Data</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>

      <ModalBody style={{ height: "50vh" }}>
        <form
          className="form-bookmark needs-validation"
          //   onSubmit={handleSubmit(sendCommandHandler)}
        >
          <Row>
            <FormGroup className="col-md-12 create-group">
              <div>
                <Label>Devices</Label>
              </div>
              {selectedItems.length > 0 && prevItem !== "" && (
                <input
                  className="form-control"
                  type="text"
                  value={selectedItems[0].name}
                  defaultValue={selectedItems[0].name}
                />
              )}
              {prevItem === "" && (
                <DevicesDropdown
                  data={dropDownDevices}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              )}
            </FormGroup>
          </Row>
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "flex-end",
              padding: "20px",
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
              {loading ? "Loading ..." : `Open`}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default DeviceSelecetdForAlerts;
