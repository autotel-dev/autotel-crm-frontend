import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import "../AnalyticsCss.css";
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { Select, Tabs, Table } from "antd";
import Swal from "sweetalert2";
import { SendCommandType } from "./Type/SendCommandType";
import { H3 } from "../../../../../../AbstractElements";
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
  VERIFY_VEHICLE_BLOCK_STATUS,
  GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT,
  GET_COMMAND_TYPES,
  SEND_GPRS_COMMAND,
} from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices?: any;
  prevItem: any;
  fromDate?: any;
  toDate?: any;
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
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("GPRS");
  const [scheduleConnectionType, setScheduleConnectionType] = useState("GPRS");
  const [scheduleVehicle, setScheduleVehicle] = useState<any>(null);
  const [scheduleCommand, setScheduleCommand] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleList, setScheduleList] = useState<any[]>([
    {
      key: "1",
      connection: "GPRS",
      command: "Check Status",
      parameters: "None",
      scheduleAt: "2024-04-27 10:00",
      type: "Daily",
    },
  ]);

  const commonCommands = [
    { label: "Custom", value: "custom" },
    { label: "Kill Engine", value: "engineStop" },
    { label: "Resume Engine", value: "engineResume" },
    { label: "Check Status", value: "checkStatus" },
  ];

  const scheduleFrequencies = [
    { label: "Hourly", value: "hourly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  useEffect(() => {
    if (addModal) {
      getAll({ url: GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT }).then((data: any) => {
        if (data?.success) {
          setVehiclesList(
            data.data.map((item: any) => ({
              ...item,
              value: item._id,
              label: item.registrationNo,
              id: item.traccarDeviceId || item.deviceId,
              deviceId: item.traccarDeviceId || item.deviceId,
              imei: item.imei || "",
              P: item.registrationNo,
            })),
          );
        }
      });
    }
  }, [addModal]);

  const [commandsType, setCommandsType] = useState([]);

  const [type, setType] = useState("");
  const [singleCommandData, setSingleCommandData] = useState({});

  const tempCommandsTypeList: any = [];
  useEffect(() => {
    sendCommandsType.map((item: any, index: any) => {
      tempCommandsTypeList.push({
        value: `${item.type}`,
        label: `${item.type}`,
        type: `${item.type}`,
        title: `${item.type}`,
        attributes: `${JSON.stringify(item.attributes)}`,
      });
    });
    setCommandsType(tempCommandsTypeList);
  }, [sendCommandsType]);

  useEffect(() => {
    if (selectedItems?.length !== 0) {
      getAll({
        url: `${GET_COMMAND_TYPES}/${selectedItems[0].id}`,
      }).then((data: any) => {
        if (data !== undefined) {
          if (data.success) {
            dispatch(setSendCommandsType(data.data));
          }
        }
      });
    }
  }, [selectedItems]);
  useEffect(() => {
    setType("");
    reset({ message: "" });
  }, [activeTab, reset]);

  useEffect(() => {
    if (prevItem !== "") {
      setSelectedItems([prevItem]);
    }
  }, [prevItem]);

  const [commandID, setCommandID] = useState("");

  const sendCommandHandler: SubmitHandler<SendCommandType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (activeTab === "Schedule") {
      if (!scheduleVehicle || !scheduleCommand || !scheduleTime) {
        Swal.fire({
          text: "Required Schedule Fields are empty",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        return;
      }
      const newSchedule = {
        key: (scheduleList.length + 1).toString(),
        connection: scheduleConnectionType,
        command:
          commonCommands.find((c) => c.value === scheduleCommand)?.label ||
          scheduleCommand,
        parameters: data.message || "None",
        scheduleAt: new Date().toLocaleString(), // Mock next execution time
        type:
          scheduleFrequencies.find((f) => f.value === scheduleTime)?.label ||
          scheduleTime,
      };
      setScheduleList([...scheduleList, newSchedule]);
      Swal.fire({
        text: "Schedule added successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    if (selectedItems.length !== 0 && type !== "") {
      const commandData = {
        vehicleId: selectedItems[0]._id || selectedItems[0].value,
        commandType: type,
        customData: type === "custom" ? data.customData : undefined,
        description: data.description || "Sent from Control Room",
      };

      try {
        await create(commandData, {
          url: SEND_GPRS_COMMAND,
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
              if (fromDate && toDate) {
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
              }
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
    <Modal isOpen={addModal} toggle={addToggle} size="lg" centered scrollable>
      <ModalHeader toggle={addToggle}>Send Command</ModalHeader>
      <form
        className="form-bookmark needs-validation"
        onSubmit={handleSubmit(sendCommandHandler)}
      >
        <ModalBody>
          <Tabs
            className="custom-command-tabs"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "GPRS",
                label: "GPRS",
                children: (
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
                          readOnly
                        />
                      )}
                      {prevItem === "" && (
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Select Vehicle"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.P ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={(val) => {
                            const selected = vehiclesList.find(
                              (v) => v.value === val,
                            );
                            if (selected && !selected.server) {
                              const flattened = (dropDownDevices || []).flatMap(
                                (g: any) => g.items || [],
                              );
                              const matched = flattened.find(
                                (d: any) =>
                                  d._id === selected._id ||
                                  d.id === selected.id,
                              );
                              if (matched) {
                                selected.server = matched.server;
                              }
                            }
                            setSelectedItems(selected ? [selected] : []);
                          }}
                          options={vehiclesList}
                          value={
                            selectedItems[0]?.value ||
                            selectedItems[0]?._id ||
                            null
                          }
                        />
                      )}
                    </FormGroup>
                    <FormGroup className="col-md-12 create-group">
                      <div>
                        <Label>Select Command</Label>
                      </div>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Command"
                        optionFilterProp="children"
                        onChange={(e: any) => {
                          setType(e);
                          const cmd = commonCommands.find((c) => c.value === e);
                          setSingleCommandData({
                            type: e,
                            title: cmd?.label,
                            attributes: "{}",
                          });
                        }}
                        options={commandsType}
                        value={type || null}
                      />
                    </FormGroup>
                    {type === "custom" && (
                      <FormGroup className="col-md-12 create-group">
                        <Label>Custom Data</Label>
                        <textarea
                          className="form-control"
                          rows={2}
                          style={{
                            maxHeight: "70px",
                            resize: "vertical",
                          }}
                          {...register("customData", {
                            required: type === "custom",
                          })}
                        />
                        <span style={{ color: "red" }}>
                          {errors.customData && "Custom Data is required"}
                        </span>
                      </FormGroup>
                    )}
                    {type !== "" && (
                      <FormGroup className="col-md-12 create-group">
                        <Label>Description</Label>
                        <textarea
                          className="form-control"
                          rows={2}
                          style={{
                            maxHeight: "70px",
                            resize: "vertical",
                          }}
                          {...register("description")}
                        />
                      </FormGroup>
                    )}
                  </Row>
                ),
              },
              {
                key: "SMS",
                label: "SMS",
                children: (
                  <Row>
                    <FormGroup className="col-md-12 create-group">
                      <div>
                        <Label>Devices</Label>
                      </div>
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Vehicle"
                        optionFilterProp="children"
                        onChange={(val) => {
                          const selected = vehiclesList.find(
                            (v) => v.value === val,
                          );
                          setSelectedItems(selected ? [selected] : []);
                        }}
                        options={vehiclesList}
                        value={
                          selectedItems[0]?.value ||
                          selectedItems[0]?._id ||
                          null
                        }
                      />
                    </FormGroup>
                    <FormGroup className="col-md-12 create-group">
                      <div>
                        <Label>Select Command</Label>
                      </div>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Command"
                        optionFilterProp="children"
                        onChange={(e: any) => {
                          setType(e);
                          const cmd = commonCommands.find((c) => c.value === e);
                          setSingleCommandData({
                            type: e,
                            title: cmd?.label,
                            attributes: "{}",
                          });
                        }}
                        options={commandsType}
                        value={type || null}
                      />
                    </FormGroup>
                    {type === "custom" && (
                      <FormGroup className="col-md-12 create-group">
                        <Label>Custom Data</Label>
                        <textarea
                          className="form-control"
                          rows={2}
                          style={{
                            maxHeight: "70px",
                            resize: "vertical",
                          }}
                          {...register("customData", {
                            required: type === "custom",
                          })}
                        />
                        <span style={{ color: "red" }}>
                          {errors.customData && "Custom Data is required"}
                        </span>
                      </FormGroup>
                    )}
                    {type !== "" && (
                      <FormGroup className="col-md-12 create-group">
                        <Label>Description</Label>
                        <textarea
                          className="form-control"
                          rows={2}
                          style={{
                            maxHeight: "70px",
                            resize: "vertical",
                          }}
                          {...register("description")}
                        />
                      </FormGroup>
                    )}
                  </Row>
                ),
              },
              {
                key: "Schedule",
                label: "Schedule",
                children: (
                  <div>
                    <Table
                      columns={[
                        {
                          title: "Connection",
                          dataIndex: "connection",
                          key: "connection",
                          align: "left",
                        },
                        {
                          title: "Command",
                          dataIndex: "command",
                          key: "command",
                          align: "left",
                        },
                        {
                          title: "Parameters",
                          dataIndex: "parameters",
                          key: "parameters",
                          align: "left",
                        },
                        {
                          title: "Schedule at",
                          dataIndex: "scheduleAt",
                          key: "scheduleAt",
                          align: "left",
                        },
                        {
                          title: "Type",
                          dataIndex: "type",
                          key: "type",
                          align: "left",
                        },
                      ]}
                      dataSource={scheduleList}
                      pagination={false}
                      size="small"
                      scroll={{ y: 200, x: "max-content" }}
                    />
                    <hr />
                    <Row>
                      <FormGroup className="col-md-6 create-group">
                        <Label>Type</Label>
                        <Select
                          style={{ width: "100%" }}
                          value={scheduleConnectionType}
                          onChange={setScheduleConnectionType}
                          options={[
                            { label: "GPRS", value: "GPRS" },
                            { label: "SMS", value: "SMS" },
                          ]}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-6 create-group">
                        <Label>Vehicle</Label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Select Vehicle"
                          value={scheduleVehicle}
                          onChange={setScheduleVehicle}
                          options={vehiclesList}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-6 create-group">
                        <Label>Command</Label>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select Command"
                          value={scheduleCommand}
                          onChange={setScheduleCommand}
                          options={commonCommands}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-6 create-group">
                        <Label>Time</Label>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select Time"
                          value={scheduleTime}
                          onChange={setScheduleTime}
                          options={scheduleFrequencies}
                        />
                      </FormGroup>
                    </Row>
                  </div>
                ),
              },
            ]}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={loading ? true : false}
            color="secondary"
            onClick={addToggle}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {loading
              ? "Loading ..."
              : activeTab === "Schedule"
                ? "Save"
                : "Send"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default SendCommand;
