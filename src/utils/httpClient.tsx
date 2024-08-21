import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getToken, isTokenExpired, removeToken } from './utils';

// Create an axios instance
const httpClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials:true,
    withXSRFToken:true
});

// Add a request interceptor to include the decrypted token in headers
httpClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && !isTokenExpired()) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (isTokenExpired()) {
            removeToken(); // Clear token if expired
            window.location.href = '/';
            return Promise.reject('Token expired');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpClient;
