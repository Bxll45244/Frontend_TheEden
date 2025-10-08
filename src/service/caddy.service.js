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

export const getCaddyBooking = async () => {
  try {
    const res = await api.get("/caddy/caddybooking");
    return { success: true, bookings: res.data };
  } catch (err) {
    console.error("Error fetching caddy bookings:", err);
    return {
      success: false,
      bookings: [],
      message: err.response?.data?.message || "โหลดข้อมูลการจองล้มเหลว",
    };
  }
};

/**
 * เริ่มรอบการทำงาน (startRound)
 * @param {string} bookingId
 */
export const startRound = async (bookingId) => {
  try {
    const res = await api.put(`/caddy/start/${bookingId}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Failed to start round:", err);
    return {
      success: false,
      message: err.response?.data?.message || "ไม่สามารถเริ่มรอบได้",
    };
  }
};

/**
 * จบรอบการทำงาน (endRound)
 * @param {string} bookingId
 */
export const endRound = async (bookingId) => {
  try {
    const res = await api.put(`/caddy/end/${bookingId}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Failed to end round:", err);
    return {
      success: false,
      message: err.response?.data?.message || "ไม่สามารถจบรอบได้",
    };
  }
};

/**
 * ทำให้สถานะแคดดี้และอุปกรณ์กลับไป Available
 * @param {string} bookingId
 */
export const markCaddyAsAvailable = async (bookingId) => {
  try {
    const res = await api.put(`/caddy/available/${bookingId}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Failed to mark available:", err);
    return {
      success: false,
      message: err.response?.data?.message || "อัปเดตสถานะว่างล้มเหลว",
    };
  }
};

/**
 * ยกเลิกก่อนเริ่มรอบ (cancelStart)
 * @param {string} bookingId
 */
export const cancelStart = async (bookingId) => {
  try {
    const res = await api.put(`/caddy/cancel-start/${bookingId}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Failed to cancel start:", err);
    return {
      success: false,
      message: err.response?.data?.message || "ยกเลิกรอบก่อนเริ่มไม่สำเร็จ",
    };
  }
};

/**
 * ยกเลิกระหว่างรอบ (cancelDuringRound)
 * @param {string} bookingId
 */
export const cancelDuringRound = async (bookingId) => {
  try {
    const res = await api.put(`/caddy/cancel-during-round/${bookingId}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Failed to cancel during round:", err);
    return {
      success: false,
      message: err.response?.data?.message || "ยกเลิกรอบระหว่างทำงานไม่สำเร็จ",
    };
  }
};