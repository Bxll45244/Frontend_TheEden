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
 * ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมด
 * @returns {Promise<object>} - ผลลัพธ์ที่มีทั้งสถานะและข้อมูลการจอง
 */
export const getBookings = async () => {
  try {
    const res = await api.get('/bookings');
    return {
      success: true,
      bookings: res.data,
      message: 'ดึงข้อมูลการจองสำเร็จ'
    };
  } catch (err) {
    console.error('Error fetching bookings:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'ไม่สามารถดึงข้อมูลการจองได้'
    };
  }
};

/**
 * ฟังก์ชันสำหรับสร้างการจองใหม่
 * @param {object} bookingData - ข้อมูลการจองที่ต้องการสร้าง
 * @returns {Promise<object>} - ผลลัพธ์ของการจอง
 */
export const createBooking = async (bookingData) => {
  try {
    const res = await api.post('/bookings/book', bookingData);
    return {
      success: true,
      message: res.data.message || 'สร้างการจองสำเร็จ!',
      booking: res.data.booking
    };
  } catch (err) {
    console.error('Error creating booking:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'ไม่สามารถสร้างการจองได้'
    };
  }
};

/**
 * ฟังก์ชันสำหรับอัปเดตการจอง
 * @param {string} bookingId - ID ของการจองที่จะอัปเดต
 * @param {object} bookingData - ข้อมูลที่ต้องการอัปเดต (เช่น { timeSlot: "new-time" })
 * @returns {Promise<object>} - ผลลัพธ์ของการอัปเดต
 */
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const res = await api.put(`/bookings/${bookingId}`, bookingData);
    return {
      success: true,
      message: res.data.message || 'อัปเดตการจองสำเร็จ',
      booking: res.data.booking
    };
  } catch (err) {
    console.error('Error updating booking:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'ไม่สามารถอัปเดตการจองได้'
    };
  }
};

/**
 * ฟังก์ชันสำหรับลบการจอง
 * @param {string} bookingId - ID ของการจองที่จะลบ
 * @returns {Promise<object>} - ผลลัพธ์ของการลบ
 */
export const deleteBooking = async (bookingId) => {
  try {
    const res = await api.delete(`/bookings/${bookingId}`);
    return {
      success: true,
      message: res.data.message || 'ลบการจองสำเร็จ'
    };
  } catch (err) {
    console.error('Error deleting booking:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || 'ไม่สามารถลบการจองได้'
    };
  }
};