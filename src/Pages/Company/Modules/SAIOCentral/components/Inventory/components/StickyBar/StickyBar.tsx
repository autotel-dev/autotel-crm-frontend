import React, { useEffect, useState } from "react";
import { GrOrganization, GrProductHunt, GrSort } from "react-icons/gr";
import { MdOutlineCrisisAlert } from "react-icons/md";
import { BiSolidCarCrash } from "react-icons/bi";
import { RiFundsBoxFill } from "react-icons/ri";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { MdContactSupport } from "react-icons/md";
import "./StickyBar.css"
import Swal from "sweetalert2";
interface StickyBarProps {
    component: any;
    setComponent: any;
}

const StickyBar: React.FC<StickyBarProps> = ({
    component,
    setComponent
}) => {
    const stcickyBarOptions = [{
        label: "Products",
        icon: <GrProductHunt size={18} />
    },
    {
        label: "Stock Movement",
        icon: <RiFundsBoxFill size={18} />
    },
    {
        label: "Stock Adjustment types",
        icon: <GrSort size={18} />
    },
    {
        label: "Stock Adjustment",
        icon: <HiMiniAdjustmentsHorizontal size={18} />
    },

    ]
    return (
        <div className="sticky-bar">
          {stcickyBarOptions.map((option) => (
            <div
              key={option.label}
              className={`sticky-label ${
                component === option.label ? "active" : ""
              }`}
              onClick={() => {
                setComponent(option.label);
              }}
            >
              {option.icon}
              <span className="tooltip">{option.label}</span>
            </div>
          ))}
        </div>
      );
};

export default StickyBar;
