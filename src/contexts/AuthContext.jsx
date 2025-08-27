// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, logoutUser } from '../service/authService'; // สมมติว่ามี getUserProfile, logoutUser

// สร้าง Context
const AuthContext = createContext(null);

// สร้าง Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [loading, setLoading] = useState(true); // สถานะการโหลด (เช่น ตรวจสอบ token ตอนเริ่มต้น)

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้เมื่อโหลดแอปฯ หรือมีการ Login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ตรวจสอบว่ามี Token/Session (ถ้าใช้ HttpOnly Cookies ไม่ต้องเช็คใน localStorage)
        // หรือถ้า Backend มี Endpoint /user/profile ที่เช็ค Authentication จาก Cookie/Header
        const result = await getUserProfile(); // สมมติว่า getUserProfile ตรวจสอบ session/token
        if (result.success) {
          setUser(result.user);
        } else {
          setUser(null); // ล้างข้อมูลผู้ใช้ถ้าไม่สำเร็จ
          // Optionally, clear any invalid tokens from localStorage if not using httpOnly cookies
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Run once on component mount

  // ฟังก์ชันสำหรับ Login และ Logout ที่จะอัปเดต state ใน Context
  const login = (userData) => { // รับข้อมูล user หลัง login สำเร็จ
    setUser(userData);
    // ในกรณีที่คุณเก็บ token ใน localStorage (ซึ่งไม่แนะนำสำหรับ JWT)
    // localStorage.setItem('userToken', userData.token);
  };

  const logout = async () => {
    try {
        await logoutUser(); // เรียก API Logout ที่ Backend
        setUser(null); // ล้างข้อมูลผู้ใช้ใน Context
        // หากเคยเก็บ token ใน localStorage ก็ลบออก
        // localStorage.removeItem('userToken');
        // localStorage.removeItem('userInfo');
    } catch (error) {
        console.error("Error during logout:", error);
    }
  };


  // ค่าที่จะส่งให้ Consumer Components
  const contextValue = {
    user,
    isAuthenticated: !!user, // true ถ้ามี user object
    loading,
    login,
    logout,
    setUser // บางทีอาจต้องให้ Component อื่นๆ อัปเดต user ตรงๆ
  };

  if (loading) {
    return <div>Loading user data...</div>; // อาจแสดง Loading Spinner
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook เพื่อใช้ Context ได้ง่ายขึ้น
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};