// import { ProvinceType } from "../Pages/Province/ProvinceTypes/ProvinceTypes";

import Swal from "sweetalert2";
import errorAlert from "../Pages/Alerts/ErrorAlert";
import successAlert from "../Pages/Alerts/SuccessAlert";
import { CitiesType } from "../Pages/Cities/CityTypes/CityTypes";
import header from "./header";
import { setNoDataFound } from "../ReaduxToolkit/Reducer/NoDataFoundSlice";
const api = `${process.env.PUBLIC_URL}/api`;
export const ChatMemberApi = `${api}/chatMember.json`;
export const ChatApi = `${api}/chats.json`;

// // api.ts

const API_BASE_URL = "http://124.29.238.127:8080/api/v1";
interface URLTypes {
  url: String;
}

interface loginTypes {
  emailAddress: string; // Change 'boolean' to the actual type of isVisible
  password: string;
}

export const login = async (postData: loginTypes): Promise<void> => {
  try {
    const response = await fetch(
      window.location.pathname === "/superAdminLogin"
        ? `${API_BASE_URL}/auth/super-admin/login`
        : `${API_BASE_URL}/auth/company/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed (e.g., authorization token)
        },
        body: JSON.stringify(postData),
      }
    );
    const result = await response.json();
    console.log(result);

    if (!result["success"]) {
      console.log("result: ", result);
      if (result.statusCode == 401 && result.success !== true) {
        var alertData = {
          title: "Invalid Login",
          text: result.message,
        };
        console.log("alertData: 1 ", alertData);
        errorAlert(alertData);
      }

      throw new Error("Failed to login ");
      return;
    }
    if (result.statusCode == 200) {
      successAlert();
    }
    return result;
    // Handle success (optional)
  } catch (error: any) {
    console.error("Error creating login:", error);

    // throw new Error("Failed to create ciloginty");
  }
};

export const create = async (
  postData: CitiesType,
  url: URLTypes
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${url.url}`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(postData),
    });
    const result = await response.json();
    if (result.success !== true && result.statusCode !== 404) {
      Swal.fire({
        text: `${result.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }
    console.log("api --- >", result);

    return result;

    // Handle success (optional)
  } catch (error: any) {
    console.error("Error get-all:", error);
  }
};

export const update = async (
  postData: CitiesType,
  url: URLTypes
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${url.url}`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(postData),
    });
    const result = await response.json();
    if (result.success !== true && result.statusCode !== 404) {
      Swal.fire({
        text: `${result.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }
    console.log("api --- >", result);

    return result;

    // Handle success (optional)
  } catch (error: any) {
    console.error("Error get-all:", error);
  }
};

export const deleteSingle = async (url: URLTypes): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${url.url}`, {
      method: "DELETE",
      headers: header,
    });
    const result = await response.json();
    console.log("api --- >", result);
    if (result.success !== true && result.statusCode !== 200) {
      Swal.fire({
        text: `${result.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }
    return result;

    // Handle success (optional)
  } catch (error: any) {
    console.error("Error get-all:", error);
  }
};

export const getAll = async (url: URLTypes): Promise<void> => {
  console.log(`${API_BASE_URL}/${url.url}`);
  console.log(header);

  try {
    const response = await fetch(`${API_BASE_URL}/${url.url}`, {
      method: "GET",
      headers: header,
    });
    const result = await response.json();
    if (result.success !== true && result.statusCode !== 404) {
      Swal.fire({
        text: `${result.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }

    console.log("api --- >", result);

    return result;

    // Handle success (optional)
  } catch (error: any) {
    console.error("Error get-all:", error);
  }
};
export const getAllActive = async (url: URLTypes): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${url.url}`, {
      method: "GET",
      headers: header,
    });
    const result = await response.json();
    if (result.success !== true && result.statusCode !== 404) {
      Swal.fire({
        text: `${result.message}`,
        icon: "info",
        timer: 2000,
        showCancelButton: false,
      });
    }
    console.log("api --- >", result);

    return result;

    // Handle success (optional)
  } catch (error: any) {
    console.error("Error get-all:", error);
    Swal.fire({
      text: `${error.message}`,
      icon: "info",
      timer: 2000,
      showCancelButton: false,
    });
  }
};
