import { useState, useContext, createContext, useEffect } from "react";
import UserService from "../service/golfer/userService"; // เรียก API ที่เกี่ยวกับผู้ใช้ทั้งหมด

// สร้าง context เอาไว้แชร์ข้อมูลผู้ใช้ทั่วทั้งเว็บ
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // เก็บข้อมูลของผู้ใช้ที่ล็อกอินอยู่
  const [user, setUser] = useState(null);

  // ฟังก์ชันเข้าสู่ระบบ
  // ส่ง email, password ไปให้ backend ตรวจสอบ
  // ถ้าสำเร็จ backend จะส่งข้อมูลผู้ใช้กลับมาและตั้ง cookie JWT ให้เอง
  const login = async ({ email, password }) => {
    const data = await UserService.loginUser({ email, password });
    setUser(data?.user || data); // ถ้ามีข้อมูล user ก็เก็บไว้ใน state
    return data; // ส่งข้อมูลกลับไปให้หน้า login ใช้งานต่อ
  };

  // ฟังก์ชันออกจากระบบ
  // เรียก API /user/logout เพื่อให้ backend ลบ cookie ออก
  const logout = async () => {
    await UserService.logoutUser();
    setUser(null); // เคลียร์ข้อมูลผู้ใช้ใน state ออก
  };

  // ตอนเปิดเว็บครั้งแรก ให้ลองเช็กว่าเคยล็อกอินอยู่ไหม
  // โดยเรียก /user/profile จาก cookie ที่ browser เก็บไว้ 
  useEffect(() => {
    let isMounted = true; // ป้องกัน error ถ้า component ถูก unmount ระหว่างรอ
    (async () => {
      try {
        const me = await UserService.getUserProfile(); // ถ้ามี cookie อยู่จะได้ข้อมูลผู้ใช้กลับมา
        if (isMounted) setUser(me);
      } catch {
        if (isMounted) setUser(null); // ถ้า cookie หมดอายุ หรือยังไม่เคยล็อกอิน
      }
    })();
    return () => {
      isMounted = false; // cleanup function 
    };
  }, []);

  // แชร์ข้อมูล user, login, logout ให้ component อื่นใช้
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ฟังก์ชันช่วยให้ component อื่นเรียกใช้ AuthContext ได้ง่ายขึ้น
export const useAuthContext = () => useContext(AuthContext);