import { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Sales from "./components/Sales/Sales";
import Accounts from "./components/Accounts/Accounts";
import Inventory from "./components/Inventory/Inventory";
import Operations from "./components/Operations/Operations";
import Customers from "./components/Customers/Customers";

const SAIOCentral = () => {

    const [sales, setSales] = useState(true);
    const [accounts, setAccounts] = useState(false);
    const [inventory, setInventory] = useState(false);
    const [operations, setOperations] = useState(false);
    const [customers, setCustomers] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "unset";


        // Cleanup function to reset the overflow when the component is unmounted
        return () => {
            document.body.style.overflow = "hidden";
            // document.body.style.scrollbarWidth = "none";
        };
    }, []);

    return (
        <div style={{
            width: "100%",
            display: "flex",
            marginLeft: "-35px",
            overflow: "unset",
        }}>

            <div
                style={{
                    width: "7% !important",
                    overflow: "hidden",
                    position: "fixed"
                }}
            >
                <Sidebar setSales={setSales} setAccounts={setAccounts} setInventory={setInventory} setOperations={setOperations} setCustomers={setCustomers} sales={sales} accounts={accounts} inventory={inventory} operations={operations} customers={customers}
                />
            </div>
            <div
                style={{
                    marginTop: "1vh",
                    height: "93vh",
                    width: "100%",
                    backgroundColor: "transparent",
                    paddingTop: "20px",
                    marginLeft: "100px",
                    marginRight: "-70px",
                    overflowX: "hidden",
                    scrollbarWidth: "none"
                }}
            >

                {sales ? <Sales /> : accounts ? <Accounts /> : inventory ? <Inventory /> : operations ? <Operations /> : <Customers />}
            </div>
        </div>
    );
};

export default SAIOCentral;
