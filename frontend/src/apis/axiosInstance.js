import axios from "axios";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  setUserToLocalStorage,
} from "../helper/auth";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  async (config) => {
    const userData = getUserFromLocalStorage();
    const accessToken = userData?.accessToken || "";
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("qqqqqqqqqqqqqqqqqqqqqqqq");
    const originalRequest = error.config;
    const userData = getUserFromLocalStorage();

    if (!userData || !userData.refreshToken) {
      console.error("No refresh token found. Logging out.");
      removeUserFromLocalStorage();
      return Promise.reject(error);
    }

    const refreshToken = userData.refreshToken;

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${API_BASE_URL}/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );
        // console.log(`RESPONSE\n${response.data.message}`);
        const newAccessToken = response.data.access_token;
        // console.log(`AXIOSINSTANCE\n${newAccessToken}`);

        userData.accessToken = newAccessToken;
        setUserToLocalStorage(userData);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out.");
        removeUserFromLocalStorage();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
