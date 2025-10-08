import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import Header from "../../components/Caddy/Header.jsx";
import { getCaddyBooking } from "../../service/caddy.service.js";

registerLocale("th", th);

const formatDateThai = (date) => {
  const thMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const day = date.getDate();
  const month = thMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ โหลดการจองของ Caddy จาก backend
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getCaddyBooking();
      if (res.success) {
        setBookings(res.bookings);
      } else {
        console.error(res.message);
      }
    };
    fetchBookings();
  }, []);

  // ✅ ส่ง bookingId ไป ProcessGolfPage.jsx
  const handleStartRound = (bookingId) => {
    navigate("/caddy/process", {
      state: { bookingId },
    });
  };

  const handleMenuClick = (menu) => {
    if (menu === "โปรไฟล์") navigate("/caddy/profile");
    else if (menu === "ประวัติการทำงาน") navigate("/caddy/history");
    else if (menu === "ออกจากระบบ") navigate("/landing");
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 text-center space-y-2">
          <img src="/images/caddy/eden-Logo.png" alt="logo" className="mx-auto h-24" />
          <h1 className="text-[#324441] text-xl font-bold uppercase">The Eden Golf Club</h1>
        </div>

        <div className="relative z-10 self-start" ref={profileRef}>
          <div
            className="avatar avatar-online avatar-placeholder cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="bg-[#324441] text-white w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-lg">AI</span>
            </div>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
              <a href="#" onClick={() => handleMenuClick("โปรไฟล์")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">โปรไฟล์</a>
              <a href="#" onClick={() => handleMenuClick("ประวัติการทำงาน")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ประวัติการทำงาน</a>
              <a href="#" onClick={() => handleMenuClick("ออกจากระบบ")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ออกจากระบบ</a>
            </div>
          )}
        </div>
      </div>

      {/* ปฏิทิน */}
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="d MMM ปี yyyy"
          locale="th"
          className="bg-[#324441] text-white rounded-full px-4 py-2 text-sm cursor-pointer text-center"
        />
      </div>

      {/* รายการรอบที่ได้รับมอบหมาย */}
      <div className="bg-[#3B6B5D] text-white text-center rounded-2xl shadow-lg py-6 px-6 mx-auto w-full max-w-sm space-y-4 mb-6">
        <h2 className="text-base font-bold">รอบการทำงานของคุณ</h2>

        {bookings.length > 0 ? (
          bookings.map((b) => (
            <div key={b._id} className="bg-white text-[#324441] rounded-xl shadow p-4 mb-3">
              <p className="font-semibold">วันที่: {formatDateThai(new Date(b.date))}</p>
              <p>เวลา: {b.timeSlot}</p>
              <p>สนาม: {b.courseType}</p>
              <p>กลุ่ม: {b.groupName}</p>

              <button
                onClick={() => handleStartRound(b._id)}
                className="mt-3 bg-[#3B6B5D] text-white px-4 py-1 rounded-full hover:bg-[#2F564D] transition"
              >
                เริ่มรอบนี้
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-200">ยังไม่มีรอบที่ได้รับมอบหมาย</p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
