import { useState } from "react";
import { Form, FormGroup, Label } from "reactstrap";
import { EmailAddress, Password } from "../../../utils/Constant";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setActiveCRMModules } from "../../../ReaduxToolkit/Reducer/CRMModuleSlice";
import Swal from "sweetalert2";
import { setUserPersonalizationData } from "../../../ReaduxToolkit/Reducer/PersonalizationSlice";
import { setUserPermissions } from "../../../ReaduxToolkit/Reducer/PermissionSlice";
import { ROLES } from "../../../constants/roles";
import {
  setLoginData,
  setUserData,
} from "../../../ReaduxToolkit/Reducer/UserSlice";
import { setDevices } from "../../../ReaduxToolkit/Reducer/MonitoringSlice";
import { getAll, login } from "../../../Utilities/api";
import {
  getOperatorCompanyUserId,
  getUserRole,
} from "../../../Utilities/globals/globals";
import {
  GET_ALLOWED_MODULES,
  GET_ALLOWED_PERMISSIONS,
  GET_ALL_ACTIVE_CRM_MODULES,
  GET_COMPANY_PERSONALIZATION,
  GET_SUPERADMIN_PERSONALIZATION,
  GET_USER_BY_ID,
} from "../../../Utilities/api/apiEndpoints";

interface loginTypes {
  emailAddress: string; // Change 'boolean' to the actual type of isVisible
  password: string;
}

