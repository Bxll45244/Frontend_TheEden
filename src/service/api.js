import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Use the URL from .env if available, or if not, use http://localhost:5000/api
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
        
    },
    
});

export default api;