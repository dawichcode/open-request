/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import {getToken, isTokenExpired, removeToken} from "./utils";

// Create an axios instance
const httpClient = axios.create({
  headers: {
    "Content-Type": " multipart/form-data",
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Add a request interceptor to include the decrypted token in headers
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token.token}`;

        ("abcdefghijklmnopqrstuvwxyz".split("").map(e=>{
            if(sessionStorage.getItem(`${e}-token`)!=null||sessionStorage.getItem(`${e}token`)!=null){
                const tokenValueName=sessionStorage.getItem(`${e}-token`)!=null?`${e}-token`:(
                    sessionStorage.getItem(`${e}token`)!=null?`${e}token`:"");
                const token=sessionStorage.getItem(`${e}-token`)??sessionStorage.getItem(`${e}token`);
                if(token!=null){
                  config.headers.set(tokenValueName.toUpperCase(),token);
                }
            }
        }))

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
