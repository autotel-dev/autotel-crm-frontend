import { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const SAIOCentralLayout = () => {

    const [dashboard, setDashboard] = useState(true);
    const [purchases, setPurchases] = useState(false);
    const [sales, setSales] = useState(false);
    const [accounts, setAccounts] = useState(false);
    const [inventory, setInventory] = useState(false);
    const [operations, setOperations] = useState(false);


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
                <Sidebar setDashboard={setDashboard} setPurchases={setPurchases} setSales={setSales} setAccounts={setAccounts} setInventory={setInventory} setOperations={setOperations} dashboard={dashboard} purchases={purchases} sales={sales} accounts={accounts} inventory={inventory} operations={operations}
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
                <Outlet />
            </div>
        </div>
    );
};

export default SAIOCentralLayout;
