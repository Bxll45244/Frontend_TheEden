import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../service/userService";
import { useAuthContext } from "../../context/AuthContext";
import { isStaffRole } from "../auth/roles";

export default function ProfilePage() {
  const { user, loading } = useAuthContext();
  const [me, setMe] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  // ถ้าเป็น staff → พาออกไปโปรไฟล์ของระบบตนเอง
  useEffect(() => {
    if (loading) return;
    if (user && isStaffRole(user.role)) {
      const r = String(user.role).toLowerCase();
      // กำหนด path โปรไฟล์ของแต่ละระบบตามโปรเจกต์จริงของคุณ
      if (r === "admin") navigate("/admin/profile", { replace: true });
      else if (r === "starter") navigate("/starter/profile", { replace: true });
      else if (r === "caddy") navigate("/caddy/profile", { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  // ถ้ายังไม่ได้ล็อกอิน → ไปหน้า login ผู้ใช้ทั่วไป
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const res = await userService.getUserProfile();
        setMe(res?.data ?? res);
      } catch {
        navigate("/login");
      } finally {
        setFetching(false);
      }
    })();
  }, [loading, user, navigate]);

  if (fetching || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">ไม่พบข้อมูลผู้ใช้</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">โปรไฟล์ผู้ใช้</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>ID:</strong> {me._id}</p>
          <p><strong>ชื่อ:</strong> {me.name}</p>
          <p><strong>อีเมล:</strong> {me.email}</p>
          <p><strong>เบอร์โทร:</strong> {me.phone || "-"}</p>
          <p><strong>บทบาท:</strong> {me.role}</p>
        </div>
        <Link to="/" className="block text-center text-emerald-700 mt-6">
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
