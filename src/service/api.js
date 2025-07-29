import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // ตรวจสอบว่า URL นี้ถูกต้อง
    headers: {
        'Content-Type': 'application/json',
        
    },
    withCredentials: true, // *** นี่คือวิธีที่ถูกต้องสำหรับ Axios ในการส่ง Cookie ***
});



export default api;