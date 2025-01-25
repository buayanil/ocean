import axios, { AxiosError } from "axios";
import { decodeJwt as joseDecodeJwt } from "jose";

import { loginFailed } from "../redux/slices/session/sessionSlice";
import { AppDispatch } from "../redux/store";
import { SessionApi } from "./sessionApi";

const { VITE_API_URL } = import.meta.env;

const baseURL = VITE_API_URL || "";

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
export const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const decoded = joseDecodeJwt(token); // Decodes the token's payload without verifying the signature
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
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

        // Prevent loops
        if (originalRequest.url === baseURL + "/auth/refresh-token") {
          delete originalRequest.headers.Authorization;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(loginFailed("Refresh token expired."));
          return Promise.resolve(undefined);
        }

        if (error.response?.status === 401) {
          try {
            const accessToken = await renewAccessToken();
            setBearerToken(accessToken);
            originalRequest.headers.Authorization = "Bearer " + accessToken;
            localStorage.setItem("accessToken", accessToken);
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            setBearerToken("");
            delete originalRequest.headers.Authorization;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            dispatch(loginFailed("Session expired."));
          }
        }
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
