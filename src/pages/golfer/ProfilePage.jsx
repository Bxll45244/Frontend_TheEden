import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import api from "../../service/api";


export default function ProfilePage() {
  const { loading, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading || !isAuthenticated) return;


    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile"); // Request golfer profile information from backend 
        setUser(res.data);
      } catch (err) {
        console.error("ดึงข้อมูลผู้ใช้ไม่สำเร็จ:", err);
        navigate("/login");
      } finally {
        setFetching(false);
      }
    };

    if (!loading && isAuthenticated && user === null) {
      setFetching(true);
      fetchProfile();
    }
  }, [loading, isAuthenticated, user, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ข้อมูลโปรไฟล์
        </h2>
        {user ? (
          <div className="space-y-4">
            <p><strong>ID:</strong> {user._id}</p>
            <p><strong>ชื่อ:</strong> {user.name}</p>
            <p><strong>อีเมล:</strong> {user.email}</p>
            <p><strong>บทบาท:</strong> {user.role}</p>
            {user.caddyStatus && <p><strong>สถานะแคดดี้:</strong> {user.caddyStatus}</p>}
            <Link to="/" className="block text-center mt-6 text-green-600 hover:text-green-500">กลับหน้าหลัก</Link>
          </div>
        ) : (
          <p className="text-center text-red-600">ไม่พบข้อมูลผู้ใช้</p>
        )}
      </div>
    </div>
  );
}
