/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment,@typescript-eslint/no-unused-vars */
import { useState } from "react";
import httpClient from "../utils/httpClient";
import { handleError, handleErrors } from "../utils/errorHandler";
import {
  saveTokenWithExpiration,
  removeToken,
  isTokenExpired,
  isDebugMode,
  isEmpty,
  isFullUrl,
} from "../utils/utils";
import { API_BASE_URL, SUBURL } from "../config";
import axios, { AxiosError } from "axios";
import PropertyError from "../utils/propertyError";

type Options =
  | "create"
  | "post"
  | "read"
  | "get"
  | "put"
  | "update"
  | "delete"
  | "remove";

const errorMessages: Record<number, string> = {
  400: "Bad Request. Please check your input.",
  401: "Unauthorized. Please login again.",
  403: "Forbidden.",
  405: "Method Not Allowed. Try another method!",
  422: "Forbidden. Validation Failed.",
  404: "Not Found. The resource could not be found.",
  500: "Internal Server Error. Please try again later.",
  // Add more error codes and messages as needed
};

const handleErrorCode = (code: number, message: string | undefined): string => {
  return (
    (errorMessages[code] || "An unknown error occurred.") +
    ` <br/> -${message ?? ""}`
  );
};

interface CrudOptions {
  method: Options;
  url: string;
  data?: any;
}

const useAjax = <T,>(expireIn: number = 8600) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<PropertyError>({});
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<T | null>(null);
  const [retries, setRetry] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [progress, setProgress] = useState(0);

  const execute = async ({
    method,
    url,
    data,
  }: CrudOptions): Promise<T | null> => {
    if (API_BASE_URL == undefined || isEmpty(API_BASE_URL)) {
      throw new Error(
        "window.host property is missing from index file or entry point",
      );
    }
    setLoading(true);
    setError(null);
    setRetry(retries + 1);
    setErrors({});
    setDownloadProgress(0);
    setProgress(0);
    try {
      if (isTokenExpired()) {
        saveTokenWithExpiration("token", 8600);
        //throw new Error('Token expired');
      }

      httpClient.interceptors.request.use((value) => {
        value.onDownloadProgress = (progressEvent) => {
          const p = Math.round(
            //@ts-ignore
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setDownloadProgress(p);
        };
        value.onUploadProgress = (progressEvent) => {
          const p = Math.round(
            //@ts-ignore
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(p);
        };
        return value;
      });
      // @ts-ignore
      const murl = isFullUrl(url) ? url : `${window?.host}${SUBURL}${url}`;
      let result;
      switch (method) {
        case "create":
        case "post":
          result = await httpClient.post(murl, data);
          break;
        case "read":
        case "get":
          result = await httpClient.get(murl);
          break;
        case "update":
        case "put":
          result = await httpClient.put(murl, data);
          break;
        case "delete":
        case "remove":
          result = await httpClient.delete(murl);
          break;
        default:
          result = await httpClient.get(murl);
          break;
      }

      try {
        // If the response contains a token, save it securely with an expiration time
        if (result.data) {
          if (result.data.data) {
            if (result.data.data.token) {
              saveTokenWithExpiration(result.data.data.token, expireIn);
            }
          } else {
            if (result.data.token)
              saveTokenWithExpiration(result.data.token, expireIn);
          }
        }
      } catch (_e) {
        //do something with ${_e}
      }

      setResponse(result.data);
      return result.data;
    } catch (err: any) {
      setErrors(handleErrors(err) as PropertyError);

      if (isDebugMode()) {
        const errorMessage = handleError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          const errorMessage = handleErrorCode(
            axiosError.response?.status ?? 0,
            handleError(err),
          );
          setError(errorMessage);
          throw new Error(errorMessage);
        } else throw new Error("unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to log out and clear the token
  const logout = () => {
    removeToken();
    setResponse(null);
    setError(null);
  };

  return {
    send: execute,
    errors: errors,
    response,
    loading,
    error,
    logout,
    retries,
    progress,
    downloadProgress,
  };
};

export default useAjax;
