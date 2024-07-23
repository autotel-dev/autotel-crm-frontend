import React, { useState, useEffect } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../../AbstractElements";
import { Select } from "antd";
import { create, getAll } from "../../../../../../Utilities/api";
import Swal from "sweetalert2";
import {
  setGeofences,
  setGeofencesGroup,
  setGeofencesSubGroup,
} from "../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import {
  CREATE_SUBGROUP,
  GET_ALL_GEOFENCES,
  GET_ALL_GEOFENCES_BY_GROUP_ID,
  GET_ALL_SUBGROUPS,
} from "../../../../../../Utilities/api/apiEndpoints";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  geofences: any[];
}

const AddSubGroupModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  geofences,
}) => {
  const { geofencesGroup } = useSelector((state: any) => state.geofence);
  const dispatch = useDispatch();

  const [group, setGroup] = useState<any>(null);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [geofencesList, setGeofencesList] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const updatedGroupList = [
      { label: "None", value: "none" },
      ...geofencesGroup.map((item: any) => ({
        label: item?.title,
        value: item?._id,
      })),
    ];
    setGroupList(updatedGroupList);
  }, [geofencesGroup]);

  useEffect(() => {
    const allChecked = geofencesList.every((item: any) => item.checked);
    setSelectAll(allChecked);
  }, [geofencesList]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const updatedList = geofencesList.map((geofence: any) => ({
      ...geofence,
      checked: checked,
    }));
    setGeofencesList(updatedList);
  };

  const onGeofenceChange = (checkedValue: boolean, index: number) => {
    const tempList = [...geofencesList];
    tempList[index] = { ...tempList[index], checked: checkedValue };
    setGeofencesList(tempList);

    const allChecked = tempList.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  const createSubGroup = async () => {
    const allcheckedGeofences = geofencesList
      .filter((item: any) => item.checked)
      .map((item: any) => item.value);

    if (formData.title !== "") {
      try {
        const response: any = await create(
          { ...formData, geofenceGroup: group, geofences: allcheckedGeofences },
          { url: CREATE_SUBGROUP }
        );

        if (response.success) {
          Swal.fire({
            text: "Group created successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          const subGroupsData: any = await getAll({
            url: GET_ALL_SUBGROUPS,
          });
          if (subGroupsData.success) {
            dispatch(setGeofencesSubGroup(subGroupsData.data));
          }

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
              for (let j = 0; j < initialGroupGeofences[i].items.length; j++) {
                var element = "";
                if (
                  initialGroupGeofences[i].items[j].geofenceSubGroup !== null
                ) {
                  element =
                    initialGroupGeofences[i].items[j].geofenceSubGroup.title;
                }
                if (!subGroups.includes(element)) {
                  if (element !== "") {
                    subGroups.push(element);
                  }
                }
              }

              subGroups.forEach((geofenceSubGroup: any) => {
                subGroupsGeofencesObj[geofenceSubGroup] = initialGroupGeofences[
                  i
                ].items
                  .filter((obj: any) => {
                    if (!obj.geofenceSubGroup || !obj.geofenceSubGroup.title) {
                      return;
                    } else {
                      return obj.geofenceSubGroup.title === geofenceSubGroup;
                    }
                  })
                  .map((item: any) => ({
                    ...item,
                    checked: false,
                    edited: false,
                  }));
              });

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
        } else {
          Swal.fire({
            text: `${response.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        setLoading(false);
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

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
      setGroup("");
      setGeofencesList([]);
    }
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredGeofences = geofencesList.filter((geofence: any) =>
    geofence.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Sub Group</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form>
              <div style={{ margin: "0px 10px" }}>
                <P>Title</P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  onChange={onChangeHandler}
                />
              </div>
              <div style={{ margin: "0px 10px" }}>
                <P>
                  <span style={{ fontWeight: "700", marginTop: "5px" }}>
                    Groups
                  </span>
                </P>
                <Select
                  showSearch
                  style={{ width: "100%", height: 36, marginBottom: "15px" }}
                  placeholder="Select group"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={async (e: any) => {
                    setGroup(e);
                    if (e === "none") {
                      setGeofencesList([]);
                      return;
                    }
                    const geofencesData: any = await getAll({
                      url: `${GET_ALL_GEOFENCES_BY_GROUP_ID}/${e}`,
                    });
                    if (geofencesData.success) {
                      setGeofencesList(
                        geofencesData.data.map((item: any) => ({
                          label: item?.title,
                          value: item?._id,
                          checked: false,
                        }))
                      );
                    }
                  }}
                  options={groupList}
                  value={group || ""}
                />
                {group && group !== "none" && filteredGeofences.length > 0 && (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search geofences..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
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
                  </>
                )}
              </div>
              <div style={{ display: "flex", marginTop: "15px" }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                    e.stopPropagation();
                    setLoading(true);
                    createSubGroup();
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
                  {loading ? "Loading..." : "Create"}
                </button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default AddSubGroupModal;
