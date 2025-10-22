import api from "../api";

const STRIPE_API = "/stripe";

// ฟังก์ชันนี้เรียก API: POST /stripe/create-checkout
// ใช้สร้างการชำระเงินผ่าน Stripe (backend จะคืน paymentUrl กลับมา)
// payload คือรายละเอียดการจอง
// ต้องเข้าสู่ระบบก่อนถึงจะเรียกได้ (เพราะ backend ใช้ middleware protect)
const createCheckout = (payload) => api.post(`${STRIPE_API}/create-checkout`, payload);

// ฟังก์ชันนี้เรียก API: GET /stripe/by-session/:session_id
// ใช้ดึงข้อมูลการจองหลังจากที่ผู้ใช้ชำระเงินสำเร็จ (หน้า success)
// sessionId จะได้จาก URL ของหน้า success เช่น ?session_id=cs_test_123
const getBookingBySession = (sessionId) => api.get(`${STRIPE_API}/by-session/${sessionId}`);

// ฟังก์ชันเสริมสำหรับดึง session_id จาก URL ของหน้า success
// ใช้เมื่อต้องการตรวจสอบข้อมูลการชำระเงินหลัง redirect กลับมาจาก Stripe
const getSessionIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("session_id") || params.get("sessionId") || null;
};

// export ฟังก์ชันทั้งหมดไว้ใน object เพื่อไปใช้ในไฟล์ที่จะใช้ service นี้
const StripeService = {
  createCheckout,
  getBookingBySession,
  getSessionIdFromUrl,
};

export default StripeService;
