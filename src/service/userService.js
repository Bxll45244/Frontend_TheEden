import axios from 'axios';

// โหลด BASE URL จากไฟล์ .env (VITE_API_BASE_URL=http://localhost:5000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// สร้าง instance ของ axios ที่มีการตั้งค่าเริ่มต้น
// ด้วย withCredentials: true เพื่อให้ส่ง httpOnly cookie ไปด้วย
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ฟังก์ชันสำหรับสร้างบัญชีผู้ใช้ (caddy, starter) โดย Admin
 * @param {object} userData - ข้อมูลผู้ใช้ใหม่: { name, email, password, role }
 * @returns {Promise<object>} - ผลลัพธ์จากการสร้างบัญชี
 */
export const registerByAdmin = async (userData) => {
  try {
    const res = await api.post('/user/admin/register', userData);
    return {
      success: true,
      message: 'สร้างบัญชีผู้ใช้สำเร็จ',
      user: res.data
    };
  } catch (err) {
    console.error('Error registering user by admin:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'ไม่สามารถสร้างบัญชีผู้ใช้ได้'
    };
  }
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
 * @returns {Promise<object>} - ผลลัพธ์ที่มีทั้งสถานะและข้อมูลผู้ใช้ทั้งหมด
 */
export const getAllUsers = async () => {
  try {
    const res = await api.get('/users/all');
    return {
      success: true,
      users: res.data,
      message: 'ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ'
    };
  } catch (err) {
    console.error('Error fetching all users:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้'
    };
  }
};