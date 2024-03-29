import { useEffect, useState } from "react";
import Logo from "./Logo";
import { H1, H4 } from "../../AbstractElements";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { getAll, login, otpVerification, resendOTP } from "../../Api";

import OTPInput from "react-otp-input";
import "./otpstyles.css";
import Swal from "sweetalert2";
import { setUserData } from "../../ReaduxToolkit/Reducer/UserSlice";
import { useDispatch } from "react-redux";
import { getOperatorCompanyUserId, getUserRole } from "../../Api/globals";
import { setUserPersonalizationData } from "../../ReaduxToolkit/Reducer/PersonalizationSlice";
import { setActiveCRMModules } from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
import { setUserPermissions } from "../../ReaduxToolkit/Reducer/PermissionSlice";
import { ROLES } from "../../constants/roles";
// import OTPInput, { ResendOTP } from "otp-input-react";

export interface CommonFormPropsType {
  alignLogo?: string;
}
const OTPForm = ({ alignLogo }: CommonFormPropsType) => {
  const [otp, setOtp] = useState("");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
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
        userId: userId,
        otpCode: otp,
      };
      setLoading(true);
      // console.log(otpData);
      try {
        await otpVerification(otpData).then((data: any) => {
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

          if (data.statusCode === 200) {
            dispatch(setUserData(null));
            const token = data.data.authToken;
            // console.log("response: ", data.data);
            // console.log("token: ", token);
            localStorage.setItem("token", token);
            if (getUserRole() === ROLES.SUPER_ADMIN) {
              dispatch(setUserPermissions([]));
            }

            if (getUserRole() === "OPERATOR") {
              localStorage.setItem("userId", getOperatorCompanyUserId());
            } else if (getUserRole() === "COMPANY") {
              localStorage.setItem("userId", data.data.userId);
            } else if (getUserRole() === "SUPER_ADMIN") {
              localStorage.removeItem("userId");
            }
            const userId = localStorage.getItem("userId");
            getAll({
              url:
                getUserRole() === "COMPANY" || getUserRole() === "OPERATOR"
                  ? "user/get-allowed-modules"
                  : "crm-module/get-all-active-modules",
            }).then((data: any) => {
              // console.log("active Modules --- >", data);

              if (data !== undefined) {
                if (!data.success) {
                  // console.log("hhg");
                  // console.log(userId);
                  dispatch(setActiveCRMModules([]));
                }
                if (data.success) {
                  // console.log("hhg");
                  // console.log(userId);
                  dispatch(setActiveCRMModules(data.data));
                }
              }
            });
            getAll({
              url:
                userId === null && userId === undefined
                  ? "super-admin/get-personalization"
                  : `company/get-personalization/${userId}`,

              // url: "super-admin/get-personalization",
            }).then((parentData: any) => {
              // console.log("api call --- >", parentData);
              if (parentData === undefined) {
                // Swal.fire({
                //   text: `${parentData.message}`,
                //   icon: "error",
                //   timer: 2000,
                //   showConfirmButton: false,
                // });
                setLoading(false);
                dispatch(setUserPersonalizationData(null));
              }

              if (parentData !== undefined) {
                if (!parentData.success) {
                  setLoading(false);
                  dispatch(setUserPersonalizationData(null));
                }
                if (parentData.success) {
                  dispatch(setUserPersonalizationData(parentData.data));
                }
              }
            });
            dispatch(setUserData(null));
            getAll({ url: "user/get-user" }).then((parentData: any) => {
              if (parentData !== undefined) {
                if (parentData.success) {
                  dispatch(setUserData(parentData.data.user));
                }
              }
            });

            if (getUserRole() === "COMPANY" || getUserRole() === "OPERATOR") {
              getAll({ url: "user/get-permissions" })
                .then((data: any) => {
                  // console.log("api call --- >", data);
                  if (data !== undefined) {
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(
                        setUserPermissions(data.data.allowedPermissions)
                      );
                      setLoading(false);
                      navigate(`${process.env.PUBLIC_URL}/dashboard`);
                    }
                    if (!data.success) {
                      navigate(`${process.env.PUBLIC_URL}/dashboard`);
                    }
                  }
                })
                .catch((error: any) => {
                  navigate(`${process.env.PUBLIC_URL}/dashboard`);
                });
            } else {
              navigate(`${process.env.PUBLIC_URL}/dashboard`);
            }
          }
          // if (data.statusCode === 200) {
          //   const token = data.data.authToken;
          //   // console.log("response: ", data.data);
          //   // console.log("token: ", token);
          //   const decodedToken = jwtDecode(token);
          //   // console.log(decodedToken);
          //   dispatch(setToken(decodedToken));
          //   const tokenParts = token.split(".");
          //   const payload = JSON.parse(atob(tokenParts[1]));
          //   setDecodedToken(payload);
          //   // console.log("payload", payload);

          //   localStorage.setItem("token", token);

          //   // successAlert();
          //   navigate(`${process.env.PUBLIC_URL}/dashboards/shoppingplace`);
          // }
          else {
            Swal.fire({
              text: `${data.message}`,
              icon: "info",
              timer: 2000,
              showCancelButton: false,
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
          handleResend();
          // console.log(data);
        } else {
        }
      });
      // Handle successful post creation (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      // console.error("Error creating post:", error);
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
      </div>
    </div>
  );
};

export default OTPForm;
