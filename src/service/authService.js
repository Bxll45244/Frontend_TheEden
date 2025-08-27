// Import API_BASE_URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ฟังก์ชันสำหรับลงทะเบียนผู้ใช้งานใหม่
 * @param {object} userData - ข้อมูลผู้ใช้สำหรับลงทะเบียน (name, email, password, role)
 * @returns {Promise<object>} - ผลลัพธ์ของการลงทะเบียน (success, message, user)
 */
export const register = async (userData) => {
    try {
        
        const response = await fetch(`${API_BASE_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message || 'Registration successful!', user: data.user };
        } else {
            return { success: false, message: data.error || data.message || 'Registration failed' };
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return { success: false, message: 'Network error or server is down' };
    }
};



/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบผู้ใช้งาน
 * @param {object} credentials - ข้อมูลการเข้าสู่ระบบ (email, password)
 * @returns {Promise<object>} - ผลลัพธ์ของการเข้าสู่ระบบ (success, message, user, token, etc.)
 */
export const login = async (credentials) => {
    try {
        // สร้าง URL สำหรับ Login endpoint: http://localhost:5000/user/login
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // หาก Backend คาดหวัง Authorization header สำหรับบางกรณี หรือไม่ก็ไม่ใส่ก็ได้
            },
            body: JSON.stringify(credentials), // ส่ง email และ password ในรูปแบบ JSON
        });

        const data = await response.json(); // แปลง response เป็น JSON

        if (response.ok) {
            // การเข้าสู่ระบบสำเร็จ
            // ตรวจสอบว่า Backend ส่งข้อมูลผู้ใช้หรือ token กลับมาหรือไม่
            // สมมติว่า Backend ส่ง token มาใน data.token หรือข้อมูล user ใน data.user
            // คุณอาจต้องการเก็บ token ไว้ใน localStorage หรือ context API ในภายหลัง
            return {
                success: true,
                message: data.message || 'Login successful!',
                user: data.user, // หรือ data.data.user แล้วแต่โครงสร้าง response ของ Backend
                token: data.token // หรือ data.data.token
                // เพิ่มข้อมูลอื่นๆ ที่ Backend ส่งกลับมาเมื่อ Login สำเร็จ
            };
        } else {
            // การเข้าสู่ระบบไม่สำเร็จ (เช่น รหัสผ่านผิด, ไม่พบผู้ใช้)
            return {
                success: false,
                message: data.error || data.message || 'Login failed'
            };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Network error or server is down' };
    }
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลโปรไฟล์ผู้ใช้งาน
 * @returns {Promise<object>} - ผลลัพธ์ (success, user, message)
 */
export const getUserProfile = async () => {
    try {
        // Endpoint สำหรับดึงโปรไฟล์ผู้ใช้ (ตาม Swagger UI ที่เคยให้มาคือ GET /user/profile)
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // หาก Backend ต้องการ Authorization Header (เช่น JWT Token)
                // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`, // ถ้าใช้ localStorage
            },
            credentials: 'include', // *** สำคัญมากถ้าใช้ HTTP-Only Cookies ***
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, user: data.user || data }; // Backend อาจส่ง user ตรงๆ หรือใน data.user
        } else {
            // หากไม่สำเร็จ อาจเป็นเพราะ Token หมดอายุ, ไม่มีการ Login
            return { success: false, message: data.message || 'Failed to fetch user profile' };
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return { success: false, message: 'Network error or server is down' };
    }
};

/**
 * ฟังก์ชันสำหรับ Logout ผู้ใช้งาน
 * @returns {Promise<object>} - ผลลัพธ์ (success, message)
 */
export const logoutUser = async () => {
    try {
        // Endpoint สำหรับ Logout (ตาม Swagger UI ที่เคยให้มาคือ POST /user/logout)
        const response = await fetch(`${API_BASE_URL}/user/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // *** สำคัญมากถ้าใช้ HTTP-Only Cookies ***
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message || 'Logged out successfully!' };
        } else {
            return { success: false, message: data.message || 'Logout failed' };
        }
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, message: 'Network error or server is down' };
    }
};

