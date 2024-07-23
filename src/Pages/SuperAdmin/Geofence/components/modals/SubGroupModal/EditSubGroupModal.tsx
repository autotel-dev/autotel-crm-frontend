// // EditGroupModal.jsx

import React, { useState, useEffect } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch } from "react-redux";
import { H4, P } from "../../../../../../AbstractElements";
import { update, getAll } from "../../../../../../Utilities/api";
import { Select } from "antd";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
  setGeofences,
  setGeofencesGroup,
} from "../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import {
  UPDATE_GROUP,
  GET_ALL_GEOFENCES,
  GET_ALL_GROUPS,
  GET_ALL_GEOFENCES_BY_GROUP_ID,
  GET_ALL_GEOFENCES_BY_SUBGROUP,
  UPDATE_SUBGROUP,
} from "../../../../../../Utilities/api/apiEndpoints";
import { number } from "yup";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  geofences: any[];
  group: any; // Adding group prop
  subGroup: any;
}

const EditSubGroupModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  geofences,
  group, // Destructuring group prop
  subGroup,
}) => {
  const dispatch = useDispatch();
  console.log("get Options", group);
  console.log("get subgroup", subGroup);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: subGroup?.title || "",
    isActive: true,
  }); // Initialize with group title

  useEffect(() => {
    if (subGroup) {
      setFormData({ title: subGroup.title || "", isActive: true }); // Update form data if group prop changes
    }
  }, [subGroup]);
  const [subGroupedGeofencesList, setSubGroupedGeofencesList]: any = useState(
    []
  );
  const [groupedGeofencesList, setGroupedGeofencesList]: any = useState([]);

  useEffect(() => {
    if (group) {
      getAll({ url: `${GET_ALL_GEOFENCES_BY_GROUP_ID}/${group.value}` }).then(
        (data: any) => {
          console.log("group-data", data);

          if (data !== undefined) {
            if (data.success) {
              setGroupedGeofencesList(
                data.data.map((item: any) => ({
                  label: item?.title,
                  value: item?._id,
                  checked: false,
                }))
              );
            }
          }
        }
      );
    }
  }, [isVisible]); // Removed dependencies to run only on mount

  useEffect(() => {
    if (subGroup) {
      getAll({ url: `${GET_ALL_GEOFENCES_BY_SUBGROUP}/${subGroup._id}` }).then(
        (data: any) => {
          console.log("subgroup-data", data);

          if (data !== undefined) {
            if (data.success) {
              setSubGroupedGeofencesList(
                data.data.map((item: any) => ({
                  label: item?.title,
                  value: item?._id,
                  checked: true,
                }))
              );
            }
          }
        }
      );
    }
  }, [isVisible]); // Removed dependencies to run only on mount

  const updateGroupDetails = async () => {
    const allcheckedGroupedGeofences = groupedGeofencesList
      .filter((item: any) => item.checked)
      .map((item: any) => item.value);

    const allcheckedIngroupedGeofences = subGroupedGeofencesList
      .filter((item: any) => item.checked)
      .map((item: any) => item.value);

    if (formData.title !== "") {
      try {
        await update(
          {
            ...formData,
            geofences: [
              ...allcheckedGroupedGeofences,
              ...allcheckedIngroupedGeofences,
            ],
          },
          { url: `${UPDATE_SUBGROUP}/${subGroup._id}` }
        ).then(async (data: any) => {
          if (data.success) {
            getAll({ url: GET_ALL_GROUPS }).then((data: any) => {
              if (data.success) {
                dispatch(setGeofencesGroup(data.data));
              }
            });

            const geofencesData: any = await getAll({
              url: GET_ALL_GEOFENCES,
            });
            if (geofencesData.success) {
              const groups: any[] = [];
              const groupGeofencesObj: any = {};

              let subGroups: any = [];
              let subGroupsGeofencesObj: any = {};
              let initialSubGroupsGeofences: any = [];

              geofencesData.data.forEach((item: any) => {
                const group = item.geofenceGroup
                  ? item.geofenceGroup.title
                  : "Ungrouped";
                if (!groups.includes(group)) {
                  groups.push(group);
                }
                if (!groupGeofencesObj[group]) {
                  groupGeofencesObj[group] = [];
                }
                groupGeofencesObj[group].push({ ...item, checked: false });
              });

              const initialGroupGeofences = Object.keys(groupGeofencesObj).map(
                (group) => ({
                  group,
                  checked: false,
                  items: groupGeofencesObj[group],
                  subgroups: [],
                })
              );

              for (let i = 0; i < initialGroupGeofences.length; i++) {
                // console.log("item.group -- >", initialGroupGeofences[i].group);
                for (
                  let j = 0;
                  j < initialGroupGeofences[i].items.length;
                  j++
                ) {
                  var element = "";
                  if (
                    initialGroupGeofences[i].items[j].geofenceSubGroup !== null
                  ) {
                    element =
                      initialGroupGeofences[i].items[j].geofenceSubGroup.title;
                  }
                  // const element = data.data[i].geofenceGroup.title;
                  if (!subGroups.includes(element)) {
                    if (element !== "") {
                      subGroups.push(element);
                    }
                  }
                }
                console.log("subGroups", subGroups);

                subGroups.forEach((geofenceSubGroup: any) => {
                  subGroupsGeofencesObj[geofenceSubGroup] =
                    initialGroupGeofences[i].items
                      .filter((obj: any) => {
                        if (
                          !obj.geofenceSubGroup ||
                          !obj.geofenceSubGroup.title
                        ) {
                          return;
                        } else {
                          return (
                            obj.geofenceSubGroup.title === geofenceSubGroup
                          );
                        }
                      })
                      .map((item: any) => ({
                        ...item,
                        checked: false,
                        edited: false,
                      }));
                });

                // console.log(groups);
                console.log("subGroupsGeofencesObj", subGroupsGeofencesObj);

                // Convert groupDevicesObj to initialGroupDevices array format
                Object.keys(subGroupsGeofencesObj).forEach((group: any) => {
                  initialSubGroupsGeofences.push({
                    subgroup: group,
                    checked: false,
                    items: subGroupsGeofencesObj[group],
                  });
                });

                initialGroupGeofences[i] = {
                  ...initialGroupGeofences[i],
                  subgroups: initialSubGroupsGeofences,
                };

                subGroups = [];
                subGroupsGeofencesObj = {};
                initialSubGroupsGeofences = [];
              }
              dispatch(setGeofences(initialGroupGeofences));
            }

            addToggle();
            setLoading(false);
            Swal.fire({
              text: "Group Updated successfully",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        Swal.fire({
          text: "Error creating group",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        text: "Please provide a title",
        icon: "info",
        timer: 2000,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };
  const { register, handleSubmit, setValue, reset } = useForm();

  const [selectAll, setSelectAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const filteredGeofences = groupedGeofencesList.filter((geofence: any) =>
    geofence.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  useEffect(() => {
    const allChecked = groupedGeofencesList.every((item: any) => item.checked);
    setSelectAll(allChecked);
  }, [groupedGeofencesList]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const updatedList = groupedGeofencesList.map((geofence: any) => ({
      ...geofence,
      checked: checked,
    }));
    setGroupedGeofencesList(updatedList);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onGeofenceChange = (checkedValue: boolean, index: number) => {
    const tempList: any = [...groupedGeofencesList];
    tempList[index] = { ...tempList[index], checked: checkedValue };
    setGroupedGeofencesList(tempList);

    const allChecked = tempList.every((item: any) => item.checked);
    setSelectAll(allChecked);
  };

  //   ----------------Ungrouped Geofences Functionality-------------------

  const [selectAllUngroupedGeofences, setSelectAllUngroupedGeofences] =
    useState(false);
  const [searchValue2, setSearchValue2] = useState("");
  const filteredSubGroupedGeofences = subGroupedGeofencesList.filter(
    (geofence: any) =>
      geofence.label.toLowerCase().includes(searchValue2.toLowerCase())
  );
  useEffect(() => {
    const allChecked = subGroupedGeofencesList.every(
      (item: any) => item.checked
    );
    setSelectAllUngroupedGeofences(allChecked);
  }, [subGroupedGeofencesList]);

  const handleSelectAllUngroupedGeofencesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setSelectAllUngroupedGeofences(checked);
    const updatedList = subGroupedGeofencesList.map((geofence: any) => ({
      ...geofence,
      checked: checked,
    }));
    setSubGroupedGeofencesList(updatedList);
  };

  const handleUngroupedSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue2(e.target.value);
  };

  const onUngroupedGeofenceChange = (checkedValue: boolean, index: number) => {
    const tempList: any = [...subGroupedGeofencesList];
    tempList[index] = { ...tempList[index], checked: checkedValue };
    setSubGroupedGeofencesList(tempList);

    const allChecked = tempList.every((item: any) => item.checked);
    setSelectAllUngroupedGeofences(allChecked);
  };

  const addToggle = () => {
    setIsVisible(!isVisible);
  };
  const [subgroupGeofencesList, setSubgroupGeofencesList]: any = useState([]);
  const handleGeofenceChange = (index: number) => {
    const updatedList = [...subgroupGeofencesList];
    updatedList[index].checked = !updatedList[index].checked;
    setSubgroupGeofencesList(updatedList);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (subGroup) {
      setValue("title", subGroup.title); // Populate title field with subgroup label
    }
  }, [subGroup, setValue]);

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Edit Sub Group</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form>
              <div style={{ margin: "0px 10px" }}>
                {/* <label htmlFor="title">Title</label> */}
                <P>
                  <span style={{ fontWeight: "700", marginTop: "10px" }}>
                    Title
                  </span>
                </P>
                <input
                  id="title"
                  className="form-control"
                  {...register("title", { required: true })}
                />
                {/* <p
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Group
                </p> */}
                <P>
                  <span style={{ fontWeight: "700", marginTop: "10px" }}>
                    Group
                  </span>
                </P>
                <Select
                  disabled
                  showSearch
                  style={{ width: "100%", height: 36, marginBottom: "10px" }}
                  placeholder="Select group"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={group}
                />
              </div>

              <div style={{ margin: "0px 10px" }}>
                <P>
                  <span style={{ fontWeight: "700", marginTop: "10px" }}>
                    {formData.title} Geofences
                  </span>
                </P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search geofences..."
                  value={searchValue2}
                  onChange={handleUngroupedSearchChange}
                />
                {filteredSubGroupedGeofences.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "15px 0px 0px 0px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "700",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllUngroupedGeofences}
                        onChange={handleSelectAllUngroupedGeofencesChange}
                        style={{ marginRight: "8px" }}
                      />
                      Select All
                    </label>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "0px 0px",
                  }}
                >
                  {filteredSubGroupedGeofences.map(
                    (geofence: any, index: any) => (
                      <label
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexBasis: "20%",
                          marginBottom: "8px",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={geofence.value}
                          checked={geofence.checked}
                          onChange={(e) =>
                            onUngroupedGeofenceChange(e.target.checked, index)
                          }
                          style={{ marginRight: "8px" }}
                        />
                        {geofence.label}
                      </label>
                    )
                  )}
                </div>
              </div>
              {/* ---------------------- */}

              <div style={{ margin: "0px 10px" }}>
                <P>
                  <span style={{ fontWeight: "700", marginTop: "10px" }}>
                    {group.label} Geofences
                  </span>
                </P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search geofences..."
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                {filteredGeofences.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "15px 0px 0px 0px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "700",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                        style={{ marginRight: "8px" }}
                      />
                      Select All
                    </label>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "0px 0px",
                  }}
                >
                  {filteredGeofences.map((geofence: any, index: any) => (
                    <label
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "20%",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={geofence.value}
                        checked={geofence.checked}
                        onChange={(e) =>
                          onGeofenceChange(e.target.checked, index)
                        }
                        style={{ marginRight: "8px" }}
                      />
                      {geofence.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* ----------------- */}

              {/* Include your geofences list rendering here */}
              {/* You might need to update geofencesList state and its related logic */}
              <div>{/* Your geofences selection UI */}</div>
              <div style={{ display: "flex", marginTop: "15px" }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToggle();
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
                  onClick={(e) => {
                    e.preventDefault();
                    setLoading(true);
                    updateGroupDetails();
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
                  {loading ? "Loading..." : "Update"}
                </button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default EditSubGroupModal;
