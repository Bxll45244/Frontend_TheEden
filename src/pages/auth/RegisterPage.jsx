// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../../service/authService";


const Notification = ({ type, message }) => {
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 opacity-90 animate-fadeInOut`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {type === "success" ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

   
    if (formData.password !== formData.confirmPassword) return setError("รหัสผ่านไม่ตรงกัน");
    if (!passwordPattern.test(formData.password)) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร, ตัวใหญ่, ตัวเล็ก และตัวเลข");

    setLoading(true);
    try {
      const result = await apiRegister(formData);
      if (result.success) {
        setSuccess(result.message || "ลงทะเบียนสำเร็จ!");
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(result.message || "ลงทะเบียนไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {error && <Notification type="error" message={error} />}
      {success && <Notification type="success" message={success} />}

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">ลงทะเบียนบัญชีใหม่</h2>
          <p className="mt-2 text-sm text-gray-600">
            หรือ <Link to="/login" className="font-medium text-green-600 hover:text-green-500">เข้าสู่ระบบ</Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {["name", "email", "password", "confirmPassword"].map((field, idx) => {
              const isPassword = field.includes("password");
              const placeholderMap = {
                name: "ชื่อ",
                email: "ที่อยู่อีเมล",
                password: "รหัสผ่าน",
                confirmPassword: "ยืนยันรหัสผ่าน",
              };
              return (
                <div key={field}>
                  <label htmlFor={field} className="sr-only">{placeholderMap[field]}</label>
                  <input
                    id={field}
                    name={field}
                    type={isPassword ? "password" : field === "email" ? "email" : "text"}
                    autoComplete={isPassword ? "new-password" : field === "email" ? "email" : undefined}
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm ${idx === 0 ? "rounded-t-md" : idx === 3 ? "rounded-b-md" : ""}`}
                    placeholder={placeholderMap[field]}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? <HiOutlineDotsHorizontal className="animate-pulse h-5 w-5" /> : "ลงทะเบียน"}
          </button>
        </form>
      </div>
    </div>
  );
}
