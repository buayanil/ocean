import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:9000/',
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
})

axiosInstance.interceptors.response.use((res) => res)