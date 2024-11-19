import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Purchases from "./components/purchases/Purchases";
import Sales from "./components/sales/Sales";
import Accounts from "./components/accounts/Accounts";
import Inventory from "./components/inventory/Inventory";
import Operations from "./components/operations/Operations";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const SalesDashboard = () => {
  // Visibility state
  const [visibleSections, setVisibleSections]: any = useState({
    sales: true,
    purchases: true,
    // accounts: true,
    inventory: true,
    operations: true,
  });
  const componentMap: { [key: string]: JSX.Element } = {
    // general: <General />,
    sales: <Sales />,
    purchases: <Purchases />,
    // accounts: <Accounts />,
    inventory: <Inventory />,
    operations: <Operations />,
  };

  const initialOrder: string[] = [
    "sales",
    "purchases",
    // "accounts",
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
