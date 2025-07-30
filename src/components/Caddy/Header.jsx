import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ currentDate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isStatusPage = location.pathname === "/caddy";
  const isReportPage = location.pathname === "/caddy/report";

  return (
    <div className="space-y-4 relative">
      {/* เมนูด้านซ้ายและปุ่มออกจากระบบ */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/caddy")}
            className={`px-3 py-1.5 rounded-full font-semibold border transition text-sm ${
              isStatusPage
                ? "bg-gray-700 text-white border-gray-700"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            สถานะ
          </button>
          <button
            onClick={() => navigate("/caddy/report")}
            className={`px-3 py-1.5 rounded-full font-semibold border transition text-sm ${
              isReportPage
                ? "bg-gray-700 text-white border-gray-700"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            แจ้งปัญหา
          </button>
        </div>
        <button className="bg-[#324441] text-white px-4 py-1 rounded-full text-sm">
          ออกจากระบบ
        </button>
      </div>

      {/* โลโก้และชื่อสนาม */}
      <div className="flex flex-col items-center text-center space-y-1">
        <img src="/images/caddy/logo.jpg" alt="Logo" className="h-20 w-auto" />
        <span className="font-bold text-lg sm:text-xl select-none">
          The Eden Golf Club
        </span>
      </div>

      {/* วันที่ */}
      <div className="flex justify-center">
        <div className="bg-[#324441] text-white rounded-full px-4 py-1 text-sm">
          {currentDate}
        </div>
      </div>
    </div>
  );
};

export default Header;
