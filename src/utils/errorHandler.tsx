/* eslint-disable @typescript-eslint/no-explicit-any */
import PropertyError from "./propertyError";

export const handleError = (error: any): string => {
  if (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    } else if (error.message) {
      return error.message;
    }
  }
  return "An unknown error occurred";
};

export const handleErrors = (error: any): PropertyError => {
  if (error) {
    if (error.response) {
      if (error.response.data) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          return { ...errors, ...(errors as PropertyError) };
        }
        else return  error.response.data;
      }
    }
  }
  return {};
};
