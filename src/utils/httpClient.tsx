/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unused-vars */
import axios from "axios";
import { getToken, isTokenExpired, removeToken } from "./utils";
import {decrypt} from "../index";

// Create an axios instance
const httpClient = axios.create({
  headers: {
    "Content-Type": " multipart/form-data",
  },
  withCredentials: true,
  withXSRFToken: true,
});
const arr="abcdefghijklmnopqrstuvwxyz".split("");

// Add a request interceptor to include the decrypted token in headers
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token.token}`;
      try {
        for (let i = 0; i < arr.length; i++) {
          const e = arr[i];
          console.log(`${e}-token\n ${e}token`);
          if (
              sessionStorage.getItem(`${e}-token`) != null ||
              sessionStorage.getItem(`${e}token`) != null
          ) {
            const tokenValueName =
                sessionStorage.getItem(`${e}-token`) != null
                    ? `${e}-token`
                    : sessionStorage.getItem(`${e}token`) != null
                        ? `${e}token`
                        : "";
            const token =
                sessionStorage.getItem(`${e}-token`) ??
                sessionStorage.getItem(`${e}token`);

            if (token != null) {
              config.headers.set(tokenValueName.toUpperCase(), decrypt(token));
            }
          }
        }
      }catch (_error){}

    } else if (isTokenExpired()) {
      removeToken(); // Clear token if expired
      window.location.href = "/";
      return Promise.reject("Token expired");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default httpClient;
