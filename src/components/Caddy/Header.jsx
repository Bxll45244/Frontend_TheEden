import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ currentDate }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isStatusPage = pathname === "/caddy";
  const isReportPage = pathname === "/caddy/booking";

  return (
    <header className="bg-white shadow-md px-4 py-4 sm:py-8 flex items-center justify-between relative min-h-[150px]">
      {/* Desktop actions */}
      <div className="hidden sm:flex space-x-3 ml-auto">
        <button
          onClick={() => navigate("/caddy")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition text-sm sm:text-base ${
            isStatusPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          }`}
        >
          สถานะ
        </button>
        <button
          onClick={() => navigate("/caddy/booking")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition text-sm sm:text-base ${
            isReportPage
              ? "bg-gray-700 text-white border-gray-700"
              : "border-gray-400 text-gray-700 hover:bg-gray-100"
          }`}
        >
          แจ้งปัญหา
        </button>
      </div>

      {/* Center logo */}
      <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-[40%] text-center">
        <img
          src="/images/caddy/eden-Logo.png"
          alt="Logo"
          className="h-20 w-auto mx-auto mb-1"
        />
        <span className="block font-bold text-lg sm:text-xl select-none">
          The Eden Golf Club
        </span>
      </div>

      {/* Date */}
      {currentDate && (
        <div className="absolute right-4 top-4 bg-[#324441] text-white rounded-full px-4 py-1 text-sm select-none">
          {currentDate}
        </div>
      )}

      {/* Mobile menu */}
      <div className="sm:hidden ml-auto z-50">
        <button
          className="btn btn-ghost btn-circle p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white border rounded-lg shadow-lg p-3 w-40 sm:hidden z-40">
          <button
            onClick={() => { navigate("/caddy"); setMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded mb-2 font-semibold border transition text-sm ${
              isStatusPage
                ? "bg-gray-700 text-white border-gray-700"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            สถานะ
          </button>
          <button
            onClick={() => { navigate("/caddy/booking"); setMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded font-semibold border transition text-sm ${
              isReportPage
                ? "bg-gray-700 text-white border-gray-700"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            แจ้งปัญหา
          </button>

          <div className="avatar flex justify-center my-3">
            <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full ring-2 ring-offset-2 overflow-hidden">
              <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" alt="User Avatar" />
            </div>
          </div>
        </div>
      )}

      {/* Desktop avatar */}
      <div className="absolute right-4 top-4 z-50 hidden sm:block">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full ring-2 ring-offset-2 overflow-hidden">
            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" alt="User Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
