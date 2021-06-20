import axios from "axios";

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