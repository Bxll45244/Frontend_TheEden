import axios from "axios";

// โหลด base URL จาก .env (เช่น http://localhost:5000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ถ้ามี cookie จาก backend
  headers: { "Content-Type": "application/json" },
});

/**
 * ดึงข้อมูลการจองของวันปัจจุบัน หรือวันที่ที่กำหนด
 * @param {string} [date] - รูปแบบ "YYYY-MM-DD" เช่น "2025-10-08"
 */
export const getBookingToday = async (date) => {
  try {
    const params = date ? { date } : {};
    const res = await api.get("/booking/today", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching booking today:", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "ไม่สามารถดึงข้อมูลการจองได้",
    };
  }
};

export const updateBooking = async (id, data) => {
  try {
    const res = await api.put(`/booking/${id}`, data);
    return res.data; // => { message, booking }
  } catch (err) {
    console.error("Error updating booking:", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "ไม่สามารถอัปเดตการจองได้",
    };
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await api.delete(`/booking/${id}`);
    return res.data; // { message: "Booking deleted successfully" }
  } catch (err) {
    console.error("Error deleting booking:", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "ไม่สามารถลบการจองได้",
    };
  }
};