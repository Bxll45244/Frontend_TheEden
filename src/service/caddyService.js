import api from "./api";

const CADDY_API = "/caddy";

// เริ่มรอบการเล่นของแคดดี้ (PUT /caddy/start/:bookingId)
const startRound = (bookingId) => api.put(`${CADDY_API}/start/${bookingId}`);

// จบรอบการเล่น (PUT /caddy/end/:bookingId)
const endRound = (bookingId) => api.put(`${CADDY_API}/end/${bookingId}`);

// เปลี่ยนสถานะแคดดี้เป็นพร้อมให้บริการ (PUT /caddy/available/:bookingId)
const markCaddyAsAvailable = (bookingId) =>
  api.put(`${CADDY_API}/available/${bookingId}`);

// ยกเลิกการเริ่มรอบ (PUT /caddy/cancel-start/:bookingId)
const cancelStart = (bookingId) =>
  api.put(`${CADDY_API}/cancel-start/${bookingId}`);

// ยกเลิกระหว่างรอบ (PUT /caddy/cancel-during-round/:bookingId)
const cancelDuringRound = (bookingId) =>
  api.put(`${CADDY_API}/cancel-during-round/${bookingId}`);

// ดึงรายชื่อแคดดี้ที่ว่าง (GET /caddy/available-caddies)
const getAvailableCaddies = () => api.get(`${CADDY_API}/available-caddies`);

// ดึงข้อมูลการจองของแคดดี้ (GET /caddy/caddybooking)
const getCaddyBookings = () => api.get(`${CADDY_API}/caddybooking`);

const CaddyService = {
  startRound,
  endRound,
  markCaddyAsAvailable,
  cancelStart,
  cancelDuringRound,
  getAvailableCaddies,
  getCaddyBookings,
};

export default CaddyService;