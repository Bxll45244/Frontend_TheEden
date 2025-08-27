import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // ใช้ใน StepProgress
import { faExclamation } from "@fortawesome/free-solid-svg-icons"; // ใช้ใน Popup ของ ReportPage
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ใช้ใน Popup ของ ReportPage
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"; // ใช้ใน Popup ของ ReportPage

// ---------------- Header ----------------
export const Header = ({ currentDate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = location.pathname;

  // กำหนดสถานะ active ของปุ่ม
  const isStatusPage = pathname === "/caddy";
  const isReportPage = pathname === "/caddy/booking";

  return (
    <header className="bg-white shadow-md px-4 py-4 sm:py-8 flex items-center justify-between relative min-h-[150px]">
      {/* ปุ่มสำหรับ Desktop */}
      <div className="hidden sm:flex space-x-3 ml-auto">
        <button
          onClick={() => navigate("/caddy")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition ${
            isStatusPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          } text-sm sm:text-base`}
        >
          สถานะ
        </button>
        <button
          onClick={() => navigate("/caddy/booking")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition ${
            isReportPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          } text-sm sm:text-base`}
        >
          แจ้งปัญหา
        </button>
      </div>

      {/* โลโก้และชื่อสนาม */}
      <div className="absolute left-1/2 top-[50%] transform -translate-x-1/2 translate-y-[-40%] text-center">
        <img
          src="/images/caddy/eden-Logo.png"
          alt="Logo"
          className="h-20 w-auto mx-auto mb-1"
        />
        <span className="block font-bold text-lg sm:text-xl select-none">
          The Eden Golf Club
        </span>
      </div>

      {/* วันที่ */}
      <div className="absolute right-4 top-4 bg-[#324441] text-white rounded-full px-4 py-1 text-sm select-none">
        {currentDate}
      </div>

      {/* ปุ่มเมนูมือถือ */}
      <div className="sm:hidden ml-auto z-50">
        <button
          className="btn btn-ghost btn-circle p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
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

      {/* เมนูมือถือ */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white border rounded-lg shadow-lg p-3 w-40 sm:hidden z-40">
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
            สถานะ
          </button>
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
            แจ้งปัญหา
          </button>

          {/* Avatar สำหรับ Mobile */}
          <div className="avatar flex justify-center my-3">
            <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full ring-2 ring-offset-2">
              <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" alt="User Avatar" />
            </div>
          </div>
        </div>
      )}

      {/* Avatar Desktop */}
      <div className="absolute right-4 top-4 z-50 hidden sm:block">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full ring-2 ring-offset-2">
            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" alt="User Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

// ---------------- StatusCard ---------------- (ไม่เปลี่ยน)
export const StatusCard = ({ image, count, label, color, className }) => {
  const colorClasses = {
    success: { bg: "bg-green-500", border: "border-green-500", text: "text-green-700" },
    info: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-700" },
    purple: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-700" },
    warning: { bg: "bg-yellow-400", border: "border-yellow-400", text: "text-yellow-700" },
    error: { bg: "bg-red-500", border: "border-red-500", text: "text-red-700" },
  };

  const colors = colorClasses[color] || { bg: "bg-gray-300", border: "border-gray-300", text: "text-gray-700" };

  return (
    <div className={`w-full max-w-xs rounded-lg shadow-md p-4 flex flex-col items-center ${className} bg-white`}>
      <img
        src={image}
        alt={label}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-md mb-3"
      />
      <span className={`mt-2 px-4 py-1 border ${colors.border} rounded-full text-lg font-bold ${colors.text}`}>
        {count}
      </span>
      <div className="text-base text-black mt-4">{label}</div>
    </div>
  );
};

// ---------------- StepProgress ---------------- (ไม่เปลี่ยน)
const steps = [
  { label: "ออกรอบกอล์ฟ", key: "start" },
  { label: "จบการเล่น", key: "end" },
  { label: "เปลี่ยนแบตสำเร็จ", key: "battery" },
];

export const StepProgress = ({ currentStep, onConfirm, onCancel }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">สถานะการทำงาน</h2>
      <div className="flex flex-col gap-6">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg border-2 
                ${isDone ? "border-green-500 bg-green-50" :
                  isCurrent ? "border-blue-500 bg-blue-50 animate-pulse" :
                    "border-gray-300 bg-gray-50"}`}
            >
              {isDone ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <div className={`w-6 h-6 rounded-full ${isCurrent ? "bg-blue-500" : "bg-gray-300"}`} />
              )}
              <span className={`text-base ${isDone ? "line-through text-gray-400" : ""}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onCancel} className="btn btn-outline btn-error w-[48%]">
          ยกเลิก
        </button>
        <button onClick={onConfirm} className="btn btn-primary w-[48%]">
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default Header;
