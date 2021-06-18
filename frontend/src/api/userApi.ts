import { axiosInstance } from "./client";
import { CrendentialProperties } from "../types/models";

export const login = (credentials: CrendentialProperties) => axiosInstance.post<any>('/login', credentials)