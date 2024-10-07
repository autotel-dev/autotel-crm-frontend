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
  const stcickyBarOptions = [
    {
      label: "Bank Accounts",
      icon: <BsBank2 size={18} />
    },
    {
      label: "Expense Accounts",
      icon: <MdSwitchAccount size={18} />
    },
    {
      label: "Expenses",
      icon: <GiExpense size={18} />
    },
    {
      label: "Tax",
      icon: <BsBank2 size={18} />
    },
    {
      label: "Chart Of Accounts",
      icon: <MdSwitchAccount size={18} />
    },
    {
      label: "Accounting Ledger",
      icon: <MdSwitchAccount size={18} />
    },

  ]
  return (
    <div className="sticky-bar-accounts">
      {stcickyBarOptions.map((option) => (
        <div
          key={option.label}
          className={`sticky-label ${component === option.label ? "active" : ""
            }`}
          onClick={() => {
            setComponent(option.label);

            if (option.label == "Expense Accounts") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/expense-accounts`)
            }
            else if (option.label == "Bank Accounts") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/bank-accounts`)
            }
            else if (option.label == "Expenses") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/expenses`)
            }
            else if (option.label == "Tax") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/tax`)
            }
            else if (option.label == "Chart Of Accounts") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/accounting-chart`)
            }
            else if (option.label == "Accounting Ledger") {
              navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/accounts/accounting-ledger`)
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
