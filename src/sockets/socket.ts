// socket.js
import { io } from "socket.io-client";

// your backend server URL
const SOCKET_URL = "http://163.61.91.52:8080";

// get token from localStorage (or Redux, etc.)
const token = localStorage.getItem("token");

export const socketConnection = io(SOCKET_URL, {
  auth: {
    token, // pass JWT or session token
  },
});
