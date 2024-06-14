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
import AddGroupModal from "../modals/AddGroupModal";
import Geofence from "../../Geofence";
import { create, getAll, update } from "../../../../../Utilities/api";
import Swal from "sweetalert2";
import { title } from "process";
import Item from "antd/es/list/Item";
import { Id } from "../../../../../utils/Constant";
import { px } from "framer-motion";
import AddSubGroupModal from "../modals/AddSubGroupModal";

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
  const { devices, selectedDevices, expandedDevice, devicesDetailData } =
    useSelector((state: any) => state.monitoring);
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
  const [open, setOpen] = useState("");
  const [matchedGroups, setMatchedGroups] = useState(geofences);
  const [Devicess, setDevicess]: any = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // console.log("devices", devices);

  useEffect(() => {
    if (searchValue.length >= 1) {
      setOpen("all");
    } else {
      setOpen("");
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
        var tempList: any = [...geofencesDetailData];
        updatedItems.map((geofenceItem: any, index: any) => {
          var geofenceExists = geofencesDetailData.find(
            (geofence: any) => geofence._id === geofenceItem._id
          );
          console.log("deviceItem", geofenceItem);
          console.log("deviceExists", geofenceExists);

          if (geofenceExists) {
            if (group.checked) {
              tempList = tempList.filter(
                (geofence: any) => geofence._id !== geofenceExists._id
              );
            }
          } else {
            tempList = [...tempList, geofenceItem];
            // dispatch(setDevicesDetailData([...devicesDetailData, deviceItem]));
          }
        });
        dispatch(setGeofencesDetailData([...tempList]));
        return { ...geofence, checked: !group.checked, items: updatedItems };
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
    index: any
  ) => {
    // Prevent the click event from propagating to the accordion
    e.stopPropagation();

    // Find the device corresponding to the group title

    var geofenceToUpdate = geofences.find(
      (geofence: any) => geofence.group === group.group
    );
    console.log(geofenceToUpdate);

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
              (geofence: any) => geofence._id === selectedGeofence._id
            );
            // console.log("deviceExists", deviceExists);

            if (geofenceExists) {
              const tempList = geofencesDetailData.filter(
                (geofence: any) => geofence._id !== geofenceExists._id
              );
              // console.log("devicesDetailData by filter", devicesDetailData);

              dispatch(setGeofencesDetailData([...tempList]));
            } else {
              dispatch(
                setGeofencesDetailData([
                  ...geofencesDetailData,
                  selectedGeofence,
                ])
              );
            }

            // if(devicesDetailData.)
            // Update the checked property if the IDs match
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
        geofence.group === group.group ? updatedGeofence : geofence
      );
      // Create a new array of devices with the updated device object at the same index
      dispatch(setGeofences(updatedGeofences));
      console.log(updatedGeofences);
    }
  };

  const handleSelectAll = () => {
    const updatedGeofences = geofences.map((geofence: any) => {
      const updatedItems = geofence.items.map((item: any) => ({
        ...item,
        checked: true,
        edited: false,
      }));

      // Update geofences detail data for each item in the geofence group
      updatedItems.forEach((selectedGeofence: any) => {
        const geofenceExists = geofencesDetailData.find(
          (geofence: any) => geofence._id === selectedGeofence._id
        );

        if (!geofenceExists) {
          dispatch(
            setGeofencesDetailData([...geofencesDetailData, selectedGeofence])
          );
        }
      });

      return { ...geofence, checked: true, items: updatedItems };
    });
    console.log(updatedGeofences);

    // Dispatch the action to set all geofences as checked
    dispatch(setGeofences(updatedGeofences));

    // Log the updated geofences detail data
    console.log("Updated Geofences Detail Data:", updatedGeofences);
  };

  const handleDeselectAll = () => {
    const updatedGeofences = geofences.map((geofence: any) => {
      const updatedItems = geofence.items.map((item: any) => ({
        ...item,
        checked: false,
        edited: false,
      }));
      return { ...geofence, checked: false, items: updatedItems };
    });

    // Dispatch the action to clear geofences detail data
    dispatch(setGeofencesDetailData([]));
    console.log(updatedGeofences);

    // Dispatch the action to set all geofences as unchecked
    dispatch(setGeofences(updatedGeofences));
  };

  const handleEditGeofence = (
    e: any,
    group: any,
    selectedGeofence: any,
    index: any
  ) => {
    console.log("selectedGeofence", selectedGeofence);

    // Prevent the click event from propagating to the accordion
    e.stopPropagation();

    // Find the device corresponding to the group title

    var geofenceToUpdate = geofences.find(
      (geofence: any) => geofence.group === group.group
    );
    console.log(geofenceToUpdate);

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
              (geofence: any) => geofence._id === selectedGeofence._id
            );
            // console.log("deviceExists", deviceExists);

            if (geofenceExists) {
              const tempList = geofencesDetailData.filter(
                (geofence: any) => geofence._id !== geofenceExists._id
              );
              // console.log("devicesDetailData by filter", devicesDetailData);

              dispatch(setGeofencesDetailData([...tempList]));
            } else {
              dispatch(
                setGeofencesDetailData([
                  ...geofencesDetailData,
                  selectedGeofence,
                ])
              );
            }

            // if(devicesDetailData.)
            // Update the checked property if the IDs match
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

          return item; // Return the item as it is if IDs don't match
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
            }
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
      })
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
              geofencePositions:
                geofenceType == "circle"
                  ? circle
                  : geofenceType == "rectangle"
                  ? rectangle
                  : geofenceType == "polygon" && { bounds: polygon },
            },
            {
              url: `monitoring/geofence/update-geofence/${editedItem._id}`,
            }
          )
        : create(
            {
              ...formData,
              geofenceGroup: group == "" ? null : group,
              type: geofenceType,
              isActive: true,
              geofencePositions:
                geofenceType == "circle"
                  ? circle
                  : geofenceType == "rectangle"
                  ? rectangle
                  : geofenceType == "polygon" && { bounds: polygon },
            },
            {
              url: "monitoring/geofence/create-geofence",
            }
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
              // console.log(data);

              setIsNewGeofence(false);
              setIsEditGeofence(false);
              setFormData({
                title: "",
              });
              setGroup("");
              setLoading(false);

              // dispatch(setCountriesStart());
              getAll({ url: "monitoring/geofence/get-all-geofences" }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  if (data == undefined) {
                    Swal.fire({
                      text: "Failed to fetch due to connection refused",
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });

                    dispatch(setGeofences([]));
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
                    if (data.success) {
                      // console.log("api call --- >", data);
                      // console.log("length --- >", data.data.length);
                      for (let i = 0; i < data.data.length; i++) {
                        var element = "";
                        if (data.data[i].geofenceGroup == null) {
                          element = "Ungrouped";
                        } else {
                          element = data.data[i].geofenceGroup.title;
                        }
                        // const element = data.data[i].geofenceGroup.title;
                        if (!groups.includes(element)) {
                          groups.push(element);
                        }
                      }
                      console.log(groups);

                      groups.forEach((geofenceGroup: any) => {
                        groupDevicesObj[geofenceGroup] = data.data
                          .filter((obj: any) => {
                            if (
                              !obj.geofenceGroup ||
                              !obj.geofenceGroup.title
                            ) {
                              return geofenceGroup === "Ungrouped";
                            } else {
                              return obj.geofenceGroup.title === geofenceGroup;
                            }
                          })
                          .map((item: any) => ({
                            ...item,
                            checked: false,
                            edited: false,
                          }));
                      });

                      // Convert groupDevicesObj to initialGroupDevices array format
                      Object.keys(groupDevicesObj).forEach((group: any) => {
                        initialGroupDevices.push({
                          group: group,
                          checked: false,
                          items: groupDevicesObj[group],
                        });
                      });
                      console.log("initialGroupDevices", initialGroupDevices);
                      dispatch(setType(null));

                      dispatch(setGeofences(initialGroupDevices));
                      setLoading(false);
                    }
                  }
                }
              );
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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleGoToReply = () => {
    if (!textareaRef.current) return; // Ensure textareaRef.current exists
    // Scroll to the textarea
    (textareaRef.current as HTMLTextAreaElement).scrollIntoView({
      behavior: "smooth",
      block: "center", // Scroll to the center of the viewport
      inline: "nearest", // Scroll to the nearest edge of the viewport
    });
    // Focus on the textarea
    (textareaRef.current as HTMLTextAreaElement).focus();
  };

  // Recalculate when itemGroups chan

  return (
    //@ts-ignore
    <>
      {/* ------------------------------------- */}

      {/* {!isEditGeofence && !isNewGeofence && !isNewGroup && (
        <div style={{ display: "flex", paddingTop: "20px" }}>
          <button
            onClick={(e: any) => {
              e.preventDefault(); // Add this line
              e.stopPropagation();
              setIsNewGroup(true);
            }}
            title="Add Group"
            style={{
              width: "30%",
              // padding: "7px 10px",
              // boxShadow: "0px 5px 18px lightgray",
              borderRadius: "8px",
              // backgroundColor: "green",
              color: "white",
              margin: "8px",
              marginBottom: "10px",
              marginTop: "0px",
              border: "0px",
              outline: "none",
              textAlign: "center",
            }}
          >
            <img src={GroupSvg} alt="" height={18} width={25} />
          </button>
          <button
            onClick={(e: any) => {
              e.preventDefault(); // Add this line
              e.stopPropagation();
              setIsNewGroup(true);
            }}
            title="Add Sub Group"
            style={{
              width: "30%",
              // padding: "7px 10px",
              // boxShadow: "0px 5px 18px lightgray",
              borderRadius: "8px",
              // backgroundColor: "green",
              color: "white",
              margin: "8px",
              marginBottom: "10px",
              marginTop: "0px",
              border: "0px",
              outline: "none",
              textAlign: "center",
            }}
          >
            <img src={SubGroupSvg} alt="" height={18} width={25} />
          </button>
          <button
            onClick={(e: any) => {
              e.preventDefault(); // Add this line
              e.stopPropagation();
              dispatch(setType(""));
              setIsNewGeofence(true);
              setGeofenceType("Select Type");
              setGroup("Select Group");
              const updateFormData = {
                ...formData,
                title: "",
              };
              setFormData(updateFormData);

              // dispatch(setType(bodyItem.type));
            }}
            title="Add Geofence"
            style={{
              width: "30%",
              // padding: "5px 0px",
              // boxShadow: "0px 5px 18px lightgray",
              borderRadius: "8px",
              // backgroundColor: "green",
              color: "white",
              margin: "8px",
              marginBottom: "10px",
              marginTop: "0px",
              border: "0px",
              outline: "none",
              textAlign: "center",
            }}
          >
            <img src={GeofenceSvg} alt="" height={16} width={22} />
          </button>
        </div>
      )} */}

      {(isNewGeofence || isEditGeofence) && (
        <form>
          <div
            style={{
              // paddingBottom: "-10px",
              margin: "0px 10px",
              marginTop: "10px",
            
            }}
          >
            <P>Title</P>
            <textarea name="" id=""
            ref={textareaRef}
            style={{display:"none"}}
            ></textarea>
            <input
              
              className="form-control"
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
                // console.log(e);
                dispatch(setType(e));
                setGeofenceType(e);
                // dispatch(setCountryId(e));
              }}
              options={typeList}
            />
          </div>
          <div
            style={{
              // marginTop: "15px",
              margin: "0px 10px",
            }}
          >
            <P>Group</P>
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
              onChange={(e) => {
                // console.log(e);
                setGroup(e);
                // dispatch(setCountryId(e));
              }}
              options={groupList}
              value={group == "" ? "" : group}
            />
          </div>

          <div style={{ display: "flex" }}>
            <button
              onClick={(e: any) => {
                e.preventDefault(); // Add this line
                e.stopPropagation();
                setIsNewGeofence(false);
                setIsEditGeofence(false);
                dispatch(setType(null));
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
      )}

      {/* {isNewGroup && (
        <AddGroupModal
          isVisible={isNewGroup}
          setIsVisible={setIsNewGroup}
          geofences={geofences}

          // setValue={setCityName}
        />
      )} */}
      {/* {isNewSubGroup && (
        <AddSubGroupModal
          isVisible={isNewSubGroup}
          setIsVisible={setIsNewSubGroup}
          geofences={geofences}

          // setValue={setCityName}
        />
      )} */}

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
      {/* <button
        onClick={(e: any) => {
          e.preventDefault(); // Add this line
          e.stopPropagation();
          handleSelectAll();
        }}
        style={{
          width: "45%",
          padding: "7px 10px",
          // boxShadow: "0px 5px 18px lightgray",
          borderRadius: "8px",
          backgroundColor: "#1f2f3e",
          color: "white",
          margin: "8px",
          marginBottom: "5px",
          marginTop: "0px",
          border: "0px",
          outline: "none",
          textAlign: "center",
        }}
      >
        Select All
      </button>
      <button
        onClick={(e: any) => {
          e.preventDefault(); // Add this line
          e.stopPropagation();
          handleDeselectAll();
        }}
        style={{
          width: "45%",
          padding: "7px 10px",
          // boxShadow: "0px 5px 18px lightgray",
          borderRadius: "8px",
          backgroundColor: "#1f2f3e",
          color: "white",
          margin: "8px",
          marginBottom: "5px",
          marginTop: "0px",
          border: "0px",
          outline: "none",
          textAlign: "center",
        }}
      >
        Deselect All
      </button> */}
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
              0
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
                bodyItem.title.toLowerCase().includes(searchValue.toLowerCase())
              )
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
                        targetId={`${searchValue.length >= 1 ? "all" : index}`}
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
                                .includes(searchValue.toLowerCase())
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
                      accordionId={`${searchValue.length >= 1 ? "all" : index}`}
                    >
                      {item.items
                        .filter((bodyItem: any) =>
                          bodyItem.title
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                        .slice(0, itemsLength)
                        .map((bodyItem: any, bodyindex: any) => {
                          return (
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
                                          bodyindex
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
                                      transition: "background-color 0.3s ease",
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
                                      handleGoToReply();
                                      const updateFormData = {
                                        ...formData,
                                        title: bodyItem.title,
                                      };
                                      setGeofenceType(bodyItem.type);
                                      dispatch(setEditedItem(bodyItem));
                                      dispatch(
                                        setCircle(bodyItem.geofencePositions)
                                      );
                                      dispatch(
                                        setRectangle(bodyItem.geofencePositions)
                                      );
                                      dispatch(
                                        setPolygon(
                                          bodyItem.geofencePositions.bounds
                                        )
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
                                        bodyindex
                                      );
                                    }}
                                  >
                                    <FaRegEdit />
                                  </button>
                                }
                              </div>
                            </div>
                          );
                        })}
                      {item.items.filter((bodyItem: any) =>
                        bodyItem.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
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
