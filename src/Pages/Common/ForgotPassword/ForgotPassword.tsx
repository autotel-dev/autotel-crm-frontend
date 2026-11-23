// Forgot password, step 1 of 3: enter the account email to get a code.
// Uses the same frame as the login page (AuthShell); logic is in Form.tsx.
import AuthShell from "../Auth/AuthShell";
import CommonForm from "./Form";

const ForgotPassword = () => (
  <AuthShell step="Step 1 of 3">
    <CommonForm />
  </AuthShell>
);

export default ForgotPassword;
