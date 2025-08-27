import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi"; // สำหรับไอคอนโหลดดิ้ง
import { Link, useNavigate } from "react-router-dom"; // Link สำหรับนำทาง, useNavigate สำหรับ redirect
import { login } from "../../service/authService"; // นำเข้าฟังก์ชัน 'login' แบบ named export

/**
 * LoginPage Component:
 * หน้าสำหรับเข้าสู่ระบบผู้ใช้งาน
 * โค้ดนี้ถูกออกแบบให้เข้ากับสไตล์ของ RegisterPage และเชื่อมต่อกับ Backend ผ่าน authService
 */
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Hook สำหรับการเปลี่ยนเส้นทาง

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

    setLoading(true);
    try {
      // เรียกใช้ฟังก์ชัน login ที่นำเข้าจาก authService
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess(result.message || "เข้าสู่ระบบสำเร็จ!");
        // หากเข้าสู่ระบบสำเร็จ สามารถ redirect ไปยังหน้าหลัก หรือ Dashboard ได้
        // ตัวอย่าง: navigate('/dashboard'); หรือ navigate('/');
        // ในตัวอย่างนี้จะ redirect ไปหน้าหลัก (/) หลังจากเข้าสู่ระบบสำเร็จ
        setTimeout(() => {
          navigate('/');
        }, 1500); // หน่วงเวลา 1.5 วินาที ก่อน redirect
      } else {
        setError(result.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
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
            {/* Input สำหรับ Email */}
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
            {/* Input สำหรับ Password */}
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