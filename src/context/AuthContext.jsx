import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import UserService from "../service/userService";

export const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

const LS_KEY = "eden_user"; // ชื่อ key เก็บ user ใน localStorage (อยากเปลี่ยนชื่อก็ได้)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงโปรไฟล์จาก backend (ใช้ตอนแรกเข้าเว็บ หรือเวลาอยาก refresh)
  const refreshProfile = useCallback(async () => {
    try {
      const res = await UserService.getUserProfile();
      const me = res?.data?.user ?? res?.data ?? null;
      setUser(me);
      if (me) {
        localStorage.setItem(LS_KEY, JSON.stringify(me));
      } else {
        localStorage.removeItem(LS_KEY);
      }
    } catch (err) {
      console.error("refreshProfile error", err);
      setUser(null);
      localStorage.removeItem(LS_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // ลองอ่านจาก localStorage ก่อน เผื่อช่วยให้ UI ไม่ว่างเปล่าขณะรอ request
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(LS_KEY);
      }
    }
    // แล้วค่อยไป sync กับ backend อีกที
    refreshProfile();
  }, [refreshProfile]);

  // --- login ---
  const login = useCallback(async (payload) => {
    // 1) login → backend จะ set httpOnly cookie ให้
    const loginRes = await UserService.loginUser(payload);

    // 2) ดึงโปรไฟล์ (กันกรณี loginRes ไม่ได้ส่ง user ตรง ๆ)
    const res = await UserService.getUserProfile();
    const me = res?.data?.user ?? res?.data ?? null;

    setUser(me);
    if (me) {
      localStorage.setItem(LS_KEY, JSON.stringify(me));
    }
    return me; // ให้หน้า login เอาไปใช้ต่อได้
  }, []);

  // --- logout ---
  const logout = useCallback(async () => {
    try {
      await UserService.logoutUser(); // ให้ backend ลบ cookie
    } catch (err) {
      console.error("logout error", err);
      // ถึง backend พลาด เราก็จะเคลียร์ฝั่ง client อยู่ดี
    } finally {
      setUser(null);
      localStorage.removeItem(LS_KEY);
      // กัน state / context ค้างในหน้าอื่น ๆ → รีโหลดแอปใหม่
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;