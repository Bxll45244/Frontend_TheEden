// นำเข้า React และ useState สำหรับเก็บสถานะภายในคอมโพเนนต์
import React, { useState } from "react";
// นำเข้า useNavigate และ useLocation เพื่อเปลี่ยนหน้าและอ่านเส้นทาง/state ที่ส่งมา
import { useNavigate, useLocation } from "react-router-dom";
// นำเข้าไอคอน CheckCircle ของ Heroicons ที่ใช้ใน StepProgress
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // ใช้ใน StepProgress
// นำเข้าไอคอนเครื่องหมายตกใจจาก FontAwesome ที่จะใช้ใน Popup ของหน้าแจ้งปัญหา
import { faExclamation } from "@fortawesome/free-solid-svg-icons"; // ใช้ใน Popup ของ ReportPage
// นำเข้าคอมโพเนนต์ FontAwesomeIcon เพื่อแสดงไอคอนแบบ React
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ใช้ใน Popup ของ ReportPage
// นำเข้าไอคอนวงกลมติ๊กถูกแบบ regular สำหรับ Popup ของหน้าแจ้งปัญหา
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"; // ใช้ใน Popup ของ ReportPage

// ---------------- Header ----------------
// ประกาศคอมโพเนนต์ Header ซึ่งรับ prop ชื่อ currentDate เพื่อแสดงวันที่
export const Header = ({ currentDate }) => {
  // สร้างฟังก์ชัน navigate เพื่อเปลี่ยนหน้า
  const navigate = useNavigate();
  // อ่านข้อมูลตำแหน่งเส้นทางปัจจุบัน (pathname) และ state ที่ส่งมาถ้ามี
  const location = useLocation();
  // สร้าง state เล็ก ๆ สำหรับเปิด/ปิดเมนูมือถือ
  const [menuOpen, setMenuOpen] = useState(false);

  // เก็บ path ปัจจุบันไว้ในตัวแปรเพื่อใช้ตรวจกำหนดปุ่มที่ active
  const pathname = location.pathname;

  // ตรวจสอบว่าเป็นหน้าสถานะหรือหน้าแจ้งปัญหาหรือไม่ เพื่อเปลี่ยนสไตล์ปุ่ม
  const isStatusPage = pathname === "/caddy";
  const isReportPage = pathname === "/caddy/booking";

  // คืนค่า JSX ของ header
  return (
    // แท็ก header หลักของหน้า: มีเงา พื้นขาว และจัด layout ให้เหมาะกับมือถือและเดสก์ท็อป
    <header className="bg-white shadow-md px-4 py-4 sm:py-8 flex items-center justify-between relative min-h-[150px]">
      {/* ปุ่มสำหรับ Desktop */}
      {/* บล็อกนี้จะซ่อนบนมือถือ (hidden sm:flex) และแสดงบนหน้าจอขนาด sm ขึ้นไป */}
      <div className="hidden sm:flex space-x-3 ml-auto">
        {/* ปุ่ม สถานะ — ถ้าหน้านี้คือ /caddy ให้เป็น active */}
        <button
          onClick={() => navigate("/caddy")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition ${
            isStatusPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          } text-sm sm:text-base`}
        >
          {/* ข้อความบนปุ่ม */}
          สถานะ
        </button>
        {/* ปุ่ม แจ้งปัญหา — ถ้าหน้านี้คือ /caddy/booking ให้เป็น active */}
        <button
          onClick={() => navigate("/caddy/booking")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition ${
            isReportPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          } text-sm sm:text-base`}
        >
          {/* ข้อความบนปุ่ม */}
          แจ้งปัญหา
        </button>
      </div>

      {/* โลโก้และชื่อสนาม อยู่ตรงกลาง header */}
      <div className="absolute left-1/2 top-[50%] transform -translate-x-1/2 translate-y-[-40%] text-center">
        {/* รูปโลโก้ของคลับ กำหนดขนาดความสูงและจัดกึ่งกลาง */}
        <img
          src="/images/caddy/eden-Logo.png"
          alt="Logo"
          className="h-20 w-auto mx-auto mb-1"
        />
        {/* ชื่อสนาม แสดงเป็นตัวหนาและไม่สามารถเลือกข้อความได้ (select-none) */}
        <span className="block font-bold text-lg sm:text-xl select-none">
          The Eden Golf Club
        </span>
      </div>

      {/* วันที่ด้านขวาบน แสดง currentDate ที่ถูกส่งเข้ามาเป็น prop */}
      <div className="absolute right-4 top-4 bg-[#324441] text-white rounded-full px-4 py-1 text-sm select-none">
        {currentDate}
      </div>

      {/* ปุ่มเมนูสำหรับมือถือ (แสดงเฉพาะบนขนาดหน้าจอเล็ก) */}
      <div className="sm:hidden ml-auto z-50">
        {/* ปุ่มเป็นวงกลม กดแล้วสลับสถานะเมนู */}
        <button
          className="btn btn-ghost btn-circle p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* ไอคอนแฮมเบอร์เกอร์ (สามขีด) */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* เมนูมือถือ: แสดงเฉพาะเมื่อ menuOpen เป็น true */}
      {menuOpen && (
        // กล่องเมนูลอยอยู่ด้านบนสุดขวา มีเงาและขอบโค้ง
        <div className="absolute top-full right-4 mt-2 bg-white border rounded-lg shadow-lg p-3 w-40 sm:hidden z-40">
          {/* ปุ่มสถานะในเมนูมือถือ — กดแล้วพาไป /caddy และปิดเมนู */}
          <button
            onClick={() => {
              navigate("/caddy");
              setMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded mb-2 font-semibold border transition text-sm ${
              isStatusPage
                ? "bg-gray-700 text-white border-gray-700"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {/* ข้อความปุ่ม */}
            สถานะ
          </button>

          {/* ปุ่มแจ้งปัญหาในเมนูมือถือ — กดแล้วพาไป /caddy/booking และปิดเมนู */}
          <button
            onClick={() => {
              navigate("/caddy/booking");
              setMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded font-semibold border transition text-sm ${
              isReportPage
                ? "bg-gray-700 text-white border-gray-700"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {/* ข้อความปุ่ม */}
            แจ้งปัญหา
          </button>

          {/* Avatar สำหรับ Mobile: รูปโปรไฟล์อยู่ตรงกลางในเมนู */}
          <div className="avatar flex justify-center my-3">
            {/* วงแหวนรอบ avatar และขนาด 16x16 */}
            <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full ring-2 ring-offset-2">
              {/* รูปผู้ใช้เป็นภาพตัวอย่างจาก daisyui */}
              <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" alt="User Avatar" />
            </div>
          </div>
        </div>
      )}


    </header>
  );
};

// ---------------- StatusCard ---------------- (ไม่เปลี่ยน)
// คอมโพเนนต์การ์ดแสดงสถิติ เช่น ภาพ จำนวน และคำอธิบาย
export const StatusCard = ({ image, count, label, color, className }) => {
  // กำหนดคลาสสีตาม props color ที่ส่งเข้ามา
  const colorClasses = {
    success: { bg: "bg-green-500", border: "border-green-500", text: "text-green-700" },
    info: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-700" },
    purple: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-700" },
    warning: { bg: "bg-yellow-400", border: "border-yellow-400", text: "text-yellow-700" },
    error: { bg: "bg-red-500", border: "border-red-500", text: "text-red-700" },
  };

  // ถ้าไม่ได้ส่ง color ที่รองรับมา ให้ใช้ค่า default สีเทา
  const colors = colorClasses[color] || { bg: "bg-gray-300", border: "border-gray-300", text: "text-gray-700" };

  // คืนค่า JSX ของ StatusCard
  return (
    <div className={`w-full max-w-xs rounded-lg shadow-md p-4 flex flex-col items-center ${className} bg-white`}>
      {/* รูปประกอบการ์ด */}
      <img
        src={image}
        alt={label}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-md mb-3"
      />
      {/* เลขแสดงจำนวน อยู่ในวงกลมมีเส้นขอบสีตามสีของการ์ด */}
      <span className={`mt-2 px-4 py-1 border ${colors.border} rounded-full text-lg font-bold ${colors.text}`}>
        {count}
      </span>
      {/* คำอธิบายใต้จำนวน */}
      <div className="text-base text-black mt-4">{label}</div>
    </div>
  );
};

// ---------------- StepProgress ---------------- (ไม่เปลี่ยน)
// กำหนดขั้นตอนที่มีทั้งหมดเป็นลิสต์คงที่
const steps = [
  { label: "ออกรอบกอล์ฟ", key: "start" },
  { label: "จบการเล่น", key: "end" },
  { label: "เปลี่ยนแบตสำเร็จ", key: "battery" },
];

// คอมโพเนนต์แสดงความคืบหน้าของขั้นตอนการทำงาน
export const StepProgress = ({ currentStep, onConfirm, onCancel }) => {
  // คืนค่า UI ของ progress ที่มีปุ่มยกเลิกและยืนยัน
  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      {/* หัวข้อของส่วนนี้ */}
      <h2 className="text-center text-xl font-bold mb-4">สถานะการทำงาน</h2>
      {/* ลิสต์ขั้นตอนทั้งหมด */}
      <div className="flex flex-col gap-6">
        {steps.map((step, index) => {
          // เช็กว่าขั้นตอนนี้เสร็จหรือไม่ (index น้อยกว่า currentStep)
          const isDone = index < currentStep;
          // เช็กว่าขั้นตอนนี้คือขั้นตอนปัจจุบันหรือไม่
          const isCurrent = index === currentStep;

          // คืนค่าแต่ละแถวของขั้นตอน
          return (
            <div
              key={step.key}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg border-2 
                ${isDone ? "border-green-500 bg-green-50" :
                  isCurrent ? "border-blue-500 bg-blue-50 animate-pulse" :
                    "border-gray-300 bg-gray-50"}`}
            >
              {/* ถ้าผ่านแล้วให้โชว์ไอคอนติ๊กถูก ถ้ายังไม่ผ่านให้โชว์จุดวงกลม */}
              {isDone ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <div className={`w-6 h-6 rounded-full ${isCurrent ? "bg-blue-500" : "bg-gray-300"}`} />
              )}
              {/* ข้อความของขั้นตอน ถ้าผ่านแล้วจะขึ้นเส้นขีดกลางและเป็นสีจาง */}
              <span className={`text-base ${isDone ? "line-through text-gray-400" : ""}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ปุ่มยกเลิกและยืนยันด้านล่าง */}
      <div className="mt-8 flex justify-between">
        {/* ปุ่มยกเลิก เรียก onCancel เมื่อกด */}
        <button onClick={onCancel} className="btn btn-outline btn-error w-[48%]">
          ยกเลิก
        </button>
        {/* ปุ่มยืนยัน เรียก onConfirm เมื่อกด */}
        <button onClick={onConfirm} className="btn btn-primary w-[48%]">
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

// ส่งออก Header เป็นค่าเริ่มต้นของไฟล์นี้
export default Header; // export คอมโพเนนต์ Header เป็น default
