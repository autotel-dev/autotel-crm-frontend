import React, { useEffect, useState } from "react";
import { GrOrganization } from "react-icons/gr";
import { MdOutlineCrisisAlert } from "react-icons/md";
import { BiSolidCarCrash } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import "./StickyBar.css"
import Swal from "sweetalert2";
interface StickyBarProps {
    component: string;
    setComponent: any;
    setIscreateNewSaleLead: any;
    setIscreateNewCustomer: any;
    setIscreateNewInvoice: any;
    setIscreateNewReceiveMoney: any;

}

const StickyBar: React.FC<StickyBarProps> = ({
    component,
    setComponent,
    setIscreateNewSaleLead,
    setIscreateNewCustomer,
    setIscreateNewInvoice,
    setIscreateNewReceiveMoney,
}) => {
    const stcickyBarOptions = [{
        label: "Sale Leads",
        icon: <GrOrganization size={18} />
    },
    {
        label: "Invoices",
        icon: <MdOutlineCrisisAlert size={18} />
    },
    {
        label: "Receive Money",
        icon: <BiSolidCarCrash size={18} />
    },
    {
        label: "Customers",
        icon: <MdContactSupport size={18} />
    }

    ]
    return (


        <div className="sticky-bar">
            {
                stcickyBarOptions.map((option) => (
                    <div
                        key={option.label}
                        className={`sticky-label ${component == option.label ? "active" : ""}`}
                        onClick={() => {
                            setIscreateNewSaleLead(false)
                            setIscreateNewCustomer(false)
                            setIscreateNewInvoice(false)
                            setIscreateNewReceiveMoney(false)
                            setComponent(option.label)
                        }}
                    >
                        {option.icon}
                    </div>
                ))
            }
        </div >
    );
};

export default StickyBar;
