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


import { useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import FeatherIcons from '../../../../../../utils/CommonSvgIcon/FeatherIcons';
import { Elementswebdesign, SimpleAccordionText, SimpleAccordionText1, SimpleAccordionText2, Usewebdesign, Webdesignersdo } from '../../../../../../utils/Constant';

const DevicesTreeViewAccordian = () => {
    const [open, setOpen] = useState('0');

    const toggle = (id: string) => {
        open === id ? setOpen('') : setOpen(id);
    };
    return (
        //@ts-ignore
        <Accordion open={open} toggle={toggle}  className='dark-accordion'>
            <AccordionItem>
                <AccordionHeader targetId="1" className='bg-light-primary font-primary'>
                    {Webdesignersdo}
                    <FeatherIcons iconName={open === '1' ? 'ChevronUp' : 'ChevronDown'} className='svg-color' />
                </AccordionHeader>
                <AccordionBody accordionId="1">
                    {SimpleAccordionText}
                </AccordionBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader targetId="2" className='bg-light-primary font-primary'>
                    {Usewebdesign}
                    <FeatherIcons iconName={open === '2' ? 'ChevronUp' : 'ChevronDown'} className='svg-color' />
                </AccordionHeader>
                <AccordionBody accordionId="2">
                    {SimpleAccordionText1}
                </AccordionBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader targetId="3" className='bg-light-primary font-primary'>
                    {Elementswebdesign}
                    <FeatherIcons iconName={open === '3' ? 'ChevronUp' : 'ChevronDown'} className='svg-color' />
                </AccordionHeader>
                <AccordionBody accordionId="3">
                    {SimpleAccordionText2}
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    )
}

export default DevicesTreeViewAccordian