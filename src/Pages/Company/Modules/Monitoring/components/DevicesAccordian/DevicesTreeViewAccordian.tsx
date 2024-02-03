// import { Card, CardBody, Col } from "reactstrap";

// import { BasicTrees } from "./../../../../../../utils/Constant";
// import { IoMdArrowDropright } from "react-icons/io";
// import TreeView, { flattenTree } from "react-accessible-treeview";
// import cx from "classnames";
// import { simpleTreeviewData } from "./../../../../../../Data/BonusUi/TreeViewData";
// import { FaCheckSquare, FaMinusSquare, FaSquare } from "react-icons/fa";
// import CommonHeader from "../../../../../../Common/CommonHeader";
// interface BasicTreesProp {
//   variant?: string;
//   isOpen?: boolean;
//   className?: string;
//   onClick?: (e: {}) => void;
// }
// export const ArrowIcon = ({ isOpen, className }: BasicTreesProp) => {
//   const baseClass = "arrow";
//   const classes = cx(
//     baseClass,
//     { [`${baseClass}--closed`]: !isOpen },
//     { [`${baseClass}--open`]: isOpen },
//     className
//   );
//   return <IoMdArrowDropright className={classes} />;
// };

// export const CheckBoxIcon = ({ variant, ...rest }: BasicTreesProp) => {
//   switch (variant) {
//     case "all":
//       return <FaCheckSquare color="#4AAD8A" {...rest} />;
//     case "none":
//       return (
//         <FaSquare
//           color="white"
//           {...rest}
//           style={{ border: "1px solid #80808069" }}
//         />
//       );
//     case "some":
//       return <FaMinusSquare {...rest} color="#33BFBF" />;
//     default:
//       return null;
//   }
// };
// const DevicesTreeViewAccordian = () => {
//   const treeData = flattenTree(simpleTreeviewData);
//   return (
//     <Col>
//       <Card>
//         <CardBody>
//           <div className="tree-container">
//             <div className="checkbox">
//               <TreeView
//                 data={treeData}
//                 aria-label="Checkbox tree"
//                 multiSelect
//                 propagateSelect
//                 propagateSelectUpwards
//                 togglableSelect
//                 expandedIds={[1, 2, 6, 10]}
//                 defaultSelectedIds={[1, 2, 3]}
//                 nodeRenderer={({
//                   element,
//                   isBranch,
//                   isExpanded,
//                   isSelected,
//                   isHalfSelected,
//                   getNodeProps,
//                   level,
//                   handleSelect,
//                   handleExpand,
//                 }) => {
//                   return (
//                     <div
//                       {...getNodeProps({ onClick: handleExpand })}
//                       style={{ marginLeft: 40 * (level - 1), marginTop: 5 }}
//                       className="d-flex align-items-center"
//                     >
//                       {isBranch && <ArrowIcon isOpen={isExpanded} />}
//                       <CheckBoxIcon
//                         className="checkbox-icon "
//                         onClick={(e: any) => {
//                           handleSelect(e);
//                           e.stopPropagation();
//                         }}
//                         variant={
//                           isHalfSelected ? "some" : isSelected ? "all" : "none"
//                         }
//                       />
//                       <span className="name">{element.name}</span>
//                     </div>
//                   );
//                 }}
//               />
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </Col>
//   );
// };

// export default DevicesTreeViewAccordian;

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
import { useSelector } from "react-redux";

const DevicesTreeViewAccordian = () => {
  const { devices } = useSelector((state: any) => state.monitoring);
  console.log("devices", devices);

  const [open, setOpen] = useState("0");

  const toggle = (id: string) => {
    open === id ? setOpen("") : setOpen(id);
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
                <div>
                  <AccordionHeader
                    targetId={`${index}`}
                    className="bg-light-primary font-primary"
                    style={{ backgroundColor: "lightgray" }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        marginRight: "10px",
                        height: "20px",
                        width: "20px",
                      }}
                      onClick={handleCheckboxClick}
                    />
                    {item.title}
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
                    return (
                      <div
                        key={bodyindex}
                        style={{
                          padding: "10px 5px",
                          boxShadow: "0px 5px 15px lightgray",
                          //   border: "1px solid",
                          borderRadius: "15px",
                          margin: "10px 0px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "40%",
                            justifyContent: "space-between",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{ height: "20px", width: "20px" }}
                          />
                          <div
                            style={{
                              height: "20px",
                              width: "20px",
                              borderRadius: "100%",
                              backgroundColor: "red",
                            }}
                          ></div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span style={{ fontWeight: "bold" }}>
                              {bodyItem.name}
                            </span>
                            <span>date</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
