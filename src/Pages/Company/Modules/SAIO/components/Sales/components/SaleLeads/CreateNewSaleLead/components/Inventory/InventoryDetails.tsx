import { ChangeEvent, useEffect, useState } from "react";
import ShowError from "../../ShowError";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { H4, P } from "../../../../../../../../../../../AbstractElements";
import { BusinessFormCommonProps } from "../../../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import SelectDeviceIMEIBox from "./components/SelectDeviceIMEIBox";
import SelectSimNoBox from "./components/SelectSimNoBox";
import SelectInstallerBox from "./components/SelectInstallerBox";
import SelectSensorsBox from "./components/SelectSensorsBox";
import SelectProductModel from "./components/SelectProductModel";
import {
  setCustomer,
  setSaleLead,
  setSaleLeadId,
  setSaleLeads,
} from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { MdDelete } from "react-icons/md";
import {
  create,
  getAll,
  patch,
} from "../../../../../../../../../../../Utilities/api";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import Swal from "sweetalert2";
import {
  ATTACH_INVENTORY_TO_VEHICLE,
  GET_ALL_SALELEADS,
  GET_SINGLE_SALELEAD,
} from "../../../../../../../../../../../Utilities/api/apiEndpoints";

const InventoryDetails = ({
  onRemove,
  index,
  inventoryData,
  onChange,
  callbackActive,
}: any) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { saleLead } = useSelector((state: any) => state.sales);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(inventoryData);
  const [deviceProduct, setDeviceProduct]: any = useState(null);
  // console.log("deviceProduct", deviceProduct);

  const [simProduct, setSimProduct] = useState([]);
  const [sensorProduct, setSensorProduct] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isAddedInventory, setIsAddedInventory] = useState(
    inventoryData?.inventory?.length > 0
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(inventoryData);
    if (inventoryData.deviceIMEI !== "") {
      // console.log("check", inventoryData);
      // setDeviceProduct({
      //     deviceIMEI: inventoryData?.deviceIMEI,
      //     deviceType: inventoryData?.deviceType,
      //     deviceID: inventoryData?.deviceID,
      //     deviceId: inventoryData?.deviceId
      // })
    }
  }, [inventoryData]);

  const handleSelectChange = (
    name: string,
    value: any,
    secondField?: string,
    secondValue?: any,
    thirdField?: string,
    thirdValue?: any,
    fourthField?: string,
    fourthValue?: any
  ) => {
    const updatedFormData = { ...formData, [name]: value };
    if (secondField) updatedFormData[secondField] = secondValue;
    if (thirdField) updatedFormData[thirdField] = thirdValue;
    if (fourthField) updatedFormData[fourthField] = fourthValue;
    setFormData(updatedFormData);
    onChange(index, updatedFormData);
    // console.log("FormData", formData);
  };

  useEffect(() => {
    if (
      saleLead?.vehicles.find(
        (item: any) => item?._id == inventoryData.vehicleId
      )?.inventory?.length > 0
    ) {
      setIsAddedInventory(true);
    }
  }, [saleLead]);

  const addInventoryToAVehicle = async () => {
    setLoading(true);
    if (formData.devices.length > 0 && formData.sims.length > 0) {
      const body = {
        // inventoryItems: [formData.deviceId, ...formData.sims.map((item: any) => item.id), ...formData.sensors.map((item: any) => item.id), ...formData.accessories.map((item: any) => item.id)],
        inventoryItems: [
          ...formData.devices.map((item: any) => item.id),
          ...formData.sims.map((item: any) => item.id),
          ...formData.sensors.map((item: any) => item.id),
          ...formData.accessories.map((item: any) => item.id),
        ],
        imei: formData.devices[0].imeiNumber,
        saleLeadId: saleLead?._id,
      };
      // console.log("body", body);

      try {
        await patch(body, {
          url: `${ATTACH_INVENTORY_TO_VEHICLE}/${formData.vehicleId}`,
        }).then((data: any) => {
          if (data !== undefined) {
            if (!data.success && data.message === ERROR_MESSAGE) {
              setLoading(false);
              // console.log("data.message", data.message);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
            }
            if (data.success) {
              // getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
              //     if (data !== undefined) {
              //         if (!data.success) {
              //             // setIscreateNewSaleLead(false)
              //         }
              //         if (data.success) {
              //             // setLoading(false);
              //             dispatch(setSaleLeads(data.data));

              //         }
              //     }
              // });
              getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead?._id}` }).then(
                (data: any) => {
                  if (data !== undefined) {
                    if (!data.success) {
                      setLoading(false);
                    }
                    if (data.success) {
                      setLoading(false);
                      dispatch(setSaleLead(data.data));
                      if (
                        data.data.vehicles.every(
                          (item: any) =>
                            item.installationStatus == "INSTALLATION"
                        )
                      ) {
                        // setIscreateNewSaleLead(false)
                        callbackActive(5);
                        // dispatch(setSaleLead(null));
                      } else {
                        setIsAddedInventory(true);
                      }
                    }
                  }
                }
              );
              setIsAddedInventory(true);
            }
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
      }
    } else {
      ShowError();
      setLoading(false);
    }
  };

  const removeInventoryToAVehicle = async () => {
    Swal.fire({
      title: "Remove Inventory",
      text: "Are you sure You want to remove the inventory",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: `Removing...`,
          icon: "info",
          showConfirmButton: false,
        });
        try {
          const body = {
            inventoryItems: [],
            imei: "",
            saleLeadId: saleLead?._id,
          };
          await patch(body, {
            url: `${ATTACH_INVENTORY_TO_VEHICLE}/${formData.vehicleId}`,
          }).then((data: any) => {
            if (data !== undefined) {
              if (!data.success && data.message === ERROR_MESSAGE) {
                setLoading(false);
                // console.log("data.message", data.message);
              }
              if (!data.success) {
                Swal.fire({
                  text: `${data.message}`,
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                });
                setLoading(false);
              }
              if (data.success) {
                Swal.fire({
                  text: `Inventory has been Removed`,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1000,
                });
                // getAll({ url: GET_ALL_SALELEADS }).then((data: any) => {
                //     if (data !== undefined) {
                //         if (!data.success) {
                //             // setIscreateNewSaleLead(false)
                //         }
                //         if (data.success) {
                //             // setLoading(false);
                //             dispatch(setSaleLeads(data.data));

                //         }
                //     }
                // });
                getAll({ url: `${GET_SINGLE_SALELEAD}/${saleLead?._id}` }).then(
                  (data: any) => {
                    if (data !== undefined) {
                      if (data.success) {
                        dispatch(setSaleLead(data.data));
                        setLoading(false);
                      }
                    }
                  }
                );
              }
            }
          });
          // Handle successful post creation (e.g., show a success message, redirect, etc.)
        } catch (error: any) {
          // Handle error (e.g., show an error message)
          // console.error("Error creating post:", error);
          setLoading(false);
        }
      }
    });
  };

  const handleAddDevices = (device: any) => {
    const updatedDevices = [...formData.devices, device];
    handleSelectChange("devices", updatedDevices);
  };

  const handleRemoveDevice = (simIndex: number) => {
    const updatedDevices = formData.devices.filter(
      (_: any, i: number) => i !== simIndex
    );
    handleSelectChange("devices", updatedDevices);
  };

  const handleAddSim = (sim: any) => {
    const updatedSims = [...formData.sims, sim];
    handleSelectChange("sims", updatedSims);
  };

  const handleRemoveSim = (simIndex: number) => {
    const updatedSims = formData.sims.filter(
      (_: any, i: number) => i !== simIndex
    );
    handleSelectChange("sims", updatedSims);
  };

  const handleAddSensor = (sensor: any) => {
    const updatedSensors = [...formData.sensors, sensor];
    handleSelectChange("sensors", updatedSensors);
  };

  const handleRemoveSensor = (sensorIndex: number) => {
    const updatedSensors = formData.sensors.filter(
      (_: any, i: number) => i !== sensorIndex
    );
    handleSelectChange("sensors", updatedSensors);
  };

  const handleAddAccessory = (accessory: any) => {
    const updatedAccessories = [...formData.accessories, accessory];
    handleSelectChange("accessories", updatedAccessories);
  };

  const handleRemoveAccessory = (accessoryIndex: number) => {
    const updatedAccessories = formData.accessories.filter(
      (_: any, i: number) => i !== accessoryIndex
    );
    handleSelectChange("accessories", updatedAccessories);
  };

  // Add handlers for adding SIMs, sensors, and accessories
  const handleAddSimFromModal = (sim: any) => {
    handleAddSim(sim);
  };

  const handleAddDevicesFromModal = (device: any) => {
    handleAddDevices(device);
  };

  const handleAddSensorFromModal = (sensor: any) => {
    handleAddSensor(sensor);
  };

  const handleAddAccessoryFromModal = (accessory: any) => {
    handleAddAccessory(accessory);
  };
  useEffect(() => {
    // console.log("deviceProduct", deviceProduct);
  }, [deviceProduct]);

  return (
    <Form
      onSubmit={(event) => event.preventDefault()}
      className="needs-validation"
      noValidate
    >
      <Row className="g-3">
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            gap: "1%",
            alignItems: "end",
          }}
        >
          <Col lg={6} xs={12}>
            <div>
              <P>
                Select Installer
                <span className="txt-danger">*</span>
              </P>
            </div>
            <SelectInstallerBox
              placeholder="Select Installer"
              installer={formData.installer}
              vehicleId={formData.vehicleId}
              isAddedInventory={isAddedInventory}
              setInstaller={(value: any) =>
                handleSelectChange("installer", value)
              }
            />
          </Col>

          {formData.devices.length <= 1 && (
            <Button
              color={
                userPersonalizationData?.buttonsAndBarsColor == "" ||
                userPersonalizationData === null
                  ? "primary"
                  : ""
              }
              style={{
                height: "36px",
                color: "white",
                backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`,
              }}
              disabled={isAddedInventory}
              onClick={() => {
                setModalType("DEVICES");
                setIsModalOpen(!isModalOpen);
              }}
            >
              Add IMEI
            </Button>
          )}

          <Button
            color={
              userPersonalizationData?.buttonsAndBarsColor == "" ||
              userPersonalizationData === null
                ? "primary"
                : ""
            }
            style={{
              height: "36px",
              color: "white",
              backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`,
            }}
            disabled={isAddedInventory}
            onClick={() => {
              setModalType("ACCESSORIES");
              setIsModalOpen(!isModalOpen);
            }}
          >
            Add Accessories
          </Button>
        </div>
      </Row>

      {/* {deviceProduct !== null && <Row className="g-3">
                <Col xl={4} xs={12}>
                    <div>
                        <P>
                            Select Device IMEI
                            <span className="txt-danger">*</span>
                        </P>
                    </div>
                    <SelectDeviceIMEIBox placeholder="Select Device IMEI"
                        deviceIMEI={formData.deviceIMEI}
                        productId={deviceProduct.id}
                        isAddedInventory={isAddedInventory}
                        setDeviceIMEI={(value: any) => handleSelectChange('deviceIMEI', value.serialNumber, 'deviceType', value.productType, 'deviceID', value.sku, "deviceId", value._id,)}
                    />
                </Col>
                <Col xl={4} xs={12}>
                    <P>
                        Device Type
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Device Type"
                        value={formData.deviceType}
                        name="deviceType"
                        disabled
                    />
                </Col>
                <Col xl={4} xs={12}>
                    <P>
                        Device ID
                        <span className="txt-danger">*</span>
                    </P>
                    <Input
                        type="text"
                        placeholder="Enter Device ID"
                        value={formData.deviceID}
                        name="deviceID"
                        disabled
                    />
                </Col>
            </Row>} */}

      <Row className="g-3" style={{ padding: "20px 0px" }}>
        {formData.devices.length > 0 && (
          <>
            <H4>Devices</H4>
            {formData.devices.map((device: any, i: number) => (
              <div style={{ width: "100%", display: "flex" }} key={i}>
                <Row style={{ marginTop: "0px", width: "98%" }}>
                  <Col xl={4} xs={12}>
                    <div>
                      <P>
                        Select Device
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <SelectDeviceIMEIBox
                      placeholder="Select Device"
                      imeiNumber={device.imeiNumber}
                      productId={device.product}
                      isAddedInventory={isAddedInventory}
                      setImeiNumber={(value: any) =>
                        handleSelectChange("devices", [
                          ...formData.devices.slice(0, i),
                          {
                            ...device,
                            imeiNumber: value.serialNumber,
                            deviceId: value.sku,
                            deviceType: value.productType,
                            id: value._id,
                          },
                          ...formData.devices.slice(i + 1),
                        ])
                      }
                    />
                  </Col>
                  <Col xl={4} xs={12}>
                    <P>
                      Device ID
                      <span className="txt-danger">*</span>
                    </P>
                    <Input
                      type="text"
                      placeholder="Enter Device ID"
                      value={device.deviceId}
                      name="deviceID"
                      disabled
                    />
                  </Col>
                  <Col xl={4} xs={12}>
                    <P>Product Type</P>
                    <Input
                      type="text"
                      placeholder="Enter Device Type"
                      value={device.deviceType}
                      name="deviceType"
                      disabled
                      // onChange={(e) => handleSelectChange('sims', [...formData.sims.slice(0, i), { ...sim, network: e.target.value }, ...formData.sims.slice(i + 1)])}
                    />
                  </Col>
                </Row>
                <div
                  style={{
                    width: "2%",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                  }}
                >
                  <MdDelete
                    color="red"
                    size="30px"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveDevice(i)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </Row>

      {formData.devices.length > 0 && formData.sims.length <= 1 && (
        <Row
          className="g-3"
          style={{
            padding: "20px 0px 0px 0px",
          }}
        >
          <Col md="2">
            <Button
              color={
                userPersonalizationData?.buttonsAndBarsColor == "" ||
                userPersonalizationData === null
                  ? "primary"
                  : ""
              }
              style={{
                height: "36px",
                color: "white",
                backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`,
              }}
              disabled={isAddedInventory}
              onClick={() => {
                setModalType("SIM");
                setIsModalOpen(!isModalOpen);
              }}
            >
              Add SIM
            </Button>
          </Col>
        </Row>
      )}

      <Row className="g-3" style={{ padding: "20px 0px" }}>
        {formData.devices.length > 0 && formData.sims.length !== 0 && (
          <>
            <H4>Sims</H4>
            {formData.sims.map((sim: any, i: number) => (
              <div style={{ width: "100%", display: "flex" }} key={i}>
                <Row style={{ marginTop: "0px", width: "98%" }}>
                  <Col xl={4} xs={12}>
                    <div>
                      <P>
                        Select SIM
                        <span className="txt-danger">*</span>
                      </P>
                    </div>
                    <SelectSimNoBox
                      placeholder="Select SIM"
                      simNumber={sim.simNumber}
                      productId={sim.product}
                      isAddedInventory={isAddedInventory}
                      setSimNumber={(value: any) =>
                        handleSelectChange("sims", [
                          ...formData.sims.slice(0, i),
                          {
                            ...sim,
                            simNumber: value.serialNumber,
                            iccid: value.sku,
                            network: value.productType,
                            id: value._id,
                          },
                          ...formData.sims.slice(i + 1),
                        ])
                      }
                    />
                  </Col>
                  <Col xl={4} xs={12}>
                    <P>ICCID</P>
                    <Input
                      type="text"
                      placeholder="Enter ICCID"
                      value={sim.iccid}
                      name="iccid"
                      disabled
                      // onChange={(e) => handleSelectChange('sims', [...formData.sims.slice(0, i), { ...sim, iccid: e.target.value }, ...formData.sims.slice(i + 1)])}
                    />
                  </Col>
                  <Col xl={4} xs={12}>
                    <P>Network</P>
                    <Input
                      type="text"
                      placeholder="Enter Network"
                      value={sim.network}
                      name="network"
                      disabled
                      // onChange={(e) => handleSelectChange('sims', [...formData.sims.slice(0, i), { ...sim, network: e.target.value }, ...formData.sims.slice(i + 1)])}
                    />
                  </Col>
                </Row>
                <div
                  style={{
                    width: "2%",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                  }}
                >
                  <MdDelete
                    color="red"
                    size="30px"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveSim(i)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </Row>

      {formData.devices.length > 0 && formData.sims.length !== 0 && (
        <Row
          className="g-3"
          style={{
            padding: "10px 0px 10px 0px",
          }}
        >
          <Col md="2">
            <Button
              color={
                userPersonalizationData?.buttonsAndBarsColor == "" ||
                userPersonalizationData === null
                  ? "primary"
                  : ""
              }
              style={{
                height: "36px",
                color: "white",
                backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor}`,
              }}
              disabled={isAddedInventory}
              onClick={() => {
                setModalType("SENSORS");
                setIsModalOpen(!isModalOpen);
              }}
            >
              Add Sensors
            </Button>
          </Col>
        </Row>
      )}

      <Row className="g-3" style={{ padding: "20px 0px" }}>
        {formData.devices.length > 0 &&
          formData.sims.length !== 0 &&
          formData.sensors.length !== 0 && (
            <>
              <H4>Sensors</H4>
              {formData.sensors.map((sensor: any, i: number) => (
                <div style={{ width: "100%", display: "flex" }} key={i}>
                  <Row style={{ marginTop: "15px", width: "98%" }}>
                    <Col xl={4} xs={12}>
                      <div>
                        <P>
                          Select Sensor
                          <span className="txt-danger">*</span>
                        </P>
                      </div>
                      <SelectSensorsBox
                        placeholder="Select Sensor"
                        sensor={sensor.serialNumber}
                        productId={sensor.product}
                        isAddedInventory={isAddedInventory}
                        setSensor={(value: any) =>
                          handleSelectChange("sensors", [
                            ...formData.sensors.slice(0, i),
                            {
                              ...sensor,
                              serialNumber: value.serialNumber,
                              sku: value.sku,
                              type: value.productType,
                              id: value._id,
                            },
                            ...formData.sensors.slice(i + 1),
                          ])
                        }
                      />
                    </Col>
                    <Col xl={4} xs={12}>
                      <P>Serial Number</P>
                      <Input
                        type="text"
                        placeholder="Enter Sku"
                        value={sensor.sku}
                        name="sku"
                        disabled
                        // onChange={(e) => handleSelectChange('sensors', [...formData.sensors.slice(0, i), { ...sensor, serialNumber: e.target.value }, ...formData.sensors.slice(i + 1)])}
                      />
                    </Col>
                    <Col xl={4} xs={12}>
                      <P>Sensor Type</P>
                      <Input
                        type="text"
                        placeholder="Enter Sensor Type"
                        value={sensor.type}
                        name="type"
                        disabled
                        // onChange={(e) => handleSelectChange('sensors', [...formData.sensors.slice(0, i), { ...sensor, sku: e.target.value }, ...formData.sensors.slice(i + 1)])}
                      />
                    </Col>
                  </Row>
                  <div
                    style={{
                      width: "2%",
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "end",
                    }}
                  >
                    <MdDelete
                      color="red"
                      size="30px"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveSensor(i)}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
      </Row>

      <Row className="g-3" style={{ padding: "20px 0px" }}>
        {formData.accessories.length !== 0 && (
          <>
            <H4>Accessories</H4>
            {formData.accessories.map((accessory: any, i: number) => (
              <div style={{ width: "100%", display: "flex" }} key={i}>
                <Row style={{ marginTop: "15px", width: "98%" }}>
                  <Col xl={4} xs={12}>
                    <div>
                      <P>Accessory {i + 1}</P>
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter Accessory"
                      value={accessory.name}
                      disabled
                      onChange={(e) =>
                        handleSelectChange("accessories", [
                          ...formData.accessories.slice(0, i),
                          { ...accessory, serialNumber: e.target.value },
                          ...formData.accessories.slice(i + 1),
                        ])
                      }
                    />
                  </Col>
                </Row>
                <div
                  style={{
                    width: "2%",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                  }}
                >
                  <MdDelete
                    color="red"
                    size="30px"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveAccessory(i)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </Row>

      <Row className="g-3">
        <Col
          xs={12}
          className="text-end d-flex justify-content-end gap-2 align-center"
        >
          {saleLead?.vehicles.find(
            (item: any) => item?._id == inventoryData.vehicleId
          )?.inventory?.length > 0 &&
            saleLead?.vehicles.find(
              (item: any) => item?._id == inventoryData.vehicleId
            )?.installationStatus !== "INSTALLED" && (
              <Button
                color="secondary"
                onClick={() => removeInventoryToAVehicle()}
              >
                Remove Inventory
              </Button>
            )}
          {saleLead?.vehicles.find(
            (item: any) => item?._id == inventoryData.vehicleId
          )?.inventory?.length > 0 &&
            !isAddedInventory && (
              <Button
                color="secondary"
                onClick={() => setIsAddedInventory(!isAddedInventory)}
              >
                Cancel
              </Button>
            )}

          {
            <Button
              disabled={
                saleLead?.vehicles.find(
                  (item: any) => item?._id == inventoryData.vehicleId
                )?.installationStatus == "INSTALLED"
              }
              color="primary"
              onClick={() =>
                !isAddedInventory
                  ? addInventoryToAVehicle()
                  : setIsAddedInventory(!isAddedInventory)
              }
            >
              {isAddedInventory
                ? saleLead?.vehicles.find(
                    (item: any) => item?._id == inventoryData.vehicleId
                  )?.installationStatus == "INSTALLED"
                  ? "Installed"
                  : "Edit"
                : loading
                ? "Loading..."
                : "Save"}
            </Button>
          }
        </Col>
      </Row>

      {isModalOpen && (
        <SelectProductModel
          isVisible={isModalOpen}
          setIsVisible={setIsModalOpen}
          type={modalType}
          deviceProduct={deviceProduct}
          setDeviceProduct={setDeviceProduct}
          simProduct={simProduct}
          setSimProduct={setSimProduct}
          sensorProduct={sensorProduct}
          setSensorProduct={setSensorProduct}
          accessories={accessories}
          setAccessories={setAccessories}
          onAddSim={handleAddSimFromModal}
          onAddDevices={handleAddDevicesFromModal}
          onAddSensor={handleAddSensorFromModal}
          onAddAccessory={handleAddAccessoryFromModal}
        />
      )}
    </Form>
  );
};

export default InventoryDetails;
