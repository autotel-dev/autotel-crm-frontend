import { useEffect, useRef, useState } from "react";
import { Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { P } from "../../../../../../../../AbstractElements";
import { Select } from "antd";
import {
  setCircle,
  setPolygon,
  setRectangle,
  setType,
} from "../../../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import { create, update } from "../../../../../../../../Utilities/api";
import Swal from "sweetalert2";
import {
  CREATE_GEOFENCE,
  UPDATE_GEOFENCE,
  IMPORT_GEOFENCE,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface PropTypes {
  isNewGeofence: boolean;
  setIsNewGeofence: any;
  isEditGeofence: boolean;
  setIsEditGeofence: any;
  geofences: any[];
  setGeofences: any;
  fetchGeofences: any;
  loading: boolean;
}

const GeofencesListTrip = ({
  isNewGeofence,
  setIsNewGeofence,
  isEditGeofence,
  setIsEditGeofence,
  geofences,
  setGeofences,
  fetchGeofences,
  loading,
}: PropTypes) => {
  const dispatch = useDispatch();
  const { type, circle, rectangle, polygon } = useSelector(
    (state: any) => state.geofence
  );

  const [formData, setFormData] = useState({ title: "" });
  const [geofenceType, setGeofenceType] = useState("");
  const [editedGeofenceId, setEditedGeofenceId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const inputareaRef = useRef<HTMLInputElement | null>(null);

  const typeList = [
    { label: "Circle", value: "circle" },
    { label: "Polygon", value: "polygon" },
  ];

  const onChangeHandler = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoToReply = () => {
    if (!inputareaRef.current) return;
    (inputareaRef.current as HTMLInputElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
    (inputareaRef.current as HTMLInputElement).focus();
  };

  const createGeofence = async () => {
    if (formData.title !== "" && type !== "" && geofenceType !== "") {
      const url = isEditGeofence
        ? update(
            {
              ...formData,
              type: geofenceType,
              geofencePositions:
                geofenceType === "circle"
                  ? circle
                  : geofenceType === "polygon"
                  ? { bounds: polygon }
                  : rectangle,
            },
            {
              url: `${UPDATE_GEOFENCE}/${editedGeofenceId}`,
            }
          )
        : create(
            {
              ...formData,
              type: geofenceType,
              isActive: true,
              geofencePositions:
                geofenceType === "circle"
                  ? circle
                  : geofenceType === "polygon"
                  ? { bounds: polygon }
                  : rectangle,
            },
            {
              url: CREATE_GEOFENCE,
            }
          );

      try {
        await url.then((data: any) => {
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              return;
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
            }
            if (data.success) {
              setIsNewGeofence(false);
              setIsEditGeofence(false);
              setFormData({ title: "" });
              setGeofenceType("");
              setEditedGeofenceId("");
              dispatch(setType(null));
              fetchGeofences();
            }
          }
        });
      } catch (error: any) {
        console.error("Error creating geofence:", error);
      }
    } else {
      Swal.fire({
        text: "Please fill all the required fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
    }
  };

  const handleCancel = () => {
    setIsNewGeofence(false);
    setIsEditGeofence(false);
    setFormData({ title: "" });
    setGeofenceType("");
    setEditedGeofenceId("");
    dispatch(setType(null));
    handleDeselectAll();
  };

  const handleSelectAll = () => {
    const updatedGeofences = geofences.map((item: any) => ({
      ...item,
      checked: true,
    }));
    setGeofences(updatedGeofences);
  };

  const handleDeselectAll = () => {
    const updatedGeofences = geofences.map((item: any) => ({
      ...item,
      checked: false,
      edited: false,
    }));
    setGeofences(updatedGeofences);
  };

  const handleCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      handleSelectAll();
    } else {
      handleDeselectAll();
    }
  };

  const handleGeofenceCheckboxClick = (e: any, selectedGeofence: any) => {
    e.stopPropagation();
    const updatedGeofences = geofences.map((item: any) => {
      if (item._id === selectedGeofence._id) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    });
    setGeofences(updatedGeofences);
  };

  const handleEditGeofence = (e: any, selectedGeofence: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleGoToReply();

    const updatedGeofences = geofences.map((item: any) => {
      if (item._id === selectedGeofence._id) {
        return {
          ...item,
          checked: true,
          edited: !item.edited,
        };
      } else {
        return {
          ...item,
          checked: false,
          edited: false,
        };
      }
    });

    setGeofences(updatedGeofences);

    if (!selectedGeofence.edited) {
      const updateFormData = {
        ...formData,
        title: selectedGeofence.title,
      };
      setGeofenceType(selectedGeofence.type);
      setEditedGeofenceId(selectedGeofence._id);
      dispatch(setCircle(selectedGeofence.geofencePositions));
      dispatch(setRectangle(selectedGeofence.geofencePositions));
      dispatch(
        setPolygon(
          selectedGeofence.geofencePositions?.bounds ||
            selectedGeofence.geofencePositions
        )
      );
      setFormData(updateFormData);
      setIsEditGeofence(true);
      setIsNewGeofence(false);
    } else {
      setIsEditGeofence(false);
      setIsNewGeofence(false);
      dispatch(setType(null));
    }
  };

  const handleDeleteGeofence = (e: any, selectedGeofence: any) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${selectedGeofence.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Since there's no DELETE_GEOFENCE endpoint, we'll update the geofence to set isActive to false
          const deleteResponse: any = await update(
            { isActive: false },
            { url: `${UPDATE_GEOFENCE}/${selectedGeofence._id}` }
          );

          if (deleteResponse.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Geofence has been deleted.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            fetchGeofences();
          } else {
            Swal.fire({
              text: `${deleteResponse.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          Swal.fire({
            text: "Failed to delete geofence",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  const handleImportGeofence = async (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      setIsImporting(true);
      try {
        await create({}, { url: IMPORT_GEOFENCE }).then((data: any) => {
          if (data.success) {
            Swal.fire({
              text: "Geofences imported successfully",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            fetchGeofences();
          } else {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          setIsImporting(false);
          // Reset the checkbox after import
          e.target.checked = false;
        });
      } catch (error: any) {
        Swal.fire({
          text: `${error.message}`,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsImporting(false);
        e.target.checked = false;
      }
    }
  };

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  const filteredGeofences = geofences.filter((item: any) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      {(isNewGeofence || isEditGeofence) && (
        <div>
          <textarea name="" id="" style={{ display: "none" }}></textarea>
          <form>
            <div
              style={{
                margin: "0px 10px",
                marginTop: "10px",
              }}
            >
              <P>Title</P>
              <input
                className="form-control"
                ref={inputareaRef}
                type="text"
                placeholder="Enter Title"
                name="title"
                value={formData.title}
                onChange={onChangeHandler}
              />
            </div>
            <div
              style={{
                margin: "0px 10px",
              }}
            >
              <P>Type</P>
              <Select
                showSearch
                style={{ width: "100%", height: 36, marginBottom: "15px" }}
                value={
                  type == null && geofenceType == ""
                    ? "Select Type"
                    : geofenceType
                }
                placeholder="Select type"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(e) => {
                  dispatch(setType(e));
                  setGeofenceType(e);
                }}
                options={typeList}
              />
            </div>

            <div style={{ display: "flex" }}>
              <button
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCancel();
                }}
                style={{
                  width: "50%",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  backgroundColor: "green",
                  color: "white",
                  margin: "8px",
                  border: "0px",
                  outline: "none",
                  textAlign: "center",
                }}
              >
                Cancel
              </button>
              <button
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  createGeofence();
                }}
                style={{
                  width: "50%",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  backgroundColor: "green",
                  color: "white",
                  margin: "8px",
                  border: "0px",
                  outline: "none",
                  textAlign: "center",
                }}
              >
                {isEditGeofence ? "Update" : "Add"}
              </button>
            </div>
            <div
              style={{
                padding: "0px 10px",
              }}
            >
              <hr />
            </div>
          </form>
        </div>
      )}

      {/* Search Input */}
      <input
        className=""
        type="text"
        placeholder="Type to Search .."
        value={searchValue}
        onChange={(e: any) => handleSearch(e)}
        style={{
          width: "95%",
          height: "36px",
          padding: "15px 15px",
          boxShadow: "0px 5px 18px lightgray",
          borderRadius: "10px",
          margin: "10px",
          marginBottom: "20px",
          border: "0px",
          outline: "none",
        }}
      />

      {/* Select All Checkbox */}
      <div>
        <div
          style={{
            width: "45%",
            margin: "8px",
            marginBottom: "5px",
            marginLeft: "20px",
            marginTop: "0px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="checkbox"
            id="selectAll"
            checked={
              geofences.length > 0 &&
              geofences.every((item: any) => item.checked)
            }
            onChange={handleCheckboxChange}
            style={{
              marginRight: "10px",
              height: "17px",
              width: "17px",
              cursor: "pointer",
            }}
          />
          <label
            style={{
              color: "#1f2f3e",
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none",
              display: "contents",
              paddingTop: "0px",
              paddingRight: "7px",
              alignContent: "center",
            }}
          >
            Select All ({filteredGeofences.length})
          </label>
        </div>
      </div>

      {/* Geofences List */}
      <div
        style={{
          padding: "0px 10px",
          maxHeight: "82.5vh",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <P>Loading...</P>
          </div>
        ) : filteredGeofences.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <P>No geofences found</P>
          </div>
        ) : (
          filteredGeofences.map((geofence: any) => (
            <div
              key={geofence._id}
              style={{
                padding: "8px 10px",
                boxShadow: "5px 5px 15px lightgray",
                borderRadius: "12px",
                margin: "7px 0px",
                cursor: "pointer",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <label
                    style={{
                      display: "contents",
                      cursor: "pointer",
                      paddingTop: "0px",
                      paddingRight: "7px",
                      alignContent: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      name="key"
                      value="value"
                      style={{
                        marginRight: "10px",
                        color: geofence.checked ? "green" : "inherit",
                      }}
                      checked={geofence.checked}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleGeofenceCheckboxClick(e, geofence);
                      }}
                    />
                    <span onClick={(e) => e.stopPropagation()}></span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {geofence.title.length > 26
                        ? `${geofence.title.slice(0, 26)}...`
                        : geofence.title}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#666",
                      }}
                    >
                      {geofence.type.charAt(0).toUpperCase() +
                        geofence.type.slice(1)}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: geofence.edited ? "green" : "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "5px 8px",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={(e: any) => {
                      handleEditGeofence(e, geofence);
                    }}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "5px 8px",
                      transition: "background-color 0.3s ease",
                      color: "#d33",
                    }}
                    onClick={(e: any) => {
                      handleDeleteGeofence(e, geofence);
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GeofencesListTrip;
