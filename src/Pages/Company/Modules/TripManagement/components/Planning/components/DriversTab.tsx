import React, { useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Table,
} from "reactstrap";
import { useSelector } from "react-redux";
import { PlusCircle } from "react-feather";
import Swal from "sweetalert2";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
}

const DriversTab = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  function hexToRgb(hex: any) {
    hex = hex?.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "John Doe",
      licenseNumber: "DL-123456",
      phone: "+92-300-1234567",
      email: "john@example.com",
      address: "Islamabad, Pakistan",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      licenseNumber: "DL-789012",
      phone: "+92-300-9876543",
      email: "jane@example.com",
      address: "Lahore, Pakistan",
      status: "active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<Driver>({
    id: "",
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    address: "",
    status: "active",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleModal = () => {
    if (!isModalOpen) {
      // Opening modal
      setFormData({
        id: "",
        name: "",
        licenseNumber: "",
        phone: "",
        email: "",
        address: "",
        status: "active",
      });
      setEditingDriver(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData(driver);
    setIsModalOpen(true);
  };

  const handleDeleteDriver = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this driver?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDrivers(drivers.filter((driver) => driver.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Driver has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSaveDriver = () => {
    if (!formData.name || !formData.licenseNumber || !formData.phone) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (editingDriver) {
      // Update existing driver
      setDrivers(
        drivers.map((driver) =>
          driver.id === editingDriver.id ? formData : driver
        )
      );
      Swal.fire({
        title: "Success!",
        text: "Driver updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // Add new driver
      const newDriver = {
        ...formData,
        id: Date.now().toString(),
      };
      setDrivers([...drivers, newDriver]);
      Swal.fire({
        title: "Success!",
        text: "Driver added successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    toggleModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderTableRows = () => {
    return filteredDrivers.map((row: Driver, index: number) => (
      <tr
        key={row.id}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredId(row.id);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && hoveredId === row.id
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{index + 1}</td>
        <td>{row.name}</td>
        <td>{row.licenseNumber}</td>
        <td>{row.phone}</td>
        <td>{row.email}</td>
        <td>{row.address}</td>
        <td>
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <Label className="switch mb-0">
              <Input
                type="checkbox"
                checked={row.status === "active"}
                onChange={() => {
                  setDrivers(
                    drivers.map((driver) =>
                      driver.id === row.id
                        ? {
                            ...driver,
                            status:
                              driver.status === "active" ? "inactive" : "active",
                          }
                        : driver
                    )
                  );
                }}
              />
              <span
                className="switch-state"
                style={{
                  backgroundColor: row.status === "active" ? "green" : "red",
                }}
              />
            </Label>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              className="global-table-edit-btn"
              onClick={() => handleEditDriver(row)}
            >
              Edit
            </button>
            <button
              className="global-table-delete-btn"
              onClick={() => handleDeleteDriver(row.id)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Card>
      <CardBody>
        <Row className="mb-3">
          <Col md="6">
            <input
              className="form-control"
              type="text"
              placeholder="Search drivers..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
          <Col md="6" className="text-end">
            <Button
              color="primary"
              style={{
                backgroundColor:
                  userPersonalizationData?.buttonsAndBarsColor || "#63d5be",
                border: "none",
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
              onClick={toggleModal}
            >
              <PlusCircle size={18} style={{ marginRight: "5px" }} />
              Create Driver
            </Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table className="table-striped">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>License Number</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </Table>
        </div>

        <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg" centered>
          <ModalHeader toggle={toggleModal}>
            {editingDriver ? "Edit Driver" : "Create Driver"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="name">
                    Name <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter driver name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="licenseNumber">
                    License Number <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="licenseNumber"
                    id="licenseNumber"
                    placeholder="Enter license number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="phone">
                    Phone <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    type="select"
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              // style={{
              //   backgroundColor:
              //     userPersonalizationData?.buttonsAndBarsColor || "#63d5be",
              //   border: "none",
              // }}
              onClick={handleSaveDriver}
            >
              {editingDriver ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default DriversTab;
