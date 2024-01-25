import { useState } from "react";
import Logo from "./Logo";
import { H3, P, H6, H1, H5, H4 } from "../../AbstractElements";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { EmailAddress, Password } from "../../utils/Constant";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login, otpVerification } from "../../Api";
import successAlert from "../Alerts/SuccessAlert";
import errorAlert from "../Alerts/ErrorAlert";
import OTPInput from "react-otp-input";
import "./otpstyles.css";
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
          }
        });
      } catch (error: any) {
        console.error("Error creating post:", error);
        setLoading(false);
      }
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

            {/* <OTPInput
              value={OTP}
              onChange={setOTP}
              autoFocus
              OTPLength={4}
              otpType="number"
              disabled={false}
              secure
            />
            <ResendOTP onResendClick={() => console.log("Resend clicked")} /> */}

            <FormGroup className="mb-0 form-group">
              {/* <Link
                className="link"
                to={`${process.env.PUBLIC_URL}/pages/authentication/forgetpassword`}
              >
                {ForgotPassword}
              </Link> */}
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
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
