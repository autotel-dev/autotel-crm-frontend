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
import { getAll, otpEnabled } from "../../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setUserData } from "../../../../../ReaduxToolkit/Reducer/UserSlice";

const SecuritySettings = () => {
  const { userData } = useSelector((state: any) => state.user);
  const [isEnabled, setIsEnabled] = useState(userData.isOtpEnabled);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const otpEnabledChange = async () => {
    setLoading(true);
    try {
      await otpEnabled(isEnabled, {
        url: "user/security/change-login-security-status",
      }).then((data: any) => {
        setLoading(false);
        if (data.success) {
          console.log(data);
          getAll({ url: "user/get-user" }).then((parentData: any) => {
            console.log("api call --- >", parentData);
            if (parentData == undefined) {
              setLoading(false);
              Swal.fire({
                text: "Failed to Fetch",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
            }

            if (parentData !== undefined) {
              if (parentData.success) {
                dispatch(setUserData(parentData.data.user));
                setLoading(false);
              }
            }
          });
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
              xl={6}
              lg={6}
              md={6}
              sm={6}
              xs={12}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <H4>OTP Enabled</H4>
              <div className="d-flex">
                <div
                  className={`text-end flex-shrink-0 icon-state 
                            }`}
                >
                  <Label className="switch mb-0">
                    <Input
                      type="checkbox"
                      disabled={loading}
                      defaultChecked={isEnabled ? true : false}
                      value={isEnabled ? "on" : "off"}
                      onChange={(e) => {
                        setIsEnabled(!isEnabled);
                        console.log(e.target.value);
                        // otpEnabledChange();
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
                onClick={() => {
                  otpEnabledChange();
                }}
              >
                {loading ? "Loading..." : "Save"}
              </Button>
            </div>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SecuritySettings;
