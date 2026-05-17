import axios, { type AxiosResponse } from "axios";
import toast from "react-hot-toast";

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<BaseResponse<unknown>>) => {
    if (!response.data.success) {
      toast.error(response.data.message || "Request failed");
      return Promise.reject(new Error(response.data.message));
    }
    return response;
  },
  (err) => {
    if (err.response?.status === 401) {
      return Promise.reject(err);
    }

    const message = err.response?.data?.message || "API Error";
    toast.error(message);
    return Promise.reject(err);
  }
);

export const getData = <T>(response: AxiosResponse<BaseResponse<T>>): T => {
  return response.data.data as T;
};
