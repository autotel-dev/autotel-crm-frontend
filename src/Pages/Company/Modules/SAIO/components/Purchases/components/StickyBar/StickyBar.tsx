import React, { useEffect, useState } from "react";

import { MdOutlinePayment } from "react-icons/md";

import { AiFillShop } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa";
import "./StickyBar.css"
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
    label: "Vendors",
    icon: <AiFillShop size={18} />
  },
  {
    label: "Purchase Invoices",
    icon: <FaFileInvoiceDollar size={18} />
  },
  {
    label: "Make Payments",
    icon: <MdOutlinePayment size={18} />
  },

  ]
  return (
    <div className="sticky-bar-purchases">
      {stcickyBarOptions.map((option) => (
        <div
          key={option.label}
          className={`sticky-label ${component === option.label ? "active" : ""
            }`}
          onClick={() => {
            setComponent(option.label);
            if (option.label == "Vendors") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/vendors`)
            }
            else if (option.label == "Purchase Invoices") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/purchase-invoices`)
            }
            else if (option.label == "Make Payments") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/purchases/make-payments`)
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
