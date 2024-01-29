import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H1, H3, H4, H5 } from "../../../../../AbstractElements";
import { useState } from "react";
import { otpEnabled } from "../../../../../Api";

const SecuritySettings = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const otpEnabledChange = async () => {
    setLoading(true);
    try {
      await otpEnabled(isEnabled, {
        url: "user/security/change-login-security-status",
      }).then((data: any) => {
        setLoading(false);
        if (data.success) {
          console.log(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      console.error("Error creating post:", error);
      setLoading(false);
    }
  };
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
                      defaultChecked={isEnabled ? true : false}
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
            <div
              className="form-footer"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                color="primary"
                className="d-block"
                onClick={otpEnabledChange}
              >
                {loading ? "Loading..." : "Update"}
              </Button>
            </div>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SecuritySettings;
