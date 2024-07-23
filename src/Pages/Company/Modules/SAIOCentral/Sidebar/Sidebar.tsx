import { useState } from "react";
import {
    PopoverBody,
    PopoverHeader,
    UncontrolledPopover,
    UncontrolledTooltip,
} from "reactstrap";
import { H6, LI } from "../../../../../AbstractElements";
import { FaCarAlt } from "react-icons/fa";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import GroupSvg from "../../../../../../src/assets/people (1).png";
import SubGroupSvg from "../../../../../../src/assets/group.png";
import GeofenceSvg from "../../../../../../src/assets/placeholder.png";
import { setType } from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";

interface SidebarProps {
    setSales: any,
    setAccounts: any;
    setInventory: any;
    setOperations: any;
    // setCustomers: any;
    sales: any,
    accounts: any;
    inventory: any;
    operations: any;
    // customers: any
}


const Sidebar: React.FC<SidebarProps> = ({
    setSales,
    setAccounts,
    setInventory,
    setOperations,
    // setCustomers,
    sales,
    accounts,
    inventory,
    operations,
    // customers,
}) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    return (
        <div style={{ display: "flex" }}>
            <div
                style={{
                    height: "94vh",
                    backgroundColor: `${userPersonalizationData && userPersonalizationData.buttonsAndBarsColor !== "" ? userPersonalizationData.buttonsAndBarsColor : "#1f2f3e"}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflow: "unset",
                    width: "90px",
                    scrollbarWidth: "none",

                }}
            >
                <div
                    title="Sales"
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100px",
                        alignItems: "center",
                        cursor: "pointer",
                        borderBottom: "0.1px solid gray",
                        marginTop: "5px",
                        opacity: `${sales ? "0.6" : "1"}`
                    }}

                    onClick={() => {
                        setSales(true)
                        setAccounts(false);
                        setInventory(false);
                        setOperations(false);
                        // setCustomers(false);
                    }}
                >
                    <img src={GroupSvg} alt="" height={24} width={28} id="Tooltip" />
                    <div style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Sales
                    </div>
                </div>


                <div
                    title="Accounts"
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100px",
                        alignItems: "center",
                        opacity: `${accounts ? "0.6" : "1"}`,
                        cursor: "pointer",
                        borderBottom: "0.1px solid gray",
                    }}
                    onClick={() => {
                        setSales(false)
                        setAccounts(true);
                        setInventory(false);
                        setOperations(false);
                        // setCustomers(false);
                    }}
                >
                    <img src={GroupSvg} alt="" height={24} width={28} id="Tooltip" />
                    <div style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Accounts
                    </div>
                </div>

                <div
                    title="Inventory"
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100px",
                        alignItems: "center",
                        opacity: `${inventory ? "0.6" : "1"}`,
                        cursor: "pointer",
                        borderBottom: "0.1px solid gray",
                    }}
                    onClick={() => {
                        setSales(false)
                        setAccounts(false);
                        setInventory(true);
                        setOperations(false);
                        // setCustomers(false);
                    }}
                >
                    <img src={GroupSvg} alt="" height={24} width={28} id="Tooltip" />
                    <div style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Inventory
                    </div>
                </div>
                <div
                    title="Operation"
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100px",
                        alignItems: "center",
                        opacity: `${operations ? "0.6" : "1"}`,
                        cursor: "pointer",
                        borderBottom: "0.1px solid gray",
                    }}
                    onClick={() => {
                        setSales(false)
                        setAccounts(false);
                        setInventory(false);
                        setOperations(true);
                        // setCustomers(false);
                    }}
                >
                    <img src={GroupSvg} alt="" height={24} width={28} id="Tooltip" />
                    <div style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Operation
                    </div>
                </div>

            </div>




        </div >
    );
};

export default Sidebar;


