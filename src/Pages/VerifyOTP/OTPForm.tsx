import { useEffect, useState } from "react";
import Logo from "./Logo";
import { H3, P, H6, H1, H5, H4 } from "../../AbstractElements";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { EmailAddress, Password } from "../../utils/Constant";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login, otpVerification, resendOTP } from "../../Api";
import successAlert from "../Alerts/SuccessAlert";
import errorAlert from "../Alerts/ErrorAlert";
import OTPInput from "react-otp-input";
import "./otpstyles.css";
import Swal from "sweetalert2";
// import OTPInput, { ResendOTP } from "otp-input-react";

export interface CommonFormPropsType {
  alignLogo?: string;
}
const OTPForm = ({ alignLogo }: CommonFormPropsType) => {
  const [otp, setOtp] = useState("");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const navigate = useNavigate();
  const header = "Verification Code";
  const [timer, setTimer] = useState(120); // Initial timer value in seconds
  const [isActive, setIsActive] = useState(true);

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
    resendOTPCode();
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
    console.log(e);
    setOtp(e);
  };

  const verifyOTP = async (e: any) => {
    e.preventDefault();
    if (otp !== "") {
      const otpData = {
        userId: userId,
        otpCode: otp,
      };
      setLoading(true);
      console.log(otpData);
      try {
        await otpVerification(otpData).then((data: any) => {
          console.log("response: ", data.data);
          setLoading(false);
          if (data.statusCode == 200) {
            const token = data.data.authToken;
            console.log("response: ", data.data);
            console.log("token: ", token);
            const tokenParts = token.split(".");
            const payload = JSON.parse(atob(tokenParts[1]));
            setDecodedToken(payload);
            console.log("payload", payload);

            localStorage.setItem("token", token);

            // successAlert();
            navigate(`${process.env.PUBLIC_URL}/dashboards/shoppingplace`);
          } else {
            Swal.fire({
              text: `${data.message}`,
              icon: "info",
              timer: 2000,
              showCancelButton: false,
            });
          }
        });
      } catch (error: any) {
        console.error("Error creating post:", error);
        setLoading(false);
      }
    }
  };

  const resendOTPCode = async () => {
    try {
      await resendOTP(userId, {
        url: "auth/user/security/resend-security-code",
      }).then((data: any) => {
        if (data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "info",
            timer: 2000,
            showCancelButton: false,
          });
          console.log(data);
        } else {
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      console.error("Error creating post:", error);
    }
  };
  return (
    <div className="login-card login-dark">
      <div>
        <div>
          <Logo alignLogo={alignLogo} />
        </div>

        <div className="login-main">
          <Form
            onSubmit={(e) => {
              verifyOTP(e);
            }}
          >
            <H1>{header}</H1>
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

            <FormGroup className="mb-0 form-group">
              <div className="text-end mt-3">
                <Button
                  disabled={loading}
                  color="primary"
                  className="btn-block w-100"
                >
                  {loading ? "Loading..." : "Verify"}
                </Button>
              </div>
            </FormGroup>
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
            {timer == 0 && (
              <H4>
                <span
                  style={{
                    color: "#33BFBF",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={handleResend}
                >
                  Resend
                </span>
              </H4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
