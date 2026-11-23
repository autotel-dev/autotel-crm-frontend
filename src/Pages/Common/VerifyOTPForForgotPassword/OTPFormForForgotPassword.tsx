import { useEffect, useState } from "react";
import { Form } from "reactstrap";
import { useBrandColor } from "../Auth/AuthShell";
import { Link, useNavigate } from "react-router-dom";
import {
  create,
  getAll,
  login,
  otpVerification,
  resendOTP,
} from "../../../Utilities/api";

import OTPInput from "react-otp-input";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

import {
  RESENT_SECURITY_CODE,
  SEND_OTP,
  VERIFY_OTP,
} from "../../../Utilities/api/apiEndpoints";
// import OTPInput, { ResendOTP } from "otp-input-react";

export interface CommonFormPropsType {
  alignLogo?: string;
  state?: any;
}
const OTPFormForForgotPassword = ({
  alignLogo,
  state,
}: CommonFormPropsType) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendOTPLoading, setResendOTPLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        userId: state.userId,
        emailAddress: state.emailAddress,
        otpCode: otp,
      };
      setLoading(true);
      // console.log(otpData);
      try {
        await create(otpData, {
          url: VERIFY_OTP,
        }).then((data: any) => {
          // console.log("response: ", data.data);
          setLoading(false);
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "success",
              timer: 2000,
              showCancelButton: false,
            });
            navigate(`${process.env.PUBLIC_URL}/reset-password`, {
              state: {
                emailAddress: state.emailAddress,
                userId: state.userId,
              },
            });
          }
        });
      } catch (error: any) {
        // console.error("Error creating post:", error);
        setLoading(false);
      }
    }
  };

  const resendOTPCode = async () => {
    setResendOTPLoading(true);
    try {
      await create(
        {
          userId: state.userId,
          emailAddress: state.emailAddress,
        },
        {
          url: SEND_OTP,
        }
      ).then((data: any) => {
        if (data.success) {
          setResendOTPLoading(false);
          Swal.fire({
            text: `${data.message}`,
            icon: "success",
            timer: 2000,
            showCancelButton: false,
          });
          handleResend();
          // console.log(data);
        } else {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showCancelButton: false,
          });
          setResendOTPLoading(false);
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      // console.error("Error creating post:", error);
    }
  };
  const brand = useBrandColor();

  // Opened directly (no email from step 1): nothing to verify against.
  if (!state?.userId) {
    return (
      <div className="al-form">
        <h2 className="al-form__title">Start again</h2>
        <p className="al-form__hint">This page needs the email from step 1. Please request a new code.</p>
        <Link className="al-submit" to={`${process.env.PUBLIC_URL}/forgot-password`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", ...(brand ? { backgroundColor: brand, borderColor: brand } : {}) }}>
          Go to Forgot password
        </Link>
      </div>
    );
  }

  return (
    <Form className="al-form" onSubmit={(e) => verifyOTP(e)}>
      <h2 className="al-form__title">Enter the code</h2>
      <p className="al-form__hint">We sent a 4-digit code to {state?.emailAddress || "your email"}.</p>
      <div className="al-otp">
        <OTPInput
          value={otp}
          onChange={(e) => handleChange(e)}
          numInputs={4}
          renderSeparator={<span>-</span>}
          renderInput={(props, i) => <input {...props} inputMode="numeric" aria-label={`Code digit ${i + 1}`} />}
          shouldAutoFocus={true}
        />
      </div>
      <button
        type="submit"
        className="al-submit"
        disabled={loading || resendOTPLoading || String(otp).length < 4}
        style={brand ? { backgroundColor: brand, borderColor: brand } : undefined}
      >
        {loading ? "Verifying…" : "Verify code"}
      </button>
      <div className="al-timer">
        {timer > 0 ? (
          <span>
            Code expires in <b>{formatTime(timer)}</b>
          </span>
        ) : (
          <span>The code has expired.</span>
        )}
        {timer === 0 && (
          <button
            type="button"
            className="al-textbtn"
            onClick={resendOTPCode}
            disabled={resendOTPLoading}
            style={brand ? { color: brand } : undefined}
          >
            {resendOTPLoading ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>
    </Form>
  );
};

export default OTPFormForForgotPassword;
