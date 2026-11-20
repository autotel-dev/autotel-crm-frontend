import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const ROLE_SUPER_ADMIN = "SUPER_ADMIN";

let loggingOut = false;

/** True when there is no token, it can't be decoded, or its `exp` is in the past. */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    // Tokens without an expiry are treated as valid; the server still checks them.
    return typeof exp === "number" && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const getStoredRole = (): string | undefined => {
  try {
    const token = localStorage.getItem("token");
    return token ? jwtDecode<{ role?: string }>(token).role : undefined;
  } catch {
    return undefined;
  }
};

/** Login page for the current user, matching the "Log Out" menu behaviour. */
export const getLoginPath = (): string => {
  const base = process.env.PUBLIC_URL || "";
  const userId = localStorage.getItem("userId");
  if (getStoredRole() === ROLE_SUPER_ADMIN || !userId) return `${base}/login`;
  return `${base}/login/${userId}`;
};

/** Clear the session and send the user to their login page (runs once at a time). */
export const endSession = (message?: string) => {
  if (loggingOut) return;
  loggingOut = true;

  const loginPath = getLoginPath();
  const role = getStoredRole();
  localStorage.removeItem("token");
  if (role === ROLE_SUPER_ADMIN) localStorage.removeItem("userId");

  Swal.fire({
    text: message || "Your session has expired. Please log in again.",
    icon: "warning",
    timer: 2500,
    showConfirmButton: false,
  }).then(() => {
    window.location.assign(loginPath);
  });
};

/**
 * Log the user out when an authenticated axios request comes back 401.
 * The backend only sends 401 from its auth middleware (missing, invalid or
 * expired token, or the account no longer exists).
 */
export const installSessionInterceptor = () => {
  axios.interceptors.response.use(undefined, (error) => {
    const status = error?.response?.status ?? error?.response?.data?.statusCode;
    if (status === 401 && localStorage.getItem("token")) {
      endSession(error?.response?.data?.message);
    }
    return Promise.reject(error);
  });
};
