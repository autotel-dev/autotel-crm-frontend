import { useSelector } from "react-redux";
import Store from "../ReaduxToolkit/Store";
import { jwtDecode } from "jwt-decode";
import { decryptData, encryptData } from "./encryption";

const authToken = localStorage.getItem("token");
const state = Store.getState();
var token; // Retrieve the current state from the Redux store
// var token = state.user.token; // Access the specific value from the state
// console.log("tokenValue -- >", token);
if (authToken !== null) {
  console.log("tokenValueFromLocalStorage -- >", authToken);
  // token = decryptData(authToken);
  token = authToken;
  console.log("tokenValueFromLocalStorage -- >", token);
} else {
  token = state.user.token;
  console.log("tokenValueFromRedux -- >", token);
}

const header = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  // Add any other headers as needed (e.g., authorization token)
};
export default header;
export const multipartHeader = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
};

export const serverCredentials = (serverID) => {
  const decodedToken = jwtDecode(authToken);
  console.log(decodedToken);

  for (let i = 0; i < decodedToken.serverCredentials.length; i++) {
    const element = decodedToken.serverCredentials[i];
    if (element.serverId == serverID) {
      return { element };
    }
  }
};
