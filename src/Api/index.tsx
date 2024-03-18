// import { ProvinceType } from "../Pages/Province/ProvinceTypes/ProvinceTypes";

import Swal from "sweetalert2";
import errorAlert from "../Pages/Alerts/ErrorAlert";
import successAlert from "../Pages/Alerts/SuccessAlert";
import { CitiesType } from "../Pages/Cities/CityTypes/CityTypes";
import { header, multipartHeader } from "./header";
import { setNoDataFound } from "../ReaduxToolkit/Reducer/NoDataFoundSlice";
import axios from "axios";
const api = `${process.env.PUBLIC_URL}/api`;
export const ChatMemberApi = `${api}/chatMember.json`;
export const ChatApi = `${api}/chats.json`;

// // api.ts

export const API_BASE_URL = "http://124.29.238.127:8080/api/v1";
export const IMAGE_BASE_URL = "http://124.29.238.127:8080";
// export const API_BASE_URL = process.env.API_BASE_URL;
// export const IMAGE_BASE_URL = process.env.;

interface URLTypes {
  url: String;
}

interface loginTypes {
  emailAddress: string; // Change 'boolean' to the actual type of isVisible
  password: string;
}

interface otpVerification {
  userId: any; // Change 'boolean' to the actual type of isVisible
  otpCode: string;
}

export const login = async (postData: loginTypes): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 400,
    };
    return error;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const result = await response.json();
    console.log(result);

    if (!result["success"]) {
      console.log("result: ", result);
      if (result.statusCode !== 401) {
        var alertData = {
          title: "Invalid Login",
          text: result.message,
        };
        console.log("alertData: 1 ", alertData);
        errorAlert(alertData);
      }

      // throw new Error("Failed to login ");
      return result;
    }
    if (result.statusCode == 200) {
      successAlert();
    }
    return result;
  } catch (error: any) {
    console.error("Error creating login:", error);

    // throw new Error("Failed to create ciloginty");
  }
};

export const otpVerification = async (
  verifyData: otpVerification
): Promise<void> => {
  try {
    if (!navigator.onLine) {
      Swal.fire({
        text: "Internet connection is not available",
        icon: "error",
        timer: 2000,
        showCancelButton: false,
      });
      // throw new Error("Internet connection is not available");
      const error: any = {
        success: false,
        message: "ERROR_INTERNET_DISCONNECTED",
        statusCode: 400,
      };
      return error;
    }
    const response = await fetch(
      `${API_BASE_URL}/auth/user/security/verify-security-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed (e.g., authorization token)
        },
        body: JSON.stringify(verifyData),
      }
    );
    const result = await response.json();
    console.log(result);

    if (!result["success"]) {
      console.log("result: ", result);
      if (result.statusCode !== 401) {
        var alertData = {
          title: "Invalid Login",
          text: result.message,
        };
        console.log("alertData: 1 ", alertData);
        errorAlert(alertData);
      }

      // throw new Error("Failed to login ");
      return result;
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

export const create = async (postData: any, url: URLTypes): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/${url.url}`, postData, {
      headers: header(),
    });

    const result = response.data;
    console.log("Response data:", response.data);

    return result;
  } catch (error: any) {
    console.error("Error creating:", error.message);
  }
};
export const otpEnabled = async (
  isSecurityEnabled: boolean,
  url: URLTypes
): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${url.url}`,
      { isSecurityEnabled: isSecurityEnabled },
      {
        headers: header(),
      }
    );

    const result = response.data;
    console.log("Response data:", response.data);

    return result;
  } catch (error: any) {
    console.error("Error OTPEnabled:", error.message);
    // return error;
  }
};

export const resendOTP = async (userId: any, url: URLTypes): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${url.url}`,
      { userId: userId },
      {
        headers: header(),
      }
    );

    const result = response.data;
    console.log("Response data:", response.data);

    return result;
  } catch (error: any) {
    console.error("Error resendOTP:", error.message);
  }
};

export const createCom = async (
  formData: FormData,
  url: URLTypes
): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.post(`${API_BASE_URL}/${url.url}`, formData, {
      headers: multipartHeader(),
    });
    console.log("api call -- >");

    const result = response.data;
    console.log("Response data:", response.data);

    return result;
  } catch (error: any) {
    console.error("Error creatingCompany:", error.message);
  }
};

export const update = async (postData: any, url: URLTypes): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.put(`${API_BASE_URL}/${url.url}`, postData, {
      headers: header(),
    });

    const result = response.data;
    console.log("Response data:", response.data);

    return result;
  } catch (error: any) {
    console.error("Error updating:", error.message);
  }
};

export const updateWithMultipart = async (
  postData: any,
  url: URLTypes
): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.put(`${API_BASE_URL}/${url.url}`, postData, {
      headers: multipartHeader(),
    });

    const result = response.data;
    console.log("Response data:", response.data);

    return result;
  } catch (error: any) {
    console.error("Error updatingMultipart:", error.message);
  }
};

