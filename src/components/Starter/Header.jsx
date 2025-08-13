import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // เปลี่ยนตรงนี้
  const isStatusPage = location.pathname === "/status";
  const isReportPage = location.pathname === "/report";

  return (
    <header className="bg-white shadow-md px-4 py-4 sm:py-8 flex items-center justify-between relative min-h-[150px]">
      {/* ปุ่มสำหรับจอใหญ่ */}
      <div className="hidden sm:flex space-x-3 ml-auto">
        <button
          onClick={() => navigate("/status")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition ${
            isStatusPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          } text-sm sm:text-base`}
        >
          สถานะ
        </button>
        <button
          onClick={() => navigate("/report")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition ${
            isReportPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          } text-sm sm:text-base`}
        >
          แจ้งปัญหา
        </button>
      </div>

      {/* โลโก้และชื่อสนามอยู่ตรงกลาง */}
      <div className="absolute left-1/2 top-[50%] transform -translate-x-1/2 translate-y-[-40%] text-center">
        <img
          src="/images/starter/logo.jpg"
          alt="Logo"
          className="h-20 w-auto mx-auto mb-1"
        />
        <span className="block font-bold text-lg sm:text-xl select-none">
          The Eden Golf Club
        </span>
      </div>

      {/* ปุ่มเมนูมือถือ */}
      <div className="sm:hidden ml-auto z-50">
        <button
          className="btn btn-ghost btn-circle p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

      {/* เมนู dropdown มือถือ */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white border rounded-lg shadow-lg p-3 w-40 sm:hidden z-40">
          <button
            onClick={() => {
              navigate("/status");
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
              navigate("/report");
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
        </div>
      )}
    </header>
  );
};

export default Header;