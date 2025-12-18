import React, { useState, useEffect } from "react";
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
import {
  create,
  update,
  patch,
  deleteSingle,
  getAll,
} from "../../../../../../../Utilities/api/index";
import {
  CREATE_TRIP_DRIVER,
  GET_ALL_TRIP_DRIVERS,
  UPDATE_TRIP_DRIVER,
  DELETE_TRIP_DRIVER,
  UPDATE_DRIVER_ACTIVATION_STATUS,
} from "../../../../../../../Utilities/api/apiEndpoints";

interface Driver {
  _id?: string;
  name: string;
  licenseNumber: string;
  phoneNo: string;
  email: string;
  address: string;
  isActive: boolean;
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

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<Driver>({
    name: "",
    licenseNumber: "",
    phoneNo: "",
    email: "",
    address: "",
    isActive: true,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    setLoading(true);
    getAll({ url: GET_ALL_TRIP_DRIVERS })
      .then((data: any) => {
        if (data === undefined) {
          Swal.fire({
            text: "Failed to fetch drivers due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setDrivers([]);
          setLoading(false);
          return;
        }
        if (data.success) {
          setDrivers(data.data || []);
        } else {
          Swal.fire({
            text: data.message || "Failed to fetch drivers",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setDrivers([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
        setDrivers([]);
        setLoading(false);
      });
  };

  const toggleModal = () => {
    if (!isModalOpen) {
      // Opening modal
      setFormData({
        name: "",
        licenseNumber: "",
        phoneNo: "",
        email: "",
        address: "",
        isActive: true,
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
      text: "Once deleted, you will not be able to recover this driver",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            text: "Deleting...",
            icon: "info",
            showCancelButton: false,
            showConfirmButton: false,
          });

          await deleteSingle({ url: `${DELETE_TRIP_DRIVER}/${id}` }).then(
            (data: any) => {
              if (data.success) {
                Swal.fire({
                  text: data.message || "Driver deleted successfully",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                });
                fetchDrivers();
              } else {
                Swal.fire({
                  text: data.message || "Failed to delete driver",
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                });
              }
            }
          );
        } catch (error: any) {
          Swal.fire({
            text: "Failed to delete driver",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  const handleSaveDriver = async () => {
    if (!formData.name || !formData.licenseNumber || !formData.phoneNo) {
      Swal.fire({
        text: "Please fill in all required fields (Name, License Number, Phone)!",
        icon: "info",
        timer: 2000,
        showConfirmButton: true,
      });
      return;
    }

    setLoading(true);
    const driverData = {
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      phoneNo: formData.phoneNo,
      email: formData.email,
      address: formData.address,
      isActive: formData.isActive,
    };

    try {
      if (editingDriver && editingDriver._id) {
        // Update existing driver
        await update(driverData, {
          url: `${UPDATE_TRIP_DRIVER}/${editingDriver._id}`,
        }).then((data: any) => {
          if (data.success) {
            Swal.fire({
              text: "Driver updated successfully",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            setIsModalOpen(false);
            fetchDrivers();
          } else {
            Swal.fire({
              text: data.message || "Failed to update driver",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
          }
        });
      } else {
        // Add new driver
        await create(driverData, { url: CREATE_TRIP_DRIVER }).then(
          (data: any) => {
            if (data.success) {
              Swal.fire({
                text: "Driver created successfully",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setIsModalOpen(false);
              fetchDrivers();
            } else {
              Swal.fire({
                text: data.message || "Failed to create driver",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
            }
          }
        );
      }
    } catch (error: any) {
      Swal.fire({
        text: "An error occurred while saving driver",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
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

  const handleStatusToggle = async (driver: Driver) => {
    if (!driver._id) return;

    try {
      const newStatus = !driver.isActive;
      const statusResponse: any = await patch(
        { isActive: newStatus },
        { url: `${UPDATE_DRIVER_ACTIVATION_STATUS}/${driver._id}` }
      );

      if (statusResponse.success) {
        Swal.fire({
          text: `Driver ${
            newStatus ? "activated" : "deactivated"
          } successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchDrivers();
      } else {
        Swal.fire({
          text: statusResponse.message || "Failed to update driver status",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      Swal.fire({
        text: "Failed to update driver status",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      driver.phoneNo.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderTableRows = () => {
    return filteredDrivers.map((row: Driver, index: number) => (
      <tr
        key={row._id}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredId(row._id || "");
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && hoveredId === row._id
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{row.name}</td>
        <td>{row.licenseNumber}</td>
        <td>{row.phoneNo}</td>
        <td>{row.email}</td>
        <td>{row.address}</td>
        <td>
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <Label className="switch mb-0">
              <Input
                type="checkbox"
                checked={row.isActive}
                onChange={() => handleStatusToggle(row)}
              />
              <span
                className="switch-state"
                style={{
                  backgroundColor: row.isActive ? "green" : "red",
                }}
              />
            </Label>
          </div>
        </td>
        <td>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              className="global-table-edit-btn"
              onClick={() => handleEditDriver(row)}
            >
              Edit
            </button>
            <button
              className="global-table-delete-btn"
              onClick={() => handleDeleteDriver(row._id || "")}
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Loading drivers...</p>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>No drivers found</p>
            </div>
          ) : (
            <Table className="table-striped">
              <thead>
                <tr>
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
          )}
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
                  <Label for="phoneNo">
                    Phone <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="phoneNo"
                    id="phoneNo"
                    placeholder="Enter phone number"
                    value={formData.phoneNo}
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
                  <Label for="isActive">Status</Label>
                  <div className="d-flex align-items-center">
                    <Label className="switch mb-0">
                      <Input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            isActive: !formData.isActive,
                          });
                        }}
                      />
                      <span
                        className="switch-state"
                        style={{
                          backgroundColor: formData.isActive ? "green" : "red",
                        }}
                      />
                    </Label>
                    <span style={{ marginLeft: "10px" }}>
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal} disabled={loading}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSaveDriver}
              disabled={loading}
            >
              {loading ? "Loading..." : editingDriver ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default DriversTab;
