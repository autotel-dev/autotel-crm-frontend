import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H1, H3, H4, H5, P } from "../../../../../AbstractElements";
import { useState } from "react";
import { getAll, otpEnabled } from "../../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setUserData } from "../../../../../ReaduxToolkit/Reducer/UserSlice";
import { CHANGE_LOGIN_STATUS, GET_USER_BY_ID } from "../../../../../Utilities/api/apiEndpoints";

const SecuritySettings = () => {
  const { userData } = useSelector((state: any) => state.user);
  const [isEnabled, setIsEnabled] = useState(userData.isOtpEnabled);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const otpEnabledChange = async () => {
    setLoading(true);
    try {
      await otpEnabled(isEnabled, {
        url: CHANGE_LOGIN_STATUS,
      }).then((data: any) => {
        setLoading(false);
        if (data.success) {
          // console.log(data);
          getAll({ url: GET_USER_BY_ID }).then((parentData: any) => {
            // console.log("api call --- >", parentData);
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
      // console.error("Error creating post:", error);
      setLoading(false);
    }
  };
  return (
    <Col md={12}>
      <Card>
        <CardHeader className="pb-0">
          <H4>Security Settings</H4>
        </CardHeader>
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
              <P>OTP Enabled</P>
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
                        // console.log(e.target.value);
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
