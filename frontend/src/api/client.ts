import axios from "axios";
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

const { REACT_APP_API_URL } = process.env;

export const axiosInstance = axios.create({
    baseURL: REACT_APP_API_URL || '',
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
})

axiosInstance.interceptors.response.use((res) => res)

export const setAuthorization = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

export const validateToken = (token: string): boolean => {
  const decoded = jwt.decode(token, {complete: true})
  const dateNow = new Date();
  if (decoded && decoded.payload.exp && decoded.payload.exp * 1000 > dateNow.getTime()) {
    return true;
  } else if (decoded && decoded.payload.exp === undefined) {
    return true;
  }
  return false;
}

export const errorSchema = yup.object({
  errors: yup.array().required().of(
    yup.object({
      code: yup.string().required(),
      message: yup.string().required(),
    }),
  ),
});