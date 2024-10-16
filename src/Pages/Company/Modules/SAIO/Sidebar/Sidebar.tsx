import { useSelector } from "react-redux";
import GroupSvg from "../../../../../../src/assets/people (1).png";
import { useLocation, useNavigate } from "react-router-dom";
import P1 from "../../../../../CommonElements/Paragraph/P1Element";
import { useEffect } from "react";

interface SidebarProps {
  setDashboard: any;
  setPurchases: any;
  setSales: any;
  setAccounts: any;
  setInventory: any;
  setOperations: any;

  dashboard: any;
  purchases: any;
  sales: any;
  accounts: any;
  inventory: any;
  operations: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  setDashboard,
  setPurchases,
  setSales,
  setAccounts,
  setInventory,
  setOperations,

  dashboard,
  purchases,
  sales,
  accounts,
  inventory,
  operations,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const navigate = useNavigate();
  const location = useLocation(); // Access current route information

  useEffect(() => {
    console.log(location.pathname.split("/"));
    const arr = location.pathname.split("/");
    const route = arr[arr.length - 1];

    if (arr.includes("dashboard")) {
      setDashboard(true);
      setPurchases(false);
      setSales(false);
      setAccounts(false);
      setInventory(false);
      setOperations(false);
    } else if (arr.includes("purchases")) {
      setDashboard(false);
      setPurchases(true);
      setSales(false);
      setAccounts(false);
      setInventory(false);
      setOperations(false);
    } else if (arr.includes("sales")) {
      setDashboard(false);
      setPurchases(false);
      setSales(true);
      setAccounts(false);
      setInventory(false);
      setOperations(false);
    } else if (arr.includes("accounts")) {
      setDashboard(false);
      setPurchases(false);
      setSales(false);
      setAccounts(true);
      setInventory(false);
      setOperations(false);
    } else if (arr.includes("inventory")) {
      setDashboard(false);
      setPurchases(false);
      setSales(false);
      setAccounts(false);
      setInventory(true);
      setOperations(false);
    } else if (arr.includes("operations")) {
      setDashboard(false);
      setPurchases(false);
      setSales(false);
      setAccounts(false);
      setInventory(false);
      setOperations(true);
    }
  }, [location.pathname]);

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          height: "94vh",
          backgroundColor: `${
            userPersonalizationData &&
            userPersonalizationData.buttonsAndBarsColor !== ""
              ? userPersonalizationData.buttonsAndBarsColor
              : "#1f2f3e"
          }`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "unset",
          width: "90px",
          scrollbarWidth: "none",
        }}
      >
        <div
          title="Dashboard"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "95px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "0.1px solid gray",
            paddingTop: "15px",
            backgroundColor: `${dashboard ? "#35bfbf" : "transparent"}`,
            // opacity: `${dashboard ? "0.6" : "1"}`
          }}
          onClick={() => {
            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/dashboard`
            );
          }}
        >
          <img src={GroupSvg} alt="" height={22} width={26} id="Tooltip" />
          <P1
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
            Dashboard
          </P1>
        </div>
        <div
          title="Purchases"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "80px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "0.1px solid gray",
            paddingTop: "10px",
            backgroundColor: `${purchases ? "#35bfbf" : "transparent"}`,
            // opacity: `${purchases ? "0.6" : "1"}`
          }}
          onClick={() => {
            setDashboard(false);
            setPurchases(true);
            setSales(false);
            setAccounts(false);
            setInventory(false);
            setOperations(false);

            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/purchases`
            );
          }}
        >
          <img src={GroupSvg} alt="" height={22} width={26} id="Tooltip" />
          <P1
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
            Purchases
          </P1>
        </div>
        <div
          title="Purchases"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "80px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "0.1px solid gray",
            paddingTop: "10px",
            backgroundColor: `${sales ? "#35bfbf" : "transparent"}`,
            // opacity: `${sales ? "0.6" : "1"}`
          }}
          onClick={() => {
            setDashboard(false);
            setPurchases(false);
            setSales(true);
            setAccounts(false);
            setInventory(false);
            setOperations(false);

            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/sales/leads`
            );
          }}
        >
          <img src={GroupSvg} alt="" height={22} width={26} id="Tooltip" />
          <P1
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
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
            height: "80px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "0.1px solid gray",
            paddingTop: "10px",
            backgroundColor: `${accounts ? "#35bfbf" : "transparent"}`,
          }}
          onClick={() => {
            setDashboard(false);
            setPurchases(false);
            setSales(false);
            setAccounts(true);
            setInventory(false);
            setOperations(false);

            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/accounts`
            );
          }}
        >
          <img src={GroupSvg} alt="" height={22} width={26} id="Tooltip" />
          <P1
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
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
            height: "80px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "0.1px solid gray",
            paddingTop: "10px",
            backgroundColor: `${inventory ? "#35bfbf" : "transparent"}`,
          }}
          onClick={() => {
            setDashboard(false);
            setPurchases(false);
            setSales(false);
            setAccounts(false);
            setInventory(true);
            setOperations(false);

            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/inventory`
            );
          }}
        >
          <img src={GroupSvg} alt="" height={22} width={26} id="Tooltip" />
          <P1
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
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
            height: "80px",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "0.1px solid gray",
            paddingTop: "10px",
            backgroundColor: `${operations ? "#35bfbf" : "transparent"}`,
          }}
          onClick={() => {
            setDashboard(false);
            setPurchases(false);
            setSales(false);
            setAccounts(false);
            setInventory(false);
            setOperations(true);

            navigate(
              `${process.env.PUBLIC_URL}/company/modules/saio-central/operations`
            );
          }}
        >
          <img src={GroupSvg} alt="" height={22} width={26} id="Tooltip" />
          <P1
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
            Operations
          </P1>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
