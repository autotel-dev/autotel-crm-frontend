const token = localStorage.getItem("token");

const header = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  // Add any other headers as needed (e.g., authorization token)
};
export default header;
