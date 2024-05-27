import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Row,
} from "reactstrap";
import FeatherIcons from "../../../../utils/CommonSvgIcon/FeatherIcons";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setDevices,
  setDevicesDetailData,
  setExpandedDevice,
  setItem,
  setSelecetdDevices,
} from "../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import "./inputStyle.css";
import greenKey from "../../../../../../assets/key-green.png";
import redKey from "../../../../../../assets/key-red.png";
import greenSatellite from "../../../../../../assets/satellite-green.png";
import redSatellite from "../../../../../../assets/satellite-green.png";
import { P } from "../../../../AbstractElements";
import { Select } from "antd";
import { setGeofences, setType } from "../../../../ReaduxToolkit/Reducer/GeofenceSlice";

interface PropTypes {
  statusDevices: String;
}

const GeofencesTreeViewAccordian = ({ statusDevices }: PropTypes) => {
  const svgRef = useRef(null);

  const [itemsLength, setItemsLength] = useState(15);
  const { devices, selectedDevices, expandedDevice, devicesDetailData } =
    useSelector((state: any) => state.monitoring);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState("");
  const [matchedGroups, setMatchedGroups] = useState(devices);
  const [Devicess, setDevicess]: any = useState([]);
  const dispatch = useDispatch();

  // console.log("devices", devices);

  useEffect(() => {
    if (searchValue.length >= 1) {
      setOpen("all");
    } else {
      setOpen("");
    }
  }, [searchValue]);

  useEffect(() => {
    setMatchedGroups(devices);
  }, [devices]);

  const toggle = (id: string) => {
    open == id ? setOpen("") : setOpen(id);
    setItemsLength(15);
  };
  const handleCheckboxClick = (e: any, group: any) => {
    // Prevent the click event from propagating to the accordion

    e.stopPropagation();

    const updatedDevices = devices.map((device: any) => {
      if (device.title === group.title) {
        const updatedItems = device.items.map((item: any) => ({
          ...item,
          checked: !group.checked, // Set checked to the opposite of group.checked
        }));
        var tempList: any = [...devicesDetailData];
        updatedItems.map((deviceItem: any, index: any) => {
          var deviceExists = devicesDetailData.find(
            (device: any) => device.id === deviceItem.id
          );
          console.log("deviceItem", deviceItem);
          console.log("deviceExists", deviceExists);

          if (deviceExists) {
            if (group.checked) {
              tempList = tempList.filter(
                (device: any) => device.id !== deviceExists.id
              );
            }
          } else {
            tempList = [...tempList, deviceItem];
            // dispatch(setDevicesDetailData([...devicesDetailData, deviceItem]));
          }
        });
        dispatch(setDevicesDetailData([...tempList]));
        return { ...device, checked: !group.checked, items: updatedItems };
      }
      return device;
    });

    dispatch(setDevices(updatedDevices));


  };

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);


  };

  const handleSelecetdDevices = (
    e: any,
    group: any,
    selectedDevice: any,
    index: any
  ) => {
    // Prevent the click event from propagating to the accordion
    e.stopPropagation();

    // Find the device corresponding to the group title

    var deviceToUpdate = devices.find(
      (device: any) => device.title === group.title
    );
    if (deviceToUpdate && deviceToUpdate.items[index]) {
      const lastIndex = deviceToUpdate.items.length - 1;
      var allItemsChecked = deviceToUpdate.items
        .slice(0, index)
        .concat(deviceToUpdate.items.slice(index + 1, lastIndex))
        .every((item: any) => item.checked === true);
      if (
        allItemsChecked &&
        selectedDevice.id === deviceToUpdate.items[index].id &&
        !selectedDevice.checked
      ) {
        allItemsChecked = true;
      } else {
        allItemsChecked = false;
      }

      const updatedDevice = {
        ...deviceToUpdate,
        checked: allItemsChecked,
        items: deviceToUpdate.items.map((item: any) => {
          if (selectedDevice.id === item.id) {
            if (
              expandedDevice != null &&
              selectedDevice.id == expandedDevice.deviceId &&
              selectedDevice.checked
            ) {
              dispatch(setExpandedDevice(null));
              dispatch(
                setItem({ id: selectedDevice.id, title: selectedDevice.title })
              );
            }
            // const deviceExists = devicesDetailData.some(
            //   (device: any) => device.id == selectedDevice.id
            // );
            var deviceExists = devicesDetailData.find(
              (device: any) => device.id === selectedDevice.id
            );
            // console.log("deviceExists", deviceExists);

            if (deviceExists) {
              const tempList = devicesDetailData.filter(
                (device: any) => device.id !== deviceExists.id
              );
              // console.log("devicesDetailData by filter", devicesDetailData);

              dispatch(setDevicesDetailData([...tempList]));
            } else {
              dispatch(
                setDevicesDetailData([...devicesDetailData, selectedDevice])
              );
            }

            // if(devicesDetailData.)
            // Update the checked property if the IDs match
            return {
              ...item,
              checked: !selectedDevice.checked,
            };
          }

          return item; // Return the item as it is if IDs don't match
        }),


      };

      const updatedDevices = devices.map((device: any) =>
        device.title === group.title ? updatedDevice : device
      );
      // Create a new array of devices with the updated device object at the same index
      dispatch(setDevices(updatedDevices));
    }
  };



  const handleSelectAll = () => {
    const updatedDevices = devices.map((device: any) => {
      const updatedItems = device.items.map((item: any) => ({
        ...item,
        checked: true, // Set checked to the opposite of group.checked
      }));
      var tempList: any = [...devicesDetailData];
      devices.map((device: any, index: any) => {
        device.items.map((item: any) => {
          var deviceExists = devicesDetailData.find(
            (device: any) => device.id === item.id
          );

          if (deviceExists == undefined) {
            tempList = [...tempList, item];
            // tempList = tempList.filter(
            //   (device: any) => device.id !== deviceExists.id
            // );
          }
        })
        if (index == devices.length - 1) {
          dispatch(setDevicesDetailData([...tempList]));
        }
      });


      return { ...device, checked: true, items: updatedItems };
    });

    dispatch(setDevices(updatedDevices));
  };
  const handleDeselectAll = () => {
    const updatedDevices = devices.map((device: any) => {
      const updatedItems = device.items.map((item: any) => ({
        ...item,
        checked: false, // Set checked to the opposite of group.checked
      }));
      var tempList: any = [...devicesDetailData];
      devices.map((device: any, index: any) => {
        device.items.map((item: any) => {
          var deviceExists = devicesDetailData.find(
            (device: any) => device.id === item.id
          );

          if (deviceExists) {
            // tempList = [...tempList, item];
            tempList = tempList.filter(
              (device: any) => device.id !== deviceExists.id
            );
          }
        })
        if (index == devices.length - 1) {
          dispatch(setDevicesDetailData([...tempList]));
        }
      });
      return { ...device, checked: false, items: updatedItems };
    });

    dispatch(setDevices(updatedDevices));
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

  const [isNewGeofence, setIsNewGeofence] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);

  const typeList = [
    { label: "Circle", value: "CIRCLE" },
    { label: "Rectangle", value: "RECTANGLE" },
    { label: "Polygon", value: "POLYGON" }
  ]

  const groupList = [
    { label: "Ungrouped", value: "UNGROUPED" },
    { label: "Ungrouped2", value: "UNGROUPED2" },
    { label: "Ungrouped3", value: "UNGROUPED3" },
    { label: "Ungrouped4", value: "UNGROUPED4" },
  ]

  const geofencesList = [
    { label: "DHA", value: "DHA" },
    { label: "Korangi", value: "KORANGI" },
    { label: "Bahadurabad", value: "BAHADURABAD" }
  ]

  const { geofences, type, circle, rectangle, polygon } = useSelector((state: any) => state.geofence);


  const [formData, setFormData] = useState({
    title: "",
    city: "",
  });


  const onChangeHandler = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const createGeofence = () => {
    if (
      formData.title !== "" &&
      formData.city !== "" &&
      type !== ""

    ) {

      // setFormData({ ...formData, type: type, bounds: type == "CIRCLE" ? circle : type == "RECTANGLE" ? rectangle : polygon });
      const tempList = [...geofences, { ...formData, type: type, bounds: type == "CIRCLE" ? circle : type == "RECTANGLE" ? rectangle : polygon }];
      dispatch(setGeofences([...tempList]))
      dispatch(setType(""))
      console.log(geofences);
      setIsNewGeofence(false);
      setFormData({
        title: "",
        city: "",
      })
    } else {
      // ShowError();
    }
  };

  return (
    //@ts-ignore
    <>
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
      <div style={{ display: "flex" }}>
        <button
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
        </button>
      </div>

      <div style={{
        padding: "0px 10px"
      }}>
        <hr />
      </div>
      {/* ------------------------------------- */}

      {(!isNewGeofence && !isNewGroup) && <div style={{ display: "flex" }}>
        <button
          onClick={(e: any) => {
            e.preventDefault(); // Add this line
            e.stopPropagation();
            setIsNewGroup(true);

          }}
          style={{
            width: "50%",
            padding: "7px 10px",
            // boxShadow: "0px 5px 18px lightgray",
            borderRadius: "8px",
            backgroundColor: "green",
            color: "white",
            margin: "8px",
            marginBottom: "10px",
            marginTop: "0px",
            border: "0px",
            outline: "none",
            textAlign: "center",
          }}
        >
          Add Group
        </button>
        <button
          onClick={(e: any) => {
            e.preventDefault(); // Add this line
            e.stopPropagation();
            dispatch(setType(""))
            setIsNewGeofence(true);

          }}
          style={{
            width: "50%",
            padding: "7px 10px",
            // boxShadow: "0px 5px 18px lightgray",
            borderRadius: "8px",
            backgroundColor: "green",
            color: "white",
            margin: "8px",
            marginBottom: "10px",
            marginTop: "0px",
            border: "0px",
            outline: "none",
            textAlign: "center",
          }}
        >
          Add Geofence
        </button>

      </div>}



      {isNewGeofence && <form>
        <div style={
          {
            // paddingBottom: "-10px",
            margin: "0px 10px",
          }
        }>
          <P>Title</P>
          <input
            className="form-control"
            type="text"
            placeholder="Enter Title"
            name="title"
            onChange={onChangeHandler}
          // {...register("name", { required: true })}
          />
          <span style={{ color: "red" }}>
            {/* {errors.name && "Country name is required"} */}
          </span>


        </div>
        <div style={
          {
            // marginBottom: "10px",
            margin: "0px 10px",
          }
        }>
          <P>Type</P>
          <Select
            showSearch
            style={{ width: "100%", height: 36, marginBottom: "15px", }}
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
              dispatch(setType(e))
              // dispatch(setCountryId(e));
            }}
            options={typeList}
          />


        </div>
        <div style={
          {
            // marginTop: "15px",
            margin: "0px 10px",
          }
        }>
          <P>Group</P>
          <Select
            showSearch
            style={{ width: "100%", height: 36, marginBottom: "15px", }}
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
              dispatch(setType(e))
              // dispatch(setCountryId(e));
            }}
            options={groupList}
          />


        </div>


        <div style={{ display: "flex" }}>
          <button
            onClick={(e: any) => {
              e.preventDefault(); // Add this line
              e.stopPropagation();
              setIsNewGeofence(false)
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
            Add
          </button>

        </div>
      </form>

      }


      {isNewGroup && <form>

        <div style={
          {
            // paddingBottom: "-10px",
            margin: "0px 10px",
          }
        }>
          <P>Title</P>
          <input
            className="form-control"
            type="text"
            placeholder="Enter Title"
            name="title"
            onChange={onChangeHandler}
          // {...register("name", { required: true })}
          />
          <span style={{ color: "red" }}>
            {/* {errors.name && "Country name is required"} */}
          </span>


        </div>
        <div style={
          {
            // marginBottom: "10px",
            margin: "0px 10px",
          }
        }>
          <P>Ungrouped Geofences</P>
          <Select
            showSearch
            style={{ width: "100%", height: 36, marginBottom: "15px", }}
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
              dispatch(setType(e))
              // dispatch(setCountryId(e));
            }}
            options={geofencesList}
          />


        </div>


        <div style={{ display: "flex" }}>
          <button
            onClick={(e: any) => {
              e.preventDefault(); // Add this line
              e.stopPropagation();
              setIsNewGroup(false)
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
              setIsNewGroup(false)
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
            Add
          </button>

        </div>
      </form>



      }


      {/* ----------------------------------- */}
      {matchedGroups?.length > 0 && (
        <Accordion open={open} toggle={toggle} className="dark-accordion">
          {matchedGroups?.filter((item: any) =>
            item.items.some((bodyItem: any) =>
              statusDevices === "Expired"
                ? bodyItem.time === statusDevices
                : statusDevices === "Not Connecetd"
                  ? bodyItem.time == null ||
                  bodyItem.time === "" ||
                  bodyItem.time == undefined
                  : statusDevices === ""
                    ? bodyItem.online === bodyItem.online
                    : bodyItem.online === statusDevices
            )
          )
            .filter((item: any) =>
              item.items.some(
                (bodyItem: any) =>
                  bodyItem.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  bodyItem.imei.includes(searchValue) ||
                  bodyItem.id == searchValue
              )
            )
            .map((item: any, index: any) => {
              const gradientId = `gradient-${index}`; // Generate a unique gradient ID for each item
              return (
                <AccordionItem key={index}  >
                  {item.items.length > 0 && (
                    <div
                    >
                      <AccordionHeader
                        targetId={`${searchValue.length >= 1 ? "all" : index}`}
                        className=" custom-accordion-header"

                      >
                        <input
                          type="checkbox"
                          style={{
                            marginRight: "10px",
                            height: "17",
                            width: "17px",
                          }}
                          checked={item.checked}
                          onClick={(e) => handleCheckboxClick(e, item)}
                        />
                        <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                          {item.title} &nbsp; (
                          {
                            item.items
                              .filter((bodyItem: any) =>
                                statusDevices === "Expired"
                                  ? bodyItem.time === statusDevices
                                  : statusDevices === "Not Connecetd"
                                    ? bodyItem.time == null ||
                                    bodyItem.time === "" ||
                                    bodyItem.time == undefined
                                    : statusDevices === ""
                                      ? bodyItem.online === bodyItem.online
                                      : bodyItem.online === statusDevices
                              )
                              .filter(
                                (bodyItem: any) =>
                                  bodyItem.name
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase()) ||
                                  bodyItem.imei.includes(searchValue) ||
                                  bodyItem.id == searchValue
                              ).length
                          }
                          )
                        </span>
                        {/* <div style={{position:"absolute",marginTop:"35px",borderBottom:"1px solid lightGray",width:"90%"}}></div> */}
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
                          statusDevices === "Expired"
                            ? bodyItem.time === statusDevices
                            : statusDevices === "Not Connecetd"
                              ? bodyItem.time == null ||
                              bodyItem.time === "" ||
                              bodyItem.time == undefined
                              : statusDevices === ""
                                ? bodyItem.online === bodyItem.online
                                : bodyItem.online === statusDevices
                        )
                        .filter(
                          (bodyItem: any) =>
                            bodyItem.name
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) ||
                            bodyItem.imei.includes(searchValue) ||
                            bodyItem.id == searchValue
                        )
                        .slice(0, itemsLength)
                        .map((bodyItem: any, bodyindex: any) => {
                          return (
                            <div
                              key={bodyItem.id}
                              style={{
                                padding: "8px 10px",
                                boxShadow: "5px 5px 15px lightgray",
                                borderRadius: "12px",
                                margin: "10px -10px",
                                cursor: "pointer",
                                backgroundColor: `${bodyItem.icon_color === "green"
                                  ? "rgba(0,255,0,0.2)"
                                  : bodyItem.icon_color === "yellow"
                                    ? "rgb(255,255,0,0.1)"
                                    : bodyItem.time === "Expired"
                                      ? "lightGray"
                                      : (bodyItem.icon_color === "blue" ||
                                        bodyItem.icon_color === "black") &&
                                        bodyItem.time !== "Expired"
                                        ? "rgba(0,0,0,0.2)"
                                        : "rgba(255,0,0,0.2)"
                                  }`,
                              }}
                              onClick={(e) => {
                                dispatch(
                                  setExpandedDevice({
                                    position: {
                                      lat: bodyItem.lat,
                                      lng: bodyItem.lng,
                                    },
                                    tail: bodyItem.tail,
                                    deviceId: bodyItem.id,
                                  })
                                );
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
                                  }}
                                >
                                  <label
                                    style={{
                                      display: "inline-block",
                                      position: "relative",
                                      cursor: "pointer",
                                      paddingTop: "2px",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      name="key"
                                      value="value"
                                      checked={bodyItem.checked}
                                      // checked={Devicess.some((item: any) => {
                                      //   return item.id === bodyItem.id;
                                      // })}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleSelecetdDevices(
                                          e,
                                          item,
                                          bodyItem,
                                          bodyindex
                                        );
                                      }}
                                      style={{ display: "none" }} // Hide the default checkbox
                                    />
                                    <span
                                      onClick={(e) => e.stopPropagation()}
                                      className={
                                        bodyItem.icon_color === "green"
                                          ? "onlineDevice"
                                          : bodyItem.icon_color === "yellow"
                                            ? "engine"
                                            : bodyItem.time === "Expired"
                                              ? "expired"
                                              : (bodyItem.icon_color === "blue" ||
                                                bodyItem.icon_color ===
                                                "black") &&
                                                bodyItem.time !== "Expired"
                                                ? "black"
                                                : bodyItem.icon_color === "red"
                                                  ? "ack" : bodyItem.online
                                      }
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
                                      {bodyItem.name.length > 26
                                        ? `${bodyItem.name.slice(0, 26)}...`
                                        : bodyItem.name}
                                    </span>
                                    <span style={{ fontSize: "11px" }}>
                                      {/* {formattedDate(bodyItem.timestamp)} */}
                                      {bodyItem.time.slice(0, 10)} ,{" "}
                                      {bodyItem.time.slice(11)}
                                    </span>
                                  </div>
                                </div>


                              </div>
                            </div>
                          );
                        })}
                      {item.items
                        .filter((bodyItem: any) =>
                          statusDevices === "Expired"
                            ? bodyItem.time === statusDevices
                            : statusDevices === "Not Connecetd"
                              ? bodyItem.time == null ||
                              bodyItem.time === "" ||
                              bodyItem.time == undefined
                              : statusDevices === ""
                                ? bodyItem.online === bodyItem.online
                                : bodyItem.online === statusDevices
                        )
                        .filter(
                          (bodyItem: any) =>
                            bodyItem.name
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) ||
                            bodyItem.imei.includes(searchValue) ||
                            bodyItem.id == searchValue
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
