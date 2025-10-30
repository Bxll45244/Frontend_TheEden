import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import th from "date-fns/locale/th";

registerLocale("th", th);

const formatDateThai = (date) => {
  const thMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const day = date.getDate();
  const month = thMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(new Date(2025, 1, 1));
  const golfTimes = ["06.00", "17.00"];

  const [completed, setCompleted] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [popup, setPopup] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasWorkOnThisDate = (date) => {
    const workDates = [1, 8, 15, 22];
    return workDates.includes(date.getDate()) && date.getMonth() === 1 && date.getFullYear() === 2025;
  };

  useEffect(() => {
    if (location.state?.completedSchedules) {
      setCompleted(location.state.completedSchedules);
    }
  }, [location.state]);

  useEffect(() => {
    const days = [];
    const workDates = [1, 8, 15, 22, 29];
    const selectedDay = selectedDate.getDate();

    let startDay = workDates[0];
    for (let i = workDates.length - 1; i >= 0; i--) {
      if (selectedDay >= workDates[i]) {
        startDay = workDates[i];
        break;
      }
    }

    const startOfWeek = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), startDay);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      days.push({ date: formatDateThai(currentDate), rawDate: currentDate });
    }
    setWeeklySchedule(days);
  }, [selectedDate]);

  const handleTimeClick = (time) => {
    if (time === "06.00") setPopup({ type: "confirm" });
    else if (time === "17.00") setPopup({ type: "notTime" });
    else {
      setSelectedTime(time);
      setPopup(null);
    }
  };

  const handleConfirm = () => {
    const newItem = { date: formatDateThai(selectedDate), time: "06.00" };
    setCompleted((prev) => [...prev, newItem]);
    setPopup({ type: "success", title: "เวลา 06.00" });
  };

  const closePopup = () => setPopup(null);

  useEffect(() => {
    if (popup?.type === "success") {
      const timer = setTimeout(() => {
        navigate("/caddy/booking", { state: { completedSchedules: [...completed] } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [popup, navigate, completed]);

  const isCompleted = (date, time) => completed.some((item) => item.date === date && item.time === time);

  const handleMenuClick = (menu) => {
    if (menu === "โปรไฟล์") navigate("/caddy/profile");
    else if (menu === "ประวัติการทำงาน") navigate("/caddy/history");
    else if (menu === "ออกจากระบบ") navigate("/landing");
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans relative">
      {/* Header mini (เฉพาะหน้านี้) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 text-center space-y-2">
          <img src="/images/caddy/eden-Logo.png" alt="logo" className="mx-auto h-24" />
          <h1 className="text-[#324441] text-xl font-bold uppercase">The Eden Golf Club</h1>
        </div>

        <div className="relative z-10 self-start" ref={profileRef}>
          <div
            className="avatar avatar-online avatar-placeholder cursor-pointer"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <div className="bg-[#324441] text-white w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-lg">AI</span>
            </div>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
              <button onClick={() => handleMenuClick("โปรไฟล์")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                โปรไฟล์
              </button>
              <button onClick={() => handleMenuClick("ประวัติการทำงาน")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                ประวัติการทำงาน
              </button>
              <button onClick={() => handleMenuClick("ออกจากระบบ")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date picker */}
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="d MMM ปี yyyy"
          locale="th"
          className="bg-[#324441] text-white rounded-full px-4 py-2 text-sm cursor-pointer text-center"
        />
      </div>

      {/* Times */}
      <div className="bg-[#3B6B5D] text-white text-center rounded-2xl shadow-lg py-6 px-6 mx-auto w-full max-w-sm space-y-4 mb-6">
        <h2 className="text-base font-bold">เวลาออกรอบกอล์ฟ</h2>
        <div className="flex justify-center gap-6">
          {hasWorkOnThisDate(selectedDate) ? (
            golfTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors duration-200 ${
                  selectedTime === time
                    ? "bg-white text-[#324441] shadow-inner"
                    : "border border-white text-white hover:bg-white hover:text-[#324441]"
                }`}
              >
                {time}
              </button>
            ))
          ) : (
            <p className="text-gray-200 font-normal">ไม่มีรอบการทำงาน</p>
          )}
        </div>
      </div>

      {/* Weekly table */}
      <div className="bg-[#E3F1EB] mx-auto w-full max-w-sm rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="bg-[#3B6B5D] text-white text-center py-4">
          <h2 className="text-xl font-bold">การทำงานรายสัปดาห์</h2>
        </div>
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2">วันที่</th>
              <th className="p-2">รอบเช้า</th>
              <th className="p-2">รอบบ่าย</th>
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((day) => (
              <tr key={day.date} className="border-t border-gray-400">
                <td className="p-2">{day.date}</td>
                <td className="p-2">{isCompleted(day.date, "06.00") ? <span className="text-green-600 text-2xl font-bold">✓</span> : "-"}</td>
                <td className="p-2">{isCompleted(day.date, "17.00") ? <span className="text-green-600 text-2xl font-bold">✓</span> : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popups */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-black text-center w-[70%] max-w-xs space-y-4">
            {popup.type === "confirm" && (
              <>
                <FontAwesomeIcon icon={faExclamation} className="text-yellow-400 text-5xl mx-auto" />
                <h3 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</h3>
                <div className="flex justify-center gap-4">
                  <button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">ตกลง</button>
                  <button onClick={closePopup} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">ยกเลิก</button>
                </div>
              </>
            )}

            {popup.type === "notTime" && (
              <>
                <FontAwesomeIcon icon={faExclamation} className="text-red-500 text-5xl mx-auto" />
                <h3 className="text-lg font-semibold mb-4">ยังไม่ถึงเวลาเริ่มงาน</h3>
                <button onClick={closePopup} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">ตกลง</button>
              </>
            )}

            {popup.type === "success" && (
              <>
                <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-5xl mx-auto" />
                <h2 className="text-3xl font-extrabold">สำเร็จ!</h2>
                <h3 className="text-base font-normal text-gray-800">{`เริ่มงาน${popup.title} สำเร็จ`}</h3>
                <button
                  disabled={clicked}
                  onClick={() => {
                    if (clicked) return;
                    setClicked(true);
                    navigate("/caddy/booking", { state: { completedSchedules: [...completed] } });
                  }}
                  className={`mt-4 px-6 py-2 rounded-full text-white ${
                    clicked ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {clicked ? "กำลังเปลี่ยนหน้า..." : "ตกลง"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
