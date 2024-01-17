import { useState } from "react";
import Logo from "./Logo";
import { H3, P, H6 } from "../../AbstractElements";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import {
  EmailAddress,
  Password,
  SignIn,
  SignInAccount,
} from "../../utils/Constant";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../Api";
import successAlert from "../Alerts/SuccessAlert";
import errorAlert from "../Alerts/ErrorAlert";

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
  const header =
    window.location.pathname === "/superAdminLogin"
      ? "Sign In to Super Admin Account"
      : "Sign in To Login Account";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginTypes>();

  const loginData: SubmitHandler<loginTypes> = async (data) => {
    if (data.emailAddress !== "" && data.password !== "") {
      const loginData = {
        emailAddress: data.emailAddress,
        password: data.password,
      };
      setLoading(true);
      console.log(loginData);
      try {
        await login(loginData).then((data: any) => {
          console.log("response: ", data.data);
          if (data.statusCode == 200) {
            const token = data.data.authToken;
            console.log("response: ", data.data);
            console.log("token: ", token);
            setLoading(false);
            localStorage.setItem("token", token);

            // successAlert();
            navigate(`${process.env.PUBLIC_URL}/dashboards/shoppingplace`);
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
              <div className="text-end mt-3">
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
