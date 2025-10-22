import api from "../api";

const USER_API = "/user";

// ดึงผู้ใช้ทั้งหมด
const getAllUsers = () => api.get(`${USER_API}/all`);

// ดึงรายชื่อพนักงาน (ที่ไม่ใช่ user ทั่วไป)
const getAllNotUser = () => api.get(`${USER_API}/allnotuser`);

// ดึงโปรไฟล์ของตัวเอง
const getUserProfile = () => api.get(`${USER_API}/profile`);

// ดึงผู้ใช้ตาม id
const getUserById = (id) => api.get(`${USER_API}/getbyiduser/${id}`);

// สมัครสมาชิก (สาธารณะ)
const registerUser = (payload) => api.post(`${USER_API}/register`, payload);

// สมัครโดยแอดมิน (อัปโหลดไฟล์)
const adminRegisterUser = (formData) =>
  api.post(`${USER_API}/admin/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// อัปเดตข้อมูลผู้ใช้ (อัปโหลดไฟล์)
const updateUser = (id, formData) =>
  api.put(`${USER_API}/updateuser/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// เข้าสู่ระบบ
const loginUser = (credentials) => api.post(`${USER_API}/login`, credentials);

// ออกจากระบบ
const logoutUser = () => api.post(`${USER_API}/logout`);

export default {
  getAllUsers,
  getAllNotUser,
  getUserProfile,
  getUserById,
  registerUser,
  adminRegisterUser,
  updateUser,
  loginUser,
  logoutUser,
};
