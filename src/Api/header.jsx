import { useSelector } from "react-redux";
import Store from "../ReaduxToolkit/Store";

const authToken = localStorage.getItem("token");
const state = Store.getState();
var token; // Retrieve the current state from the Redux store
// var token = state.user.token; // Access the specific value from the state
// console.log("tokenValue -- >", token);
if (authToken !== null) {
  token = authToken;
  console.log("tokenValueFromLocalStorage -- >", token);
} else {
  token = state.user.token;
  console.log("tokenValueFromRedux -- >", token);
}

// const header = () => {
//   const authToken = localStorage.getItem("token");
//   const { token } = useSelector((state) => state.user);

//   var bearerToken;
//   if (authToken !== null) {
//     bearerToken = `Bearer ${authToken}`;
//   } else {
//     bearerToken = `Bearer ${token}`;
//   }

//   return {
//     "Content-Type": "application/json",
//     Authorization: bearerToken,
//     // Add any other headers as needed (e.g., authorization token)
//   };
// };

// export default header;

const header = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  // Add any other headers as needed (e.g., authorization token)
};
export default header;
export const multipartHeader = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
}
