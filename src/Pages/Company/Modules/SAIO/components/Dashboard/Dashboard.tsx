import React from "react";
import { Col, Row } from "reactstrap";
import Purchases from "./components/purchases/Purchases";
import Sales from "./components/sales/Sales";
import Accounts from "./components/accounts/Accounts";
import Inventory from "./components/inventory/Inventory";
import Operations from "./components/operations/Operations";

const SalesDashboard = () => {
  return (
    <div>
      <Purchases />
      <Sales />
      <Accounts />
      <Inventory />
      <Operations />
    </div>
  );
};

export default SalesDashboard;
