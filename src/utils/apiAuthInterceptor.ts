import axios from "axios";
import API from "./api";
import Cookies from "js-cookie";
import { ApiError } from "@/types";

// Pass `navigate` to the interceptor
const setupInterceptor = (resetAndRedirect: () => void) => {
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the error is due to an expired token, try to refresh it
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            "http://localhost:8000/api/refresh",
            {},
            { withCredentials: true }
          );

          const accessToken = response.data.data.access_token;
          Cookies.set("accessToken", accessToken, { secure: true });

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log the user out and redirect to login
          resetAndRedirect(); // Use navigate instead of window.location.href
          return Promise.reject(refreshError);
        }
      }

      if (error.response?.data) {
        const apiError: ApiError = error.response.data;
        return Promise.reject(apiError);
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptor;
