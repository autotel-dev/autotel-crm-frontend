import { useState } from "react";
import { Form, FormGroup, Label } from "reactstrap";
import { useBrandColor } from "../Auth/AuthShell";
import { EmailAddress } from "../../../utils/Constant";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { create } from "../../../Utilities/api";
import { useSelector } from "react-redux";
import { SEND_OTP, VERIFY_EMAIL } from "../../../Utilities/api/apiEndpoints";
// import {
//   CHECK_USER_EMAIL,
//   SEND_OTP_EMAIL,
// } from "../../../Utilities/api/apiEndpoints";

interface PropTypes {
  emailAddress: string; // Change 'boolean' to the actual type of isVisible
}

export interface CommonFormPropsType {
  alignLogo?: string;
}
const CommonForm = ({ alignLogo }: CommonFormPropsType) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSendingLoading, setOtpSendingLoading] = useState(false);
  const navigate = useNavigate();

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropTypes>();

  const forgotPassword: SubmitHandler<PropTypes> = async (data, e: any) => {
    e.preventDefault();
    if (data.emailAddress !== "") {
      var userData = {
        emailAddress: data.emailAddress,
      };

      setLoading(true);
      // console.log(loginData);
      try {
        await create(userData, {
          url: VERIFY_EMAIL,
        }).then(async (userData: any) => {
          // console.log("response: ", data);
          setLoading(false);

          if (!userData.success) {
            setLoading(false);
            Swal.fire({
              text: `${userData.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (userData.success) {
            setLoading(false);
            Swal.fire({
              text: `${userData.message}`,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            const emailData = {
              userId: userData.data._id,
              emailAddress: userData.data.emailAddress,
            };
            setOtpSendingLoading(true);
            await create(emailData, {
              url: SEND_OTP,
            }).then(async (data: any) => {
              // console.log("response: ", data);

              // setLoading(false);

              if (!data.success) {
                setOtpSendingLoading(false);
                Swal.fire({
                  text: `${data.message}`,
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                });
              }

              if (data.success) {
                setOtpSendingLoading(false);
                Swal.fire({
                  text: `${data.message}`,
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                });
                navigate(
                  `${process.env.PUBLIC_URL}/verifyOTPForForgotPassword`,
                  {
                    state: {
                      emailAddress: emailData.emailAddress,
                      userId: emailData.userId,
                    },
                  },
                );
              }

              reset({
                emailAddress: "",
              });
            });
          }

          reset({
            emailAddress: "",
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
          emailAddress: "",
        });
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
  const busy = loading || otpSendingLoading;
  return (
    <Form className="al-form" onSubmit={handleSubmit(forgotPassword)}>
      <h2 className="al-form__title">Forgot password</h2>
      <p className="al-form__hint">
        Enter your account email. We'll email you a 4-digit code to reset your password.
      </p>
      <FormGroup className="al-field">
        <Label for="fp-email">{EmailAddress}</Label>
        <input
          id="fp-email"
          className="al-input"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          {...register("emailAddress", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.emailAddress && <span className="al-error">{errors.emailAddress.message}</span>}
      </FormGroup>
      <button
        type="submit"
        className="al-submit"
        disabled={busy}
        style={brand ? { backgroundColor: brand, borderColor: brand } : undefined}
      >
        {loading ? "Checking…" : otpSendingLoading ? "Sending code…" : "Send code"}
      </button>
    </Form>
  );
};

export default CommonForm;
