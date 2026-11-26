import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import VehiclePhoto, { vehiclePhotoUrl } from "../../../../../Component/VehiclePhoto/VehiclePhoto";
import Swal from "sweetalert2";
import { Select } from "antd";
import { MdCloudUpload, MdCheckCircle, MdDelete, MdAdd } from "react-icons/md";
import { getAll, create } from "../../../../../Utilities/api";
import {
  GET_ALL_CUSTOMERS,
  GET_ALL_VEHICLES_MAKE,
  GET_ALL_VEHICLES_MODEL,
  GET_ALL_ACTIVE_SERVICE_PACKAGES,
  GET_ALL_COMPANY_INSTALLERS,
  ADD_NEW_DEVICE,
} from "../../../../../Utilities/api/apiEndpoints";

interface AddDeviceModalProps {
  isOpen: boolean;
  toggle: () => void;
  // called after a vehicle/device is successfully onboarded so the parent can refetch
  onDeviceAdded?: () => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, toggle, onDeviceAdded }) => {
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [vehicleMakesList, setVehicleMakesList] = useState<any[]>([]);
  const [vehicleModelsList, setVehicleModelsList] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [installersList, setInstallersList] = useState<any[]>([]);
  // index of the vehicle currently being submitted to the API (-1 = none)
  const [installingIndex, setInstallingIndex] = useState<number>(-1);
  // whether at least one device was onboarded during this session (drives refetch on close)
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      getAll({ url: GET_ALL_CUSTOMERS })
        .then((data: any) => {
          if (data && data.success && data.data) {
            setCustomersList(data.data);
          }
        })
        .catch((err):any => console.error("Error fetching customers", err));

      getAll({ url: GET_ALL_VEHICLES_MAKE })
        .then((data: any) => {
          if (data && data.success && data.data) {
            setVehicleMakesList(data.data);
          }
        })
        .catch((err): any => console.error("Error fetching vehicle makes", err));

      getAll({ url: GET_ALL_VEHICLES_MODEL })
        .then((data: any) => {
          if (data && data.success && data.data) {
            setVehicleModelsList(data.data);
          }
        })
        .catch((err): any => console.error("Error fetching vehicle models", err));

      getAll({ url: GET_ALL_ACTIVE_SERVICE_PACKAGES })
        .then((data: any) => {
          if (data && data.success && data.data) {
            setPackagesList(data.data);
          }
        })
        .catch((err): any => console.error("Error fetching packages", err));

      getAll({ url: GET_ALL_COMPANY_INSTALLERS })
        .then((data: any) => {
          if (data && data.success && data.data) {
            setInstallersList(data.data);
          }
        })
        .catch((err): any => console.error("Error fetching installers", err));
    }
  }, [isOpen]);

  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState<any>({
    customerId: "",
    numberOfVehicles: 0,
  });

  // Dynamic list of vehicles
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Update vehicles list when numberOfVehicles changes
  useEffect(() => {
    const num = Math.max(0, parseInt(customerInfo.numberOfVehicles.toString()) || 0);
    setVehicles((prevVehicles) => {
      const nextVehicles = [...prevVehicles];
      if (nextVehicles.length < num) {
        // Expand
        for (let i = nextVehicles.length; i < num; i++) {
          nextVehicles.push({
            // Vehicle Details
            registrationNo: "",
            vrn: "",
            vehicleMake: "",
            vehicleModel: "",
            modelYear: "",
            fuelType: "",
            transmission: "",
            vehicleColor: "",
            engineNo: "",
            chasisNo: "",
            selectedPackage: "",
            packagePrice: "",
            discountedServiceCharges: "",

            // Icons Files
            vehicleIconOffline: null,
            vehicleIconIdle: null,
            vehicleIconOnline: null,
            vehicleIconStopped: null,

            // Inventory
            installer: "",
            imei: "",
            sim: "",
            accessory: "",

            // Installation Files
            vehicleFront: null,
            vehicleBack: null,
            trackerLocation: null,
            otherEvidence: null,
            remarks: "",
            isInstalled: false,
          });
        }
      } else if (nextVehicles.length > num) {
        // Shrink
        nextVehicles.splice(num);
      }
      return nextVehicles;
    });
  }, [customerInfo.numberOfVehicles]);

  // Handle Customer Info change
  const handleCustomerChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev:any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Vehicle Field change
  const handleVehicleChange = (index: number, name: string, value: any) => {
    setVehicles((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [name]: value,
      };
      return next;
    });
  };

  // File Upload Helper
  const handleFileChange = (
    index: number,
    field: string,
    file: File | null
  ) => {
    setVehicles((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: file,
      };
      return next;
    });
  };

  // Build the ADD_NEW_DEVICE payload for a single vehicle (per the simplified-onboard schema)
  const buildVehiclePayload = (vehicle: any) => {
    // "Package price charged to customer": discounted amount if entered, else the package price
    const chargedAmount = Number(
      vehicle.discountedServiceCharges !== "" && vehicle.discountedServiceCharges != null
        ? vehicle.discountedServiceCharges
        : vehicle.packagePrice
    );

    const inventoryItems: any[] = [];
    if (vehicle.imei) {
      inventoryItems.push({
        serialNumber: `${vehicle.imei}`.trim(),
        type: "DEVICES",
        autoCreate: true,
      });
    }
    if (vehicle.sim) {
      inventoryItems.push({
        serialNumber: `${vehicle.sim}`.trim(),
        type: "SIM",
        autoCreate: true,
      });
    }

    const vehiclePayload: any = {
      // required
      registrationNo: vehicle.registrationNo,
      engineNo: vehicle.engineNo,
      servicePackage: vehicle.selectedPackage,
      servicePackageDiscountedCharges: chargedAmount,
      inventoryItems,
    };

    // optional fields - only sent when provided
    if (vehicle.vrn) vehiclePayload.vrn = vehicle.vrn;
    if (vehicle.chasisNo) vehiclePayload.chasisNo = vehicle.chasisNo;
    if (vehicle.vehicleColor) vehiclePayload.color = vehicle.vehicleColor;
    if (vehicle.modelYear) vehiclePayload.year = Number(vehicle.modelYear);
    if (vehicle.fuelType) vehiclePayload.fuelType = vehicle.fuelType;
    if (vehicle.transmission) vehiclePayload.transmissionType = vehicle.transmission;
    if (vehicle.vehicleMake) vehiclePayload.vehicleMake = vehicle.vehicleMake;
    if (vehicle.vehicleModel) vehiclePayload.vehicleModel = vehicle.vehicleModel;

    // optional installer details (installerInfo)
    const installerInfo: any = {};
    if (vehicle.installer) installerInfo.installerId = vehicle.installer;
    if (vehicle.remarks) installerInfo.installationRemarks = vehicle.remarks;
    if (Object.keys(installerInfo).length > 0) {
      vehiclePayload.installerInfo = installerInfo;
    }

    return vehiclePayload;
  };

  // Trigger "Installed" status for a vehicle block -> calls ADD_NEW_DEVICE
  const handleVehicleInstall = async (index: number) => {
    const vehicle = vehicles[index];

    // ---- Required field validation (per simplified-onboard schema) ----
    if (!customerInfo.customerId) {
      Swal.fire({ text: "Please select a Customer first.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }
    if (!vehicle.registrationNo) {
      Swal.fire({ text: "Please enter a Registration Number for this vehicle.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }
    if (!vehicle.selectedPackage) {
      Swal.fire({ text: "Please select a Service Package for this vehicle.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }
    if (vehicle.packagePrice === "" || vehicle.packagePrice == null) {
      Swal.fire({ text: "Please enter the Package Price for this vehicle.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }
    if (vehicle.discountedServiceCharges === "" || vehicle.discountedServiceCharges == null) {
      Swal.fire({ text: "Please enter the Discounted Service Charges for this vehicle.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }
    if (!vehicle.imei) {
      Swal.fire({ text: "Please add the Tracker (IMEI) device for this vehicle.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }
    if (!vehicle.sim) {
      Swal.fire({ text: "Please add the SIM number for this vehicle.", icon: "warning", timer: 5000, showConfirmButton: false });
      return;
    }

    const payload = {
      customerInfo: { id: customerInfo.customerId },
      vehicles: [buildVehiclePayload(vehicle)],
    };

    setInstallingIndex(index);
    try {
      const data: any = await create(payload, { url: ADD_NEW_DEVICE });

      if (data === undefined) {
        setInstallingIndex(-1);
        return;
      }

      if (!data.success) {
        Swal.fire({ text: `${data.message}`, icon: "error", timer: 5000, showConfirmButton: false });
        setInstallingIndex(-1);
        return;
      }

      // Success: mark this vehicle as installed
      const updatedVehicles = vehicles.map((v, i) =>
        i === index ? { ...v, isInstalled: true } : v
      );
      setVehicles(updatedVehicles);
      setInstallingIndex(-1);

      // mark that something was onboarded; parser devices are refetched when the modal closes
      setHasOnboarded(true);

      const allInstalled = updatedVehicles.every((v) => v.isInstalled);

      if (allInstalled) {
        // All vehicles installed -> notify only. The modal stays open and is
        // closed manually by the user (Close button / X icon).
        await Swal.fire({
          title: "Success!",
          text: "Device(s) onboarded and installed successfully!",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
      } else {
        // More vehicles remain -> notify and move to the next vehicle to install
        await Swal.fire({
          title: "Installed!",
          text: `Vehicle ${vehicle.registrationNo} installed. Proceed with the next vehicle.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        const nextIndex = updatedVehicles.findIndex((v) => !v.isInstalled);
        if (nextIndex !== -1) {
          setTimeout(() => {
            document
              .getElementById(`vehicle-card-${nextIndex}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        }
      }
    } catch (error: any) {
      Swal.fire({ text: "Something went wrong while onboarding the device.", icon: "error", timer: 5000, showConfirmButton: false });
      setInstallingIndex(-1);
    }
  };

  // Reset state and close the modal
  const handleClose = () => {
    // refetch parser devices on close if any device was onboarded in this session
    if (hasOnboarded) {
      onDeviceAdded?.();
    }
    setCustomerInfo({ customerId: "", numberOfVehicles: 0 });
    setVehicles([]);
    setInstallingIndex(-1);
    setHasOnboarded(false);
    toggle();
  };

  // Each vehicle is onboarded/installed individually via its "Mark as Installed"
  // button (calls ADD_NEW_DEVICE). The form submit simply prevents a page reload.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Dropdown options (antd Select format: { value, label }) matching VehicleDetails
  const modelYearOptions = Array.from({ length: 26 }, (_, i) => {
    const year = (2000 + i).toString();
    return { value: year, label: year };
  });
  // Fuel enum accepted by ADD_NEW_DEVICE (simplified-onboard)
  const fuelTypeOptions = [
    { value: "PETROL", label: "Petrol" },
    { value: "DIESEL", label: "Diesel" },
    { value: "CNG", label: "CNG" },
    { value: "LPG", label: "LPG" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "ELECTRIC", label: "Electric" },
  ];
  const transmissionOptions = [
    { value: "AUTOMATIC", label: "Automatic" },
    { value: "MANUAL", label: "Manual" },
  ];
  // Backend-driven package options (same source as SaleLeadInfo / SelectPackageBox).
  // Each option carries the package price/days so we can auto-fill on select.
  const packageOptions = packagesList.map((item: any) => ({
    value: `${item?._id}`,
    label: `${item?.title}`,
    price: `${item?.price}`,
    days: `${item?.days}`,
    duration: `${item?.duration}`,
  }));
  // Backend-driven installer options (same source as Installation / SelectInstallerBox)
  const installerOptions = installersList.map((item: any) => ({
    value: `${item?._id}`,
    label: `${item?.fullName}`,
  }));
  const vehicleColorOptions = [
    "Super White", "Attitude Black", "Graphite Grey", "Silver Metallic",
    "Phantom Brown", "Strong Blue", "Oxford Blue", "Black Diamond Metallic",
    "Polar White", "Fiery Red", "Aqua Silver", "Teal Blue", "Pearl Red",
    "Cerulean Blue", "Silky Silver", "Super Pearl Black", "Pearl White",
    "Solid White", "Pearl Black", "Clear White", "Sparkling Silver",
    "Mineral Blue", "Cherry Black", "Steel Grey", "Milky Beige", "Mercury Blue",
    "Lime Light", "Graphite", "Crimson Spark Red", "Dark Teal Mica",
    "Carnelian Red", "Urban Titanium", "Crystal Black", "Lunar Silver",
    "Taffeta White", "Modern Steel", "Lunar Silver Metallic",
    "Modern Steel Metallic", "Crystal Black Pearl", "Carnelian Red Pearl",
    "Galaxy Black", "Space Grey", "Stellar White", "Cosmic Red",
  ].map((c) => ({ value: c, label: c }));

  // Backend-driven options (same source as VehicleDetails)
  const vehicleMakeOptions = vehicleMakesList.map((item: any) => ({
    value: `${item?._id}`,
    label: `${item?.name}`,
  }));
  const getVehicleModelOptions = (selectedMakeId: string) =>
    vehicleModelsList
      .filter((item: any) => item?.vehicleMake?._id == selectedMakeId)
      .map((item: any) => ({ value: `${item?._id}`, label: `${item?.name}` }));

  // Shared antd Select styling to match VehicleDetails
  const antSelectStyle = { width: "100%" } as const;
  const antFilterOption = (input: any, option: any) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="xl" centered className="at-modal at-devform" backdrop="static" keyboard={false}>
      <div className="modal-header">
        <h4 className="modal-title">Add New Device</h4>
        <Button
          color="transparent"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></Button>
      </div>
      <ModalBody style={{ maxHeight: "80vh", overflowY: "auto" }} className="theme-scrollbar">
        <Form onSubmit={handleSubmit}>
          {/* Customer Details Block */}
          <Card className="at-df-card">
            <CardHeader>
              <h5 className="mb-0">Customer Information</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label>
                      Select Customer <span className="at-df-req">*</span>
                    </Label>
                    <Select
                      showSearch
                      style={antSelectStyle}
                      placeholder="Select Customer"
                      optionFilterProp="children"
                      filterOption={antFilterOption}
                      value={customerInfo.customerId || null}
                      onChange={(value) =>
                        setCustomerInfo((prev: any) => ({ ...prev, customerId: value }))
                      }
                      options={customersList.map((c: any) => ({
                        value: c._id || c.id,
                        label: c.fullName || c.customerName,
                      }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="numberOfVehicles">
                      Number of Vehicles <span className="at-df-req">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="numberOfVehicles"
                      id="numberOfVehicles"
                      min="0"
                      placeholder="e.g. 2"
                      value={customerInfo.numberOfVehicles || ""}
                      onChange={handleCustomerChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Dynamic Vehicle Details Blocks */}
          {vehicles.map((vehicle, index) => (
            <Card key={index} id={`vehicle-card-${index}`} className="at-df-card at-df-card--vehicle">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Vehicle #{index + 1} Details {vehicle.isInstalled && <MdCheckCircle color="green" size={20} className="ms-2" />}
                </h5>
                {vehicle.isInstalled && (
                  <span className="badge bg-success">Installation Confirmed</span>
                )}
              </CardHeader>
              <CardBody>
                {/* 1. Vehicle Details Fields */}
                <h6 className="at-df-section at-df-section--first">
                  Vehicle Attributes
                </h6>
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Enter Registration Number <span className="at-df-req">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. TEST-859"
                        value={vehicle.registrationNo}
                        onChange={(e) => handleVehicleChange(index, "registrationNo", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Enter VRN
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. LED-9999"
                        value={vehicle.vrn}
                        onChange={(e) => handleVehicleChange(index, "vrn", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Vehicle Make
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Vehicle Make"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.vehicleMake || null}
                        onChange={(value) => {
                          // reset model when make changes (model list depends on make)
                          handleVehicleChange(index, "vehicleMake", value);
                          handleVehicleChange(index, "vehicleModel", "");
                        }}
                        options={vehicleMakeOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Vehicle Model
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Vehicle Model"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.vehicleModel || null}
                        onChange={(value) => handleVehicleChange(index, "vehicleModel", value)}
                        options={getVehicleModelOptions(vehicle.vehicleMake)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {/* Vehicle catalog photo for the chosen make/model */}
                {vehicle.vehicleModel &&
                  vehiclePhotoUrl(vehicleModelsList.find((m: any) => String(m?._id) === String(vehicle.vehicleModel))) && (
                  <Row>
                    <Col md={6} lg={4} className="mb-3">
                      <VehiclePhoto
                        model={vehicleModelsList.find((m: any) => String(m?._id) === String(vehicle.vehicleModel))}
                        label={[
                          vehicleMakesList.find((m: any) => String(m?._id) === String(vehicle.vehicleMake))?.name,
                          vehicleModelsList.find((m: any) => String(m?._id) === String(vehicle.vehicleModel))?.name,
                        ].filter(Boolean).join(" ")}
                      />
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Model Year
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Model Year"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.modelYear || null}
                        onChange={(value) => handleVehicleChange(index, "modelYear", value)}
                        options={modelYearOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Fuel Type
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Fuel Type"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.fuelType || null}
                        onChange={(value) => handleVehicleChange(index, "fuelType", value)}
                        options={fuelTypeOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Transmissions
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Transmission"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.transmission || null}
                        onChange={(value) => handleVehicleChange(index, "transmission", value)}
                        options={transmissionOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Vehicle Color
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Vehicle Color"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.vehicleColor || null}
                        onChange={(value) => handleVehicleChange(index, "vehicleColor", value)}
                        options={vehicleColorOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Enter Engine Number
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 35654758676"
                        value={vehicle.engineNo}
                        onChange={(e) => handleVehicleChange(index, "engineNo", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Enter Chasis Number
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 543564586987"
                        value={vehicle.chasisNo}
                        onChange={(e) => handleVehicleChange(index, "chasisNo", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Selected Package <span className="at-df-req">*</span>
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Package"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.selectedPackage || null}
                        onChange={(value, option: any) => {
                          handleVehicleChange(index, "selectedPackage", value);
                          // auto-fill the package price AND discounted service charges from the selected package
                          if (option?.price !== undefined) {
                            handleVehicleChange(index, "packagePrice", option.price);
                            handleVehicleChange(index, "discountedServiceCharges", option.price);
                          }
                        }}
                        options={packageOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Package Price <span className="at-df-req">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10000"
                        value={vehicle.packagePrice}
                        onChange={(e) => handleVehicleChange(index, "packagePrice", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Discounted Service Charges <span className="at-df-req">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10000"
                        value={vehicle.discountedServiceCharges}
                        onChange={(e) => handleVehicleChange(index, "discountedServiceCharges", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* TEMP: Vehicle Icons Customization hidden
                <h6 className="at-df-section">
                  Vehicle Icons Customization
                </h6>
                <Row className="g-3 mb-3">
                  {[
                    { label: "Vehicle Icon (Offline)", field: "vehicleIconOffline" },
                    { label: "Vehicle Icon (Idle)", field: "vehicleIconIdle" },
                    { label: "Vehicle Icon (Online)", field: "vehicleIconOnline" },
                    { label: "Vehicle Icon (Stopped)", field: "vehicleIconStopped" },
                  ].map((iconObj) => (
                    <Col md={3} key={iconObj.field}>
                      <div className="p-2 border rounded text-center" style={{ backgroundColor: "#fbfcfc" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#555", display: "block", marginBottom: "8px" }}>
                          {iconObj.label}
                        </span>
                        {vehicle[iconObj.field] ? (
                          <div className="d-flex flex-column align-items-center justify-content-center p-2" style={{ minHeight: "100px" }}>
                            <div className="mb-2 text-success" style={{ fontSize: "11px", fontWeight: "bold" }}>
                              Uploaded: {vehicle[iconObj.field].name}
                            </div>
                            <Button
                              color="danger"
                              size="sm"
                              className="px-2 py-1"
                              style={{ fontSize: "10px" }}
                              onClick={() => handleFileChange(index, iconObj.field, null)}
                              disabled={vehicle.isInstalled}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div
                            style={{
                              border: "1px dashed #ccc",
                              borderRadius: "6px",
                              padding: "15px 10px",
                              backgroundColor: "white",
                              cursor: "pointer",
                              minHeight: "100px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              if (!vehicle.isInstalled) {
                                document.getElementById(`icon-${index}-${iconObj.field}`)?.click();
                              }
                            }}
                          >
                            <span style={{ fontSize: "10px", color: "gray" }}>Not Uploaded</span>
                            <span className="text-primary mt-1" style={{ fontSize: "11px", textDecoration: "underline" }}>
                              Upload File
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              id={`icon-${index}-${iconObj.field}`}
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  handleFileChange(index, iconObj.field, files[0]);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
                */}

                {/* 3. Inventory Details Block */}
                <h6 className="at-df-section">
                  Inventory Configuration
                </h6>
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Select Installer
                      </Label>
                      <Select
                        showSearch
                        style={antSelectStyle}
                        placeholder="Select Installer"
                        optionFilterProp="children"
                        filterOption={antFilterOption}
                        value={vehicle.installer || null}
                        onChange={(value) => handleVehicleChange(index, "installer", value)}
                        options={installerOptions}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Add IMEI <span className="at-df-req">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 860987654321"
                        value={vehicle.imei}
                        onChange={(e) => handleVehicleChange(index, "imei", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Add SIM <span className="at-df-req">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 899211998877"
                        value={vehicle.sim}
                        onChange={(e) => handleVehicleChange(index, "sim", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label>
                        Add Accessory
                      </Label>
                      <Input
                        type="text"
                        placeholder="Type accessory details"
                        value={vehicle.accessory}
                        onChange={(e) => handleVehicleChange(index, "accessory", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* TEMP: Installation Verification hidden
                <h6 className="at-df-section">
                  Installation Verification
                </h6>
                <div className="mb-3" style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}>
                  Registration Number : {vehicle.registrationNo || "TEST-859"}
                </div>
                <Row className="g-3 mb-3">
                  {[
                    { label: "Vehicle Front", field: "vehicleFront" },
                    { label: "Vehicle Back", field: "vehicleBack" },
                    { label: "Tracker Location", field: "trackerLocation" },
                    { label: "Other Evidence", field: "otherEvidence" },
                  ].map((dropzone) => (
                    <Col md={3} key={dropzone.field}>
                      <div className="p-3 border rounded text-center" style={{ backgroundColor: "#f8f9f9" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "8px" }}>
                          {dropzone.label}
                        </span>
                        {vehicle[dropzone.field] ? (
                          <div className="d-flex flex-column align-items-center justify-content-center p-2" style={{ minHeight: "120px" }}>
                            {vehicle[dropzone.field] instanceof File && (
                              <img
                                src={URL.createObjectURL(vehicle[dropzone.field])}
                                alt="preview"
                                style={{ maxHeight: "80px", maxWidth: "100%", borderRadius: "4px", marginBottom: "8px" }}
                              />
                            )}
                            <div className="mb-2 text-success" style={{ fontSize: "10px", wordBreak: "break-all" }}>
                              {vehicle[dropzone.field].name}
                            </div>
                            <Button
                              color="danger"
                              size="sm"
                              className="px-2 py-0"
                              style={{ fontSize: "9px" }}
                              onClick={() => handleFileChange(index, dropzone.field, null)}
                              disabled={vehicle.isInstalled}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div
                            style={{
                              border: "2px dashed #bbb",
                              borderRadius: "8px",
                              padding: "20px 10px",
                              backgroundColor: "white",
                              cursor: "pointer",
                              minHeight: "120px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              transition: "border-color 0.2s",
                            }}
                            onClick={() => {
                              if (!vehicle.isInstalled) {
                                document.getElementById(`upload-${index}-${dropzone.field}`)?.click();
                              }
                            }}
                          >
                            <MdCloudUpload size={28} color="#aaa" />
                            <span style={{ fontSize: "11px", color: "#777", marginTop: "5px" }}>
                              Drop files here or click to upload.
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              id={`upload-${index}-${dropzone.field}`}
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  handleFileChange(index, dropzone.field, files[0]);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
                */}

                <Row>
                  <Col md={12} className="mb-3">
                    <FormGroup>
                      <Label>Enter Remarks</Label>
                      <Input
                        type="textarea"
                        placeholder="Enter installation notes and remarks"
                        rows={2}
                        value={vehicle.remarks}
                        onChange={(e) => handleVehicleChange(index, "remarks", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="text-end">
                  <Button
                    color="primary"
                    disabled={vehicle.isInstalled || installingIndex === index}
                    onClick={() => handleVehicleInstall(index)}
                  >
                    {vehicle.isInstalled
                      ? "Installed ✅"
                      : installingIndex === index
                      ? "Installing..."
                      : "Mark as Installed"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* Action Footer Buttons */}
          <div className="text-end mt-4">
            <Button
              color="secondary"
              className="me-2"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
