// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../service/authService"; 
import { useAuth } from "../../context/useAuth"; 

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  // ✅ client-side validation
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    setError("กรุณากรอกอีเมลที่ถูกต้อง");
    return;
  }
  if (formData.password.length < 8) {
    setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    return;
  }

  setLoading(true);
  try {
    const result = await apiLogin(formData); // axios/fetch ต้องมี withCredentials: true

    if (result.success) {
      setSuccess(result.message || "เข้าสู่ระบบสำเร็จ!");
      authLogin(result.user);
      setFormData(prev => ({ ...prev, password: "" })); // ✅ ล้าง password

      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(result.message || "Email หรือรหัสผ่านไม่ถูกต้อง"); // ✅ ปลอดภัย
      setFormData(prev => ({ ...prev, password: "" })); // ล้าง password
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    setFormData(prev => ({ ...prev, password: "" })); // ล้าง password
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            เข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            หรือ <Link to="/register" className="font-medium text-green-600 hover:text-green-500">ลงทะเบียนบัญชีใหม่</Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                ที่อยู่อีเมล
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="ที่อยู่อีเมล"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="รหัสผ่าน"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <HiOutlineDotsHorizontal className="animate-pulse h-5 w-5" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}
