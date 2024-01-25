import { Card, CardBody, Col, Input, Label, Row, Table } from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H1, H3, H4, H5 } from "../../../../../AbstractElements";
import { useState } from "react";

const SecuritySettings = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  return (
    <Col md={12}>
      <Card>
        <CommonHeader
          title="Security Settings"
          headClass="card-title mb-0 pb-0"
        />
        <CardBody>
          <Row>
            <Col
              lg={4}
              md={4}
              // xs={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <H3>OTP Enabled</H3>
              <div className="d-flex">
                <div
                  className={`text-end flex-shrink-0 icon-state 
                            }`}
                >
                  <Label className="switch mb-0">
                    <Input
                      type="checkbox"
                      defaultChecked={true}
                      value={isEnabled ? "on" : "off"}
                      onChange={(e) => {
                        setIsEnabled(!isEnabled);
                        console.log(e.target.value);
                      }}
                    />
                    <span
                      className={`switch-state ${
                        isEnabled ? "bg-primary" : "bg-secondary"
                      }`}
                    />
                  </Label>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SecuritySettings;
