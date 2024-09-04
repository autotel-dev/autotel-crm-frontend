import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GroupSvg from "../../../../../../src/assets/people (1).png";
import SubGroupSvg from "../../../../../../src/assets/group.png";
import GeofenceSvg from "../../../../../../src/assets/placeholder.png";
import { setType } from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import P1 from "../../../../../CommonElements/Paragraph/P1Element";

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
                    <P1 style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Sales
                    </P1>
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
                    <P1 style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Accounts
                    </P1>
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
                    <P1 style={{
                        color: "green",
                        marginTop: "5px"
                    }}>
                        Inventory
                    </P1>
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
                    <P1 style={{
                        color: "white",
                        marginTop: "5px"
                    }}>
                        Operation
                    </P1>
                </div>

            </div>

        </div >
    );
};

export default Sidebar;


