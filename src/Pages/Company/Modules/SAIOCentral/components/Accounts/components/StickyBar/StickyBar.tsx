import React, { useEffect, useState } from "react";
import { GrOrganization } from "react-icons/gr";
import { MdOutlineCrisisAlert, MdOutlinePayment, MdSwitchAccount } from "react-icons/md";
import { BiSolidCarCrash } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import { AiFillShop } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa";
import "./StickyBar.css"
import Swal from "sweetalert2";
import { BsBank2 } from "react-icons/bs";
import { GiExpense } from "react-icons/gi";
interface StickyBarProps {
    component: any;
    setComponent: any;
}

const StickyBar: React.FC<StickyBarProps> = ({
    component,
    setComponent
}) => {
    const stcickyBarOptions = [{
        label: "Vendors",
        icon: <AiFillShop size={18} />
    },
    {
        label: "Purchase Invoice",
        icon: <FaFileInvoiceDollar size={18} />
    },
    {
        label: "Expense Accounts",
        icon: <MdSwitchAccount size={18} />
    },
    {
        label: "Bank Accounts",
        icon: <BsBank2 size={18} />
    },
    {
        label: "Make Payment",
        icon: <MdOutlinePayment size={18} />
    },
    {
        label: "Expenses",
        icon: <GiExpense size={18} />
    }

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
