import CryptoJS from "crypto-js";
import { API_BASE_URL } from "../config";
import { encrypt } from "../index";

export function getBrowserInfo(): { [key: string]: string } {
  const browserInfo: { [key: string]: string } = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
    onlineStatus: navigator.onLine ? "Online" : "Offline",
    hardwareConcurrency: navigator.hardwareConcurrency?.toString() || "N/A",
    maxTouchPoints: navigator.maxTouchPoints?.toString() || "N/A",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    plugins:
      Array.from(navigator.plugins ?? [])
        .map((plugin) => plugin.name)
        .join(", ") || "No plugins installed",
  };

  return browserInfo;
}

const TOKEN_STORAGE_KEY = "authToken";
const SECRET_KEY = JSON.stringify(getBrowserInfo());

export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Decrypt the token
export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Save the encrypted token to sessionStorage
export const saveToken = (token: string) => {
  const encryptedToken = encryptToken(token);
  sessionStorage.setItem(TOKEN_STORAGE_KEY, encryptedToken);
};

// Retrieve and decrypt the token from sessionStorage
export const getToken = (): string | null => {
  const encryptedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  return encryptedToken ? decryptToken(encryptedToken) : null;
};

// Remove the token from storage
export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(`${TOKEN_STORAGE_KEY}_expiration`);
};
// Set the token with an expiration time (e.g., 1 hour)
export const saveTokenWithExpiration = (token: string, expiresIn: number) => {
  const expirationTime = Date.now() + expiresIn * 1000; // expiresIn is in seconds
  saveToken(token);
  sessionStorage.setItem(
    `${TOKEN_STORAGE_KEY}_expiration`,
    expirationTime.toString(),
  );
};

// Check if the token is expired
export const isTokenExpired = (): boolean => {
  const expirationTime = sessionStorage.getItem(
    `${TOKEN_STORAGE_KEY}_expiration`,
  );
  if (!expirationTime) {
    saveTokenWithExpiration(encrypt("token"), 8600);
    return false;
  }
  return dateExpired(expirationTime);
};

export const dateExpired = (value: string | number): boolean => {
  return Date.now() > parseInt(value as string, 10);
};

export const isEmpty = (value: string) => {
  return `${value}`.length <= 0 || value === "";
};

export const isDebugMode = () => {
  return API_BASE_URL.split(":").length > 2;
};
