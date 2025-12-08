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
  setDeviceSelecetdAlerts,
  setKilledDevices,
  setSelfSendCommands,
  setSendCommandsType,
} from "../../../../../../ReaduxToolkit/Reducer/AlertsSlice";
import { create, getAll } from "../../../../../../Utilities/api";
import { serverCredentials } from "../../../../../../Utilities/headers/header";
import TotalAlertsForSpecificDevices from "./TotalAlertsForSpecificDevices";
import { GET_ALL_MERGED_ALERT_EVENTS } from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

interface PropsTypes {
  addModal: boolean; // Change 'boolean' to the actual type of isVisible
  setAddModal: any;
  dropDownDevices: any;
  prevItem: any;
  serverID: any;
}

const DeviceSelecetdForAlerts: React.FC<PropsTypes> = ({
  addModal,
  setAddModal = () => {},
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
  const [
    isUpdateModalOpenForSelecteddeviceAlerts,
    setIsUpdateModalOpenForSelecteddeviceAlerts,
  ] = useState(false);

  const deviceAlerts: SubmitHandler<SendCommandType> = async (data: any) => {
    setLoading(true);
    if (selectedItems.length !== 0) {
      const serverInfo = serverCredentials(selectedItems[0]?.server?._id);
      const deviceData = {
        deviceId: selectedItems[0].id,
        serverId: serverInfo?.serverId,
        serverHashKey: serverInfo?.serverHashKey,
      };

      try {
        await create(deviceData, {
          url: GET_ALL_MERGED_ALERT_EVENTS,
        }).then(async (data: any) => {
          setIsUpdateModalOpenForSelecteddeviceAlerts(true);
          // console.log("data send command", data);
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
            if (data.data) {
              console.log("Called in IF");

              dispatch(setDeviceSelecetdAlerts(data.data));
            } else {
              console.log("Called in Else");
              dispatch(setDeviceSelecetdAlerts([]));
            }

            // addToggle();
            setLoading(false);
          }
        });
      } catch (error: any) {
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
          onSubmit={handleSubmit(deviceAlerts)}
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
              // onClick={() => {
              // setIsUpdateModalOpenForSelecteddeviceAlerts(true);
              // }}
            >
              {loading ? "Loading ..." : `Open`}
            </Button>
          </div>
        </form>
      </ModalBody>
      {isUpdateModalOpenForSelecteddeviceAlerts && (
        <TotalAlertsForSpecificDevices
          isVisible={isUpdateModalOpenForSelecteddeviceAlerts}
          setIsVisible={setIsUpdateModalOpenForSelecteddeviceAlerts}
        />
      )}
    </Modal>
  );
};

export default DeviceSelecetdForAlerts;
