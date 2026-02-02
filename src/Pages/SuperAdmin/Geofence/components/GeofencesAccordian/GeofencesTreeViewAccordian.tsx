import {
  ChangeEvent,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Row,
} from "reactstrap";
import FeatherIcons from "../../../../../utils/CommonSvgIcon/FeatherIcons";

import { Form, FormGroup, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import "./inputStyle.css";
import { FaRegEdit } from "react-icons/fa";
import { P } from "../../../../../AbstractElements";
import { Select } from "antd";
import {
  setCircle,
  setGeofences,
  setGeofencesDetailData,
  setPolygon,
  setRectangle,
  setType,
  setEditedItem,
} from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import { create, getAll, update } from "../../../../../Utilities/api";
import Swal from "sweetalert2";
import {
  CREATE_GEOFENCE,
  GET_ALL_GEOFENCES,
  GET_ALL_SUBGROUPS_BY_GROUP_ID,
  IMPORT_GEOFENCE,
  UPDATE_GEOFENCE,
} from "../../../../../Utilities/api/apiEndpoints";

interface PropTypes {
  statusDevices: String;
  isNewGeofence: boolean;
  setIsNewGeofence: any;
  isEditGeofence: boolean;
  setIsEditGeofence: any;
  isNewGroup: boolean;
  setIsNewGroup: any;
  isNewSubGroup: boolean;
  setIsNewSubGroup: any;
  group: any;
  setGroup: any;
  geofenceType: any;
  setGeofenceType: any;
  formData: any;
  setFormData: any;
}

const GeofencesTreeViewAccordian = ({
  isNewGeofence,
  setIsNewGeofence,
  isEditGeofence,
  setIsEditGeofence,
  group,
  setGroup,
  geofenceType,
  setGeofenceType,
  formData,
  setFormData,
}: PropTypes) => {
  const svgRef = useRef(null);

  const [itemsLength, setItemsLength] = useState(15);
  const [subGroup, setSubGroup] = useState("");
  const [subGroupList, setSubGroupList] = useState([]);

  const {
    geofences,
    type,
    circle,
    rectangle,
    polygon,
    geofencesGroup,
    geofencesDetailData,
    editedItem,
  } = useSelector((state: any) => state.geofence);
  const [searchValue, setSearchValue] = useState("");
  const [searchSubGroupValue, setSearchSubGroupValue] = useState("");
  const [open, setOpen] = useState("");
  const [matchedGroups, setMatchedGroups] = useState(geofences);
  const [Devicess, setDevicess]: any = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // // console.log("devices", devices);

  useEffect(() => {
    if (searchValue.length >= 1) {
      setOpen("all");
      setInnerOpen("all");
    } else {
      setOpen("");
      setInnerOpen("");
    }
  }, [searchValue]);

  useEffect(() => {
    setMatchedGroups(geofences);
  }, [geofences]);

  const toggle = (id: string) => {
    open == id ? setOpen("") : setOpen(id);
    setItemsLength(15);
  };

  const handleCheckboxClick = (e: any, group: any) => {
    // Prevent the click event from propagating to the accordion

    e.stopPropagation();

    const updatedGeofences = geofences.map((geofence: any) => {
      if (geofence.group === group.group) {
        const updatedItems = geofence.items.map((item: any) => ({
          ...item,
          checked: !group.checked, // Set checked to the opposite of group.checked
        }));

        var updatedSubGroups: any = [];
        geofence.subgroups.map((subgroup: any) => {
          var updatedSubGroupsItems = subgroup.items.map((item: any) => ({
            ...item,
            checked: !group.checked, // Set checked to the opposite of group.checked
          }));
          updatedSubGroups.push({
            ...subgroup,
            checked: !group.checked,
            items: updatedSubGroupsItems,
          });
        });

        return {
          ...geofence,
          checked: !group.checked,
          items: updatedItems,
          subgroups: updatedSubGroups,
        };
      }
      return geofence;
    });

    dispatch(setGeofences(updatedGeofences));
  };

  const handleSubGroupCheckboxClick = (e: any, group: any, subGroup: any) => {
    // console.log("group", group);
    // console.log("subGroup", subGroup);

    const updatedGeofences = geofences.map((geofence: any) => {
      if (geofence.group === group.group) {
        const updatedItems = geofence.items.map((itemm: any) => ({
          ...itemm,
          checked:
            itemm?.geofenceSubGroup?.title == subGroup.subgroup
              ? !itemm.checked
              : itemm.checked, // Set checked to the opposite of group.checked
        }));

        // const checkedAllSubGroups = geofence?.subgroups?.every(
        //   (subgroup: any) => subgroup.checked
        // );

        var subGroupToUpdate = geofence?.subgroups?.find(
          (subgroup: any) => subGroup.subgroup == subgroup.subgroup,
        );

        // console.log("subGroupToUpdate", subGroupToUpdate);

        var updatedSubGroupGeofences = subGroupToUpdate.items.map(
          (itemm: any) => ({
            ...itemm,
            checked: !subGroup.checked, // Set checked to the opposite of group.checked
          }),
        );
        var updatedSubGroups = geofence?.subgroups?.map((subgroup: any) => {
          if (subgroup.subgroup == subGroup.subgroup) {
            return {
              ...subGroupToUpdate,
              checked: !subGroup.checked,
              items: updatedSubGroupGeofences,
            };
          } else {
            return {
              ...subgroup,
            };
          }
        });
        // console.log("geofence.items", geofence.items);

        return {
          ...geofence,
          checked: updatedItems.every((item: any) => item.checked),
          items: updatedItems,
          subgroups: updatedSubGroups,
          // subgroups: [
          //   ...geofence.subgroups,
          //   {
          //     ...subGroupToUpdate,
          //     checked: !subGroup.checked,
          //     items: updatedSubGroupGeofences,
          //   },
          // ],
        };
      }
      return geofence;
    });

    dispatch(setGeofences(updatedGeofences));
  };

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleSelecetdDevices = (
    e: any,
    group: any,
    selectedGeofence: any,
    index: any,
  ) => {
    // Prevent the click event from propagating to the accordion
    e.stopPropagation();

    // Find the device corresponding to the group title

    var geofenceToUpdate = geofences.find(
      (geofence: any) => geofence.group === group.group,
    );
    // console.log(geofenceToUpdate);

    if (geofenceToUpdate && geofenceToUpdate.items[index]) {
      const lastIndex = geofenceToUpdate.items.length;
      var allItemsChecked = geofenceToUpdate.items
        .slice(0, index)
        .concat(geofenceToUpdate.items.slice(index + 1, lastIndex))
        .every((item: any) => item.checked === true);
      if (
        allItemsChecked &&
        selectedGeofence._id === geofenceToUpdate.items[index]._id &&
        !geofenceToUpdate.checked
      ) {
        allItemsChecked = true;
      } else {
        allItemsChecked = false;
      }

      const updatedGeofence = {
        ...geofenceToUpdate,
        checked: allItemsChecked,
        items: geofenceToUpdate.items.map((item: any) => {
          if (selectedGeofence._id === item._id) {
            // commenetd code is below the function

            return {
              ...item,
              checked: !selectedGeofence.checked,
              // isEdit: false,
            };
          }

          return item; // Return the item as it is if IDs don't match
        }),
      };

      const updatedGeofences = geofences.map((geofence: any) =>
        geofence.group === group.group ? updatedGeofence : geofence,
      );
      // Create a new array of devices with the updated device object at the same index
      dispatch(setGeofences(updatedGeofences));
      // console.log(updatedGeofences);
    }
  };

  const handleSelecetdSubGroupDevices = (
    e: any,
    group: any,
    subGroup: any,
    selectedGeofence: any,
    index: any,
  ) => {
    // Prevent the click event from propagating to the accordion
    e.stopPropagation();
    // console.log(e, group, subGroup, selectedGeofence, index);

    var geofenceToUpdate = geofences.find(
      (geofence: any) => geofence.group === group.group,
    );
    // console.log(geofenceToUpdate);

    if (geofenceToUpdate && geofenceToUpdate.items[index]) {
      const lastIndex = geofenceToUpdate.items.length;
      var allItemsChecked = geofenceToUpdate.items
        .slice(0, index)
        .concat(geofenceToUpdate.items.slice(index + 1, lastIndex))
        .every((item: any) => item.checked === true);
      if (
        allItemsChecked &&
        selectedGeofence._id === geofenceToUpdate.items[index]._id &&
        !geofenceToUpdate.checked
      ) {
        allItemsChecked = true;
      } else {
        allItemsChecked = false;
      }

      const updatedGeofence = {
        ...geofenceToUpdate,
        checked: allItemsChecked,
        items: geofenceToUpdate.items.map((item: any) => {
          if (selectedGeofence._id === item._id) {
            return {
              ...item,
              checked: !selectedGeofence.checked,
              // isEdit: false,
            };
          }
          return item; // Return the item as it is if IDs don't match
        }),
      };

      // --------------------------------------------------------

      var subGroupGeofenceToUpdate = geofenceToUpdate.subgroups.find(
        (subgroup: any) => subgroup.subgroup === subGroup.subgroup,
      );
      // console.log(subGroupGeofenceToUpdate);

      if (subGroupGeofenceToUpdate && subGroupGeofenceToUpdate.items[index]) {
        const lastIndex = subGroupGeofenceToUpdate.items.length;
        var allItemsChecked = subGroupGeofenceToUpdate.items
          .slice(0, index)
          .concat(subGroupGeofenceToUpdate.items.slice(index + 1, lastIndex))
          .every((item: any) => item.checked === true);
        if (
          allItemsChecked &&
          selectedGeofence._id === subGroupGeofenceToUpdate.items[index]._id &&
          !subGroupGeofenceToUpdate.checked
        ) {
          allItemsChecked = true;
        } else {
          allItemsChecked = false;
        }

        const updatedSubgroupedGeofence = {
          ...subGroupGeofenceToUpdate,
          checked: allItemsChecked,
          items: subGroupGeofenceToUpdate.items.map((item: any) => {
            if (selectedGeofence._id === item._id) {
              return {
                ...item,
                checked: !selectedGeofence.checked,
                // isEdit: false,
              };
            }
            return item; // Return the item as it is if IDs don't match
          }),
        };

        const updatedSubGroupGeofences = geofenceToUpdate.subgroups.map(
          (subgroup: any) =>
            subgroup.subgroup === subGroup.subgroup
              ? updatedSubgroupedGeofence
              : subgroup,
        );
        const updatedGeofences = geofences.map((geofence: any) =>
          geofence.group === group.group
            ? { ...updatedGeofence, subgroups: updatedSubGroupGeofences }
            : geofence,
        );
        // Create a new array of devices with the updated device object at the same index
        dispatch(setGeofences(updatedGeofences));
        // console.log(updatedGeofences);
      } else {
        const updatedGeofences = geofences.map((geofence: any) =>
          geofence.group === group.group ? updatedGeofence : geofence,
        );
        // Create a new array of devices with the updated device object at the same index
        dispatch(setGeofences(updatedGeofences));
        // console.log(updatedGeofences);
      }
    }
  };

  // var geofenceExists = geofencesDetailData.find(
  //   (geofence: any) => geofence._id === selectedGeofence._id
  // );
  // // console.log("deviceExists", deviceExists);

  // if (geofenceExists) {
  //   const tempList = geofencesDetailData.filter(
  //     (geofence: any) => geofence._id !== geofenceExists._id
  //   );
  //   // // console.log("devicesDetailData by filter", devicesDetailData);

  //   dispatch(setGeofencesDetailData([...tempList]));
  // } else {
  //   dispatch(
  //     setGeofencesDetailData([
  //       ...geofencesDetailData,
  //       selectedGeofence,
  //     ])
  //   );
  // }

  const handleSelectAll = () => {
    var updatedSubGroups: any = [];
    var subGroups: any = [];
    var finalGeofences: any = [];
    const updatedGeofences = geofences.map((geofence: any) => {
      updatedSubGroups = [];
      subGroups = [];
      var updatedItems = geofence.items.map((item: any) => ({
        ...item,
        checked: true,
        edited: false,
      }));

      // Update geofences detail data for each item in the geofence group
      updatedItems.forEach((selectedGeofence: any) => {
        const geofenceExists = geofencesDetailData.find(
          (geofence: any) => geofence._id === selectedGeofence._id,
        );

        if (!geofenceExists) {
          dispatch(
            setGeofencesDetailData([...geofencesDetailData, selectedGeofence]),
          );
        }
      });
      // // console.log(updatedGeofences);

      var updatedSubGroupItems;

      geofence.subgroups.map((subGroup: any) => {
        // console.log("subGroup", subGroup);

        updatedSubGroupItems = subGroup.items.map((item: any) => ({
          ...item,
          checked: true,
        }));
        // // console.log("updatedSubGroupItems",updatedSubGroupItems);

        var subGroup = {
          ...subGroup,
          checked: true,
          items: updatedSubGroupItems,
        };
        updatedSubGroups.push(subGroup);
        subGroups.push(subGroup);

        // if (geofence.subgroups.length > 0) {
        //   return {
        //     ...geofence,
        //     checked: true,
        //     items: updatedItems,
        //     subgroups: subGroups,
        //   };
        // } else {
        //   return {
        //     ...geofence,
        //     checked: true,
        //     items: updatedItems,
        //   };
        // }
      });
      // console.log("subGroups", subGroups);
      if (geofence.subgroups.length > 0) {
        finalGeofences.push({
          ...geofence,
          checked: true,
          items: updatedItems,
          subgroups: subGroups,
        });
      } else {
        finalGeofences.push({
          ...geofence,
          checked: true,
          items: updatedItems,
        });
      }
    });

    // console.log(updatedGeofences);
    // console.log(finalGeofences);
    dispatch(setGeofences(finalGeofences));
  };

  const handleDeselectAll = () => {
    var updatedSubGroups: any = [];
    var subGroups: any = [];
    var finalGeofences: any = [];
    const updatedGeofences = geofences.map((geofence: any) => {
      updatedSubGroups = [];
      subGroups = [];
      var updatedItems = geofence.items.map((item: any) => ({
        ...item,
        checked: false,
        edited: false,
      }));

      // Update geofences detail data for each item in the geofence group
      updatedItems.forEach((selectedGeofence: any) => {
        const geofenceExists = geofencesDetailData.find(
          (geofence: any) => geofence._id === selectedGeofence._id,
        );
      });

      var updatedSubGroupItems;

      geofence.subgroups.map((subGroup: any) => {
        // console.log("subGroup", subGroup);

        updatedSubGroupItems = subGroup.items.map((item: any) => ({
          ...item,
          checked: false,
        }));
        // // console.log("updatedSubGroupItems",updatedSubGroupItems);

        var subGroup = {
          ...subGroup,
          checked: false,
          items: updatedSubGroupItems,
        };
        updatedSubGroups.push(subGroup);
        subGroups.push(subGroup);

        // if (geofence.subgroups.length > 0) {
        //   return {
        //     ...geofence,
        //     checked: false,
        //     items: updatedItems,
        //     subgroups: subGroups,
        //   };
        // } else {
        //   return {
        //     ...geofence,
        //     checked: false,
        //     items: updatedItems,
        //   };
        // }
      });
      // console.log("subGroups", subGroups);
      if (geofence.subgroups.length > 0) {
        finalGeofences.push({
          ...geofence,
          checked: false,
          items: updatedItems,
          subgroups: subGroups,
        });
      } else {
        finalGeofences.push({
          ...geofence,
          checked: false,
          items: updatedItems,
        });
      }
    });
    dispatch(setGeofencesDetailData([]));
    // console.log(updatedGeofences);
    // console.log(finalGeofences);
    dispatch(setGeofences(finalGeofences));
  };

  const handleEditGeofence = (
    e: any,
    group: any,
    selectedGeofence: any,
    index: any,
  ) => {
    // console.log("selectedGeofence", selectedGeofence);

    // Prevent the click event from propagating to the accordion
    e.stopPropagation();

    // Find the device corresponding to the group title

    var geofenceToUpdate = geofences.find(
      (geofence: any) => geofence.group === group.group,
    );
    // console.log(geofenceToUpdate);

    if (geofenceToUpdate && geofenceToUpdate.items[index]) {
      const lastIndex = geofenceToUpdate.items.length;
      var allItemsChecked = geofenceToUpdate.items
        .slice(0, index)
        .concat(geofenceToUpdate.items.slice(index + 1, lastIndex))
        .every((item: any) => item.checked === true);
      if (
        allItemsChecked &&
        selectedGeofence._id === geofenceToUpdate.items[index]._id &&
        !geofenceToUpdate.checked
      ) {
        allItemsChecked = true;
      } else {
        allItemsChecked = false;
      }

      const updatedGeofence = {
        ...geofenceToUpdate,
        checked: allItemsChecked,
        items: geofenceToUpdate.items.map((item: any) => {
          if (selectedGeofence._id === item._id) {
            var geofenceExists = geofencesDetailData.find(
              (geofence: any) => geofence._id === selectedGeofence._id,
            );

            if (selectedGeofence.edited) {
              dispatch(setType(null));
            }

            return {
              ...item,
              checked: true,
              // : !selectedGeofence.checked,
              edited: !selectedGeofence.edited,
            };
          } else {
            return {
              ...item,
              checked: false,
              // : !selectedGeofence.checked,
              edited: false,
            };
          }

          // return item; // Return the item as it is if IDs don't match
        }),
      };

      const updatedGeofences = geofences.map((geofence: any) =>
        geofence.group === group.group
          ? updatedGeofence
          : {
              ...geofence,
              checked: false,
              items: geofence.items.map((item: any) => {
                return {
                  ...item,
                  checked: false,
                  isEdit: false,
                };
              }),
            },
      );
      // Create a new array of devices with the updated device object at the same index
      dispatch(setGeofences(updatedGeofences));
    }
  };

  const formattedDate = (timeStamp: string) => {
    var ts = parseInt(timeStamp) * 1000;

    var date = new Date(ts);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var formatDate =
      (day < 10 ? "0" : "") +
      day +
      "-" +
      (month < 10 ? "0" : "") +
      month +
      "-" +
      year;
    return formatDate;
  };

  const typeList = [
    { label: "Circle", value: "circle" },
    { label: "Rectangle", value: "rectangle" },
    { label: "Polygon", value: "polygon" },
  ];

  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    setGroupList(() =>
      geofencesGroup.map((item: any) => {
        return { label: item?.title, value: item?._id };
      }),
    );
  }, [geofencesGroup]);

  const onChangeHandler = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const createGeofence = async () => {
    const groups: any = [];
    const groupDevicesObj: any = {};
    const initialGroupDevices: any = [];
    if (formData.title !== "" && type !== "") {
      const url = isEditGeofence
        ? update(
            {
              ...formData,
              geofenceGroup: group == "" ? null : group,
              type: geofenceType,
              geofenceSubGroup: subGroup == "" ? null : subGroup,
              geofencePositions:
                geofenceType == "circle"
                  ? circle
                  : geofenceType == "rectangle"
                    ? rectangle
                    : geofenceType == "polygon" && { bounds: polygon },
            },
            {
              url: `${UPDATE_GEOFENCE}/${editedItem._id}`,
            },
          )
        : create(
            {
              ...formData,
              geofenceGroup: group == "" ? null : group,
              type: geofenceType,
              isActive: true,
              geofenceSubGroup: subGroup == "" ? null : subGroup,
              geofencePositions:
                geofenceType == "circle"
                  ? circle
                  : geofenceType == "rectangle"
                    ? rectangle
                    : geofenceType == "polygon" && { bounds: polygon },
            },
            {
              url: CREATE_GEOFENCE,
            },
          );
      try {
        await url.then((data: any) => {
          if (data !== undefined) {
            if (
              !data.success &&
              data.message === "ERROR_INTERNET_DISCONNECTED"
            ) {
              setLoading(false);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
            }
            if (data.success) {
              // // console.log(data);

              setIsNewGeofence(false);
              setIsEditGeofence(false);
              setFormData({
                title: "",
              });
              setGroup("");
              setLoading(false);

              // dispatch(setCountriesStart());
              getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
                // // console.log("api call --- >", data);
                if (data == undefined) {
                  Swal.fire({
                    text: "Failed to fetch due to connection refused",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });

                  dispatch(setGeofences([]));
                  setSubGroupList([]);
                  setSubGroup("");
                  dispatch(setType(null));
                  setIsNewGeofence(false);
                  setIsEditGeofence(false);
                  setFormData({
                    title: "",
                  });
                  return;
                }
                // dispatch(setCountriesEnd());
                if (data !== undefined) {
                  dispatch(setType(null));
                  setSubGroupList([]);
                  setSubGroup("");
                  setIsNewGeofence(false);
                  setIsEditGeofence(false);
                  setFormData({
                    title: "",
                  });
                  if (data.success) {
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
                      // // console.log("item.group -- >", initialGroupGeofences[i].group);
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
                      // console.log("subGroups", subGroups);

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

                      // // console.log(groups);
                      //  console.log(
                      //   "subGroupsGeofencesObj",
                      //   subGroupsGeofencesObj
                      // );

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
            }
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
      }
    } else {
      Swal.fire({
        text: "Please Select all the fields",
        icon: "info",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  const [hoveredButtonId, setHoveredButtonId] = useState("");
  const handleMouseEnter = (id: any) => {
    setHoveredButtonId(id);
  };

  const handleMouseLeave = (id: string) => {
    setHoveredButtonId(id);
  };

  // ----------------------- new checkbox

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (checked) {
      handleSelectAll(); // Perform "Select All" action when checked
    } else {
      handleDeselectAll(); // Perform "Deselect All" action when unchecked
    }
  };

  const inputareaRef = useRef<HTMLInputElement | null>(null);

  const handleGoToReply = () => {
    if (!inputareaRef.current) return; // Ensure textareaRef.current exists
    // Scroll to the textarea
    (inputareaRef.current as HTMLInputElement).scrollIntoView({
      behavior: "smooth",
      block: "center", // Scroll to the center of the viewport
      inline: "nearest", // Scroll to the nearest edge of the viewport
    });
    // Focus on the textarea
    (inputareaRef.current as HTMLInputElement).focus();
  };

  const sortedGroupList = [
    { label: "None", value: "none" },
    ...groupList.sort((a: any, b: any) => a.label.localeCompare(b.label)), // Sorting groups alphabetically
  ];
  // Recalculate when itemGroups chan

  const [innerOpen, setInnerOpen] = useState(""); // State for inner accordion

  const toggleInner = (id: any) => {
    setInnerOpen(innerOpen === id ? null : id);
  };

  useEffect(() => {
    if (subGroup !== "") {
      getAll({
        url: `${GET_ALL_SUBGROUPS_BY_GROUP_ID}/${group}`,
      })
        .then((data: any) => {
          if (data.success) {
            setSubGroupList(() =>
              data.data.map((item: any) => {
                return { label: item?.title, value: item?._id };
              }),
            );
          } else {
            setSubGroupList([]);
          }
        })
        .catch((error) => {
          setSubGroupList([]);
        });
    }
  }, [subGroup]);

  return (
    //@ts-ignore
    <>
      {(isNewGeofence || isEditGeofence) && (
        <div>
          <textarea name="" id="" style={{ display: "none" }}></textarea>
          <form>
            <div
              style={{
                // paddingBottom: "-10px",
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
                // {...register("name", { required: true })}
              />
              <span style={{ color: "red" }}>
                {/* {errors.name && "Country name is required"} */}
              </span>
            </div>
            <div
              style={{
                // marginBottom: "10px",
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
                  // // console.log(e);
                  dispatch(setType(e));
                  setGeofenceType(e);
                  // dispatch(setCountryId(e));
                }}
                options={typeList}
              />
            </div>

            <div style={{ margin: "0px 10px" }}>
              <p>Group</p>
              <Select
                showSearch
                style={{ width: "100%", height: 36, marginBottom: "15px" }}
                placeholder="Select group"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={async (value) => {
                  setGroup(value === "none" ? null : value);
                  const subGroupData: any = await getAll({
                    url: `${GET_ALL_SUBGROUPS_BY_GROUP_ID}/${value}`,
                  });
                  if (subGroupData.success) {
                    setSubGroupList(() =>
                      subGroupData.data.map((item: any) => {
                        return { label: item?.title, value: item?._id };
                      }),
                    );
                  } else {
                    setSubGroupList([]);
                  }
                }}
                options={sortedGroupList}
                value={group || undefined}
              />
            </div>
            {subGroupList.length > 0 && (
              <div style={{ margin: "0px 10px" }}>
                <P>Sub Group</P>
                <Select
                  showSearch
                  style={{ width: "100%", height: 33, marginBottom: "15px" }}
                  placeholder="Select group"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e) => {
                    setSubGroup(e);
                  }}
                  options={subGroupList}
                  value={subGroup == "" ? null : subGroup}
                />
              </div>
            )}

            <div style={{ display: "flex" }}>
              <button
                onClick={(e: any) => {
                  e.preventDefault(); // Add this line
                  e.stopPropagation();
                  setIsNewGeofence(false);
                  setIsEditGeofence(false);
                  dispatch(setType(null));
                  setSubGroupList([]);
                  setGroup("");
                  setSubGroup("");
                  handleDeselectAll();
                  dispatch(setEditedItem(""));
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
                  e.preventDefault(); // Add this line
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
                {isEditGeofence ? " Update" : "Add"}
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

      {/* ---------------------------------------- */}
      <div
        className="d-flex"
        style={{
          justifyContent: "end",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        <div
          className={`text-end flex-shrink-0 icon-state 
                            }`}
        >
          <Label className="switch mb-0">
            <Input
              type="checkbox"
              // defaultChecked={row.isActive}
              // value={row.isActive}
              onChange={async (e: any) => {
                //  --------------------------
                // const changeStatus = {
                //   isActive: !row.isActive,
                // };

                try {
                  await create(
                    {},
                    {
                      url: `${IMPORT_GEOFENCE}`,
                    },
                  ).then((data: any) => {
                    if (data.success) {
                      // // // console.log(data);
                      getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
                        // // console.log("api call --- >", data);
                        if (data == undefined) {
                          Swal.fire({
                            text: "Failed to fetch due to connection refused",
                            icon: "error",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                        }
                        // dispatch(setCountriesEnd());
                        if (data !== undefined) {
                          if (data.success) {
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

                            for (
                              let i = 0;
                              i < initialGroupGeofences.length;
                              i++
                            ) {
                              // // console.log("item.group -- >", initialGroupGeofences[i].group);
                              for (
                                let j = 0;
                                j < initialGroupGeofences[i].items.length;
                                j++
                              ) {
                                var element = "";
                                if (
                                  initialGroupGeofences[i].items[j]
                                    .geofenceSubGroup !== null
                                ) {
                                  element =
                                    initialGroupGeofences[i].items[j]
                                      .geofenceSubGroup.title;
                                }
                                // const element = data.data[i].geofenceGroup.title;
                                if (!subGroups.includes(element)) {
                                  if (element !== "") {
                                    subGroups.push(element);
                                  }
                                }
                              }
                              // console.log("subGroups", subGroups);

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

                              // // console.log(groups);
                              //  console.log(
                              //     "subGroupsGeofencesObj",
                              //     subGroupsGeofencesObj
                              //   );

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
                    } else {
                      Swal.fire({
                        text: `${data.message}`,
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }
                  });
                  // Handle successful post creation (e.g., show a success message, redirect, etc.)
                } catch (error: any) {
                  Swal.fire({
                    text: `${error.message}`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                }
              }}
            />
            <span
              // className={`switch-state ${
              //   row.isActive ? "bg-primary" : "bg-secondary"
              // }`}
              className="switch-state bg-primary"
              // style={{ backgroundColor: row.isActive ? "green" : "red" }}
            />
          </Label>
        </div>
      </div>

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

      <div
      // style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
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
            // checked={isChecked}
            checked={geofences.every((item: any) => {
              return item.checked;
            })}
            onChange={handleCheckboxChange}
            style={{
              marginRight: "10px",
              height: "17px",
              width: "17px",
              cursor: "pointer",
            }}
          />
          <label
            // htmlFor="selectAll"
            style={{
              color: "#1f2f3e",
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none",
              // lineHeight:"15px",
              display: "contents",
              paddingTop: "0px",
              paddingRight: "7px",
              alignContent: "center",
            }}
          >
            Select All (
            {geofences.reduce(
              (total: any, group: any) => total + group.items.length,
              0,
            )}
            )
          </label>
        </div>
      </div>

      {/* ----------------------------------- */}
      {matchedGroups?.length > 0 && (
        <Accordion open={open} toggle={toggle} className="dark-accordion">
          {matchedGroups
            ?.filter((item: any) =>
              item.items.some((bodyItem: any) =>
                bodyItem.title
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()),
              ),
            )
            .sort((a: any, b: any) => {
              // Ensure "Ungrouped" comes first
              if (a.group === "Ungrouped") return -1;
              if (b.group === "Ungrouped") return 1;
              return a.group.localeCompare(b.group); // Otherwise, sort alphabetically
            })
            .map((item: any, index: any) => {
              const gradientId = `gradient-${index}`; // Generate a unique gradient ID for each item
              return (
                <AccordionItem key={index}>
                  {item.items.length > 0 && (
                    <div>
                      <AccordionHeader
                        targetId={`${searchValue?.length >= 1 ? "all" : index}`}
                        className="custom-accordion-header"
                      >
                        <input
                          type="checkbox"
                          style={{
                            marginRight: "10px",
                            height: "17px",
                            width: "17px",
                          }}
                          checked={item.checked}
                          onClick={(e) => handleCheckboxClick(e, item)}
                        />
                        <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                          {item.group} &nbsp; (
                          {
                            item.items.filter((bodyItem: any) =>
                              bodyItem.title
                                .toLowerCase()
                                .includes(searchValue.toLowerCase()),
                            ).length
                          }
                          )
                        </span>
                        <FeatherIcons
                          iconName={
                            open === `${index}` ? "ChevronUp" : "ChevronDown"
                          }
                          className="svg-color"
                        />
                      </AccordionHeader>
                    </div>
                  )}
                  {item.items.length > 0 && (
                    <AccordionBody
                      accordionId={`${
                        searchValue && searchValue?.length >= 1 ? "all" : index
                      }`}
                    >
                      {item.subgroups.length > 0 &&
                        item.subgroups
                          ?.filter((item: any) =>
                            item.items.some((bodyItem: any) =>
                              bodyItem.title
                                .toLowerCase()
                                .includes(searchValue.toLowerCase()),
                            ),
                          )
                          .map((itemm: any, indexx: any) => {
                            const gradientId = `gradient-${indexx}`; // Generate a unique gradient ID for each item
                            return (
                              <div
                                style={{
                                  margin: "0px -10px 0px -10px",
                                }}
                              >
                                <Accordion
                                  open={innerOpen}
                                  toggle={toggleInner}
                                  className="dark-accordion"
                                >
                                  <AccordionItem key={indexx}>
                                    {itemm.items.length > 0 && (
                                      <AccordionHeader
                                        targetId={`${
                                          searchValue?.length >= 1
                                            ? "all"
                                            : indexx
                                        }`}
                                        className="custom-accordion-header"
                                        onClick={() => toggleInner(`${indexx}`)}
                                      >
                                        <input
                                          type="checkbox"
                                          style={{
                                            marginRight: "10px",
                                            height: "17px",
                                            width: "17px",
                                          }}
                                          checked={itemm.checked}
                                          onClick={(e) =>
                                            handleSubGroupCheckboxClick(
                                              e,
                                              item,
                                              itemm,
                                            )
                                          }
                                        />
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {itemm.subgroup} &nbsp; (
                                          {
                                            itemm.items.filter(
                                              (bodyItem: any) =>
                                                bodyItem.title
                                                  .toLowerCase()
                                                  .includes(
                                                    searchValue.toLowerCase(),
                                                  ),
                                            ).length
                                          }
                                          )
                                        </span>
                                        <FeatherIcons
                                          iconName={
                                            innerOpen === `${indexx}`
                                              ? "ChevronUp"
                                              : "ChevronDown"
                                          }
                                          className="svg-color"
                                        />
                                      </AccordionHeader>
                                    )}
                                    <div>
                                      <AccordionBody
                                        accordionId={`${
                                          searchValue?.length >= 1
                                            ? "all"
                                            : indexx
                                        }`}
                                      >
                                        {itemm.items
                                          .filter((bodyItemm: any) =>
                                            bodyItemm.title
                                              .toLowerCase()
                                              .includes(
                                                searchValue.toLowerCase(),
                                              ),
                                          )
                                          .slice(0, itemsLength)
                                          .map(
                                            (
                                              bodyItemm: any,
                                              bodyindex: any,
                                            ) => {
                                              return (
                                                <div
                                                  key={bodyItemm._id}
                                                  style={{
                                                    padding: "8px 10px",
                                                    boxShadow:
                                                      "5px 5px 15px lightgray",
                                                    borderRadius: "12px",
                                                    margin: "7px -10px",
                                                    cursor: "pointer",
                                                    backgroundColor: `white`,
                                                  }}
                                                  onClick={(e) => {}}
                                                >
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <label
                                                        style={{
                                                          display: "contents",
                                                          cursor: "pointer",
                                                          paddingTop: "0px",
                                                          paddingRight: "7px",
                                                          alignContent:
                                                            "center",
                                                        }}
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          name="key"
                                                          value="value"
                                                          style={{
                                                            marginRight: "10px",
                                                            color:
                                                              bodyItemm.checked
                                                                ? "green"
                                                                : "inherit",
                                                          }}
                                                          checked={
                                                            bodyItemm.checked
                                                          }
                                                          onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleSelecetdSubGroupDevices(
                                                              e,
                                                              item,
                                                              itemm,
                                                              bodyItemm,
                                                              bodyindex,
                                                            );
                                                          }}
                                                        />
                                                        <span
                                                          onClick={(e) =>
                                                            e.stopPropagation()
                                                          }
                                                        ></span>
                                                      </label>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            fontWeight: "bold",
                                                            fontSize: "13px",
                                                          }}
                                                        >
                                                          {bodyItemm.title
                                                            .length > 26
                                                            ? `${bodyItemm.title.slice(
                                                                0,
                                                                26,
                                                              )}...`
                                                            : bodyItemm.title}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    {
                                                      <button
                                                        style={{
                                                          border: "none",
                                                          backgroundColor:
                                                            // isHovered &&
                                                            // hoveredButtonId == bodyItem._id
                                                            bodyItemm.edited
                                                              ? "green"
                                                              : "white",
                                                          borderRadius: "5px",
                                                          cursor: "pointer",
                                                          transition:
                                                            "background-color 0.3s ease",
                                                        }}
                                                        onMouseEnter={() => {
                                                          handleMouseEnter(
                                                            bodyItemm._id,
                                                          );
                                                          setIsHovered(true);
                                                        }}
                                                        onMouseLeave={() => {
                                                          handleMouseLeave("");
                                                          setIsHovered(false);
                                                        }}
                                                        onClick={(e: any) => {
                                                          e.preventDefault();
                                                          e.stopPropagation();
                                                          // setSubGroupList([]);
                                                          // setSubGroup("");
                                                          handleGoToReply();
                                                          const updateFormData =
                                                            {
                                                              ...formData,
                                                              title:
                                                                bodyItemm.title,
                                                            };
                                                          setGeofenceType(
                                                            bodyItemm.type,
                                                          );
                                                          dispatch(
                                                            setEditedItem(
                                                              bodyItemm,
                                                            ),
                                                          );
                                                          dispatch(
                                                            setCircle(
                                                              bodyItemm.geofencePositions,
                                                            ),
                                                          );
                                                          dispatch(
                                                            setRectangle(
                                                              bodyItemm.geofencePositions,
                                                            ),
                                                          );
                                                          dispatch(
                                                            setPolygon(
                                                              bodyItemm
                                                                .geofencePositions
                                                                .bounds,
                                                            ),
                                                          );
                                                          setGroup(
                                                            bodyItemm
                                                              ?.geofenceGroup
                                                              ?._id,
                                                          );

                                                          if (
                                                            bodyItemm.geofenceSubGroup !==
                                                            null
                                                          ) {
                                                            setSubGroup(
                                                              bodyItemm
                                                                ?.geofenceSubGroup
                                                                ?._id,
                                                            );
                                                          }

                                                          setFormData(
                                                            updateFormData,
                                                          );
                                                          if (
                                                            bodyItemm.edited ==
                                                            false
                                                          ) {
                                                            setIsEditGeofence(
                                                              true,
                                                            );
                                                            setIsNewGeofence(
                                                              false,
                                                            );
                                                          } else {
                                                            setIsEditGeofence(
                                                              false,
                                                            );
                                                            setIsNewGeofence(
                                                              false,
                                                            );
                                                          }
                                                          handleEditGeofence(
                                                            e,
                                                            item,
                                                            bodyItemm,
                                                            bodyindex,
                                                          );
                                                        }}
                                                      >
                                                        <FaRegEdit />
                                                      </button>
                                                    }
                                                  </div>
                                                </div>
                                              );
                                            },
                                          )}
                                        {item.items.filter((bodyItem: any) =>
                                          bodyItem.title
                                            .toLowerCase()
                                            .includes(
                                              searchValue.toLowerCase(),
                                            ),
                                        ).length >= 15 && (
                                          <div
                                            style={{
                                              display: "flex",
                                              color: "#1f2f3e",
                                              fontSize: "16px",
                                              justifyContent: "end",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (
                                                item.items.length >= 15 &&
                                                itemsLength < item.items.length
                                              ) {
                                                setItemsLength(
                                                  itemsLength + 14,
                                                );
                                              }
                                            }}
                                          >
                                            {item.items.length >= 15 &&
                                              itemsLength < item.items.length &&
                                              "Show More"}
                                          </div>
                                        )}
                                      </AccordionBody>
                                    </div>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            );
                          })}
                      {item.items
                        .filter((bodyItem: any) =>
                          bodyItem.title
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()),
                        )
                        .slice(0, itemsLength)
                        .map((bodyItem: any, bodyindex: any) => {
                          return (
                            bodyItem.geofenceSubGroup == null && (
                              <div
                                key={bodyItem._id}
                                style={{
                                  padding: "8px 10px",
                                  boxShadow: "5px 5px 15px lightgray",
                                  borderRadius: "12px",
                                  margin: "7px -10px",
                                  cursor: "pointer",
                                  backgroundColor: `white`,
                                }}
                                onClick={(e) => {}}
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
                                          color: bodyItem.checked
                                            ? "green"
                                            : "inherit",
                                        }}
                                        checked={bodyItem.checked}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleSelecetdDevices(
                                            e,
                                            item,
                                            bodyItem,
                                            bodyindex,
                                          );
                                        }}
                                      />
                                      <span
                                        onClick={(e) => e.stopPropagation()}
                                      ></span>
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
                                        {bodyItem.title.length > 26
                                          ? `${bodyItem.title.slice(0, 26)}...`
                                          : bodyItem.title}
                                      </span>
                                    </div>
                                  </div>
                                  {
                                    <button
                                      style={{
                                        border: "none",
                                        backgroundColor:
                                          // isHovered &&
                                          // hoveredButtonId == bodyItem._id
                                          bodyItem.edited ? "green" : "white",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        transition:
                                          "background-color 0.3s ease",
                                      }}
                                      onMouseEnter={() => {
                                        handleMouseEnter(bodyItem._id);
                                        setIsHovered(true);
                                      }}
                                      onMouseLeave={() => {
                                        handleMouseLeave("");
                                        setIsHovered(false);
                                      }}
                                      onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSubGroupList([]);
                                        setSubGroup("");
                                        handleGoToReply();
                                        const updateFormData = {
                                          ...formData,
                                          title: bodyItem.title,
                                        };
                                        setGeofenceType(bodyItem.type);
                                        dispatch(setEditedItem(bodyItem));
                                        dispatch(
                                          setCircle(bodyItem.geofencePositions),
                                        );
                                        dispatch(
                                          setRectangle(
                                            bodyItem.geofencePositions,
                                          ),
                                        );
                                        dispatch(
                                          setPolygon(
                                            bodyItem.geofencePositions.bounds,
                                          ),
                                        );
                                        setGroup(bodyItem?.geofenceGroup?._id);

                                        setFormData(updateFormData);
                                        if (bodyItem.edited == false) {
                                          setIsEditGeofence(true);
                                          setIsNewGeofence(false);
                                        } else {
                                          setIsEditGeofence(false);
                                          setIsNewGeofence(false);
                                        }
                                        handleEditGeofence(
                                          e,
                                          item,
                                          bodyItem,
                                          bodyindex,
                                        );
                                      }}
                                    >
                                      <FaRegEdit />
                                    </button>
                                  }
                                </div>
                              </div>
                            )
                          );
                        })}
                      {item.items.filter((bodyItem: any) =>
                        bodyItem.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()),
                      ).length >= 15 && (
                        <div
                          style={{
                            display: "flex",
                            color: "#1f2f3e",
                            fontSize: "16px",
                            justifyContent: "end",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (
                              item.items.length >= 15 &&
                              itemsLength < item.items.length
                            ) {
                              setItemsLength(itemsLength + 14);
                            }
                          }}
                        >
                          {item.items.length >= 15 &&
                            itemsLength < item.items.length &&
                            "Show More"}
                        </div>
                      )}
                    </AccordionBody>
                  )}
                </AccordionItem>
              );
            })}
        </Accordion>
      )}
    </>
  );
};

export default GeofencesTreeViewAccordian;
