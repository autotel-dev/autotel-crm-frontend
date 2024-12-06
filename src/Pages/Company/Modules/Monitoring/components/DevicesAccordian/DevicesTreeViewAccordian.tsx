import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import FeatherIcons from "../../../../../../utils/CommonSvgIcon/FeatherIcons";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import SVG from "../../../../../../utils/CommonSvgIcon/SVG";
import {
  setDevices,
  setDevicesDetailData,
  setExpandedDevice,
  setItem,
  setSelecetdDevices,
} from "../../../../../../ReaduxToolkit/Reducer/MonitoringSlice";
import "./inputStyle.css";
import greenKey from "../../../../../../assets/key-green.png";
import redKey from "../../../../../../assets/key-red.png";
import greenSatellite from "../../../../../../assets/satellite-green.png";
import redSatellite from "../../../../../../assets/satellite-green.png";

interface PropTypes {
  statusDevices: String;
}

const DevicesTreeViewAccordian = ({ statusDevices }: PropTypes) => {
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

    // const groupItems = group.items;

    // // Check if any item of this group is already selected

    // const isAnyItemSelected = groupItems.every((item: any) =>
    //   Devicess.find((selectedItem: any) => selectedItem.title === item.title)
    // );
    // // console.log(isAnyItemSelected);

    // // If no item of this group is selected, add all items to selectedDevices
    // if (isAnyItemSelected) {
    //   const newSelectedDevices = [...Devicess, ...groupItems];
    //   setDevices(newSelectedDevices);
    //   dispatch(setSelecetdDevices(newSelectedDevices));
    // } else {
    //   // Otherwise, remove all items of this group from selectedDevices
    //   const updatedDevices = Devicess.filter((selectedItem: any) =>
    //     groupItems.every((item: any) => selectedItem.title !== item.title)
    //   );
    //   setDevices(updatedDevices);
    //   dispatch(setSelecetdDevices(updatedDevices));
    // }
    // // console.log("selectedDevices-->", devices);
  };

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);

    // const matchedGroupss = devices.map((group: any, index: any) => {
    //   const matchedItems = group.items.filter((item: any) =>
    //     item.name.toLowerCase().includes(searchKey)
    //   );
    //   return {
    //     title: group.title,
    //     checked: group.checked,
    //     items: matchedItems,
    //   };
    // });
    // const matcheditems = matchedGroupss.filter(
    //   (item: any, index: any) => item.items.length > 0
    // );
    // // console.log("matcheditems", matcheditems);
    // setMatchedGroups(matcheditems);
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

        // Create a new device object with the updated items array
        // const updatedDevice = {
        //   ...deviceToUpdate,
        //   checked: allItemsChecked,
        //   items: [
        //     ...deviceToUpdate.items.slice(0, index),
        //     {
        //       ...deviceToUpdate.items[index],
        //       checked: !selectedDevice.checked,
        //     },
        //     ...deviceToUpdate.items.slice(index + 1),
        //   ],
        // };
        // const updatedDevices = devices.map((device: any) =>
        //   device.title === group.title ? updatedDevice : device
        // );
      };

      const updatedDevices = devices.map((device: any) =>
        device.title === group.title ? updatedDevice : device
      );
      // Create a new array of devices with the updated device object at the same index
      dispatch(setDevices(updatedDevices));
    }
  };

  // const handleSelecetdDevices = (
  //   e: any,
  //   group: any,
  //   selectedDevice: any,
  //   indexx: Number
  // ) => {
  //   // Prevent the click event from propagating to the accordion
  //   e.stopPropagation();

  //   const updatedDevices = devices.map((device: any) => {
  //     if (device.title === group.title) {
  //       const updatedItems = device.items.map((item: any) => {
  //         // console.log("item._id", item);
  //         // console.log("selectedDevice._id", selectedDevice);
  //         if (item.id === selectedDevice.id) {
  //           // console.log("item._id - matchewd", item);
  //           // console.log("selectedDevice._id  -matchewd", selectedDevice);
  //           return {
  //             ...item,
  //             checked: !selectedDevice.checked, // Set checked to the opposite of group.checked
  //           };
  //         }
  //         return item; // Return the item if it doesn't match the condition
  //       });
  //       return { ...device, items: updatedItems };
  //     }
  //     return device;
  //   });

  //   // Dispatch an action to update the Devices state in Redux
  //   dispatch(setDevices(updatedDevices));
  //   // console.log("Devicesss - - >", Devicess);

  //   const condition = Devicess.includes(selectedDevice);
  //   const index = Devicess.findIndex(
  //     (device: any) => device.id === selectedDevice.id
  //   );
  //   // console.log(condition);
  //   if (condition) {
  //     const updatedDevices = [...Devicess];
  //     updatedDevices.splice(index, 1);
  //     setDevices(updatedDevices);
  //     dispatch(setSelecetdDevices(updatedDevices));
  //     // console.log("Devices false", Devicess);
  //   } else {
  //     const updatedDevices = [...Devicess, selectedDevice];
  //     setDevices(updatedDevices);
  //     dispatch(setSelecetdDevices(updatedDevices));
  //     // console.log("Devices true", Devicess);
  //   }

  //   // console.log("selectedDevices-->", Devicess);
  // };

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
        });
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
        });
        if (index == devices.length - 1) {
          dispatch(setDevicesDetailData([...tempList]));
        }
      });
      return { ...device, checked: false, items: updatedItems };
    });

    dispatch(setDevices(updatedDevices));
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
            marginBottom: "10px",
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
            marginBottom: "10px",
            marginTop: "0px",
            border: "0px",
            outline: "none",
            textAlign: "center",
          }}
        >
          Deselect All
        </button>
      </div>
      {matchedGroups.length > 0 && (
        <div
          style={{
            height: "75.5vh",
            overflow: "auto",
            scrollbarWidth: "none",
          }}
        >
          <Accordion open={open} toggle={toggle} className="dark-accordion">
            {matchedGroups
              .filter((item: any) =>
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
                  <AccordionItem key={index}>
                    {item.items.length > 0 && (
                      <div>
                        <AccordionHeader
                          targetId={`${
                            searchValue.length >= 1 ? "all" : index
                          }`}
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
                          <span
                            style={{ fontWeight: "bold", fontSize: "13px" }}
                          >
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
                        accordionId={`${
                          searchValue.length >= 1 ? "all" : index
                        }`}
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
                                  backgroundColor: `${
                                    bodyItem.icon_color === "green"
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
                                            ? "ack"
                                            : bodyItem.online
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
        </div>
      )}
    </>
  );
};

export default DevicesTreeViewAccordian;
