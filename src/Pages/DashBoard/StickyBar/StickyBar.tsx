import React, { useEffect, useState } from "react";
import { GrOrganization } from "react-icons/gr";
import { MdOutlineCrisisAlert } from "react-icons/md";
import { BiSolidCarCrash } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import "./StickyBar.css"
interface StickyBarProps {
    toggleSection: any;
    visibleSections: any;
}

const StickyBar: React.FC<StickyBarProps> = ({ toggleSection, visibleSections }) => {
    const stcickyBarOptions = [{
        label: "general",
        icon: <GrOrganization size={18} />
    },
    {
        label: "control-room",
        icon: <MdOutlineCrisisAlert size={18} />
    },
    {
        label: "killed-vehicles",
        icon: <BiSolidCarCrash size={18} />
    },
    {
        label: "complaint-center",
        icon: <MdContactSupport size={18} />
    }

    ]
    return (


        <div className="sticky-bar">
            {
                stcickyBarOptions.map((option) => (
                    <div
                        key={option.label}
                        className={`sticky-label ${visibleSections[option.label] ? "active" : ""}`}
                        onClick={() => toggleSection(option.label)}
                    >
                        {option.icon}
                    </div>
                ))
            }
        </div >
    );
};

export default StickyBar;
