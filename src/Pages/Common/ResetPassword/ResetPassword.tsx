// Forgot password, step 3 of 3: choose a new password.
import { useLocation } from "react-router-dom";
import AuthShell from "../Auth/AuthShell";
import CommonForm from "./Form";

const ResetPassword = () => {
  const location = useLocation();
  return (
    <AuthShell step="Step 3 of 3">
      <CommonForm state={location.state} />
    </AuthShell>
  );
};

export default ResetPassword;
