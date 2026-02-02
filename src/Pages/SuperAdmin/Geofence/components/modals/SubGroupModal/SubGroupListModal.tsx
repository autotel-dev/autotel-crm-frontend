import React, { useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../../AbstractElements";
import { PlusCircle } from "react-feather";
import AddSubGroupModal from "./AddSubGroupModal";
import EditSubGroupModal from "./EditSubGroupModal";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { Select } from "antd";
import { create, getAll } from "../../../../../../Utilities/api";
import {
  DELETE_SUBGROUP,
  GET_ALL_GEOFENCES,
  GET_ALL_GROUPS,
  GET_ALL_SUBGROUPS_BY_GROUP_ID,
  TRANSFER_SUBGROUP,
} from "../../../../../../Utilities/api/apiEndpoints";
import deleteAlert, {
  deleteAlertForManyData,
} from "../../../../../../Utilities/alerts/DeleteAlert";
import Swal from "sweetalert2";
import {
  setGeofences,
  setGeofencesGroup,
} from "../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import Loader from "../../../../../Utilities/Loader/Loader";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
}

const SubGroupListModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
  );
  const { geofences, geofencesGroup } = useSelector(
    (state: any) => state.geofence,
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState("");
  const [transferGroup, setTransferGroup] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isAddGroupModalVisible, setIsAddGroupModalVisible] = useState(false);
  const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<any>(null);
  const [latestGeofences, setLatestGeofences] = useState(geofences);
  const [subGroupList, setSubGroupList] = useState([]);
  const [subGroup, setSubGroup] = useState("");
  const [checkedSubGroups, setCheckedSubGroups] = useState<any[]>([]); // New state for checkbox handling

  const addToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const [isTransferDropdownVisible, setIsTransferDropdownVisible] =
    useState(false);

  const openAddGroupModal = () => {
    setIsAddGroupModalVisible(true);
  };

  const closeAddGroupModal = () => {
    setIsAddGroupModalVisible(false);
  };

  const openEditGroupModal = (subGroup: any) => {
    setSelectedSubGroup(subGroup);
    setIsEditGroupModalVisible(true);
  };

  const closeEditGroupModal = () => {
    setIsEditGroupModalVisible(false);
    setSelectedSubGroup(null);
  };

  useEffect(() => {
    setLatestGeofences(geofences);
  }, [geofences]);

  const fetchSubGroups = async (groupId: string) => {
    const subGroupData: any = await getAll({
      url: `${GET_ALL_SUBGROUPS_BY_GROUP_ID}/${groupId}`,
    });

    if (subGroupData.success) {
      const initialCheckedState = subGroupData.data.map((subGroup: any) => ({
        ...subGroup,
        checked: false,
      }));
      setSubGroupList(initialCheckedState);
      setCheckedSubGroups(initialCheckedState);
      setLoading(false);
    } else {
      setSubGroupList([]);
      setCheckedSubGroups([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (group !== "") {
      fetchSubGroups(group);
    }
  }, [isAddGroupModalVisible, isEditGroupModalVisible]);

  const handleCheckboxChange = (id: string) => {
    const updatedCheckedSubGroups = checkedSubGroups.map((subGroup) =>
      subGroup._id === id
        ? { ...subGroup, checked: !subGroup.checked }
        : subGroup,
    );
    setCheckedSubGroups(updatedCheckedSubGroups);
  };

  const deleteSubGroups = () => {
    const body = checkedSubGroups
      .filter((item: any) => item.checked)
      .map((item: any) => item._id);

    // console.log("body", body);

    var alertData = {
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this ",
    };

    deleteAlertForManyData(alertData, DELETE_SUBGROUP, dispatch, {
      subGroups: body,
    }).then(() => {
      fetchSubGroups(group);
      // console.log("calling");
    });
  };

  const deleteSingleGroups = (body: any) => {
    // console.log("body", body);

    var alertData = {
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this",
    };

    deleteAlertForManyData(alertData, DELETE_SUBGROUP, dispatch, {
      subGroups: body,
    }).then(() => {
      fetchSubGroups(group);
      // console.log("calling");
    });
  };

  const transferSubGroups = () => {
    const body = checkedSubGroups
      .filter((item: any) => item.checked)
      .map((item: any) => item._id);

    // console.log("body", body);

    var alertData = {
      title: "Warning?",
      text: `Are You Sure , You want to transfer this subgroups into ${transferGroup.label}`,
    };

    transferSelectedSubgroups(alertData, TRANSFER_SUBGROUP, dispatch, {
      subGroups: body,
      geofenceGroupId: transferGroup?.value,
    }).then(() => {
      fetchSubGroups(group);
      // console.log("calling");
    });
  };

  const transferSelectedSubgroups = (
    alertData: any,
    url: any,
    dispatch: any,
    body?: any,
  ) => {
    return Swal.fire({
      title: alertData.title,
      text: alertData.text,
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            text: "Loading...",
            icon: "info",
            // timer: 2000,
            showCancelButton: false,
            showConfirmButton: false,
          });
          // console.log("caled");

          await create(body, { url: url }).then((data: any) => {
            // console.log("called");
            if (data.success) {
              // console.log(data);

              Swal.fire({
                text: `${data.message}`,
                icon: "success",
                timer: 2500,
              });

              getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
                if (data !== undefined) {
                  if (data.success) {
                    getAll({ url: GET_ALL_GROUPS }).then((data: any) => {
                      if (data.success) {
                        dispatch(setGeofencesGroup(data.data));
                      }
                    });

                    const groups: any[] = [];
                    const groupGeofencesObj: any = {};

                    let subGroups: any = [];
                    let subGroupsGeofencesObj: any = {};
                    let initialSubGroupsGeofences: any = [];

                    data.data.forEach((item: any) => {
                      const group = item.geofenceGroup
                        ? item.geofenceGroup.title
                        : "Ungrouped";
                      if (!groups.includes(group)) {
                        groups.push(group);
                      }
                      if (!groupGeofencesObj[group]) {
                        groupGeofencesObj[group] = [];
                      }
                      groupGeofencesObj[group].push({
                        ...item,
                        checked: false,
                      });
                    });

                    const initialGroupGeofences = Object.keys(
                      groupGeofencesObj,
                    ).map((group) => ({
                      group,
                      checked: false,
                      items: groupGeofencesObj[group],
                      subgroups: [],
                    }));

                    for (let i = 0; i < initialGroupGeofences.length; i++) {
                      // console.log("item.group -- >", initialGroupGeofences[i].group);
                      for (
                        let j = 0;
                        j < initialGroupGeofences[i].items.length;
                        j++
                      ) {
                        var element = "";
                        if (
                          initialGroupGeofences[i].items[j].geofenceSubGroup !==
                          null
                        ) {
                          element =
                            initialGroupGeofences[i].items[j].geofenceSubGroup
                              .title;
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
                                  obj.geofenceSubGroup.title ===
                                  geofenceSubGroup
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
                      console.log(
                        "subGroupsGeofencesObj",
                        subGroupsGeofencesObj,
                      );

                      // Convert groupDevicesObj to initialGroupDevices array format
                      Object.keys(subGroupsGeofencesObj).forEach(
                        (group: any) => {
                          initialSubGroupsGeofences.push({
                            subgroup: group,
                            checked: false,
                            items: subGroupsGeofencesObj[group],
                          });
                        },
                      );

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
                }
              });

              // loading false
            }
          });
          // Handle successful post creation (e.g., show a success message, redirect, etc.)
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Sub Group List</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
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
                  padding: "6px 10px 6px 10px",
                  marginBottom: "10px",
                }}
                onClick={openAddGroupModal}
              >
                <PlusCircle style={{ marginRight: "5px" }} />
                Create New SubGroup
              </button>
            </div>
            <div style={{ margin: "0px 10px" }}>
              <p
                style={{
                  fontWeight: "bold",
                  padding: "2px ",
                  fontSize: "18px",
                  margin: "0px",
                }}
              >
                Select Group
              </p>
              <Select
                showSearch
                style={{ width: "100%", height: 36, marginBottom: "10px" }}
                placeholder="Select group"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={async (value: any, options: any) => {
                  setGroup(value === "none" ? null : value);
                  console.log("options", options);

                  setSelectedGroup(options);
                  setLoading(true);
                  await fetchSubGroups(value);
                }}
                options={[
                  { label: "None", value: "none" },
                  ...geofencesGroup.map((group: any) => ({
                    label: group?.title,
                    value: group?._id,
                  })),
                ]}
                value={group || undefined}
              />
            </div>

            <div style={{ margin: "0px 10px" }}>
              <P>
                <span
                  style={{
                    fontWeight: "bold",
                    padding: "0px 0px",
                    fontSize: "18px",
                  }}
                >
                  Sub Groups
                </span>
              </P>

              <div
                style={{
                  overflow: "scroll",
                  scrollbarWidth: "none",
                  height: "50vh",
                }}
              >
                {loading ? (
                  <Loader />
                ) : subGroupList.length > 0 ? (
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    <input
                      style={{ marginBottom: "20px" }}
                      className="form-control"
                      type="text"
                      placeholder="Search subgroups..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          width: "45%",
                          margin: "7px",
                          marginBottom: "5px",
                          marginLeft: "10px",
                          marginTop: "0px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="selectAll"
                          checked={checkedSubGroups.every(
                            (subGroup) => subGroup.checked,
                          )}
                          onChange={() => {
                            const allChecked = !checkedSubGroups.every(
                              (subGroup) => subGroup.checked,
                            );
                            const updatedCheckedSubGroups =
                              checkedSubGroups.map((subGroup) => ({
                                ...subGroup,
                                checked: allChecked,
                              }));
                            setCheckedSubGroups(updatedCheckedSubGroups);
                          }}
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
                          Select All ({subGroupList.length})
                        </label>
                      </div>
                      {checkedSubGroups.some(
                        (subGroup) => subGroup.checked,
                      ) && (
                        <div>
                          <button
                            style={{
                              border: "none",
                              borderRadius: "5px",
                              backgroundColor: "#FF4433",
                              color: "white",
                              padding: "5px 8px",
                              marginRight: "10px",
                            }}
                            onClick={deleteSubGroups}
                          >
                            {checkedSubGroups.every(
                              (subGroup) => subGroup.checked,
                            )
                              ? "Delete All"
                              : "Delete"}
                          </button>
                          <button
                            style={{
                              color: "white",
                              backgroundColor: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor
                              }`,
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px 8px",
                            }}
                            onClick={() => {
                              if (isTransferDropdownVisible) {
                                setTransferGroup(null);
                              }
                              setIsTransferDropdownVisible((prev) => !prev);
                            }}
                          >
                            {isTransferDropdownVisible
                              ? "Cancel"
                              : checkedSubGroups.every(
                                    (subGroup) => subGroup.checked,
                                  )
                                ? "Transfer All"
                                : "Transfer"}
                          </button>
                        </div>
                      )}
                    </div>
                    {isTransferDropdownVisible && (
                      <div style={{ margin: "5px 0px 10px 0px" }}>
                        <P
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            margin: "10px 0px",
                          }}
                        >
                          Select Group to Transfer
                        </P>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Select
                            showSearch
                            style={{
                              width: "90%",
                              height: 36,
                              marginBottom: "10px",
                            }}
                            placeholder="Select group to transfer"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            onChange={(value: any, options: any) => {
                              console.log("Selected transfer group:", value);
                              setTransferGroup(options);
                              // Handle the group selection for transfer logic here
                            }}
                            options={[
                              { label: "None", value: "none" },
                              ...geofencesGroup.map((group: any) => ({
                                label: group?.title,
                                value: group?._id,
                              })),
                            ]}
                            value={transferGroup?.value || undefined}
                          />
                          <button
                            style={{
                              border: "none",
                              borderRadius: "5px",
                              backgroundColor: `${
                                userPersonalizationData !== null &&
                                userPersonalizationData?.buttonsAndBarsColor
                              }`,
                              color: "white",
                              padding: "5px 8px",
                              marginLeft: "15px",
                              height: "36px",
                            }}
                            onClick={transferSubGroups}
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    )}

                    {checkedSubGroups.map((subGroup: any) => (
                      <div key={subGroup._id}>
                        <li
                          style={{
                            border: "none",
                            borderRadius: "10px",
                            padding: "8px 10px",
                            marginTop: "6px",
                            marginBottom: "6px",
                            marginRight: "2px",
                            marginLeft: "2px",
                            boxShadow: "lightgray 2px 2px 5px",
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <input
                              type="checkbox"
                              name="key"
                              value={subGroup._id}
                              style={{ marginRight: "10px" }}
                              checked={subGroup.checked}
                              onChange={() =>
                                handleCheckboxChange(subGroup._id)
                              }
                            />
                            <span>{subGroup.title}</span>
                          </div>

                          <div>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                              }}
                              onClick={() => {
                                const body = [subGroup._id];
                                deleteSingleGroups(body);
                              }}
                            >
                              <MdDelete color="red" size={20} />
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                              }}
                              onClick={() => openEditGroupModal(subGroup)}
                            >
                              <AiFillEdit color="green" size={20} />
                            </button>
                          </div>
                        </li>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p>No subgroups found</p>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
      <AddSubGroupModal
        isVisible={isAddGroupModalVisible}
        setIsVisible={setIsAddGroupModalVisible}
        geofences={latestGeofences}
      />
      {selectedSubGroup && (
        <EditSubGroupModal
          isVisible={isEditGroupModalVisible}
          setIsVisible={setIsEditGroupModalVisible}
          geofences={latestGeofences}
          group={selectedGroup} // Pass the selected subgroup
          subGroup={selectedSubGroup}
        />
      )}
    </Col>
  );
};

export default SubGroupListModal;
