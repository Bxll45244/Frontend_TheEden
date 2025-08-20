// api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // ดึง Token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // แนบ Token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;