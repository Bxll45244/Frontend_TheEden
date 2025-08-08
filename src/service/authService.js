import axios from 'axios';

// Load BASE URL from .env (VITE_API_BASE_URL=http://localhost:5000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

// Register (Sign up a new user)
export const register = async (userData) => {
  try {
    const res = await api.post('/user/register', userData); 
    return { 
      success: true, 
      message: res.data.message || 'ลงทะเบียนสำเร็จ', 
      user: res.data.user 
    };
  } catch (err) {
    console.error("Registration error:", err.response ? err.response.data : err.message);
    return { 
      success: false, 
      message: err.response?.data?.message || "ลงทะเบียนไม่สำเร็จ" 
    };
  }
};

// Login (Backend will set JWT token as httpOnly cookie)
export const login = async (credentials) => {
  try {
    const res = await api.post('/user/login', credentials); 
    return {
      success: true,
      message: res.data.message || 'เข้าสู่ระบบสำเร็จ',
      user: res.data  // Get user data directly from response
    };
  } catch (err) {
    console.error("Login error:", err.response ? err.response.data : err.message);
    return { 
      success: false, 
      message: err.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    };
  }
};

// Logout (Backend will delete JWT cookie)
export const logout = async () => {
  try {
    const res = await api.post('/user/logout'); 
    return { 
      success: true, 
      message: res.data.message || 'ออกจากระบบเรียบร้อยแล้ว' 
    };
  } catch (err) {
    console.error("Logout error:", err.response?.data || err.message);
    return { 
      success: false, 
      message: err.response?.data?.message || "ออกจากระบบไม่สำเร็จ" 
    };
  }
};

// userController.js (backend)

// export const getUserProfile = async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (user) {
//     res.json({
//        _id: user.id, 
//        name: user.name, 
//        email: user.email, 
//        role: user.role,
//      });
//   } else {
//     res.status(404).json({ message: "User not found" });
//   }
// };

// Get Current User Profile (Use JWT cookie for authentication)
export const getUserProfile = async () => {
  try {
    const res = await api.get('/user/profile'); 
    return { 
      success: true, 
      user: res.data,  //Get user object from backend
    }; 
  } catch (err) {
    // Don't show error log if you haven't logged in yet
    if (err.response?.status === 401) {
      return {
        success: false,
        message: "ยังไม่ได้เข้าสู่ระบบ หรือ กรุณาเข้าสู่ระบบอีกครั้ง"
      };
    }

    console.error("Profile fetch error:", err.response?.data || err.message);

    return { 
      success: false, 
      message:
        err.response?.data?.message === 'User not found'
          ? 'ไม่พบข้อมูลผู้ใช้งานในระบบ กรุณาลองเข้าสู่ระบบใหม่'
          : err.response?.data?.message || "เกิดข้อผิดพลาดขณะโหลดโปรไฟล์"
    };
  }
};

// Get All Users (Need to be logged in and have admin rights)
export const getAllUsers = async () => {
  try {
    const res = await api.get('/user/all');
    return { 
      success: true, 
      users: res.data // Get a list of all users from the backend
    };
  } catch (err) {
    console.error('Error fetching all users:', err.response?.data || err.message);
    return { 
      success: false, 
      message: err.response?.data?.message || 'ไม่สามารถดึงรายชื่อผู้ใช้ได้' };
  }
};

// Update Caddy Status 
export const updateCaddyStatus = async (id, newStatus) => {
  try {
    const res = await api.put(`/user/caddy/${id}/status/${newStatus}`); 
    return { 
      success: true, 
      message: res.data.message, 
      caddy: res.data.caddy };
  } catch (err) {
    console.error('Error updating caddy status:', err.response?.data || err.message);
    return { 
      success: false, 
      message: err.response?.data?.message || 'อัปเดตสถานะแคดดี้ไม่สำเร็จ' };
  }
};