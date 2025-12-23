import React, { useCallback, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import NavComponent from "./NavComponent/NavComponent";
import CustomFormTabContent from "./CustomFormTabContent";
import { TripProvider } from "./TripContext";

const CustomHorizontalWizard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | undefined>(1);

  const callback = useCallback((tab: number | undefined) => {
    setActiveTab(tab);
  }, []);

  return (
    <TripProvider>
      <div>
        <Row>
          <Col sm={12}>
            <NavComponent callbackActive={callback} activeTab={activeTab} />
            <CustomFormTabContent
              activeTab={activeTab}
              callbackActive={callback}
            />
          </Col>
        </Row>
      </div>
    </TripProvider>
  );
};

export default CustomHorizontalWizard;
