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
import { getAll, update, create } from "../../../../../Utilities/api";
import {
  GET_ALL_CUSTOMERS,
  GET_ALL_VEHICLES_MAKE,
  GET_ALL_VEHICLES_MODEL,
  GET_ALL_ACTIVE_SERVICE_PACKAGES,
  GET_ALL_COMPANY_INSTALLERS,
  VEHICLE_BILLING_ACTIONS,
  EDIT_VEHICLE,
  SWAP_DEVICE,
  MIGRATE_PACKAGE,
  TRANSFER_OWNER,
} from "../../../../../Utilities/api/apiEndpoints";

interface EditDeviceModalProps {
  isOpen: boolean;
  toggle: () => void;
  device: any;
  onDeviceUpdated?: () => void;
}

export const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ isOpen, toggle, device, onDeviceUpdated }) => {
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [vehicleMakesList, setVehicleMakesList] = useState<any[]>([]);
  const [vehicleModelsList, setVehicleModelsList] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [installersList, setInstallersList] = useState<any[]>([]);
  const [billingActionsList, setBillingActionsList] = useState<any[]>([]);
  // Snapshot of the originally loaded values used to detect real changes
  // (IMEI, SIM, package, discounted charges). A field that is changed and then
  // reverted back to this snapshot will NOT trigger its API call.
  const [original, setOriginal] = useState<any>({
    imei: "",
    sim: "",
    selectedPackage: "",
    discountedServiceCharges: "",
    customerId: "",
  });
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

      getAll({ url: VEHICLE_BILLING_ACTIONS })
        .then((data: any) => {
          if (data && data.success && data.data) {
            setBillingActionsList(data.data);
          }
        })
        .catch((err): any => console.error("Error fetching billing actions", err));
    }
  }, [isOpen]);

  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState<any>({
    customerId: "",
    numberOfVehicles: 1, // Fixed to 1 for edit
    billingAction: "", // Required only when the package / discounted charges change
  });

  // Dynamic list of vehicles
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Pre-fill the form when device changes or modal opens
  useEffect(() => {
    if (isOpen && device && device.vehicle) {
      setCustomerInfo({
        customerId: device.vehicle.customer?._id || "",
        numberOfVehicles: 1,
        billingAction: "",
      });

      const prefilledImei = device.vehicle.imei || "";
      // SIM lives in the inventory array as the item whose productType is "SIM"
      const simInventory = (device.vehicle.inventory || []).find(
        (item: any) => item?.productType === "SIM"
      );
      const prefilledSim = simInventory?.serialNumber || "";
      const prefilledPackage = device.vehicle.servicePackage || "";
      const prefilledDiscount = device.vehicle.servicePackageDiscountedCharges?.toString() || "";

      setVehicles([
        {
          registrationNo: device.vehicle.registrationNo || "",
          vrn: device.vehicle.vrn || "",
          vehicleMake: device.vehicle.make?._id || "",
          vehicleModel: device.vehicle.model?._id || "",
          modelYear: device.vehicle.year?.toString() || "",
          fuelType: device.vehicle.fuelType || "",
          transmission: device.vehicle.transmissionType || "",
          vehicleColor: device.vehicle.color || "",
          engineNo: device.vehicle.engineNo || "",
          chasisNo: device.vehicle.chasisNo || "",
          selectedPackage: prefilledPackage,
          packagePrice: device.vehicle.servicePackageCharges?.toString() || "",
          discountedServiceCharges: prefilledDiscount,
          imei: prefilledImei,
          sim: prefilledSim,
          deviceSwapReason: "", // Reason for device (IMEI) swap; shown only when IMEI changes
          simSwapReason: "", // Reason for SIM swap; shown only when SIM changes
          installer: device.vehicle.installer?._id || "",
          remarks: device.vehicle.installationRemarks || "",
          isInstalled: false, // Allows the user to click update
        },
      ]);

      // Snapshot originals so we only fire swap/migrate/transfer APIs when values truly change
      setOriginal({
        imei: prefilledImei,
        sim: prefilledSim,
        selectedPackage: prefilledPackage,
        discountedServiceCharges: prefilledDiscount,
        customerId: device.vehicle.customer?._id || "",
      });
    } else if (!isOpen) {
      // Reset state on close
      setCustomerInfo({ customerId: "", numberOfVehicles: 1, billingAction: "" });
      setVehicles([]);
      setInstallingIndex(-1);
      setOriginal({ imei: "", sim: "", selectedPackage: "", discountedServiceCharges: "", customerId: "" });
    }
  }, [isOpen, device]);

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

  // Build the EDIT_VEHICLE (metadata) payload. NOTE: billing / inventory fields
  // (imei, inventory, servicePackage, serviceRenewalDate, servicePackageCharges,
  // servicePackageDiscountedCharges, customer) are BLOCKED by this endpoint and
  // must never be sent here — they return a 400. Those are handled by the
  // swap-device / migrate-package endpoints instead.
  const buildMetadataPayload = (vehicle: any) => {
    const payload: any = {
      registrationNo: vehicle.registrationNo,
    };

    if (vehicle.vrn) payload.vrn = vehicle.vrn;
    if (vehicle.engineNo) payload.engineNo = vehicle.engineNo;
    if (vehicle.chasisNo) payload.chasisNo = vehicle.chasisNo;
    if (vehicle.vehicleColor) payload.color = vehicle.vehicleColor;
    if (vehicle.modelYear) payload.year = Number(vehicle.modelYear);
    if (vehicle.fuelType) payload.fuelType = vehicle.fuelType;
    if (vehicle.transmission) payload.transmissionType = vehicle.transmission;
    if (vehicle.vehicleMake) payload.vehicleMake = vehicle.vehicleMake;
    if (vehicle.vehicleModel) payload.vehicleModel = vehicle.vehicleModel;
    if (vehicle.remarks) payload.remarks = vehicle.remarks;

    return payload;
  };

  // Extract a readable message from an API result / rejection
  const messageFrom = (res: any) =>
    res?.message || res?.description || res?.error || "Request failed";

  // Update a vehicle. Fires up to three endpoints in parallel:
  //  1. EDIT_VEHICLE   (metadata)      -> always
  //  2. SWAP_DEVICE    (IMEI / SIM)    -> only when the serial actually changed
  //  3. MIGRATE_PACKAGE(package/price) -> only when package or discount changed
  // A single combined alert is shown if any of them fail.
  const handleVehicleInstall = async (index: number) => {
    const vehicle = vehicles[index];
    const vehicleId = device?.vehicle?._id;

    if (!vehicleId) {
      Swal.fire({ text: "Vehicle reference is missing. Please reopen and try again.", icon: "error" });
      return;
    }

    // ---- Required field validation ----
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

    // ---- Change detection (trimmed string comparison against the snapshot) ----
    const newImei = `${vehicle.imei ?? ""}`.trim();
    const newSim = `${vehicle.sim ?? ""}`.trim();
    const imeiChanged = newImei !== `${original.imei ?? ""}`.trim();
    const simChanged = newSim !== `${original.sim ?? ""}`.trim();
    const packageChanged = `${vehicle.selectedPackage ?? ""}` !== `${original.selectedPackage ?? ""}`;
    const discountChanged =
      `${vehicle.discountedServiceCharges ?? ""}`.trim() !== `${original.discountedServiceCharges ?? ""}`.trim();
    const packageMigration = packageChanged || discountChanged;
    const customerChanged = `${customerInfo.customerId ?? ""}` !== `${original.customerId ?? ""}`;

    // Billing action is only required when a package migration will happen
    if (packageMigration && !customerInfo.billingAction) {
      Swal.fire({
        text: "Please select a Billing Action for the package/price change.",
        icon: "warning",
        timer: 5000,
        showConfirmButton: false,
      });
      return;
    }

    // ---- Build the task list (label + promise) ----
    const tasks: { label: string; promise: Promise<any> }[] = [];

    // 1. Metadata update — always
    tasks.push({
      label: "Vehicle details",
      promise: update(buildMetadataPayload(vehicle), {
        url: EDIT_VEHICLE.replace(":vehicleId", vehicleId),
      }) as Promise<any>,
    });

    // 2. Swap device / SIM — a single call that carries only whichever changed.
    //    { device: {...} } when the IMEI changed, { sim: {...} } when the SIM
    //    changed, both when both changed. Each carries its OWN reason.
    const swapDevice = imeiChanged && newImei;
    const swapSim = simChanged && newSim;
    if (swapDevice || swapSim) {
      const swapPayload: any = {};
      if (swapDevice) {
        const deviceReason = `${vehicle.deviceSwapReason ?? ""}`.trim();
        swapPayload.device = {
          serialNumber: newImei,
          autoCreate: true,
          ...(deviceReason ? { reason: deviceReason } : {}),
        };
      }
      if (swapSim) {
        const simReason = `${vehicle.simSwapReason ?? ""}`.trim();
        swapPayload.sim = {
          serialNumber: newSim,
          autoCreate: true,
          ...(simReason ? { reason: simReason } : {}),
        };
      }

      tasks.push({
        label:
          swapDevice && swapSim
            ? "Device & SIM swap"
            : swapDevice
            ? "Tracker (IMEI) swap"
            : "SIM swap",
        promise: create(swapPayload, {
          url: SWAP_DEVICE.replace(":vehicleId", vehicleId),
        }) as Promise<any>,
      });
    }

    // 3. Package migration — only when package or discounted charges changed
    if (packageMigration) {
      const migratePayload: any = {
        newServicePackageId: vehicle.selectedPackage,
        billingAction: customerInfo.billingAction,
      };
      if (vehicle.discountedServiceCharges !== "" && vehicle.discountedServiceCharges != null) {
        migratePayload.servicePackageDiscountedCharges = Number(vehicle.discountedServiceCharges);
      }
      tasks.push({
        label: "Package migration",
        promise: create(migratePayload, {
          url: MIGRATE_PACKAGE.replace(":vehicleId", vehicleId),
        }) as Promise<any>,
      });
    }

    // 4. Transfer owner — only when the selected customer changed
    if (customerChanged && customerInfo.customerId) {
      tasks.push({
        label: "Owner transfer",
        promise: create(
          { newCustomerId: customerInfo.customerId },
          { url: TRANSFER_OWNER.replace(":vehicleId", vehicleId) }
        ) as Promise<any>,
      });
    }

    setInstallingIndex(index);
    try {
      const settled = await Promise.allSettled(tasks.map((t) => t.promise));

      const errors: string[] = [];
      settled.forEach((s, i) => {
        if (s.status === "fulfilled") {
          const res = s.value;
          if (!res || !res.success) {
            errors.push(`• ${tasks[i].label}: ${messageFrom(res)}`);
          }
        } else {
          errors.push(`• ${tasks[i].label}: ${messageFrom(s.reason)}`);
        }
      });

      if (errors.length > 0) {
        // One combined alert for any/all failures
        Swal.fire({
          title: "Some updates failed",
          html: errors.join("<br/>"),
          icon: "error",
        });
        return;
      }

      // All succeeded
      Swal.fire({
        text: "Device updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh the snapshot so re-clicking without further edits won't re-fire swap/migrate/transfer.
      // The form stays editable (fields are NOT disabled) and in the same position after updating.
      setOriginal({
        imei: newImei,
        sim: newSim,
        selectedPackage: vehicle.selectedPackage,
        discountedServiceCharges: vehicle.discountedServiceCharges,
        customerId: customerInfo.customerId,
      });
      setHasOnboarded(true);
      // Refetch the parser devices (GET_PARSER_DEVICES) so the sidebar reflects the update
      onDeviceUpdated?.();
    } catch (err: any) {
      console.error("Update error:", err);
      Swal.fire({
        text: err?.response?.data?.message || "An error occurred while updating.",
        icon: "error",
      });
    } finally {
      setInstallingIndex(-1);
    }
  };

  // Reset state and close the modal
  const handleClose = () => {
    // refetch parser devices on close if any device was onboarded in this session
    if (hasOnboarded) {
      // onDeviceAdded?.();
    }
    setCustomerInfo({ customerId: "", numberOfVehicles: 0 });
    setVehicles([]);
    setInstallingIndex(-1);
    setHasOnboarded(false);
    toggle();
  };

  // Each vehicle is updated individually via its "Update Device" button.
  // The form submit simply prevents a page reload.
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
  // Backend-driven billing action options (VEHICLE_BILLING_ACTIONS). Value is the
  // action `type`; the description is shown to the user for context.
  const billingActionOptions = billingActionsList.map((item: any) => ({
    value: `${item?.type}`,
    label: `${item?.type}`,
    description: `${item?.description ?? ""}`,
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
        <h4 className="modal-title">Edit Device</h4>
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
                      placeholder="e.g. 1"
                      value={customerInfo.numberOfVehicles || ""}
                      onChange={handleCustomerChange}
                      required
                      disabled // Disable the number of vehicles input for editing
                    />
                  </FormGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label>
                      Billing Action
                    </Label>
                    <Select
                      showSearch
                      style={antSelectStyle}
                      placeholder="Select Billing Action"
                      optionFilterProp="label"
                      filterOption={antFilterOption}
                      value={customerInfo.billingAction || null}
                      onChange={(value) =>
                        setCustomerInfo((prev: any) => ({ ...prev, billingAction: value }))
                      }
                      options={billingActionOptions}
                      optionRender={(option) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{option.data.label}</div>
                          {option.data.description && (
                            <div style={{ fontSize: "11px", color: "#888", whiteSpace: "normal" }}>
                              {option.data.description}
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <small className="at-df-help">
                      Required only when the package or discounted charges are changed.
                    </small>
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
                  Vehicle #{index + 1} Details
                </h5>
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

                {/* Swap reasons — each appears only when its serial is changed */}
                {(`${vehicle.imei ?? ""}`.trim() !== `${original.imei ?? ""}`.trim() ||
                  `${vehicle.sim ?? ""}`.trim() !== `${original.sim ?? ""}`.trim()) && (
                  <Row>
                    {`${vehicle.imei ?? ""}`.trim() !== `${original.imei ?? ""}`.trim() && (
                      <Col md={6} className="mb-3">
                        <FormGroup>
                          <Label>
                            Device (IMEI) Swap Reason
                          </Label>
                          <Input
                            type="text"
                            placeholder="e.g. Faulty internal GPS module"
                            value={vehicle.deviceSwapReason}
                            onChange={(e) => handleVehicleChange(index, "deviceSwapReason", e.target.value)}
                            disabled={vehicle.isInstalled}
                          />
                        </FormGroup>
                      </Col>
                    )}
                    {`${vehicle.sim ?? ""}`.trim() !== `${original.sim ?? ""}`.trim() && (
                      <Col md={6} className="mb-3">
                        <FormGroup>
                          <Label>
                            SIM Swap Reason
                          </Label>
                          <Input
                            type="text"
                            placeholder="e.g. SIM no longer active"
                            value={vehicle.simSwapReason}
                            onChange={(e) => handleVehicleChange(index, "simSwapReason", e.target.value)}
                            disabled={vehicle.isInstalled}
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                )}

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
                    disabled={installingIndex === index}
                    onClick={() => handleVehicleInstall(index)}
                  >
                    {installingIndex === index ? "Updating..." : "Update Device"}
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
