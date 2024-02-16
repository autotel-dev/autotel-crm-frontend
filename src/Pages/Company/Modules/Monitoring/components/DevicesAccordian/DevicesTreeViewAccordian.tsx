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
import html2canvas from "html2canvas";
import greenKey from "../../../../../../assets/key-green.png";
import redKey from "../../../../../../assets/key-red.png";
import greenSatellite from "../../../../../../assets/satellite-green.png";
import redSatellite from "../../../../../../assets/satellite-green.png";

const DevicesTreeViewAccordian = () => {
  const svgRef = useRef(null);

  const [itemsLength, setItemsLength] = useState(6);
  const { devices, selectedDevices } = useSelector(
    (state: any) => state.monitoring
  );
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState("");
  const [matchedGroups, setMatchedGroups] = useState(devices);
  const [Devices, setDevices]: any = useState([]);
  const dispatch = useDispatch();

  console.log("devices", devices);

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

    const groupItems = group.items;

    // Check if any item of this group is already selected
    const isAnyItemSelected = groupItems.some((item: any) =>
      Devices.find((selectedItem: any) => selectedItem.title === item.title)
    );

    // If no item of this group is selected, add all items to selectedDevices
    if (!isAnyItemSelected) {
      const newSelectedDevices = [...Devices, ...groupItems];
      setDevices(newSelectedDevices);
      dispatch(setSelecetdDevices(newSelectedDevices));
    } else {
      // Otherwise, remove all items of this group from selectedDevices
      const updatedDevices = Devices.filter((selectedItem: any) =>
        groupItems.every((item: any) => selectedItem.title !== item.title)
      );
      setDevices(updatedDevices);
      dispatch(setSelecetdDevices(updatedDevices));
    }
    console.log("selectedDevices-->", Devices);
  };

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);

    const matchedGroups = devices.map((group: any, index: any) => {
      const matchedItems = group.items.filter((item: any) =>
        item.name.toLowerCase().includes(searchKey)
      );
      return { title: group.title, items: matchedItems };
    });
    const matcheditems = matchedGroups.filter(
      (item: any, index: any) => item.items.length > 0
    );
    console.log("matcheditems", matcheditems);
    setMatchedGroups(matcheditems);
  };

  const handleSelecetdDevices = (e: any, device: any) => {
    // Prevent the click event from propagating to the accordion
    e.stopPropagation();
    const index = Devices.indexOf(device);
    if (index === -1) {
      const updatedDevices = [...Devices, device];
      dispatch(setSelecetdDevices(updatedDevices));
      setDevices(updatedDevices);
    } else {
      const updatedDevices = [...Devices];
      updatedDevices.splice(index, 1);
      dispatch(setSelecetdDevices(updatedDevices));
      setDevices(updatedDevices);
    }

    console.log("selectedDevices-->", Devices);
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
          padding: "10px 12px",
          boxShadow: "0px 5px 18px lightgray",
          borderRadius: "15px",
          margin: "10px",
          marginBottom: "20px",
        }}
      />

      {matchedGroups.length > 0 && (
        <Accordion open={open} toggle={toggle} className="dark-accordion">
          {matchedGroups.map((item: any, index: any) => {
            const gradientId = `gradient-${index}`; // Generate a unique gradient ID for each item
            return (
              <AccordionItem key={index}>
                <div style={{ backgroundColor: "gray", fontWeight: "bold" }}>
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
                      onClick={(e) => handleCheckboxClick(e, item)}
                    />
                    <span style={{ fontWeight: "bold" }}>
                      {item.title} &nbsp; ({item.items.length})
                    </span>
                    <FeatherIcons
                      iconName={
                        open == `${index}` ? "ChevronUp" : "ChevronDown"
                      }
                      className="svg-color"
                    />
                  </AccordionHeader>
                </div>
                <AccordionBody
                  accordionId={`${searchValue.length >= 1 ? "all" : index}`}
                >
                  {item.items.map((bodyItem: any, bodyindex: any) => {
                    if (bodyindex <= itemsLength) {
                      return (
                        <div
                          key={bodyindex}
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
                                  checked={selectedDevices.some(
                                    (selectedItem: any) =>
                                      selectedItem === bodyItem
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleSelecetdDevices(e, bodyItem);
                                  }}
                                  style={{ display: "none" }} // Hide the default checkbox
                                />
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className={
                                    bodyItem.icon_color === "green"
                                      ? "green"
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
                                  {formattedDate(bodyItem.timestamp)}
                                </span>
                              </div>
                            </div>

                            <div
                              style={{
                                marginBottom: "-20px",
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
                                {/* Add your speedometer graphics or customize as needed */}
                                {/* Half-circle shape */}
                                <path
                                  d="M 10 50
      A 40 40 0 0 1 90 50"
                                  fill="none"
                                  stroke="url(#gradient)" // Use a gradient for multicolor stroke
                                  strokeWidth="10" // Increase stroke width for a thicker stroke
                                />
                                {/* Define gradient */}
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
                                {/* Speed points */}
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
                                  // points="50,50 55,30 50,20 45,30"
                                  points="50,42 55,22 50,12 45,22"
                                  fill="black" // Needle color
                                />
                                {/* Speed text */}
                                <text
                                  x="50"
                                  y="53"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize="18"
                                >
                                  {bodyItem.speed} kph
                                </text>
                              </svg>
                              <div>
                                <div
                                  style={{
                                    display: "inline-block",
                                    height: "40px",
                                    width: "25px",
                                    verticalAlign: "middle",
                                    marginTop: "6px",
                                    marginLeft: "15px",
                                  }}
                                >
                                  <img
                                    src={
                                      bodyItem.engine_status ? greenKey : redKey
                                    }
                                    alt=""
                                    height={30}
                                    width={25}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "inline-block",
                                    height: "40px",
                                    width: "25px",
                                    verticalAlign: "middle",
                                    marginTop: "6px",
                                    marginLeft: "15px",
                                  }}
                                >
                                  <img
                                    src={greenSatellite}
                                    alt=""
                                    height={30}
                                    width={25}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  {item.items.length >= 6 && (
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
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </>
  );
};

export default DevicesTreeViewAccordian;
