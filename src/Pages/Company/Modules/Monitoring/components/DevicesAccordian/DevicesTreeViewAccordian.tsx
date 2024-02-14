import { useEffect, useState } from "react";
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

const DevicesTreeViewAccordian = () => {
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
                                    : bodyItem.icon_color === "blue"
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
                              <span style={{ fontWeight: "bold" }}>
                                {bodyItem.name}
                              </span>
                              <span>date</span>
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
