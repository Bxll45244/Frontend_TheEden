import api from "./api";

const BOOKING_API = "/booking";

// สร้างการจองใหม่ (POST /booking/book)
// ต้องล็อกอินก่อน (เพราะ backend ใช้ protect)
const createBooking = (bookingData) => api.post(`${BOOKING_API}/book`, bookingData);

// ดึงการจองทั้งหมด (GET /booking/getbook)
const getAllBookings = () => api.get(`${BOOKING_API}/getbook`);

// ดึงการจองตาม id (GET /booking/getbyidbooked/:id)
const getBookingById = (id) => api.get(`${BOOKING_API}/getbyidbooked/${id}`);

// ดึงการจองของผู้ใช้ที่ล็อกอินอยู่ (GET /booking/getbyidbookinguser)
// ใช้แสดงข้อมูลการจองเฉพาะของ user ปัจจุบัน
const getMyBookings = () => api.get(`${BOOKING_API}/getbyidbookinguser`);

// ดึงข้อมูลการจองของวันนี้ (GET /booking/today)
// สำหรับแสดงรายการจองที่เกิดขึ้นในวันปัจจุบัน
const getTodayBookings = () => api.get(`${BOOKING_API}/today`);

// อัปเดตข้อมูลการจอง (PUT /booking/:id)
const updateBooking = (id, bookingData) => api.put(`${BOOKING_API}/${id}`, bookingData);

// ลบการจอง (DELETE /booking/:id)
const deleteBooking = (id) => api.delete(`${BOOKING_API}/${id}`);


const BookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  getTodayBookings,
  updateBooking,
  deleteBooking,
};

export default BookingService;