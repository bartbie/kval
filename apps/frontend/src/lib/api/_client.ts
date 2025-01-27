import { err, Result } from "@libs/shared";
import axios from "axios";
import { getToken } from "../_token";
export const api = axios.create({ baseURL: "http://localhost:3000/api" });
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            if (error.response?.success !== undefined) return error.response;
            return err(error.response);
        }
        // Rethrow network/timeout errors
        return Promise.reject(error);
    },
);
