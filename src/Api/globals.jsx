import { jwtDecode } from "jwt-decode";

export function formatUnderscoredString(inputString) {
  if (inputString.includes("_")) {
    return inputString
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  } else {
    return (
      inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
    );
  }
}

export function getUserRole() {
  const authToken = localStorage.getItem("token");
  if (authToken !== null) {
    const decodedToken = jwtDecode(authToken);
    console.log(decodedToken);
    return decodedToken.role;
  }
}
