import { useState } from "react";
import { Form, FormGroup, Label } from "reactstrap";
import { useBrandColor } from "../Auth/AuthShell";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { create } from "../../../Utilities/api";
import { RESET_PASSWORD } from "../../../Utilities/api/apiEndpoints";
// import { RESET_PASSWORD } from "../../../Utilities/api/apiEndpoints";

interface PropTypes {
  password: string; // Change 'boolean' to the actual type of isVisible
  confirmpassword: string;
}

export interface CommonFormPropsType {
  alignLogo?: string;
  state?: any;
}
const CommonForm = ({ alignLogo, state }: CommonFormPropsType) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const [showConfirmPassWord, setShowConfirmPassWord] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropTypes>();

  const resetPassword: SubmitHandler<PropTypes> = async (data, e: any) => {
    setLoading(true);
    e.preventDefault();
    if (data.password !== "" && data.confirmpassword !== "") {
      if (data.password == data.confirmpassword) {
        var resetData = {
          userId: state.userId,
          emailAddress: state.emailAddress,
          password: data.password,
          confirmPassword: data.confirmpassword,
        };

        // console.log(loginData);
        try {
          await create(resetData, {
            url: RESET_PASSWORD,
          }).then(async (data: any) => {
            console.log("response: ", data);
            setLoading(false);

            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
            }

            if (data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              navigate(`${process.env.PUBLIC_URL}/login`);
            }

            reset({
              confirmpassword: "",
              password: "",
            });
          });

          // Handle successful post creation (e.g., show a success message, redirect, etc.)
        } catch (error: any) {
          Swal.fire({
            text: `${error?.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
          reset({
            confirmpassword: "",
            password: "",
          });
        }
      } else {
        Swal.fire({
          text: `Password Not Matched`,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
      }
    } else {
      Swal.fire({
        text: `Required Fileds are empty`,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  const brand = useBrandColor();

  // Opened directly (no verified email from step 2).
  if (!state?.userId) {
    return (
      <div className="al-form">
        <h2 className="al-form__title">Start again</h2>
        <p className="al-form__hint">This page opens after you verify the code from your email.</p>
        <Link className="al-submit" to={`${process.env.PUBLIC_URL}/forgot-password`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", ...(brand ? { backgroundColor: brand, borderColor: brand } : {}) }}>
          Go to Forgot password
        </Link>
      </div>
    );
  }

  return (
    <Form className="al-form" onSubmit={handleSubmit(resetPassword)}>
      <h2 className="al-form__title">Set a new password</h2>
      <p className="al-form__hint">Choose a new password for {state?.emailAddress || "your account"}.</p>
      <FormGroup className="al-field">
        <Label for="rp-new">New password</Label>
        <div className="al-input-wrap">
          <input
            id="rp-new"
            className="al-input"
            type={showPassWord ? "text" : "password"}
            autoComplete="new-password"
            placeholder="New password"
            required
            {...register("password", { required: true })}
          />
          <button
            type="button"
            className="al-eye"
            aria-label={showPassWord ? "Hide password" : "Show password"}
            aria-pressed={showPassWord}
            onClick={() => setShowPassWord(!showPassWord)}
          >
            {showPassWord ? (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7-.4 1-1.3 2.4-2.6 3.7M6.2 6.2C4.1 7.6 2.6 9.8 2 12c1 2.5 5 7 10 7 1.8 0 3.4-.5 4.8-1.3" /></svg>) : (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" /><circle cx="12" cy="12" r="3" /></svg>)}
          </button>
        </div>
        {errors.password && <span className="al-error">{errors.password.message || "This field is required"}</span>}
      </FormGroup>
      <FormGroup className="al-field">
        <Label for="rp-confirm">Confirm new password</Label>
        <div className="al-input-wrap">
          <input
            id="rp-confirm"
            className="al-input"
            type={showConfirmPassWord ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Type it again"
            required
            {...register("confirmpassword", { required: true })}
          />
          <button
            type="button"
            className="al-eye"
            aria-label={showConfirmPassWord ? "Hide password" : "Show password"}
            aria-pressed={showConfirmPassWord}
            onClick={() => setShowConfirmPassWord(!showConfirmPassWord)}
          >
            {showConfirmPassWord ? (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7-.4 1-1.3 2.4-2.6 3.7M6.2 6.2C4.1 7.6 2.6 9.8 2 12c1 2.5 5 7 10 7 1.8 0 3.4-.5 4.8-1.3" /></svg>) : (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" /><circle cx="12" cy="12" r="3" /></svg>)}
          </button>
        </div>
        {errors.confirmpassword && <span className="al-error">{errors.confirmpassword.message || "This field is required"}</span>}
      </FormGroup>
      <button
        type="submit"
        className="al-submit"
        disabled={loading}
        style={brand ? { backgroundColor: brand, borderColor: brand } : undefined}
      >
        {loading ? "Saving…" : "Reset password"}
      </button>
    </Form>
  );
};

export default CommonForm;