export interface CommonFormPropsType {
  alignLogo?: string;
}
const CommonForm = ({ alignLogo }: CommonFormPropsType) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const [showPassWord, setShowPassWord] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const header = "Sign In ";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginTypes>();

  const loginData: SubmitHandler<loginTypes> = async (data, e: any) => {
    e.preventDefault();
    if (data.emailAddress !== "" && data.password !== "") {
      const loginData = {
        emailAddress: data.emailAddress,
        password: data.password,
      };
      setLoading(true);
      // console.log(loginData);
      try {
        await login(loginData).then(async (data: any) => {
          // console.log("response: ", data);

          setLoading(false);
          // if (data == undefined) {
          //   Swal.fire({
          //     text: "Connection Refused or not connected",
          //     icon: "error",
          //     timer: 2000,
          //     showConfirmButton: false,
          //   });
          //   setLoading(false);
          //   return;
          // }

          if (!data.success && data.statusCode !== 401) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (data.statusCode === 401) {
            if (data.data) {
              if (data.data.isOtpEnabled) {
                // console.log("response: ", data.data);

                localStorage.setItem("userId", data.data.userId);
                navigate(`${process.env.PUBLIC_URL}/verifyOTP`);
                // localStorage.setItem("userId", data.data.userId);
              }
            } else {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showCancelButton: false,
              });
            }
          } else if (data.statusCode === 200) {
            dispatch(setLoginData(data));
            dispatch(setUserData(null));
            const token = data.data.authToken;
            // console.log("response: ", data.data);
            // console.log("token: ", token);

            localStorage.setItem("token", token);

            if (
              getUserRole() == ROLES.COMPANY ||
              getUserRole() == ROLES.OPERATOR
            ) {
              dispatch(setDevices([]));
            }
            if (getUserRole() === ROLES.SUPER_ADMIN) {
              dispatch(setUserPermissions([]));
            }

            if (getUserRole() === ROLES.OPERATOR) {
              localStorage.setItem("userId", getOperatorCompanyUserId());
            } else if (getUserRole() === ROLES.COMPANY) {
              localStorage.setItem("userId", data.data.userId);
            } else if (getUserRole() === ROLES.SUPER_ADMIN) {
              localStorage.removeItem("userId");
            }
            const userId = localStorage.getItem("userId");
            getAll({
              url:
                getUserRole() === ROLES.COMPANY ||
                getUserRole() === ROLES.OPERATOR
                  ? GET_ALLOWED_MODULES
                  : GET_ALL_ACTIVE_CRM_MODULES,
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
                userId == null && userId == undefined
                  ? GET_SUPERADMIN_PERSONALIZATION
                  : `${GET_COMPANY_PERSONALIZATION}/${userId}`,

              // url: GET_SUPERADMIN_PERSONALIZATION,
            }).then((parentData: any) => {
              // console.log("api call --- >", parentData);
              if (parentData == undefined) {
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
            // dispatch(setUserData(null));
            // getAll({ url: GET_USER_BY_ID }).then((parentData: any) => {
            //   if (parentData !== undefined) {
            //     if (parentData.success) {
            //       dispatch(setUserData(parentData.data.user));
            //     }
            //   }
            // });
            if (
              getUserRole() === ROLES.COMPANY ||
              getUserRole() === ROLES.OPERATOR
            ) {
              dispatch(setUserData(null));
              getAll({ url: GET_USER_BY_ID })
                .then((data: any) => {
                  // console.log("api call --- >", data);
                  if (data !== undefined) {
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setUserData(data.data.user));
                      dispatch(setUserPermissions(data.data.user.permissions));
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
            // if (
            //   getUserRole() === ROLES.COMPANY ||
            //   getUserRole() === ROLES.OPERATOR
            // ) {
            //   getAll({ url: GET_ALLOWED_PERMISSIONS })
            //     .then((data: any) => {
            //       // console.log("api call --- >", data);
            //       if (data !== undefined) {
            //         if (data.success) {
            //           // console.log("hhg");

            //           dispatch(
            //             setUserPermissions(data.data.allowedPermissions)
            //           );
            //           setLoading(false);
            //           navigate(`${process.env.PUBLIC_URL}/dashboard`);
            //         }
            //         if (!data.success) {
            //           navigate(`${process.env.PUBLIC_URL}/dashboard`);
            //         }
            //       }
            //     })
            //     .catch((error: any) => {
            //       navigate(`${process.env.PUBLIC_URL}/dashboard`);
            //     });
            // } else {
            //   navigate(`${process.env.PUBLIC_URL}/dashboard`);
            // }
          }

          reset({
            // emailAddress: "",
            password: "",
          });
        });

        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        setLoading(false);
        // if (error.response.statusCode === 401) {
        //     errorAlert();
        //   }
      }
    }
  };
  const brand =
    userPersonalizationData && userPersonalizationData.buttonsAndBarsColor
      ? String(userPersonalizationData.buttonsAndBarsColor).trim()
      : "";
  return (
    <Form className="al-form" onSubmit={handleSubmit(loginData)} noValidate={false}>
      <h2 className="al-form__title">{header.trim()}</h2>
      <p className="al-form__hint">Enter your email and password to continue.</p>
      <FormGroup className="al-field">
        <Label htmlFor="al-email">{EmailAddress}</Label>
        <input
          id="al-email"
          className="al-input"
          type="email"
          required
          autoComplete="username"
          placeholder="you@company.com"
          {...register("emailAddress", { required: true })}
        />
        {errors.emailAddress && <span className="al-error">Email is required</span>}
      </FormGroup>
      <FormGroup className="al-field">
        <Label htmlFor="al-password">{Password}</Label>
        <div className="al-input-wrap">
          <input
            id="al-password"
            className="al-input"
            type={showPassWord ? "text" : "password"}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            {...register("password", { required: true })}
          />
          <button
            type="button"
            className="al-eye"
            aria-label={showPassWord ? "Hide password" : "Show password"}
            aria-pressed={showPassWord}
            onClick={() => setShowPassWord(!showPassWord)}
          >
            {showPassWord ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7-.4 1-1.3 2.4-2.6 3.7M6.2 6.2C4.1 7.6 2.6 9.8 2 12c1 2.5 5 7 10 7 1.8 0 3.4-.5 4.8-1.3" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>
        {errors.password && <span className="al-error">Password is required</span>}
      </FormGroup>
      <div className="al-row">
        <Link className="al-link" style={brand ? { color: brand } : undefined} to={`${process.env.PUBLIC_URL}/forgot-password`}>
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="al-submit"
        style={brand ? { backgroundColor: brand, borderColor: brand } : undefined}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </Form>
  );
};

export default CommonForm;
