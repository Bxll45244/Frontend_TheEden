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
// ดึงพนักงานที่ไม่ใช่ role user
export const getAllNotUser = async () => {
  try {
    const res = await api.get("/user/allnotuser"); // ✅ route ของคุณคือ /allnotuser
    return {
      success: true,
      employees: res.data.employees,
    };
  } catch (err) {
    console.error("Error fetching non-user employees:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "ไม่สามารถดึงข้อมูลพนักงานได้",
    };
  }
};