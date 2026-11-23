import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { Select } from "antd";
import Swal from "sweetalert2";
import { H3 } from "../../../../AbstractElements";

import { SendCommandType } from "../ControlRoom/Analytics/components/Type/SendCommandType";
import DevicesDropdown from "../ControlRoom/Analytics/components/DevicesDropdown/DevicesDropdown";
import CreateComplainModal from "./CreateComplainModal";
import { serverCredentials } from "../../../../Utilities/headers/header";
import { create } from "../../../../Utilities/api";
import { setCreateComplainModalData } from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";
import { GET_DEVICE_DATA } from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";
// import TotalAlertsForSpecificDevices from "./TotalAlertsForSpecificDevices";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices: any;
  prevItem: any;
  serverID: any;
}

const DeviceSelecetdForNewComplain: React.FC<PropsTypes> = ({
  addModal,
  setAddModal = () => { },
  dropDownDevices,
  prevItem,
  serverID,
}) => {
  // console.log("serverID", serverID);

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [basicTab, setBasicTab] = useState("1");
  const { createComplainModalData } = useSelector((state: any) => state.complainCenter);

  useEffect(() => {
    if (addModal == false) {
      setSelectedItems([]);
    }

  }, [addModal])

  return (
    <Modal isOpen={addModal} toggle={addToggle} size="md" centered className="at-modal">
      <div className="modal-header">
        <H3 className="modal-title">Select Device For Complain</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>

      <ModalBody style={{ height: "min(50vh, 360px)", minHeight: 300 }}>
        <form
          className="form-bookmark needs-validation"
        //   onSubmit={handleSubmit(deviceAlerts)}
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
                  serverID={serverID}
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
            <Button
              color="primary"
              className="me-1"
              type="submit"
              disabled={selectedItems.length == 0}
              onClick={async (e) => {
                e.preventDefault();
                setBasicTab("1");

                setIsUpdateModalOpen(true);

                const serverInfo = serverCredentials(selectedItems[0].server._id);

                const sendData = {
                  serverId: serverInfo?.serverId,
                  serverHashKey: serverInfo?.serverHashKey,
                  deviceId: selectedItems[0].id,
                };

                try {
                  await create(sendData, {
                    url: GET_DEVICE_DATA,
                  }).then((data: any) => {

                    if (
                      !data.success &&
                      data.message === ERROR_MESSAGE
                    ) {
                    }
                    if (!data.success) {
                      Swal.fire({
                        text: `${data.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      setIsUpdateModalOpen(false);
                    }
                    if (data.success) {
                      dispatch(setCreateComplainModalData(data.data));
                      // console.log("createComplainModalData", createComplainModalData);


                    }
                  });
                  // Handle successful post creation (e.g., show a success message, redirect, etc.)
                } catch (error: any) {
                  // Handle error (e.g., show an error message)
                  dispatch(setCreateComplainModalData(undefined));
                }

              }}
            >
              {loading ? "Loading ..." : `Open`}
            </Button>
          </div>
        </form>
      </ModalBody>
      {isUpdateModalOpen && (
        <CreateComplainModal
          isVisible={isUpdateModalOpen}
          setIsVisible={setIsUpdateModalOpen}
          isDeviceSelectedModalVisible={addModal}
          setIsDeviceSelectedModalVisible={setAddModal}
          selectedItems={selectedItems}
          tab={basicTab}
        />
      )}
    </Modal>
  );
};

export default DeviceSelecetdForNewComplain;














//   const deviceAlerts: SubmitHandler<SendCommandType> = async (data: any) => {
//     setLoading(true);
//     if (selectedItems.length !== 0) {
//       const serverInfo = serverCredentials(selectedItems[0]?.server?._id);
//       const deviceData = {
//         deviceId: selectedItems[0].id,
//         serverId: serverInfo?.serverId,
//         serverHashKey: serverInfo?.serverHashKey,
//       };

//       try {
//         await create(deviceData, {
//           url: GET_ALL_MERGED_ALERT_EVENTS,
//         }).then(async (data: any) => {
//           setIsUpdateModalOpenForSelecteddeviceAlerts(true);
//           // console.log("data send command", data);
//           if (!data.success && data.message === ERROR_MESSAGE) {
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
//             if (data.data) {
//               console.log("Called in IF");

//               dispatch(setDeviceSelecetdAlerts(data.data));
//             } else {
//               console.log("Called in Else");
//               dispatch(setDeviceSelecetdAlerts([]));
//             }

//             // addToggle();
//             setLoading(false);
//           }
//         });
//       } catch (error: any) {
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
