import axios, { AxiosError } from "axios";
import jwt from "jsonwebtoken";

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

  if (refreshToken === null) {
    throw new Error("No refresh token in storage.");
  }

  const decodedRefreshToken = jwt.decode(refreshToken, { complete: true });
  if (decodedRefreshToken === null) {
    localStorage.removeItem("refreshToken");
    throw new Error("Failed to decode refresh token.");
  }

  const now = Math.ceil(Date.now() / 1000);
  if (
    decodedRefreshToken.payload.exp &&
    decodedRefreshToken.payload.exp < now
  ) {
    localStorage.removeItem("refreshToken");
    throw new Error("Refresh token expired.");
  }

  try {
    const response = await SessionApi.refreshToken({
      refreshToken: refreshToken,
    });
    return response.accessToken;
  } catch (error) {
    localStorage.removeItem("refreshToken");
    throw error;
  }
};
