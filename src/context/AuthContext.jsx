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

const LS_USER_KEY = "eden_user";
const LS_LOGOUT_LOCK = "eden_logout_lock"; // ป้องกัน cookie zombie login

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดูว่ามี logout lock ไหม (กัน cookie เข้ามาขัด)
  const isLocked = () => localStorage.getItem(LS_LOGOUT_LOCK) === "1";

  // ------------ refresh profile ------------
  const refreshProfile = useCallback(async () => {
    // ถ้าเคย logout → ห้าม auto login จาก cookie
    if (isLocked()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await UserService.getUserProfile();
      const me = res?.data?.user ?? res?.data ?? null;

      if (me) {
        setUser(me);
        localStorage.setItem(LS_USER_KEY, JSON.stringify(me));
      } else {
        setUser(null);
        localStorage.removeItem(LS_USER_KEY);
      }
    } catch {
      setUser(null);
      localStorage.removeItem(LS_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------ initial load ------------
  useEffect(() => {
    // ถ้ามี lock → ไม่ต้องโหลดจาก cookie/backend
    if (isLocked()) {
      setUser(null);
      setLoading(false);
      return;
    }

    // ลองโหลดจาก localStorage ก่อน
    try {
      const saved = localStorage.getItem(LS_USER_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      localStorage.removeItem(LS_USER_KEY);
    }

    // แล้วค่อย sync backend
    refreshProfile();
  }, [refreshProfile]);

  // ------------ login ------------
  const login = useCallback(async (payload) => {
    await UserService.loginUser(payload);

    // Login สำเร็จแล้ว → เอา lock ออก
    localStorage.removeItem(LS_LOGOUT_LOCK);

    // โหลดโปรไฟล์ใหม่
    const res = await UserService.getUserProfile();
    const me = res?.data?.user ?? res?.data ?? null;

    if (me) {
      setUser(me);
      localStorage.setItem(LS_USER_KEY, JSON.stringify(me));
    }

    return me;
  }, []);

  // ------------ logout ------------
  const logout = useCallback(async () => {
    try {
      await UserService.logoutUser(); // backend จะลบ cookie ถ้า config ถูก
    } catch (err) {
    console.warn("Logout failed (ignored):", err);
  }

    // แต่เพื่อความชัวร์ ต้อง "ล็อกการใช้ cookie" ทิ้งไว้
    localStorage.setItem(LS_LOGOUT_LOCK, "1");
    localStorage.removeItem(LS_USER_KEY);
    setUser(null);

    // reload ทั้งระบบให้ clean state
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
