import React, { useEffect, useState } from "react";
import { GrOrganization } from "react-icons/gr";
import { MdOutlineCrisisAlert } from "react-icons/md";
import { BiSolidCarCrash } from "react-icons/bi";
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
        label: "Sale Leads",
        icon: <GrOrganization size={18} />
    },
    {
        label: "New Lead",
        icon: <MdOutlineCrisisAlert size={18} />
    },
        // {
        //     label: "killed-vehicles",
        //     icon: <BiSolidCarCrash size={18} />
        // },
        // {
        //     label: "complaint-center",
        //     icon: <MdContactSupport size={18} />
        // }

    ]
    return (


        <div className="sticky-bar">
            {
                stcickyBarOptions.map((option) => (
                    <div
                        key={option.label}
                        className={`sticky-label ${component == option.label ? "active" : ""}`}
                        onClick={() => {
                            if (option.label == "New Lead") {
                                Swal.fire({
                                    title: "Please Select",
                                    icon: "success",
                                    showCancelButton: false,
                                    showCloseButton: true,
                                    showConfirmButton: true,
                                    confirmButtonText: "New",
                                    showDenyButton: true,
                                    denyButtonText: "Existing",
                                }).then(async (result: any) => {
                                    if (result.isConfirmed) {
                                        setComponent(option.label)

                                    } else if (result.isDenied) {
                                        setComponent(option.label)

                                    }
                                });
                            }
                            else {
                                setComponent(option.label)
                            }
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
