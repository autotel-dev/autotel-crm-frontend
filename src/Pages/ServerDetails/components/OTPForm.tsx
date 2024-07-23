import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { H1, H4 } from "../../../AbstractElements";
import axios from "axios";
import Swal from "sweetalert2";
import {header} from "../../../Api/header";
import ChangePasswordForm from "./ChangePasswordForm";
import { API_BASE_URL } from "../../../Api";
// import OTPInput, { ResendOTP } from "otp-input-react";

type propsType = {
  toggle: () => void;
};
const OTPForm = ({ toggle }: propsType) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // Initial timer value in seconds
  const [isActive, setIsActive] = useState(true);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  // Function to start the timer
  useEffect(() => {
    let interval: any;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Here you can add actions to perform when the timer reaches zero
      // For example, disable submit button or show a message
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Function to handle resend button click
  const handleResend = () => {
    setTimer(120); // Reset the timer
    setIsActive(true); // Start the timer again
  };

  // Format timer for display
  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (e: any) => {
    // console.log(e);
    setOtp(e);
  };

  const verifyOTP = async (e: any) => {
    e.preventDefault();
    if (otp !== "") {
      const otpData = {
        otpCode: otp,
      };
      setLoading(true);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/server-management/verify-otp`,
          otpData,
          {
            headers: header(),
          }
        );
        setLoading(false);
        const result = response.data;
        // console.log("Response data:", response.data);
        if (result.success) {
          setShowChangePasswordForm(true);
        }
        return result;
      } catch (error: any) {
        setLoading(false);
        Swal.fire({
          text: `${error.response.data.message}`,
          icon: "info",
          timer: 2000,
          showCancelButton: false,
        });
      }
      // console.log(otpData);
    }
  };

  const resendOTPCode = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/server-management/send-otp`,
        {
          method: "POST",
          headers: header(),
        }
      );
      const result = await response.json();
      // console.log("api --- >", result);
      if (result.success) {
        Swal.fire({
          text: `${result.message}`,
          icon: "info",
          timer: 2000,
          showCancelButton: false,
        });
        handleResend();
        // console.log(result);
      } else {
      }
    } catch (error: any) {
      Swal.fire({
        text: `${error.response.data.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }
  };

  return (
    <div>
      {showChangePasswordForm === false ? (
        <div>
          <Form
            onSubmit={(e) => {
              verifyOTP(e);
            }}
          >
            <H1>Verification Code</H1>
            <div style={{ margin: "15px 0px" }}>
              <H4>{"Enter your OTP Verification Code"}</H4>
            </div>

            <div style={{ margin: "35px 0px" }}>
              <OTPInput
                containerStyle={{ display: "flex", justifyContent: "center" }} // Add container styles if needed
                value={otp}
                onChange={(e) => handleChange(e)}
                numInputs={4}
                renderSeparator={<span>-</span>}
                inputStyle="otp-input"
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus={true}
              />
            </div>

            <Row style={{ marginTop: "20px", marginBottom: "10px" }}>
              <Col md={6}>
                <Button
                  disabled={loading}
                  color="primary"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {loading ? "Loading..." : "Verify"}
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                  }}
                  color="secondary"
                  type="submit"
                  onClick={(e) => {
                    toggle();
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <H4> This OTP will expire after </H4>
              <H4>
                <span
                  style={{
                    color: "#33BFBF",
                    marginLeft: "3px",
                    marginRight: "3px",
                  }}
                >
                  {" "}
                  {formatTime(timer)}{" "}
                </span>
              </H4>
            </div>
            {timer === 0 && (
              <H4>
                <span
                  style={{
                    color: "#33BFBF",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                    onClick={resendOTPCode}
                >
                  Resend
                </span>
              </H4>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h3>Change Password</h3>
          <p>Please type your new password</p>
          <ChangePasswordForm toggle={toggle} />
        </div>
      )}
    </div>
  );
};

export default OTPForm;
