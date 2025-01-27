import { err, Result } from "@libs/shared";
import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:3000/api" });
api.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response?.success !== undefined) return error.response;
            return err(error.response);
        }
        // Rethrow network/timeout errors
        return Promise.reject(error);
    },
);
