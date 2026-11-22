import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  MdDashboard,
  MdPointOfSale,
  MdShoppingCart,
  MdAccountBalance,
  MdInventory,
  MdSettings,
} from "react-icons/md";

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
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  const saio_purchases = userPermissions.find(
    (item: any) => item.title === "SAIO Purchases"
  );
  const saio_sales = userPermissions.find(
    (item: any) => item.title === "SAIO Sales"
  );
  const saio_accounts = userPermissions.find(
    (item: any) => item.title === "SAIO Accounts"
  );
  const saio_inventory = userPermissions.find(
    (item: any) => item.title === "SAIO Inventory"
  );
  const saio_operations = userPermissions.find(
    (item: any) => item.title === "SAIO Operations"
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect active menu based on URL
  useEffect(() => {
    const arr = location.pathname.split("/");

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

  const handleNavigation = (menu: string) => {
    navigate(`${process.env.PUBLIC_URL}/company/modules/saio-central/${menu}`);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={28} />,
      isActive: dashboard,
      onClick: () => handleNavigation("dashboard"),
      hasPermission: true,
    },
    {
      id: "sales",
      label: "Sales",
      icon: <MdPointOfSale size={28} />,
      isActive: sales,
      onClick: () => handleNavigation("sales/leads"),
      hasPermission: saio_sales && saio_sales.read,
    },
    {
      id: "purchases",
      label: "Purchases",
      icon: <MdShoppingCart size={28} />,
      isActive: purchases,
      onClick: () => handleNavigation("purchases"),
      hasPermission: saio_purchases && saio_purchases.read,
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: <MdAccountBalance size={28} />,
      isActive: accounts,
      onClick: () => handleNavigation("accounts"),
      hasPermission: saio_accounts && saio_accounts.read,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <MdInventory size={28} />,
      isActive: inventory,
      onClick: () => handleNavigation("inventory"),
      hasPermission: saio_inventory && saio_inventory.read,
    },
    {
      id: "operations",
      label: "Operations",
      icon: <MdSettings size={28} />,
      isActive: operations,
      onClick: () => handleNavigation("operations"),
      hasPermission: saio_operations && saio_operations.read,
    },
  ];

  return (
    <div
      style={{
        // Floating panel beside the app's icon rail (redesign Phase 1).
        width: "90px",
        height: "calc(100vh - var(--at-chrome-h, 104px))",
        backgroundColor: "var(--at-rail)",
        borderRadius: "var(--at-radius, 20px)",
        border: "1px solid var(--at-line)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        marginTop: 0,
        gap: "10px",
        position: "fixed",
        left: "96px",
        top: "88px",
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      {menuItems
        .filter((item) => item.hasPermission)
        .map((item) => (
          <div
            key={item.id}
            onClick={item.onClick}
            style={{
              width: "70px",
              height: "70px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: item.isActive ? "#35bfbf" : "transparent",
              color: item.isActive ? "#fff" : "#a8b3c1",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!item.isActive) {
                e.currentTarget.style.backgroundColor =
                  "rgba(53, 191, 191, 0.2)";
                e.currentTarget.style.color = "#35bfbf";
              }
            }}
            onMouseLeave={(e) => {
              if (!item.isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#a8b3c1";
              }
            }}
          >
            {item.icon}
            <span
              style={{
                fontSize: "10px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
