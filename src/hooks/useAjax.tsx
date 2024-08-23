/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import httpClient from '../utils/httpClient';
import { handleError } from '../utils/errorHandler';
import {
    saveTokenWithExpiration,
    removeToken,
    isTokenExpired,
    isDebugMode,
    isEmpty
} from '../utils/utils';
import {API_BASE_URL, SUBURL} from "../config";
import axios, {AxiosError} from "axios";

 type Options = 'create' | 'read' | 'update' | 'delete';


const errorMessages: Record<number, string> = {
    400: 'Bad Request. Please check your input.',
    401: 'Unauthorized. Please login again.',
    403: 'Forbidden. You do not have permission to access this resource.',
    404: 'Not Found. The resource could not be found.',
    500: 'Internal Server Error. Please try again later.',
    // Add more error codes and messages as needed
};

const handleErrorCode = (code: number): string => {
    return errorMessages[code] || 'An unknown error occurred.';
};

interface CrudOptions {
    method: Options;
    url: string;
    data?: any;
}

const useAjax = <T,>(expireIn:number=8600) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<T | null>(null);
    const [retries,setRetry]=useState(0);

    const execute = async ({ method, url, data }: CrudOptions): Promise<T | null> => {
        if(API_BASE_URL == undefined || isEmpty(API_BASE_URL)){
            throw  new Error("window.host property is missing from index file or entry point");
        }
        setLoading(true);
        setError(null);
        setRetry(retries+1);
        try {
            if (isTokenExpired()) {
                saveTokenWithExpiration("token",8600);
                //throw new Error('Token expired');
            }
            url=`${SUBURL}${url}`;
            let result;
            switch (method) {
                case 'create':
                    result = await httpClient.post(url, data);
                    break;
                case 'read':
                    result = await httpClient.get(url);
                    break;
                case 'update':
                    result = await httpClient.put(url, data);
                    break;
                case 'delete':
                    result = await httpClient.delete(url);
                    break;
                default:
                    throw new Error('Invalid method');
            }

            // If the response contains a token, save it securely with an expiration time
            if (result.data.token) {
                saveTokenWithExpiration(result.data.token, expireIn);
            }

            setResponse(result.data);
            return result.data;
        } catch (err: any) {
            if(isDebugMode()) {
                const errorMessage = handleError(err);
                setError(errorMessage);
                throw new Error(errorMessage);
            }else {
                if (axios.isAxiosError(err)) {
                    const axiosError = err as AxiosError;
                    const errorMessage = handleErrorCode(axiosError.response?.status ?? 0);
                    setError(errorMessage);
                    throw new Error(errorMessage);
                }else
                throw new Error("unknown error");
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

    return { send:execute, response, loading, error, logout,retries };
};

export default useAjax;
