import * as yup from 'yup';

import { axiosInstance } from "./client";
import { CrendentialProperties } from "../types/models";

export const login = (credentials: CrendentialProperties) => axiosInstance.post<any>('/login', credentials)

export const getUser = () => axiosInstance.get<any>('/user')

export const tokenSchema = yup.string().required()

export const userSchema = yup.object().shape({
    id: yup.number().required(),
    username: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    mail: yup.string().required(),
    employeeType: yup.string().required(),
})