import React, { useState, useEffect } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../Utilities/api";
import Swal from "sweetalert2";
import {
  setGeofences,
  setGeofencesGroup,
} from "../../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import { log } from "console";
import {
  CREATE_GROUP,
  GET_ALL_GEOFENCES,
  GET_ALL_GROUPS,
} from "../../../../../../Utilities/api/apiEndpoints";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  geofences: any[];
}

const AddGroupModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  geofences,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();

  const [geofencesList, setGeofencesList]: any = useState([]);
  // const [geofencesList, setGeofencesList] = useState(() => {
  //   const ungroupedGeofence = geofences.find(
  //     (geofence) => geofence.group === "Ungrouped"
  //   );

  //   if (ungroupedGeofence) {
  //     return ungroupedGeofence.items.map((item: any) => ({
  //       label: item?.title,
  //       value: item?._id,
  //       checked: false,
  //     }));
  //   }

  //   return [];
  // });

  useEffect(() => {
    setGeofencesList(() => {
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
  }, [geofences]);

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [searchValue, setSearchValue] = useState("");

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

  const createGroup = async () => {
    const allcheckedGeofences = geofencesList
      .filter((item: any) => item.checked)
      .map((item: any) => item.value);

    if (formData.title !== "") {
      try {
        await create(
          {
            ...formData,
            geofences: allcheckedGeofences,
          },
          { url: CREATE_GROUP }
        ).then(async (data: any) => {
          if (data.success) {
            Swal.fire({
              text: "Group created successfully",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

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

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Filter geofences based on search query
  const filteredGeofences = geofencesList.filter((geofence: any) =>
    geofence.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  console.log("checking data arry");
  console.log(filteredGeofences);

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Group</H4>
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
                  onChange={onChangeHandler}
                />
              </div>
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
                    createGroup();
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

export default AddGroupModal;
