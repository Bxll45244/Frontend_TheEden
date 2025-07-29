import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // นำเข้า Outlet และ Link สำหรับการนำทาง

/**
 * UserMobileLayout Component:
 * เป็นโครงสร้าง Layout มาตรฐานสำหรับผู้ใช้งานทั่วไป หรือหน้าจอ Mobile
 * ประกอบด้วยส่วนหัว (Header/Navbar), ส่วนเนื้อหาหลัก (Main Content) และส่วนท้าย (Footer)
 * ออกแบบมาให้ตอบสนอง (responsive) กับขนาดหน้าจอต่างๆ
 */
export default function UserMobileLayout() {
  return (
    // คอนเทนเนอร์หลักของ Layout:
    // - min-h-screen: กำหนดความสูงขั้นต่ำให้เต็มหน้าจอ
    // - bg-gray-100: สีพื้นหลังอ่อนๆ
    // - flex flex-col: จัดเรียงองค์ประกอบย่อยในแนวตั้ง
    <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
      {/* ส่วนหัว (Header/Navbar) */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          {/* โลโก้/ชื่อแอปพลิเคชัน */}
          <Link to="/" className="text-2xl font-bold tracking-wide hover:text-green-100 transition duration-200 ease-in-out">
            Eden Golf Club
          </Link>

          {/* เมนูนำทาง (Navigation Links) */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition duration-200 ease-in-out"
            >
              หน้าหลัก
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition duration-200 ease-in-out"
            >
              ลงทะเบียน
            </Link>
            {/* สามารถเพิ่มลิงก์อื่นๆ ได้ที่นี่ตามความต้องการ */}
          </div>
        </nav>
      </header>

      {/* ส่วนเนื้อหาหลัก */}
      {/* flex-grow: ทำให้ส่วนนี้ขยายเต็มพื้นที่ที่เหลือในแนวตั้ง */}
      {/* p-4: เพิ่ม padding รอบเนื้อหา */}
      {/* max-w-7xl mx-auto: จำกัดความกว้างสูงสุดและจัดให้อยู่กึ่งกลาง */}
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {/* Outlet: เป็นจุดที่เนื้อหาของ Route ลูก (เช่น GolferHomePage) จะถูกแสดงผล */}
        <Outlet />
      </main>

      {/* ส่วนท้าย (Footer) */}
      <footer className="bg-gray-900 text-gray-300 p-6 text-center text-sm shadow-inner">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Eden Golf Club. สงวนลิขสิทธิ์.
        </p>
        <p>
          <a href="#" className="hover:text-white transition duration-200 ease-in-out">นโยบายความเป็นส่วนตัว</a> |
          <a href="#" className="hover:text-white transition duration-200 ease-in-out ml-2">ข้อกำหนดและเงื่อนไข</a>
        </p>
      </footer>
    </div>
  );
}