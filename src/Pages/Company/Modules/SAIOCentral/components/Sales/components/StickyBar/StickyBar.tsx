import React from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { MdContactSupport, MdLeaderboard } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { TbFileInvoice } from "react-icons/tb";

import "./StickyBar.css";
import Swal from "sweetalert2";

interface StickyBarProps {
  component: any;
  setComponent: any;
}

const StickyBar: React.FC<StickyBarProps> = ({ component, setComponent }) => {
  const stcickyBarOptions = [
    {
      label: "Sale Leads",
      icon: <MdLeaderboard size={18} />,
    },
    {
      label: "Invoices",
      icon: <TbFileInvoice size={18} />,
    },
    {
      label: "Receive Money",
      icon: <GiReceiveMoney size={18} />,
    },
    {
      label: "Customers",
      icon: <BsPersonLinesFill size={18} />,
    },
  ];

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
