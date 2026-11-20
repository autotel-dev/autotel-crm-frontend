import { io } from "socket.io-client";

// Socket server address comes from .env at build time (see .env.example).
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "";

export const socketConnection = io(SOCKET_URL, {
  // Read the token on every (re)connect, not once when this file loads,
  // so a login or logout after page load is picked up.
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});
