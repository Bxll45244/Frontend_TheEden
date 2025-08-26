//import React from "react";

import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile, logout as apiLogout } from '../service/authService';

// สร้าง Context สำหรับจัดการ Authentication (ผู้ใช้ที่ล็อกอิน)
export const AuthContext = createContext(null);


// Component Provider สำหรับครอบทุกรายการที่ต้องการเข้าถึง user
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่ล็อกอิน
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูลผู้ใช้ (เริ่มต้นเป็น true)

  // ใช้ useEffect เพื่อโหลดข้อมูลผู้ใช้ครั้งแรกเมื่อ component mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true); // เริ่มโหลดข้อมูล
      const result = await getUserProfile(); // เรียก API ดึง profile ของผู้ใช้

      if (result.success) {
        setUser(result.user); // ถ้าเรียก API สำเร็จ ให้บันทึกข้อมูลผู้ใช้
      } else {
        // กรณีไม่ได้ล็อกอิน
        if (result.message?.includes("ยังไม่ได้เข้าสู่ระบบ")) {
          // ไม่ต้องทำอะไร
        } else {
          // กรณีเกิดข้อผิดพลาดอื่น ๆ
          //console.warn("Error loading user profile:", result.message); // Log เฉพาะ error ที่ไม่ปกติ
        }
        setUser(null); // ตั้งค่า user เป็น null
      }
      setLoading(false); // โหลดเสร็จแล้ว
    };

    loadUser(); // เรียกฟังก์ชันโหลด user
  }, []);

  // ฟังก์ชันสำหรับล็อกอิน (อัปเดต state)
  const login = async (userData) => {
    const result = await getUserProfile(); // ดึงข้อมูล user จาก backend
    if (result.success) {
      setUser(result.user); // ถ้าสำเร็จ ใช้ข้อมูลจาก backend
    } else {
      setUser(userData); // fallback: ถ้า backend ไม่ส่ง user กลับมา ให้ใช้ข้อมูลที่ส่งมา
    }
  };

  // ฟังก์ชันสำหรับ logout
  const logout = async () => {
    try {
      const result = await apiLogout(); // เรียก API logout
      if (result.success) {
        setUser(null); // ล้างข้อมูล user ใน state
        console.log("User logged out successfully.");
      } else {
        console.error("Logout failed:", result.message); // แสดง error ถ้า logout ไม่สำเร็จ
      }
    } catch (error) {
      console.error("Error during logout:", error); // แสดง error ถ้าเกิด exception
    }
  };

  // object สำหรับส่งผ่านค่าให้กับ children ผ่าน Context
  const value = {
    user, // ข้อมูลผู้ใช้
    loading, // สถานะกำลังโหลด
    login, // ฟังก์ชันล็อกอิน
    logout, // ฟังก์ชันล็อกเอาท์
    isAuthenticated: !!user, // true ถ้ามี user อยู่
  };

  // Provider ครอบทุกรายการ children ให้สามารถใช้ AuthContext ได้
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
