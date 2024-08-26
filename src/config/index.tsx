/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
export const API_BASE_URL = window.host ?? "";
//@ts-ignore
export const SUBURL = window.sub_url ?? "api/";

// Extend axios configuration if needed
import axios from "axios";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpClient;
