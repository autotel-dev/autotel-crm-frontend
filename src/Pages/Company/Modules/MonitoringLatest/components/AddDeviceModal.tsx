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
import Swal from "sweetalert2";
import { MdCloudUpload, MdCheckCircle, MdDelete, MdAdd } from "react-icons/md";

interface AddDeviceModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, toggle }) => {
  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerContactNo: "",
    customerAdditionalNo: "",
    customerAddress: "",
    city: "",
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
            vehicleMake: "",
            vehicleModel: "",
            modelYear: "",
            fuelType: "",
            transmission: "",
            vehicleColor: "",
            engineNo: "",
            chasisNo: "",
            selectedPackage: "Quarterly",
            packagePrice: "10000",
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
    setCustomerInfo((prev) => ({
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

  // Trigger "Installed" status for a vehicle block
  const handleVehicleInstall = (index: number) => {
    const vehicle = vehicles[index];
    if (!vehicle.registrationNo) {
      Swal.fire({
        text: "Please enter a Registration Number for this vehicle first.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!vehicle.vehicleFront || !vehicle.vehicleBack || !vehicle.trackerLocation || !vehicle.otherEvidence) {
      Swal.fire({
        text: "Please upload all installation images.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setVehicles((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        isInstalled: true,
      };
      return next;
    });

    Swal.fire({
      title: "Installed!",
      text: `Vehicle ${vehicle.registrationNo} marked as installed.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Main Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerInfo.customerName ||
      !customerInfo.customerContactNo ||
      !customerInfo.city ||
      customerInfo.numberOfVehicles <= 0
    ) {
      Swal.fire({
        text: "Please fill in all required customer details and set vehicles count.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Verify all vehicles are installed
    const allInstalled = vehicles.every((v) => v.isInstalled);
    if (!allInstalled) {
      Swal.fire({
        text: "Please complete installation for all vehicles before saving.",
        icon: "warning",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: "Success!",
      text: "Customer and vehicle details saved successfully!",
      icon: "success",
      timer: 3000,
      showConfirmButton: false,
    });

    // Reset states and close modal
    setCustomerInfo({
      customerName: "",
      customerContactNo: "",
      customerAdditionalNo: "",
      customerAddress: "",
      city: "",
      numberOfVehicles: 0,
    });
    setVehicles([]);
    toggle();
  };

  // Lists for dropdown options
  const cities = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Peshawar", "Multan", "Quetta"];
  const vehicleMakes = ["Toyota", "Honda", "Suzuki", "Hyundai", "Kia", "Changan", "MG"];
  const vehicleModels = ["Corolla", "Civic", "Swift", "Cultus", "WagonR", "Tucson", "Sportage", "Alsvin", "HS"];
  const modelYears = Array.from({ length: 27 }, (_, i) => (2000 + i).toString());
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "CNG", "LPG"];
  const transmissions = ["Automatic", "Manual"];
  const packages = ["Quarterly", "Bi-Annual", "Annual", "Monthly"];
  const installers = ["Installer A", "Installer B", "Installer C", "Installer D"];
  const vehicleColors = ["Super White", "Attitude Black", "Graphite Grey", "Silver Metallic", "Phantom Brown", "Strong Blue", "Red"];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
      <div className="modal-header" style={{ borderBottom: "1px solid #dee2e6" }}>
        <h4 className="modal-title" style={{ color: "#333", fontWeight: "bold" }}>Add New Device</h4>
        <Button
          color="transparent"
          className="btn-close"
          onClick={toggle}
          style={{ fontSize: "1.2rem", fontWeight: "bold", opacity: 0.5, border: "none" }}
        ></Button>
      </div>
      <ModalBody style={{ maxHeight: "80vh", overflowY: "auto", padding: "24px" }} className="theme-scrollbar">
        <Form onSubmit={handleSubmit}>
          {/* Customer Details Block */}
          <Card className="mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <CardHeader style={{ backgroundColor: "rgba(109, 191, 184, 0.1)", borderBottom: "1px solid rgba(109, 191, 184, 0.2)" }}>
              <h5 className="mb-0" style={{ color: "#6dbfb8", fontWeight: "600" }}>Customer Information</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="customerName" style={{ fontWeight: "600", fontSize: "13px", color: "#555" }}>
                      Customer Name <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      name="customerName"
                      id="customerName"
                      placeholder="Enter Customer Name"
                      value={customerInfo.customerName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="customerContactNo" style={{ fontWeight: "600", fontSize: "13px", color: "#555" }}>
                      Customer Contact No <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      name="customerContactNo"
                      id="customerContactNo"
                      placeholder="Enter Contact No"
                      value={customerInfo.customerContactNo}
                      onChange={handleCustomerChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="customerAdditionalNo" style={{ fontWeight: "600", fontSize: "13px", color: "#555" }}>
                      Customer Additional No
                    </Label>
                    <Input
                      type="text"
                      name="customerAdditionalNo"
                      id="customerAdditionalNo"
                      placeholder="Enter Additional Contact No"
                      value={customerInfo.customerAdditionalNo}
                      onChange={handleCustomerChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="customerAddress" style={{ fontWeight: "600", fontSize: "13px", color: "#555" }}>
                      Customer Address
                    </Label>
                    <Input
                      type="text"
                      name="customerAddress"
                      id="customerAddress"
                      placeholder="Enter Customer Address"
                      value={customerInfo.customerAddress}
                      onChange={handleCustomerChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="city" style={{ fontWeight: "600", fontSize: "13px", color: "#555" }}>
                      Select City <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      type="select"
                      name="city"
                      id="city"
                      value={customerInfo.city}
                      onChange={handleCustomerChange}
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="numberOfVehicles" style={{ fontWeight: "600", fontSize: "13px", color: "#555" }}>
                      Number of Vehicles <span style={{ color: "red" }}>*</span>
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
            <Card key={index} className="mb-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderLeft: "4px solid #6dbfb8" }}>
              <CardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f8f9fa" }}>
                <h5 className="mb-0" style={{ color: "#333", fontWeight: "600" }}>
                  Vehicle #{index + 1} Details {vehicle.isInstalled && <MdCheckCircle color="green" size={20} className="ms-2" />}
                </h5>
                {vehicle.isInstalled && (
                  <span className="badge bg-success">Installation Confirmed</span>
                )}
              </CardHeader>
              <CardBody>
                {/* 1. Vehicle Details Fields */}
                <h6 style={{ color: "#666", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px" }}>
                  Vehicle Attributes
                </h6>
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Enter Registration Number <span style={{ color: "red" }}>*</span>
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
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Vehicle Make <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.vehicleMake}
                        onChange={(e) => handleVehicleChange(index, "vehicleMake", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Make</option>
                        {vehicleMakes.map((make) => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Vehicle Model <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.vehicleModel}
                        onChange={(e) => handleVehicleChange(index, "vehicleModel", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Model</option>
                        {vehicleModels.map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Model Year <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.modelYear}
                        onChange={(e) => handleVehicleChange(index, "modelYear", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Year</option>
                        {modelYears.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Fuel Type <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.fuelType}
                        onChange={(e) => handleVehicleChange(index, "fuelType", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Fuel Type</option>
                        {fuelTypes.map((fuel) => (
                          <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Transmissions <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.transmission}
                        onChange={(e) => handleVehicleChange(index, "transmission", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Transmission</option>
                        {transmissions.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Vehicle Color <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.vehicleColor}
                        onChange={(e) => handleVehicleChange(index, "vehicleColor", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Color</option>
                        {vehicleColors.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Enter Engine Number <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 35654758676"
                        value={vehicle.engineNo}
                        onChange={(e) => handleVehicleChange(index, "engineNo", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Enter Chasis Number <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. 543564586987"
                        value={vehicle.chasisNo}
                        onChange={(e) => handleVehicleChange(index, "chasisNo", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Selected Package <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.selectedPackage}
                        onChange={(e) => handleVehicleChange(index, "selectedPackage", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        {packages.map((pkg) => (
                          <option key={pkg} value={pkg}>{pkg}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Package Price <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10000"
                        value={vehicle.packagePrice}
                        onChange={(e) => handleVehicleChange(index, "packagePrice", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Discounted Service Charges
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter discount if any"
                        value={vehicle.discountedServiceCharges}
                        onChange={(e) => handleVehicleChange(index, "discountedServiceCharges", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* 2. Vehicle Icon Uploads */}
                <h6 className="mt-4" style={{ color: "#666", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px" }}>
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

                {/* 3. Inventory Details Block */}
                <h6 className="mt-4" style={{ color: "#666", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px" }}>
                  Inventory Configuration
                </h6>
                <Row>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Select Installer <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        type="select"
                        value={vehicle.installer}
                        onChange={(e) => handleVehicleChange(index, "installer", e.target.value)}
                        required
                        disabled={vehicle.isInstalled}
                      >
                        <option value="">Select Installer</option>
                        {installers.map((inst) => (
                          <option key={inst} value={inst}>{inst}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Add IMEI
                      </Label>
                      <Input
                        type="text"
                        placeholder="Type IMEI details"
                        value={vehicle.imei}
                        onChange={(e) => handleVehicleChange(index, "imei", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
                        Add SIM
                      </Label>
                      <Input
                        type="text"
                        placeholder="Type SIM number"
                        value={vehicle.sim}
                        onChange={(e) => handleVehicleChange(index, "sim", e.target.value)}
                        disabled={vehicle.isInstalled}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>
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

                {/* 4. Installation Block */}
                <h6 className="mt-4" style={{ color: "#666", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "15px" }}>
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

                <Row>
                  <Col md={12} className="mb-3">
                    <FormGroup>
                      <Label style={{ fontWeight: "600", fontSize: "12px", color: "#666" }}>Enter Remarks</Label>
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
                    disabled={vehicle.isInstalled}
                    onClick={() => handleVehicleInstall(index)}
                    style={{
                      backgroundColor: vehicle.isInstalled ? "#28a745" : "#6dbfb8",
                      borderColor: vehicle.isInstalled ? "#28a745" : "#6dbfb8",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {vehicle.isInstalled ? "Installed ✅" : "Mark as Installed"}
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
              onClick={toggle}
              style={{ borderRadius: "6px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "#6dbfb8",
                borderColor: "#6dbfb8",
                color: "white",
                borderRadius: "6px",
                fontWeight: "600",
                padding: "8px 24px",
              }}
            >
              Save Device
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
