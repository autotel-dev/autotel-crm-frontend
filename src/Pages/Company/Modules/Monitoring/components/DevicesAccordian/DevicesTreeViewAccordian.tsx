import { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import FeatherIcons from "../../../../../../utils/CommonSvgIcon/FeatherIcons";
import {
  Elementswebdesign,
  SimpleAccordionText,
  SimpleAccordionText1,
  SimpleAccordionText2,
  Usewebdesign,
  Webdesignersdo,
} from "../../../../../../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import "./inputStyle.css";

const DevicesTreeViewAccordian = () => {
  const { devices } = useSelector((state: any) => state.monitoring);
  console.log("devices", devices);
  const [itemsLength, setItemsLength] = useState(6);

  const [open, setOpen] = useState("");

  const toggle = (id: string) => {
    open === id ? setOpen("") : setOpen(id);
    setItemsLength(6);
  };
  const handleCheckboxClick = (e: any) => {
    // Prevent the click event from propagating to the accordion
    e.stopPropagation();
  };
  return (
    //@ts-ignore
    <>
      {" "}
      {devices.length > 0 && (
        <Accordion open={open} toggle={toggle} className="dark-accordion">
          {devices.map((item: any, index: any) => {
            return (
              <AccordionItem key={index}>
                <div style={{ backgroundColor: "gray", fontWeight: "bold" }}>
                  <AccordionHeader
                    targetId={`${index}`}
                    className="bg-light-primary"
                  >
                    <input
                      type="checkbox"
                      style={{
                        marginRight: "10px",
                        height: "22px",
                        width: "22px",
                      }}
                      onClick={handleCheckboxClick}
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
                <AccordionBody accordionId={`${index}`}>
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
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              // width: "40%",
                              // justifyContent: "space-between",
                            }}
                          >
                            <label
                              style={{
                                display: "inline-block",
                                position: "relative",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="key"
                                value="value"
                                style={{ display: "none" }} // Hide the default checkbox
                              />
                              <span></span>
                            </label>
                            <style>
                              {`
        label > input[type="checkbox"] + span::before {
          content: "";
          display: inline-block;
          vertical-align: bottom;
          width: 20px;
          height: 20px; 
          border-radius: 10%;
          border-style: solid;
          border-width: 0.15rem;
          border-color: red;
          margin-right: 15px;
        }
        
        label > input[type="checkbox"]:checked + span::before {
          content: "✓"; /* you can change check logo here */
          font-weight: bold; /* make content bold */
          transform: scale(1.1); /* this is for check size */
          color: red; /* check colour */
          text-align: center;
          background: white; /* check background colour */
          border-color: red; /* check border colour */
          margin-right: 15px;
          
        }
        
        label > input[type="checkbox"]:checked + span {
          color: red;
        }
      `}
                            </style>
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
                        if (itemsLength <= 7) {
                          setItemsLength(itemsLength + 5);
                        } else {
                          setItemsLength(itemsLength - 5);
                        }
                      }}
                    >
                      {itemsLength <= 7 ? "Show More" : "Show Less"}
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
