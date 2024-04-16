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
  setExpandedDevice,
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

  const [itemsLength, setItemsLength] = useState(6);
  const { devices, selectedDevices } = useSelector(
    (state: any) => state.monitoring
  );
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
    setItemsLength(6);
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

      const updatedDevice = {
        ...deviceToUpdate,
        checked: allItemsChecked,
        items: deviceToUpdate.items.map((item: any) => {
          if (selectedDevice.id === item.id) {
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
          padding: "15px 15px",
          boxShadow: "0px 5px 18px lightgray",
          borderRadius: "15px",
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
            padding: "10px 15px",
            // boxShadow: "0px 5px 18px lightgray",
            borderRadius: "10px",
            backgroundColor: "gray",
            color: "white",
            margin: "10px",
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
            padding: "10px 15px",
            // boxShadow: "0px 5px 18px lightgray",
            borderRadius: "10px",
            backgroundColor: "gray",
            color: "white",
            margin: "10px",
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
                    <div
                      style={{ backgroundColor: "gray", fontWeight: "bold" }}
                    >
                      <AccordionHeader
                        targetId={`${searchValue.length >= 1 ? "all" : index}`}
                        className="bg-light-primary"
                      >
                        <input
                          type="checkbox"
                          style={{
                            marginRight: "10px",
                            height: "22px",
                            width: "22px",
                          }}
                          checked={item.checked}
                          onClick={(e) => handleCheckboxClick(e, item)}
                        />
                        <span style={{ fontWeight: "bold" }}>
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
                                padding: "10px 12px",
                                boxShadow: "0px 5px 18px lightgray",
                                borderRadius: "15px",
                                margin: "10px -10px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                dispatch(
                                  setExpandedDevice({
                                    lat: bodyItem.lat,
                                    lng: bodyItem.lng,
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
                                          : bodyItem.time === "Expired"
                                          ? "expired"
                                          : bodyItem.icon_color === "blue" &&
                                            bodyItem.time !== "Expired"
                                          ? "black"
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
                                        fontSize: "16px",
                                      }}
                                    >
                                      {bodyItem.name}
                                    </span>
                                    <span style={{ fontSize: "12px" }}>
                                      {/* {formattedDate(bodyItem.timestamp)} */}
                                      {bodyItem.time.slice(0, 10)} ,{" "}
                                      {bodyItem.time.slice(11)}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    marginBottom: "-10px",
                                    marginRight: "20px",
                                    display: "flex",
                                  }}
                                >
                                  <svg
                                    ref={svgRef}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 100 100" // Adjusted viewBox to minimize bottom height
                                    width="58" // You may need to adjust the width accordingly
                                    height="58" // Adjusted height
                                  >
                                    <path
                                      d="M 10 50
A 40 40 0 0 1 90 50"
                                      fill="none"
                                      stroke="url(#gradient)" // Use a gradient for multicolor stroke
                                      strokeWidth="10" // Increase stroke width for a thicker stroke
                                    />

                                    <defs>
                                      <linearGradient
                                        id={`gradient${index}`} // Use unique gradient ID for each item
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="0%"
                                      >
                                        <stop offset="0%" stopColor="red" />
                                        <stop offset="33%" stopColor="yellow" />
                                        <stop offset="66%" stopColor="green" />
                                      </linearGradient>
                                    </defs>

                                    {Array.from(Array(20).keys()).map(
                                      (_, index) => {
                                        const angle =
                                          Math.PI / 1 - (index * Math.PI) / 15;
                                        const x = 50 + Math.cos(angle) * 40;
                                        const y = 50 - Math.sin(angle) * 40;
                                        return (
                                          <circle
                                            key={index}
                                            cx={x}
                                            cy={y}
                                            r="2"
                                            fill="black"
                                          />
                                        );
                                      }
                                    )}
                                    {/* Needle */}
                                    <polygon
                                      points="50,42 55,22 50,12 45,22"
                                      //  points="50,42 55,42 55,12 50,12 45"
                                      fill={
                                        bodyItem.engine_status ? "green" : "red"
                                      } // Needle color
                                      // transform={`translate(0, 0) rotate(${bodyItem.speed}
                                      // , 50, 50)`}
                                    />
                                    {/* Speed text */}
                                    <text
                                      x="50"
                                      y="53"
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      fontSize="20"
                                    >
                                      {bodyItem.speed} kph
                                    </text>
                                  </svg>
                                  <div>
                                    <div
                                      style={{
                                        display: "inline-block",
                                        height: "32px",
                                        width: "22px",
                                        verticalAlign: "middle",
                                        marginTop: "9px",
                                        marginLeft: "15px",
                                      }}
                                    >
                                      <img
                                        src={
                                          bodyItem.engine_status
                                            ? greenKey
                                            : redKey
                                        }
                                        alt=""
                                        height={26}
                                        width={23}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        display: "inline-block",
                                        height: "32px",
                                        width: "22px",
                                        verticalAlign: "middle",
                                        marginTop: "6px",
                                        marginLeft: "15px",
                                      }}
                                    >
                                      <img
                                        src={greenSatellite}
                                        alt=""
                                        height={26}
                                        width={23}
                                      />
                                    </div>
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
                        ).length >= 6 && (
                        <div
                          style={{
                            display: "flex",
                            color: "blue",
                            fontSize: "16px",
                            justifyContent: "end",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (
                              item.items.length >= 6 &&
                              itemsLength < item.items.length
                            ) {
                              setItemsLength(itemsLength + 5);
                            }
                          }}
                        >
                          {item.items.length >= 6 &&
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

export default DevicesTreeViewAccordian;
