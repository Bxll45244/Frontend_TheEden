import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true, // ส่ง HttpOnly Cookie (cookie-based JWT auth)
    // เปิดให้ browser ส่ง cookie (ที่มี token แบบ httpOnly) ไปกับทุก request โดยอัตโนมัติ
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

// ระบบนี้ใช้ JWT แบบเก็บใน cookie (httpOnly)
// ไม่ต้องแนบ token เองใน header เช่น Authorization หรือ x-access-token
// เพราะ browser จะส่ง cookie ให้อัตโนมัติเมื่อมี withCredentials: true