export const createWithMultipart = async (
  postData: any,
  url: URLTypes
): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.post(`${API_BASE_URL}/${url.url}`, postData, {
      headers: multipartHeader(),
    });

    const result = response.data;
    console.log("Response data:", response.data);
    return result;
  } catch (error: any) {
    console.error("Error creatingMultipart:", error.message);
  }
};

export const patch = async (postData: any, url: URLTypes): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  try {
    const response = await axios.patch(`${API_BASE_URL}/${url.url}`, postData, {
      headers: header(),
    });

    const result = response.data;
    console.log("Response data:", response.data);
    return result;
  } catch (error: any) {
    console.error("Error when Patching:", error.message);
  }
};

export const deleteSingle = async (url: URLTypes): Promise<void> => {
  if (!navigator.onLine) {
    Swal.fire({
      text: "Internet connection is not available",
      icon: "error",
      timer: 2000,
      showCancelButton: false,
    });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  console.log(`${API_BASE_URL}/${url.url}`);
  console.log(header());

  try {
    const response = await axios.delete(`${API_BASE_URL}/${url.url}`, {
      headers: header(),
    });
    const result = response.data;
    console.log("Response data:", response.data);
    return result;
  } catch (error: any) {
    console.error("Error deleting:", error.message);
  }
};

export const getAll = async (url: URLTypes): Promise<void> => {
  if (!navigator.onLine) {
    // Swal.fire({
    //   text: "Internet connection is not available",
    //   icon: "error",
    //   timer: 2000,
    //   showCancelButton: false,
    // });
    // throw new Error("Internet connection is not available");
    const error: any = {
      success: false,
      message: "ERROR_INTERNET_DISCONNECTED",
      statusCode: 401,
    };
    return error;
  }
  // -----------------------
  console.log(`${API_BASE_URL}/${url.url}`);
  console.log(header());

  try {
    const response = await axios.get(`${API_BASE_URL}/${url.url}`, {
      headers: header(),
    });
    const result = response.data;
    console.log("Response data:", response.data);
    return result;
  } catch (error: any) {
    console.error("Error get-all:", error.message);
  }
};

export const getImage = async (url: URLTypes) => {
  try {
    // const response = await axios.get(`${url.url}`, {
    //   headers: multipartHeader
    // })
    const response = await fetch(`${url.url}`, {
      method: "GET",
      headers: {
        Authorization: header().Authorization,
      },
    });
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    const result = objectURL;

    return result;

    // Handle success (optional)
  } catch (error: any) {
    console.error("Error get-all:", error);
  }
};

// import axios from "axios";
// import { BASE_URL } from "./constant";

// const token = localStorage.getItem("token");
// // GLOBAL POST REQUEST WITH AUTHRIZATION
// const POST = async (path, token, data) => {
//   // SETTING UP HEADER
//   const HEADER = {
//     headers: token
//       ? {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         }
//       : {
//           "Content-Type": "application/json",
//         },
//   };
//   // GETTING RESPONSE
//   let res = await axios.post(BASE_URL + path, data, HEADER);
//   return res.data;
// };

// // GLOBAL GET REQUEST WITH AUTHRIZATION
// const GET = async (path, token, params) => {
//   // SETTING UP HEADER & PARAMS
//   const HEADER = {
//     headers: token
//       ? {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           params: params,
//         }
//       : {
//           "Content-Type": "application/json",
//           params: params,
//         },
//   };
//   // GETTING RESPONSE
//   let res = await axios.get(BASE_URL + path + params, HEADER);
//   return res.data;
// };

// // GLOBAL PUT REQUEST WITH AUTHRIZATION
// const PUT = async (path, token, params, data) => {
//   // SETTING UP HEADER & PARAMS
//   const HEADER = {
//     headers: token
//       ? {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         }
//       : {
//           "Content-Type": "application/json",
//         },
//   };
//   // GETTING RESPONSE
//   let res = await axios.put(BASE_URL + path + "/" + params, data, HEADER);
//   return res.data;
// };

// // GLOBAL DELETE REQUEST WITH AUTHRIZATION
// const DELETE = async (path, token, params) => {
//   // SETTING UP HEADER & PARAMS
//   const HEADER = {
//     headers: token
//       ? {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           params: params,
//         }
//       : {
//           "Content-Type": "application/json",
//           params: params,
//         },
//   };
//   // GETTING RESPONSE
//   let res = await axios.delete(BASE_URL + path, HEADER);
//   return res.data;
// };

// export { POST, GET, PUT, DELETE };

// const LIVE_URL = "https://koko-ranch.herokuapp.com";
// const LOCAL_URL = "http://localhost:4000";

// // const BASE_URL = LIVE_URL;
// const BASE_URL = LOCAL_URL;
// const TOKEN = localStorage.getItem("token");

// export { LIVE_URL, LOCAL_URL, TOKEN, BASE_URL };
