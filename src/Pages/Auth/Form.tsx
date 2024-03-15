import { useState } from "react";
import Logo from "./Logo";
import { H3, P, H6 } from "../../AbstractElements";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { EmailAddress, Password } from "../../utils/Constant";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getAll, login } from "../../Api";
import successAlert from "../Alerts/SuccessAlert";
import errorAlert from "../Alerts/ErrorAlert";
import { useDispatch } from "react-redux";
import { setActiveCRMModules } from "../../ReaduxToolkit/Reducer/CRMModuleSlice";
import { getOperatorCompanyUserId, getUserRole } from "../../Api/globals";
import Swal from "sweetalert2";
import { setUserPersonalizationData } from "../../ReaduxToolkit/Reducer/PersonalizationSlice";
import { setPermissions } from "../../ReaduxToolkit/Reducer/CompanySlice";
import { setUserPermissions } from "../../ReaduxToolkit/Reducer/PermissionSlice";
import { ROLES } from "../../constants/roles";

interface loginTypes {
  emailAddress: string; // Change 'boolean' to the actual type of isVisible
  password: string;
}

export interface CommonFormPropsType {
  alignLogo?: string;
}
const CommonForm = ({ alignLogo }: CommonFormPropsType) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
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
      console.log(loginData);
      try {
        await login(loginData).then(async (data: any) => {
          console.log("response: ", data);
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

          if (data.statusCode == 401) {
            if (data.data) {
              if (data.data.isOtpEnabled) {
                console.log("response: ", data.data);

                localStorage.setItem("userId", data.data.userId);
                navigate(`${process.env.PUBLIC_URL}/verifyOTP`);
                // localStorage.setItem("userId", data.data.userId);
              }
            } else {
              Swal.fire({
                text: `${data.message}`,
                icon: "info",
                timer: 2000,
                showCancelButton: false,
              });
            }
          } else if (data.statusCode == 200) {
            const token = data.data.authToken;
            console.log("response: ", data.data);
            console.log("token: ", token);
            localStorage.setItem("token", token);
            if (getUserRole() == ROLES.SUPER_ADMIN) {
              dispatch(setUserPermissions([]));
            }

            if (getUserRole() == "OPERATOR") {
              localStorage.setItem("userId", getOperatorCompanyUserId());
            } else if (getUserRole() == "COMPANY") {
              localStorage.setItem("userId", data.data.userId);
            } else if (getUserRole() == "SUPER_ADMIN") {
              localStorage.removeItem("userId");
            }
            const userId = localStorage.getItem("userId");
            getAll({
              url:
                getUserRole() == "COMPANY" || getUserRole() == "OPERATOR"
                  ? "user/get-allowed-modules"
                  : "crm-module/get-all-active-modules",
            }).then((data: any) => {
              console.log("active Modules --- >", data);

              if (data !== undefined) {
                if (!data.success) {
                  console.log("hhg");
                  console.log(userId);
                  dispatch(setActiveCRMModules([]));
                }
                if (data.success) {
                  console.log("hhg");
                  console.log(userId);
                  dispatch(setActiveCRMModules(data.data));
                }
              }
            });
            getAll({
              url:
                userId == null && userId == undefined
                  ? "super-admin/get-personalization"
                  : `company/get-personalization/${userId}`,

              // url: "super-admin/get-personalization",
            }).then((parentData: any) => {
              console.log("api call --- >", parentData);
              if (parentData == undefined) {
                Swal.fire({
                  text: `${parentData.message}`,
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                });
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

            if (getUserRole() == "COMPANY" || getUserRole() == "OPERATOR") {
              getAll({ url: "user/get-permissions" })
                .then((data: any) => {
                  console.log("api call --- >", data);
                  if (data !== undefined) {
                    if (data.success) {
                      console.log("hhg");
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

          reset({
            emailAddress: "",
            password: "",
          });
        });

        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        // Handle error (e.g., show an error message)
        console.error("Error creating post:", error);
        setLoading(false);
        // if (error.response.statusCode == 401) {
        //     errorAlert();
        //   }
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
          <Form className="theme-form" onSubmit={handleSubmit(loginData)}>
            <H3>{header}</H3>
            <P>{"Enter your email & password to login"}</P>
            <FormGroup>
              <Label className="col-form-label">{EmailAddress}</Label>
              <input
                className="form-control"
                type="email"
                required
                placeholder="Test@gmail.com"
                {...register("emailAddress", { required: true })}
              />

              <span style={{ color: "red" }}>
                {errors.emailAddress && "Email is required"}
              </span>
            </FormGroup>
            <FormGroup>
              <Label className="col-form-label">{Password}</Label>
              <div className="form-input position-relative">
                <input
                  className="form-control"
                  type={showPassWord ? "text" : "password"}
                  placeholder="*********"
                  required
                  {...register("password", { required: true })}
                />

                <div className="show-hide">
                  <span
                    onClick={() => setShowPassWord(!showPassWord)}
                    className={!showPassWord ? "show" : ""}
                  />
                </div>
              </div>
              <span style={{ color: "red" }}>
                {errors.password && "Paswword is required"}
              </span>
            </FormGroup>
            <FormGroup className="mb-0 form-group">
              {/* <Link
                className="link"
                to={`${process.env.PUBLIC_URL}/pages/authentication/forgetpassword`}
              >
                {ForgotPassword}
              </Link> */}
              <div className="text-end mt-2">
                <Button
                  disabled={loading}
                  color="primary"
                  className="btn-block w-100"
                >
                  {loading ? "Loading..." : "SignIn"}
                </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CommonForm;
