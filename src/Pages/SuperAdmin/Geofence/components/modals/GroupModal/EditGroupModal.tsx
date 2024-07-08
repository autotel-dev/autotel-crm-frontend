// // EditGroupModal.jsx

import React, { useState, useEffect } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch } from "react-redux";
import { H4, P } from "../../../../../../AbstractElements";
import { update, getAll } from "../../../../../../Utilities/api";
import Swal from "sweetalert2";
import {
  setGeofences,
  setGeofencesGroup,
} from "../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import {
  UPDATE_GROUP,
  GET_ALL_GEOFENCES,
  GET_ALL_GROUPS,
  GET_ALL_GEOFENCES_BY_GROUP_ID,
} from "../../../../../../Utilities/api/apiEndpoints";
import { number } from "yup";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  geofences: any[];
  group: any; // Adding group prop
}

const EditGroupModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible,
  geofences,
  group, // Destructuring group prop
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: group?.title || "",
    isActive: true,
  }); // Initialize with group title

  useEffect(() => {
    if (group) {
      setFormData({ title: group.title || "", isActive: true }); // Update form data if group prop changes
    }
  }, [group]);
  const [groupedGeofencesList, setGroupedGeofencesList]: any = useState([]);
  const [ungroupedGeofencesList, setUngroupedGeofencesList]: any = useState([]);
  useEffect(() => {
    setUngroupedGeofencesList(() => {
      const ungroupedGeofence = geofences.find(
        (geofence) => geofence.group === "Ungrouped"
      );

      if (ungroupedGeofence) {
        return ungroupedGeofence.items.map((item: any) => ({
          label: item?.title,
          value: item?._id,
          checked: false,
        }));
      }

      return [];
    });
  }, [group]);

  useEffect(() => {
    getAll({ url: `${GET_ALL_GEOFENCES_BY_GROUP_ID}/${group._id}` }).then(
      (data: any) => {
        console.log("group-data", data);

        // console.log("api call --- >", data);

        if (data !== undefined) {
          if (data.success) {
            setGroupedGeofencesList(
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
  }, [group]);

  const updateGroupDetails = async () => {
    const allcheckedGroupedGeofences = groupedGeofencesList
      .filter((item: any) => item.checked)
      .map((item: any) => item.value);

    const allcheckedIngroupedGeofences = ungroupedGeofencesList
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
          { url: `${UPDATE_GROUP}/${group._id}` }
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
  const filteredUngroupedGeofences = ungroupedGeofencesList.filter(
    (geofence: any) =>
      geofence.label.toLowerCase().includes(searchValue2.toLowerCase())
  );
  useEffect(() => {
    const allChecked = ungroupedGeofencesList.every(
      (item: any) => item.checked
    );
    setSelectAllUngroupedGeofences(allChecked);
  }, [ungroupedGeofencesList]);

  const handleSelectAllUngroupedGeofencesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setSelectAllUngroupedGeofences(checked);
    const updatedList = ungroupedGeofencesList.map((geofence: any) => ({
      ...geofence,
      checked: checked,
    }));
    setUngroupedGeofencesList(updatedList);
  };

  const handleUngroupedSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue2(e.target.value);
  };

  const onUngroupedGeofenceChange = (checkedValue: boolean, index: number) => {
    const tempList: any = [...ungroupedGeofencesList];
    tempList[index] = { ...tempList[index], checked: checkedValue };
    setUngroupedGeofencesList(tempList);

    const allChecked = tempList.every((item: any) => item.checked);
    setSelectAllUngroupedGeofences(allChecked);
  };

  const addToggle = () => {
    setIsVisible(!isVisible);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Edit Group</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form>
              <div style={{ margin: "0px 10px" }}>
                <P>
                  <span style={{ fontWeight: "700" }}>Title</span>
                </P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  value={formData.title}
                  onChange={onChangeHandler}
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

              {/* ---------------------- */}
              <div style={{ margin: "0px 10px" }}>
                <P>
                  <span style={{ fontWeight: "700", marginTop: "10px" }}>
                    Ungrouped Geofences
                  </span>
                </P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search geofences..."
                  value={searchValue2}
                  onChange={handleUngroupedSearchChange}
                />
                {filteredUngroupedGeofences.length > 0 && (
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
                  {filteredUngroupedGeofences.map(
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

export default EditGroupModal;
