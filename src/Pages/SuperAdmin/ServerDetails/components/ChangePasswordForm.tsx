import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import { Checkmeout, Email, Password, Signin } from "../../../../utils/Constant";
import { useState } from "react";

import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterServers,
  setId,
  setServers,
  setServersEnd,
  setServersStart,
} from "../../../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import { setNoDataFound } from "../../../../ReaduxToolkit/Reducer/NoDataFoundSlice";

import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getAll } from "../../../../Utilities/api";
import { header } from "../../../../Utilities/headers/header";
type propsType = {
  toggle: () => void;
};
const ChangePasswordForm = ({ toggle }: propsType) => {
  const { id } = useSelector((state: any) => state.serverDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  // Function to handle click event
  const handleClick = (event: any) => {
    event.preventDefault();
    // Extract the text content of the clicked element's child
    const clickedChildValue = event.target.firstChild.textContent;
    // Update the state with the value
    setPassword(clickedChildValue);
  };

  const handleChange = (e: any) => {
    setPassword(e.target.value);
  };
  const randomPasswordsCount = [1, 2, 3, 4, 5];
  const generateRandomPassword = (length = 24) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_-+=<>?/{}[]|";

    const allChars = uppercase + lowercase + numbers + specials;

    if (length < 24) {
      throw new Error("Password length must be at least 10 characters");
    }

    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars.charAt(randomIndex);
    }

    return password;
  };

  const updateServerSubmitted = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/server-management/change-server-password/${id}`,
        {
          updatedPassword: password,
        },
        {
          headers: header(),
        }
      );

      const result = response.data;
      // console.log("Response data of change password:", response.data);
      dispatch(setId(null));
      dispatch(setServersStart());
      getAll({ url: "server-management/get-all-servers" }).then((data: any) => {
        // console.log("api call --- >", data);
        setLoading(false);
        // ----------------------
        dispatch(setServersEnd());
        if (data !== undefined) {
          dispatch(setNoDataFound(data.message));
          if (data.success) {
            // console.log("hhg");
            dispatch(setServers(data.data.allServers));
            dispatch(setFilterServers(data.data.allServers));
            toggle();
            // navigate(`${process.env.PUBLIC_URL}/setup/server_details`);
          }
        }
      });

      return result;
    } catch (error: any) {
      setLoading(false);
      Swal.fire({
        text: `${error.response.data.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }
  };
  return (
    <Row className="g-3">
      <Col md={12}>
        <Label htmlFor="inputPassword4">Change Password</Label>
        <Input
          id="password"
          type="text"
          placeholder="Enter Your Password"
          onChange={(e) => handleChange(e)}
          value={password}
        />
      </Col>
      <Col md={12}>
        {randomPasswordsCount.map((item, index) => {
          return (
            <span
              onClick={(e) => handleClick(e)}
              style={{
                padding: "5px",
                backgroundColor: "red",
                margin: "5px",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {generateRandomPassword(24)}
            </span>
          );
        })}
      </Col>

      <Row style={{ marginTop: "20px" }}>
        <Col md={6}>
          <Button
            style={{ display: "block", width: "100%", textAlign: "center" }}
            color="primary"
            type="submit"
            onClick={(e) => {
              updateServerSubmitted(e);
            }}
          >
            {loading ? "Loading..." : "Change"}
          </Button>
        </Col>
        <Col md={6}>
          <Button
            style={{ display: "block", width: "100%", textAlign: "center" }}
            color="secondary"
            type="submit"
            onClick={(e) => {
              toggle();
            }}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Row>
  );
};

export default ChangePasswordForm;