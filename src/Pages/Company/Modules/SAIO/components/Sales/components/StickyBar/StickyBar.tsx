import React from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { MdContactSupport, MdLeaderboard } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { TbFileInvoice } from "react-icons/tb";

import "./StickyBar.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface StickyBarProps {
  component: string;
  setComponent: any;
}

const StickyBar: React.FC<StickyBarProps> = ({ component, setComponent }) => {
  const stcickyBarOptions = [
    {
      label: "Sale Leads",
      icon: <MdLeaderboard size={18} />,
    },
    {
      label: "Sale Invoices",
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
    {
      label: "Customer Ledger",
      icon: <BsPersonLinesFill size={18} />,
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="sticky-bar">
      {stcickyBarOptions.map((option) => (
        <div
          key={option.label}
          className={`sticky-label ${
            component == option.label ? "active" : ""
          }`}
          onClick={() => {
            setComponent(option.label);
            if (option.label == "Sale Leads") {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`
              );
            } else if (option.label == "Sale Invoices") {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/invoices`
              );
            } else if (option.label == "Receive Money") {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/receive-money`
              );
            } else if (option.label == "Customers") {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customers`
              );
            } else if (option.label == "Customer Ledger") {
              navigate(
                `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/customer-ledger`
              );
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
