import axios, { AxiosError } from "axios";
import jwt, {JwtPayload} from "jsonwebtoken";

import { loginFailed } from "../redux/slices/session/sessionSlice";
import { AppDispatch } from "../redux/store";
import { SessionApi } from "./sessionApi";

const { REACT_APP_API_URL } = process.env;

const baseURL = REACT_APP_API_URL || "";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 20000,
  headers: headers,
});

/**
 * Safely decode a JWT and return the payload if it's valid.
 * @param token - The JWT string to decode.
 * @returns The decoded JwtPayload or null if invalid.
 */
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded !== "string") {
      return decoded as JwtPayload;
    }
  } catch (error) {
    console.error("Failed to decode JWT:", error);
  }
  return null;
};

export const setBearerToken = (accessToken: string) => {
  if (accessToken === "") {
    delete axiosInstance.defaults.headers.common.Authorization;
  } else {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};

export const setupRequestInterceptors = (dispatch: AppDispatch) => {
  const responseHandle = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Ensure originalRequest exists before proceeding
        if (!originalRequest) {
          console.error("originalRequest is undefined.");
          return Promise.reject(error);
        }

        // Prevent loops for refresh-token requests
        if (originalRequest.url === baseURL + "/auth/refresh-token") {
          if (originalRequest.headers) {
            delete originalRequest.headers.Authorization;
          }
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(loginFailed("Refresh token expired."));
          return Promise.resolve(undefined);
        }

        // Handle token renewal on 401 errors
        if (error.response?.status === 401) {
          try {
            const accessToken = await renewAccessToken();
            setBearerToken(accessToken);

            // Ensure headers exist before modifying
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: "Bearer " + accessToken,
            };

            localStorage.setItem("accessToken", accessToken);

            // Retry the original request with the new token
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            setBearerToken("");
            if (originalRequest.headers) {
              delete originalRequest.headers.Authorization;
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            dispatch(loginFailed("Session expired."));
          }
        }

        return Promise.reject(error);
      }
  );

  return () => {
    axiosInstance.interceptors.response.eject(responseHandle);
  };
};


const renewAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token in storage.");
  }

  const decodedRefreshToken = decodeJwt(refreshToken);

  if (!decodedRefreshToken || !decodedRefreshToken.exp) {
    localStorage.removeItem("refreshToken");
    throw new Error("Invalid or expired refresh token.");
  }

  const now = Math.ceil(Date.now() / 1000);
  if (decodedRefreshToken.exp < now) {
    localStorage.removeItem("refreshToken");
    throw new Error("Refresh token expired.");
  }

  try {
    const response = await SessionApi.refreshToken({ refreshToken });
    return response.accessToken;
  } catch (error) {
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

