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
    const stcickyBarOptions = [{
        label: "Activity",
        icon: <AiFillShop size={18} />
    },


    ]
    return (
        <div className="sticky-bar-operations">
            {stcickyBarOptions.map((option) => (
                <div
                    key={option.label}
                    className={`sticky-label ${component === option.label ? "active" : ""
                        }`}
                    onClick={() => {
                        setComponent(option.label);
                        if (option.label == "Activity") {
                            navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/operations/activity`)
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
