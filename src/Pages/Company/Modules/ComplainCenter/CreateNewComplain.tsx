import { PlusCircle } from "react-feather";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  PopoverBody,
  PopoverHeader,
  Row,
  UncontrolledPopover,
} from "reactstrap";
import { Cancel } from "../../../../utils/Constant";
import { H3, P } from "../../../../AbstractElements";
import { createCom, getAll } from "../../../../Utilities/api";
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
import { getUserRole } from "../../../../Utilities/globals/globals";
import { ROLES } from "../../../../constants/roles";
import DeviceSelecetdForNewComplain from "./DeviceSelectedForNewComplainModel";
import SelectFilterNRDevicesModal from "./SelectFilterNRDevicesModal";

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
  const [isUpdateModalOpenForNRDevices, setIsUpdateModalOpenForNRDevices] =
    useState(false);
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
    setIsUpdateModalOpenForDeviceSelecetdForNewComplain(true);
  };

  const addToggleForNRDevices = () => {
    setIsUpdateModalOpenForNRDevices(true);
  };

  return (
    <div
      className="text-end"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div id="sendButtonWaitForDevices" style={{ marginRight: "10px" }}>
        <button
          className={`btn ${
            userPersonalizationData?.buttonsAndBarsColor == null
              ? "btn-primary"
              : ""
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
            padding: "5px 5px",
            height: "40px",
            width: "100px",
          }}
          onClick={addToggle}
          disabled={devices.length == 0}
        >
          <div
            style={{
              marginRight: "2.5%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PlusCircle size={18} />
          </div>
          <span style={{ fontSize: "0.8em" }}>Create New</span>
        </button>
      </div>
      <div id="nrButtonWaitForDevices">
        <button
          className={`btn ${
            userPersonalizationData?.buttonsAndBarsColor == null
              ? "btn-primary"
              : ""
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
            padding: "5px 5px",
            height: "40px",
            width: "100px",
          }}
          onClick={addToggleForNRDevices}
          disabled={devices.length == 0}
        >
          <div
            style={{
              marginRight: "2.5%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PlusCircle size={18} />
          </div>
          <span style={{ fontSize: "0.8em" }}>NR Status</span>
        </button>
      </div>

      {devices.length == 0 ? (
        <UncontrolledPopover
          placement="top"
          trigger="hover"
          target="sendButtonWaitForDevices"
        >
          <PopoverHeader>Reason</PopoverHeader>
          <PopoverBody>
            Please wait a while because devices are loading in background
          </PopoverBody>
        </UncontrolledPopover>
      ) : (
        <></>
      )}

      {devices.length == 0 ? (
        <UncontrolledPopover
          placement="top"
          trigger="hover"
          target="nrButtonWaitForDevices"
        >
          <PopoverHeader>Reason</PopoverHeader>
          <PopoverBody>
            Please wait a while because devices are loading in background
          </PopoverBody>
        </UncontrolledPopover>
      ) : (
        <></>
      )}
      <DeviceSelecetdForNewComplain
        addModal={isUpdateModalOpenForDeviceSelecetdForNewComplain}
        setAddModal={setIsUpdateModalOpenForDeviceSelecetdForNewComplain}
        dropDownDevices={devices}
        prevItem=""
        serverID={serverID}
      />

      {
        <SelectFilterNRDevicesModal
          addModal={isUpdateModalOpenForNRDevices}
          setAddModal={setIsUpdateModalOpenForNRDevices}
          selectedDevices={devices}
          prevItem=""
          serverID={serverID}
        />
      }
    </div>
  );
};

export default CreateNewComplain;
