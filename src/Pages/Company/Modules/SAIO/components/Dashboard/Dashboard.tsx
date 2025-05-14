import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Purchases from "./components/purchases/Purchases";
import Sales from "./components/sales/Sales";
// import Accounts from "./components/accounts/Accounts";
import Inventory from "./components/inventory/Inventory";
import Operations from "./components/operations/Operations";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

const SalesDashboard = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );

  var saio_purchases = userPermissions.find(
    (item: any) => item.title === "SAIO Purchases"
  );
  var saio_sales = userPermissions.find(
    (item: any) => item.title === "SAIO Sales"
  );

  var saio_inventory = userPermissions.find(
    (item: any) => item.title === "SAIO Inventory"
  );
  var saio_operations = userPermissions.find(
    (item: any) => item.title === "SAIO Operations"
  );
  // Visibility state
  const [visibleSections, setVisibleSections]: any = useState({
    sales: saio_sales && saio_sales.read ? true : false,
    purchases: saio_purchases && saio_purchases.read ? true : false,
    inventory: saio_inventory && saio_inventory.read ? true : false,
    operations: saio_operations && saio_operations.read ? true : false,
  });
  const componentMap: { [key: string]: JSX.Element } = {
    // general: <General />,
    sales: <Sales />,
    purchases: <Purchases />,
    inventory: <Inventory />,
    operations: <Operations />,
  };

  const initialOrder: string[] = [
    "sales",
    "purchases",
    "inventory",
    "operations",
  ];

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(componentOrder);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);

    setComponentOrder(newOrder);
  };

  const [componentOrder, setComponentOrder] = useState<string[]>(initialOrder);
  return (
    <div>
      <Container fluid className="crm_dashboard">
        <Row className="widget-grid">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="dashboard">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {componentOrder.map((id: any, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* {componentMap[id]} */}
                          {visibleSections[id] && componentMap[id]}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Row>
      </Container>
    </div>
  );
};

export default SalesDashboard;

// 139755
