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
import { create, getAll } from "../../../../../../Utilities/api";
import { serverCredentials } from "../../../../../../Utilities/headers/header";
import {
  CONTROLROOM_DASHBOARD_STATISTICS,
  GET_ALL_COMMANDED_DEVICES,
  GET_ALL_KILLED_DEVICES,
  GET_DEVICE_COMMANDS,
  SEND_COMMAND_TO_DEVICE,
  VERIFY_VEHICLE_BLOCK_STATUS,
} from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices: any;
  prevItem: any;
  fromDate: any;
  toDate: any;
}

const SendCommand: React.FC<PropsTypes> = ({
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
      setType("");
    }
  };
  const [selectedItems, setSelectedItems]: any = useState([]);
  const [commandedVehicleDeviceId, setcommandedVehicleDeviceId] = useState("");

  const [commandsType, setCommandsType] = useState([]);

  const [type, setType] = useState("");
  const [singleCommandData, setSingleCommandData] = useState({});

  const tempCommandsTypeList: any = [];
  useEffect(() => {
    sendCommandsType.map((item: any, index: any) => {
      tempCommandsTypeList.push({
        value: `${item.type}`,
        label: `${item.title}`,
        type: `${item.type}`,
        title: `${item.title}`,
        attributes: `${JSON.stringify(item.attributes)}`,
      });
    });
    setCommandsType(tempCommandsTypeList);
  }, [sendCommandsType]);

  useEffect(() => {
    const serverInfo = serverCredentials(selectedItems[0]?.server?._id);
    if (selectedItems?.length !== 0) {
      create(
        {
          deviceId: selectedItems[0].id,
          serverId: serverInfo?.serverId,
          serverHashKey: serverInfo?.serverHashKey,
        },
        { url: GET_DEVICE_COMMANDS }
      ).then((data: any) => {
        // // console.log("api call --- >", data);

        if (data !== undefined) {
          if (data.success) {
            // // console.log("length --- >", data.data);
            dispatch(setSendCommandsType(data.data.deviceCommands));
          }
        }
      });
    }
  }, [selectedItems]);
  useEffect(() => {
    if (prevItem !== "") {
      setSelectedItems([prevItem]);
    }
  }, [prevItem]);

  const [commandID, setCommandID] = useState("");

  const sendCommandHandler: SubmitHandler<SendCommandType> = async (
    data: any
  ) => {
    setLoading(true);
    if (selectedItems.length !== 0 && type !== "") {
      const serverInfo = serverCredentials(selectedItems[0]?.server?._id);
      const commandData = {
        deviceId: selectedItems[0].id,
        serverId: serverInfo?.serverId,
        serverHashKey: serverInfo?.serverHashKey,
        commandType: type,
        commandData: {
          ...singleCommandData,
          messageData: type === "custom" ? data.message : null,
        },
        deviceData: selectedItems[0],
      };
      // // console.log(commandData);

      try {
        await create(commandData, {
          url: SEND_COMMAND_TO_DEVICE,
        }).then(async (data: any) => {
          // console.log("data send command", data);

          setLoading(false);
          if (!data.success && data.message === ERROR_MESSAGE) {
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
            setLoading(false);

            if (data.data.reasons) {
              Swal.fire({
                text: `${data.data.reasons[0]}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              addToggle();
            } else {
              let intervalId: any; // Declare variable to store interval ID
              // // console.log("Setting up interval...");
              intervalId = setTimeout(async () => {
                setcommandedVehicleDeviceId(data.data.commandedDeviceId);

                const serverInfo = serverCredentials(
                  selectedItems[0]?.server?._id
                );
                const verifyData = {
                  deviceId: selectedItems[0].id,
                  serverId: serverInfo?.serverId,
                  serverHashKey: serverInfo?.serverHashKey,
                  commandedVehicleDeviceId: data.data.commandedDeviceId,
                };

                await create(verifyData, {
                  url: VERIFY_VEHICLE_BLOCK_STATUS,
                }).then((data: any) => {
                  // // console.log("data", data);
                  setLoading(false);
                  if (!data.success && data.message === ERROR_MESSAGE) {
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
                    setLoading(false);
                    addToggle();
                  }
                });
              }, 30000);

              Swal.fire({
                text: `${data.message}`,
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });
              getAll({ url: GET_ALL_COMMANDED_DEVICES }).then((data: any) => {
                // // console.log("api call --- >", data);

                if (data !== undefined) {
                  if (data.success) {
                    // // // console.log("length --- >", data.data);
                    dispatch(setSelfSendCommands(data.data));
                  }
                }
              });
              const fromDateUpdated = new Date(fromDate);
              fromDateUpdated.setMinutes(new Date().getMinutes());
              fromDateUpdated.setSeconds(new Date().getSeconds() + 10);
              const toDateUpdated = new Date(toDate);
              toDateUpdated.setMinutes(new Date().getMinutes());
              toDateUpdated.setSeconds(new Date().getSeconds() + 10);

              getAll({
                url: `${CONTROLROOM_DASHBOARD_STATISTICS}?fromDate=${fromDateUpdated}&toDate=${toDateUpdated}`,
              }).then((data: any) => {
                // // console.log("api call --- >", data);

                if (data !== undefined) {
                  if (data.success) {
                    // // // console.log("length --- >", data.data);
                    dispatch(setDashboardStatistics(data.data));
                  }
                }
              });
              getAll({
                url: GET_ALL_KILLED_DEVICES,
              }).then((data: any) => {
                // // console.log("api call --- >", data);

                if (data !== undefined) {
                  if (data.success) {
                    // // console.log("length --- >", data.data);
                    dispatch(setKilledDevices(data.data));
                  }
                }
              });
              addToggle();

              // Cleanup function to clear interval when component unmounts or when loading becomes true
              return () => {
                // // console.log("Clearing interval...");
                clearInterval(intervalId);
              };
            }
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
    <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
      <div className="modal-header">
        <H3 className="modal-title">Send Command</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={addToggle}
        ></Button>
      </div>

      <ModalBody style={{ height: "65vh" }}>
        <form
          className="form-bookmark needs-validation"
          onSubmit={handleSubmit(sendCommandHandler)}
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
                  serverID=""
                />
              )}
            </FormGroup>
            {selectedItems.length !== 0 && (
              <FormGroup className="col-md-12 create-group">
                <div>
                  <Label>Select Command type</Label>
                </div>

                <Select
                  showSearch
                  style={{ width: "100%", height: 36 }}
                  placeholder="Select Command type"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e: any, option: any) => {
                    // // console.log(e);
                    // // console.log(option);
                    setType(e);
                    setSingleCommandData({
                      type: `${option.type}`,
                      title: `${option.title}`,
                      attributes: `${option.attributes}`,
                    });
                  }}
                  options={commandsType}
                />
              </FormGroup>
            )}
            {type === "custom" && (
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
            )}
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
              {loading ? "Loading ..." : `Send`}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SendCommand;
