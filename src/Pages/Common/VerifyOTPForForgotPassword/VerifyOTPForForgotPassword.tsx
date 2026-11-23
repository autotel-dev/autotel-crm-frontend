// Forgot password, step 2 of 3: enter the code sent by email.
import { useLocation } from "react-router-dom";
import AuthShell from "../Auth/AuthShell";
import OTPFormForForgotPassword from "./OTPFormForForgotPassword";

const VerifyOTPForForgotPassword = () => {
  const location = useLocation();
  return (
    <AuthShell step="Step 2 of 3">
      <OTPFormForForgotPassword state={location.state} />
    </AuthShell>
  );
};

export default VerifyOTPForForgotPassword;
