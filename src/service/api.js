import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true, // ส่ง HttpOnly Cookie
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;