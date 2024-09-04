import React, { useEffect, useState } from "react";
import { GrOrganization, GrProductHunt, GrSort } from "react-icons/gr";
import { MdOutlineCrisisAlert } from "react-icons/md";
import { BiSolidCarCrash } from "react-icons/bi";
import { RiFundsBoxFill } from "react-icons/ri";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { MdContactSupport } from "react-icons/md";
import "./StickyBar.css"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
interface StickyBarProps {
  component: any;
  setComponent: any;
}

const StickyBar: React.FC<StickyBarProps> = ({
  component,
  setComponent
}) => {
  const navigate = useNavigate()
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
    <div className="sticky-bar-inventory">
      {stcickyBarOptions.map((option) => (
        <div
          key={option.label}
          className={`sticky-label ${component === option.label ? "active" : ""
            }`}
          onClick={() => {
            setComponent(option.label);
            if (option.label == "Products") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/inventory/products`)
            }
            else if (option.label == "Stock Movement") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/inventory/stock-movement`)
            }
            else if (option.label == "Stock Adjustment types") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/inventory/stock-adjustment-type`)
            }
            else if (option.label == "Stock Adjustment") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/inventory/stock-adjustment`)
            }
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
